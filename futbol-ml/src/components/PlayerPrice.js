import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

export default function PlayerPrice(props) {
  return (
    <React.Fragment>
      <Title>{props.title}</Title>
      <Typography component="p" variant="h5">
        {props.title === "Precio estimado"? props.contenido + "€": "Num Goles: " + props.contenido["resultado"]} 
        {/* Salto de linea*/}
        <br/>
        {props.title === "Precio estimado"? props.contenido + "€": props.contenido["fecha"]} 
      </Typography>
    </React.Fragment>
  );
}
