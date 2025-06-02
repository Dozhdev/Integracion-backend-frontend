const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    ws.on('message', (data) => {
        try {
            // Convertir a string y limpiar caracteres especiales
            const mensaje = data.toString().replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
            
            // Parsear y validar estructura
            const json = JSON.parse(mensaje);
            
            if (typeof json.temperatura !== 'number' || typeof json.pasos !== 'number') {
                throw new Error('Estructura inválida');
            }

            console.log('Datos recibidos:', {
                temperatura: json.temperatura,
                pasos: json.pasos,
                timestamp: new Date().toISOString()
            });

            // Reenviar a todos los clientes
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(json));
                }
            });

        } catch (error) {
            console.error('Error procesando mensaje:', {
                error: error.message,
                data: data.toString(),
                timestamp: new Date().toISOString()
            });
        }
    });

    ws.on('close', () => console.log('Cliente desconectado'));
    ws.on('error', (err) => console.error('Error en conexión:', err));
});

console.log('Servidor WebSocket escuchando en ws://localhost:8080');