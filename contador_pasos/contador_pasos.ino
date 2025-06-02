#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

int pasoContador = 0;
float umbralCambio = 0.3;  // Cambio mínimo para contar un paso (en g)
bool pasoDetectado = false;

float ayAnterior = 0;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  mpu.initialize();

  if (!mpu.testConnection()) {
    //Serial.println("MPU6050 no conectado correctamente.");
    while (1);
  }

}

void loop() {
  int16_t ax, ay, az, tempRaw;
  mpu.getAcceleration(&ax, &ay, &az);

   tempRaw = mpu.getTemperature();

  // Convertimos el valor de aceleración en g (~16384 = 1g)
  float ayActual = ay / 16384.0;

  float diferencia = abs(ayActual - ayAnterior);

  // Si hay un cambio brusco en Y
  if (diferencia > umbralCambio) {
    if (!pasoDetectado) {
      pasoContador++;
      pasoDetectado = true;
    }
  } else {
    pasoDetectado = false;
  }

  float temperatura = (tempRaw / 340.0) + 36.53;
  Serial.print(pasoContador);
  Serial.print(",");
  Serial.println(temperatura);

  ayAnterior = ayActual; 
  delay(100);  // Tiempo de muestreo
}
