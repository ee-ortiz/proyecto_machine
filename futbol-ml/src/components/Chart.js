import * as React from 'react';
import Title from './Title';
import Typography from '@mui/material/Typography';

export default function Chart(props) {

  // Función para dar formato a un número. Ejemplo: 10903742.417039616 a 10.903.742,42
  function formatearNumero(numero) {
    const separadorDecimal = ',';
    const separadorMiles = '.';
    
    // Convertir el número a formato de cadena y separar la parte decimal
    let numeroFormateado = numero.toFixed(2).toString();
    const partes = numeroFormateado.split('.');
    
    // Separar la parte entera por miles
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, separadorMiles);
    
    // Unir las partes y añadir el separador decimal
    numeroFormateado = partes.join(separadorDecimal);
    
    return numeroFormateado;
  }
 

  return (
    <React.Fragment>
      <Title>{props.title}</Title>
      {props.prediction === "goles" ? (
      <Typography component="p" variant="h5">
        {props.prediction_goles["resultado"]? "Número de goles: " + props.prediction_goles["resultado"]: ""}
        {/* Salto de linea*/}
        <br/>
        {props.prediction_goles["fecha"]? "Fecha del Partido: " + props.prediction_goles["fecha"]: ""}
      </Typography>
      ) : (
      <Typography component="p" variant="h5">
        {props.prediction_precio["resultado"]? "Precio del jugador: " + formatearNumero(props.prediction_precio["resultado"]): ""}
        {/* Salto de linea*/}
        <br/>
        {props.prediction_precio["resultado"]? "Moneda: Euros": ""}
      </Typography>
      )}
  </React.Fragment>
  );
}
