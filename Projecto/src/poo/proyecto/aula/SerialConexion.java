package poo.proyecto.aula;

import com.fazecast.jSerialComm.SerialPort;
import javax.swing.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.LinkedList;

public class SerialConexion extends Thread {

    private static final LinkedList<Integer> pasos = new LinkedList<>();
    private static final LinkedList<Float> temperatura = new LinkedList<>();

    @Override
    public void run() {
        SerialPort puerto = SerialPort.getCommPort("COM3");
        puerto.setBaudRate(9600);
        puerto.setComPortTimeouts(SerialPort.TIMEOUT_READ_BLOCKING, 1000, 0);

        if (!puerto.openPort()) {
            System.out.println("Connexion fallida");
            return;
        }

        System.out.println("Connexion con el serial, establecida correctamente");

        try {
            Thread.sleep(3000);  // Esperar a que el puerto se estabilice
        } catch (InterruptedException _) {
        }

        BufferedReader entrada = new BufferedReader(new InputStreamReader(puerto.getInputStream()));

        try {
            String linea;
            while ((linea = entrada.readLine()) != null) {
                linea = linea.trim().replace("\uFEFF", "");

                // Esperamos formato tipo: 5,24.75
                if (!linea.contains(",")) continue;

                try {
                    String[] partes = linea.split(",");

                    if (partes.length != 2) continue;

                    String p = partes[0].trim();
                    String t = partes[1].trim();
                    pasos.add(Integer.parseInt(p));
                    temperatura.add(Float.parseFloat(t));

                } catch (Exception _) {
                }
            }

        } catch (Exception _) {
        } finally {
            try { entrada.close(); } catch (Exception ignored) {}
            puerto.closePort();
        }
    }

    public static LinkedList<Integer> getPasos() {
        return pasos;
    }

    public static LinkedList<Float> getTemperatura() {
        return temperatura;
    }

}
