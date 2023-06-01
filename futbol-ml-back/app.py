from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import StandardScaler
import pickle
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app)

def calcularDiferenciaGol5Prom_pred(final_partidos, proximos_partidos):
    dataNueva= []
    for i in range(len(proximos_partidos)):
        infoAct=[]
        homeTeam = proximos_partidos.iloc[i]['HomeTeam']
        awayTeam = proximos_partidos.iloc[i]['AwayTeam']
        fecha_match =  proximos_partidos.iloc[i]['Date']
        fecha_match = pd.to_datetime(fecha_match, format="%d.%m.%Y %H:%M")

        final_partidos_copy = final_partidos.copy()  # Copia el DataFrame original

        final_partidos_copy['Date'] = pd.to_datetime(final_partidos_copy['Date'], format='%d.%m.%Y %H:%M')

        print(type(fecha_match), fecha_match)
        print(type(final_partidos_copy['Date'][0]), final_partidos_copy['Date'][0])

        print("fecha_match", fecha_match)

        infoHome = final_partidos_copy[(final_partidos_copy['HomeTeam'] == homeTeam) & (final_partidos_copy['Date'] < fecha_match)].head(5).copy()
        infoAway = final_partidos_copy[(final_partidos_copy['AwayTeam'] == awayTeam) & (final_partidos_copy['Date'] < fecha_match)].head(5).copy()

        print("TERMINO")

        # Me quedo solo con las columnas: ['HSI', 'ASI', 'HGS', 'AGS', 'HTo', 'ADespeje']
        infoHome = infoHome[['HSI', 'ASI', 'HGS', 'AGS', 'HTo', 'ADespeje']]
        infoAway = infoAway[['HSI', 'ASI', 'HGS', 'AGS', 'HTo', 'ADespeje']]

        print("infoHome", infoHome)


        infoHome = infoHome.mean()
        infoAway = infoAway.mean()
        if len(infoHome) > 56:
            for i in range(54):
                infoAct.append(0)
            dataNueva.append(infoAct)
            continue
        for i in range(0,len(infoHome),2):
            infoAct.append(infoHome[i])
            infoAct.append(infoAway[i+1])
        dataNueva.append(infoAct)

    print("data_nueva", dataNueva)
    return dataNueva



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

@app.route('/partidos', methods=['POST'])
def obtener_equipos():
    liga = request.json['liga']
    archivo_csv = f'data/datos_next_games_{liga.lower()}.csv'

    print("liga:", liga)
    print("archivo_csv:", archivo_csv)

    prox_partidos = pd.read_csv(archivo_csv, header=None)
    
    # Convertir jugadores al lista
    prox_partidos = prox_partidos[0].tolist()

    # Devolver resultado en formato json
    return jsonify(prox_partidos)


@app.route('/predecir_goles', methods=['POST'])
def predecir_goles():
    equipo_local =  request.json['equipo_local']
    equipo_visitante =  request.json['equipo_visitante']
    liga = request.json['liga']
    # Cargo el dataframe data/proximos_partidos.xlsx
    df = pd.read_excel(f'data/datos_promedio_5partidos_proximos_{liga}.xlsx', sheet_name="Sheet1")
    # Encuentro la fila en la que HomeTeam = equipo_local y AwayTeam = equipo_visitante
    df = df.loc[(df['HomeTeam'] == equipo_local) & (df['AwayTeam'] == equipo_visitante)]
    # obtengo fecha
    fecha = df['Date'].values[0]
    fecha = datetime.strptime(fecha, "%d.%m.%Y %H:%M")
    fecha_formateada = fecha.strftime("%d.%m.%Y")

    # Datos final partidos
    final_partidos = pd.read_excel(f'data/datos_{liga}_final_partidos.xlsx', sheet_name="Sheet1")

    # Llamo a la función calcularDiferenciaGol5Prom_pred
    df = calcularDiferenciaGol5Prom_pred(final_partidos, df)
    # Estandarizo los valores con el Standarizer guardado en modelo_goles/scaler.pkl
    scaler = pickle.load(open(f'modelo_goles/scaler_{liga}.pkl', 'rb'))
    # Agrego una columna extra al dataframe con el valor 0
    df = scaler.transform(np.append(df, [[0]], axis=1))
    # Llamo al modelo guardado en modelo_goles/modelo.pkl
    modelo = pickle.load(open(f'modelo_goles/model_{liga}.pkl', 'rb'))
    # Realizo la predicción
    pred = modelo.predict(np.delete(df, -1, axis=1))
    # Predice 1 o 2 goles: Un partido con menos de 3 goles
    # Precide 3 o más será un partido de 2 o más goles
    if pred[0] == 1 or pred[0] == 2:
        return jsonify({"resultado": "Menos de 3 goles", "fecha": str(fecha_formateada)})
    else:
        return jsonify({"resultado": "2 o más goles", "fecha": str(fecha_formateada)})
    

@app.route('/predecir_precio', methods=['POST'])
def predecir_precio():
    nombre_jugador = request.json['nombre_jugador']
    # Cargo el dataframe datos_jugadores_ols_final.csv
    df = pd.read_csv('data/datos_jugadores_ols_final.csv')
    # Obtengo el jugador con la columna Jugador igual a nombre_jugador
    df = df.loc[df['Jugador'] == nombre_jugador]
    # Cambio el nombre de la columna Jugador por const y de valor será 1.00
    df.rename(columns={'Jugador': 'const'}, inplace=True)
    df['const'] = 1.00
    # Cargo el modelo olsres_precios.pkl
    modelo = pickle.load(open('modelo_precio/olsres_precios.pkl', 'rb'))
    # Imprimo el shape del dataframe
    print(df.shape)
    # Realizo la prediccíón
    pred = modelo.predict(df)
    print(pred)
    # Devuelvo el resultado en formato JSON
    return jsonify({"resultado": float(pred)})
    


if __name__ == '__main__':
    app.run()
