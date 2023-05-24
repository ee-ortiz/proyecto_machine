from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/obtener_jugadores', methods=['POST'])
def obtener_jugadores():
    liga = request.json['liga']
    archivo_csv = f'data/jugadores_{liga.lower()}.csv'

    print("liga:", liga)
    print("archivo_csv:", archivo_csv)

    jugadores = pd.read_csv(archivo_csv, header=None)
    
    # Convertir jugadores al lista
    jugadores = jugadores[0].tolist()

    # Devolver resultado en formato json
    return jsonify(jugadores)

@app.route('/obtener_equipos', methods=['POST'])
def obtener_equipos():
    liga = request.json['liga']
    archivo_csv = f'data/equipos_{liga.lower()}.csv'

    print("liga:", liga)
    print("archivo_csv:", archivo_csv)

    equipos = pd.read_csv(archivo_csv, header=None)
    
    # Convertir jugadores al lista
    equipos = equipos[0].tolist()

    # Devolver resultado en formato json
    return jsonify(equipos)


if __name__ == '__main__':
    app.run()
