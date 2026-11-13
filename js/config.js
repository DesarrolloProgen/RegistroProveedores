/* ------------------------------------------------------------------------------------- */
/*                         CONFIGURACIÓN DEL BACKEND (Portal PROGEN)                     */
/* ------------------------------------------------------------------------------------- */
/*
  Único lugar donde se define a qué backend (Conecta) llama el formulario.

  - Abierto en local (localhost, 127.0.0.1 o como archivo): backend local.
  - Publicado (Azure Static Web Apps): Conecta en producción.

  En el .env del backend de Conecta, el dominio de este sitio debe estar en
  ZONA_PROVEEDORES_ORIGENES (eso también lo habilita en CORS).
*/
const CONECTA_API_LOCAL = "http://localhost:3000/api/v1";
const CONECTA_API_PRODUCCION = "https://portal-conecta.progen.com.co/api/v1";

const ES_LOCAL =
  location.protocol === "file:" ||
  ["localhost", "127.0.0.1"].indexOf(location.hostname) !== -1;

const API_BASE_URL = ES_LOCAL ? CONECTA_API_LOCAL : CONECTA_API_PRODUCCION;

const ZONA_PROVEEDORES_API_URL = API_BASE_URL + "/externo/zona-proveedores";

/*
  true: el archivo se manda al backend (PUT /:numero/adjuntos/:id/archivo) y
  él lo sube a S3, así el bucket no necesita CORS.
  false: el navegador sube directo a S3 con el enlace firmado; el bucket debe
  permitir PUT desde el origen de este sitio.
*/
const SUBIDA_POR_BACKEND = true;
