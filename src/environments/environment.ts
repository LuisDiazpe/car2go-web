// Configuración de PRODUCCIÓN. Todo el frontend apunta al API Gateway.
// No se exponen secretos ni tokens aquí: solo la URL pública del gateway.
export const environment = {
  production: true,
  apiBaseUrl: 'https://car2go-gateway.onrender.com/api/v1'
};
