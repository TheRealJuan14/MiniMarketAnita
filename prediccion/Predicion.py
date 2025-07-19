import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.utils import to_categorical
import random

# Configuración inicial
CUADROS = 25
NUM_BOMBITAS = 3
JUGADAS = 1000  # Número de partidas simuladas para entrenar

# Simulamos jugadas: historial de jugadas anteriores
def generar_datos(jugadas):
    X = []
    y = []
    historial = []

    for _ in range(jugadas):
        # Simula bombitas en 3 cuadros distintos
        bombitas = sorted(random.sample(range(CUADROS), NUM_BOMBITAS))

        # Codificamos el estado anterior como entrada (una hot de los cuadros previos)
        entrada = np.zeros(CUADROS)
        if historial:
            for cuadro in historial[-1]:  # Última jugada
                entrada[cuadro] = 1
        X.append(entrada)

        # Salida (target): codificación de las nuevas posiciones
        salida = np.zeros(CUADROS)
        for cuadro in bombitas:
            salida[cuadro] = 1
        y.append(salida)

        historial.append(bombitas)

    return np.array(X), np.array(y)

# Generamos los datos
X, y = generar_datos(JUGADAS)

# Creamos el modelo
model = Sequential([
    Dense(64, activation='relu', input_shape=(CUADROS,)),
    Dense(64, activation='relu'),
    Dense(CUADROS, activation='sigmoid')  # Salida tipo multi-label
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Entrenamos
model.fit(X, y, epochs=30, batch_size=32)

# 🎯 Hacer una predicción basada en la última jugada
def predecir_siguiente(jugada_anterior):
    entrada = np.zeros(CUADROS)
    for cuadro in jugada_anterior:
        entrada[cuadro] = 1

    prediccion = model.predict(np.array([entrada]))[0]
    # Tomar los 3 cuadros con mayor probabilidad
    indices_probables = np.argsort(prediccion)[-NUM_BOMBITAS:][::-1]

    print("Predicción de los cuadros con bombitas:", indices_probables)
    print("Probabilidades:", prediccion[indices_probables])

# Ejemplo de predicción
jugada_test = [1, 7, 13]  # Puedes cambiar esto por una jugada real
predecir_siguiente(jugada_test)
