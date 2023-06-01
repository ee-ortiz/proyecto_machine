import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


export default function MainListItemsComponent(props){


  return (
    <>
      {/* Radio button con dos opciones: Predecir goles y predecir precio */}
      <FormControl component="fieldset">
        <FormLabel component="legend">Predicción</FormLabel>
        <RadioGroup
          aria-label="prediction"
          defaultValue="goles"
          name="radio-buttons-group"
          value={props.prediction}
          onChange={props.handlePredictionChange}
        >
          <FormControlLabel value="goles" control={<Radio />} label="Predecir goles" />
          <FormControlLabel value="precio" control={<Radio />} label="Predecir precio" />
        </RadioGroup>
      </FormControl>

      {/* Si prediction es precio */}
      {props.prediction === "precio" ? (
        <>
          <React.Fragment>
            <ListSubheader component="div" inset>
              Elije una liga
            </ListSubheader>
            <Autocomplete
              value={props.selectedLeague}
              onChange={props.handleLeagueChange}
              options={props.leagues}
              getOptionLabel={(option) => String(option)}
              renderInput={(params) => (
                <TextField {...params} label="Liga" variant="outlined" />
              )}
            />
          </React.Fragment>
          <React.Fragment>
            <ListSubheader component="div" inset>
              Elije un jugador
            </ListSubheader>
            <Autocomplete
              value={props.selectedPlayer}
              onChange={props.handlePlayerChange}
              options={props.players}
              getOptionLabel={(option) => String(option)}
              renderInput={(params) => (
                <TextField {...params} label="Jugador" variant="outlined" />
              )}
            />
          </React.Fragment>

          {/* Espacio vertical */}
          <Box m={2} />

          {/* Boton para calcular el precio */}
          <Button variant="contained" onClick={props.handleCalcularPrecio}>
            Calcular precio
          </Button>

        </>
      ) : (
        <>
          <React.Fragment>
            <ListSubheader component="div" inset>
              Elije una liga
            </ListSubheader>
            <Autocomplete
              value={props.selectedLeague}
              onChange={props.handleLeagueChange}
              options={props.leagues}
              getOptionLabel={(option) => String(option)}
              renderInput={(params) => (
                <TextField {...params} label="Liga" variant="outlined" />
              )}
            />
          </React.Fragment>
          <React.Fragment>
            <ListSubheader component="div" inset>
              Elije un partido
            </ListSubheader>
            <Autocomplete
              value={props.selected_partido}
              onChange={props.handleSelectedPartidoChange}
              options={props.equipos}
              getOptionLabel={(option) => String(option)}
              renderInput={(params) => (
                <TextField {...params} label="Equipo" variant="outlined" />
              )}
            />
          </React.Fragment>

          {/* Espacio vertical */}
          <Box m={2} />

          {/* Boton para calcular los goles */}
          <Button variant="contained" onClick={props.handleCalcularGoles}>
            Calcular goles
          </Button>

        </>

      )
      }
    </>
  );

}
