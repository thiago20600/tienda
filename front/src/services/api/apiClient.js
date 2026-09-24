const API_PRODUCTOS = import.meta.env.VITE_API_URL;
const API_USUARIOS = import.meta.env.VITE_API_URL_USUARIOS;
const API_FACTURACION = import.meta.env.VITE_API_URL_FACTURACION;

const request = async (baseUrl, path, options = {}) => {
  const { auth = false, headers = {}, body, ...fetchOptions } = options;
  const requestHeaders = new Headers(headers);

  if (auth) {
    const token = localStorage.getItem('token');
    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  if (body && !(body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...fetchOptions,
    headers: requestHeaders,
    credentials: 'include',
    body: body instanceof FormData || typeof body === 'string' ? body : body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) window.dispatchEvent(new Event('auth:expired'));
  return response;
};

export const tiendaRequest = (path, options) => request(API_PRODUCTOS, path, options);
export const usuariosRequest = (path, options) => request(API_USUARIOS, path, options);
export const facturacionRequest = (path, options) => request(API_FACTURACION, path, options);
export { API_PRODUCTOS, API_USUARIOS, API_FACTURACION };
