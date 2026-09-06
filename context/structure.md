# Estructura — Capítulo C (Hardware / Microcontroladores)

## 0. Metadata
- **Lenguaje:** C
- **Plataforma del reto:** Wokwi (ESP-32 simulado)
- **Tema:** Pines digitales y control directo de hardware
- **Duración lectura teoría:** ≤ 10 min

---

## 1. Objetivo de aprendizaje
Que el alumno entienda cómo el código en C controla directamente un pin físico del microcontrolador, sin capas intermedias.

---

## 2. Teoría (10 min o menos)

1. **Intro (1 min)** — gancho: vas a prender un LED de verdad en un simulador de hardware.
2. **¿Qué es un microcontrolador? (2 min)** — chip con CPU + pines de entrada/salida, sin sistema operativo.
3. **Pines digitales HIGH/LOW (2 min)** — un pin solo entiende 5V (HIGH) o 0V (LOW), nada intermedio.
4. **`digitalWrite()` por dentro (3 min)** — qué hace realmente esa función a nivel de registros:
   - `DDRx` → dirección del pin (entrada/salida)
   - `PORTx` / `LATx` → estado que se escribe (HIGH/LOW)
   - `PINx` → lectura del pin
   - Nota: `digitalWrite(13, HIGH)` es azúcar sintáctico sobre `PORTB |= (1 << 5);`
5. **Cierre (2 min)** — el pin es solo un bit en un registro; el LED enciende porque ese bit pasó de 0 a 1 en el hardware real (simulado).

---

## 3. Reto interactivo (Wokwi)

- **Código inicial (LED apagado):**
  ```cpp
  digitalWrite(13, LOW);
  ```
- **Acción del alumno:** cambiar `LOW` → `HIGH`
- **Resultado esperado:** el LED del simulador Wokwi se enciende en tiempo real
- **Feedback visual:** el propio simulador Wokwi (no requiere lógica externa)

---

## 4. Archivos a generar
  - Texto teoría (secciones 2.1–2.5) con info.md
  - `<iframe>` embebido con el proyecto Wokwi (o link directo si Wokwi no permite iframe público) 
  https://wokwi.com/projects/474392520253335553
  - Bloque de código inicial mostrado como referencia (readonly)
- (Opcional) snippet con el equivalente en registros crudos, para el alumno curioso que quiera ver "la verdad" detrás de `digitalWrite()`


manipula el css y el js de wwwroot para que sea dinamico
C (Programación de Sistemas y Electrónica): Tonos azul cian, azul eléctrico o morado profundo con acentos en verde neón (como un LED encendido). Transmite la precisión de la programación de bajo nivel, hardware, circuitos y un estilo ciberespacial (glassmorphism).