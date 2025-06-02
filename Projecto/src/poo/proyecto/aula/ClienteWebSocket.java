package poo.proyecto.aula;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import java.net.URI;
import java.net.URISyntaxException;

public class ClienteWebSocket {
    private static volatile boolean isRunning = true;

    public static void main(String[] args) throws Exception {
        // 1. Inicializar SerialConexion
        System.out.println("Inicializando conexión serial...");
        SerialConexion serial = new SerialConexion();
        serial.start();
        Thread.sleep(7000);

        // 2. Configurar WebSocket
        System.out.println("Conectando al servidor WebSocket...");
        WebSocketClient client = getWebSocketClient();

        // 4. Enviar datos periódicamente
        System.out.println("🚀 Iniciando envío de datos...");
        while (isRunning) {
            try {
                if (client.isOpen()) {
                    // Obtener datos y asegurar valores válidos
                    float temp = validarTemperatura(SerialConexion.getTemperatura().getLast());
                    int pasos = validarPasos(SerialConexion.getPasos().getLast());

                    // Crear JSON manualmente para total control
                    String json = construirJSON(temp, pasos);

                    // Enviar y mostrar en consola para verificación
                    client.send(json);
                    System.out.println("📤 Enviado: " + json);
                }
                Thread.sleep(500);
            } catch (Exception e) {
                System.err.println("⛔ Error en el bucle:");
                e.printStackTrace();
                isRunning = false;
            }
        }

        client.close();
        System.out.println("🛑 Programa terminado");
    }

    private static WebSocketClient getWebSocketClient() throws URISyntaxException, InterruptedException {
        WebSocketClient client = new WebSocketClient(new URI("ws://20.253.229.234:8080")) {
            @Override
            public void onOpen(ServerHandshake handshakedata) {
                System.out.println("✅ Conexión WebSocket establecida");
            }

            @Override
            public void onMessage(String message) {
                System.out.println("📩 Recibido: " + message);
            }

            @Override
            public void onClose(int code, String reason, boolean remote) {
                System.out.println("❌ Conexión cerrada: " + reason);
                isRunning = false;
            }

            @Override
            public void onError(Exception ex) {
                System.err.println("⚠️ Error en WebSocket:");
                ex.printStackTrace();
                isRunning = false;
            }
        };

        // 3. Conectar al servidor
        client.connectBlocking();
        return client;
    }

    private static float validarTemperatura(float temp) {
        return Float.isNaN(temp) ? 0.0f : temp;
    }

    private static int validarPasos(int pasos) {
        return pasos < 0 ? 0 : pasos;
    }

    private static String construirJSON(float temperatura, int pasos) {
        // NOTA: Usamos Locale.US para asegurar puntos decimales
        return String.format(java.util.Locale.US,
                "{\"temperatura\":%.2f,\"pasos\":%d}",
                temperatura,
                pasos
        );
    }
}