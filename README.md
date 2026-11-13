# Registro de Proveedores

Formulario público (HTML + jQuery + Bootstrap, sin build) con el que un proveedor solicita su inscripción o actualización en
PROGEN. Ya no usa Power Automate: habla con la API pública de Zona Proveedores del backend del Portal PROGEN
(`portal-progen-backend`, módulo `zona-proveedores`).

El contrato completo está en `portal-progen-backend/docs/zona-proveedores-api.md`.

## Configuración

Todo está en `js/config.js`:

| Constante            | Qué es                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `API_BASE_URL`       | Base de la API del backend. En local: `http://localhost:3000/api/v1`. **TODO producción:** la URL pública del backend.                     |
| `SUBIDA_POR_BACKEND` | `true` (por defecto): los archivos se mandan al backend y él los sube a S3. `false`: el navegador sube directo a S3 con el enlace firmado. |

En el `.env` del backend deben estar:

- `ZONA_PROVEEDORES_SECRETO`: al menos 32 caracteres aleatorios. Sin ella la API responde 503.
- `ZONA_PROVEEDORES_ORIGENES`: el origen exacto desde donde se sirve este formulario (p. ej. `http://localhost:5500`). Otro
  origen recibe 403.
- `ALLOWED_ORIGINS`: el mismo origen, para el CORS del backend.
- Opcional: `ZONA_PROVEEDORES_TEXTO_AUTORIZACION`, el texto de la casilla de autorización de datos. Vacía = un texto genérico
  del backend.
- `S3_BUCKET_ADJUNTOS` y `S3_PREFIJO`, las credenciales de AWS y el correo (`GRAPH_*` o `SMTP_*`).

Con `SUBIDA_POR_BACKEND = false`, el bucket debe permitir por CORS `PUT` desde el origen del formulario, con los encabezados
`Content-Type` y `Content-Length`.

## Correr en local

1. Levanta el backend (puerto 3000) con las variables de arriba.
2. Sirve esta carpeta en el origen configurado, por ejemplo con `python3 -m http.server 5500` o `npx serve -l 5500`, y abre
   `http://localhost:5500`. Debe ser `localhost` y no `127.0.0.1`, porque el origen tiene que coincidir exactamente.

## Cómo funciona

1. Al cargar, `GET /externo/zona-proveedores/formulario` trae el token del formulario, las listas (tipos de registro, de
   empresa y de identificación, monedas, tipos de actividad), los contactos PROGEN y las condiciones de pago por ámbito, los
   documentos por caso, los límites de los adjuntos y el texto de autorización. Nada de eso está fijo en el HTML: los
   contactos y las condiciones se administran desde el portal. Si la llamada falla, se muestra el error con un botón para
   reintentar.
2. El país decide el caso: `COLOMBIA` es nacional; cualquier otro, del exterior. `documentosPorCaso` dice qué documentos se
   muestran y cuáles son obligatorios (nacional según el tipo de empresa; exterior, todos opcionales). Cada documento trae
   en `camposFormulario` los `name` de los inputs de archivo que le corresponden. Cada archivo se revisa contra
   `adjuntos.tamanoMaximoBytes` y `adjuntos.tiposPermitidos` al elegirlo.
3. Al enviar: `POST /` crea el borrador (un `200` es un reintento con el mismo token y devuelve el mismo borrador). Luego, de
   uno en uno: `POST /:numero/adjuntos`, `PUT .../archivo` y `POST .../confirmar`, todo con `X-Registro-Token`. Si una
   subida falla, ese documento queda con «Reintentar» y «Quitar» (`DELETE /:numero/adjuntos/:adjuntoId`) sin volver a crear
   el registro. Al final, `POST /:numero/enviar` y la pantalla de confirmación con el número `PRV-xxxxx`.
4. Validación con IA: `documentosPorCaso[].validacionIa` (`{ categoria: "texto del requisito" }`) dice qué documentos revisa
   la IA y qué revisa; el texto se muestra debajo del input. Esos documentos sólo aceptan `adjuntos.tiposParaIa` (PDF, PNG,
   JPG o WEBP: se limita el `accept` y se valida antes de subir). Su `POST .../confirmar` tarda unos segundos ("Verificando
   con IA…"). Un 400 significa que no pasó y el backend ya lo borró: el `message` queda en rojo junto al documento, se pide
   otro archivo y los demás siguen subiéndose. Un 200 trae `validacionIa.estado`: `valido` → "✔ Verificado";
   `sin_validar` → se acepta y Finanzas lo revisa (no es error). La confirmación tiene un límite por IP
   (`RATE_LIMIT_VALIDACION_MAX`, 15 por minuto): ante un 429 se espera un minuto con cuenta regresiva y se reintenta sólo esa
   confirmación, sin volver a subir el archivo. La IA no bloquea el botón Enviar: `enviar` reporta los faltantes (409).
5. Errores: siempre se muestra el `message` del backend y, si trae `details[].field`, también junto a ese campo. Un 409 con
   `details.faltantes` marca esos documentos para subirlos y volver a enviar; "El formulario venció" ofrece recargar.

Reglas que el navegador revisa antes de enviar (sólo como ayuda; el backend las vuelve a aplicar): para nacional, el NIT va
sin el DV y el DV se comprueba con el algoritmo de la DIAN, y la cédula no lleva DV. El exterior no envía identificación y
sí dirección, cargo, moneda y tipo de actividad. La condición de pago sólo se envía en la inscripción. Los talleres no eligen
contacto PROGEN: el backend les asigna el de talleres. Es obligatorio aceptar el tratamiento de datos. El campo oculto
`sitioWeb` es una trampa para bots y debe llegar vacío. El token del formulario sólo sirve 3 segundos después de pedirlo:
si se envía antes, el formulario espera.

## Archivos

- `index.html`: el formulario.
- `js/config.js`: URL del backend y modo de subida.
- `js/main.js`: carga del catálogo, envío según el contrato y manejo de errores.
- `js/archivos.js`: documentos por caso, límites de archivos y estado de cada subida.
- `js/onchange.js`: qué se muestra según lo elegido (país, tipo de empresa, tipo de registro).
- `js/validaciones.js`: validaciones del navegador (DV de la DIAN incluido) y marcas junto a los campos.
- `js/datos.js`: países y municipios de Colombia.
- `js/init.js`: desplegables con buscador, mayúsculas y aviso de "seguir bajando".

## Pasar a producción

1. Despliega el backend con el módulo `zona-proveedores`.
2. En el `.env` de producción del backend, define `ZONA_PROVEEDORES_SECRETO` (nuevo y distinto del de local, 32 caracteres o
   más) y agrega el dominio de Azure Static Web Apps de este sitio a `ZONA_PROVEEDORES_ORIGENES` y a `ALLOWED_ORIGINS`.
   Revisa también `S3_BUCKET_ADJUNTOS`, `S3_PREFIJO=prod` y el texto legal en `ZONA_PROVEEDORES_TEXTO_AUTORIZACION`.
3. Cambia `API_BASE_URL` en `js/config.js` por la URL pública del backend y despliega. El push a `main` publica en Azure
   Static Web Apps.
4. Haz una prueba con datos sintéticos y apaga el flujo HTTP de Power Automate `Zona_Proveeedores`.
