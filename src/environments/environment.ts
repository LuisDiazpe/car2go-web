// Configuración de PRODUCCIÓN con failover entre dos backends (cuenta A y cuenta B).
// No se exponen secretos: solo las URLs públicas de los gateways.
export const environment = {
  production: true,
  // Gateway A: cuenta principal (mantenida viva con cron-job).
  apiGatewayA: 'https://car2go-gateway.onrender.com',
  // Gateway B: cuenta de respaldo (se enciende manualmente en Render cuando A se suspende).
  // TODO: reemplazar por la URL real del gateway de la cuenta B cuando se despliegue.
  apiGatewayB: 'https://car2go-gateway-ihg0.onrender.com',
  // Sufijo común de la API
  apiPath: '/api/v1'
};
