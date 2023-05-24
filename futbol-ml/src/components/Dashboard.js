import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MainListItemsComponent from './listItems';
import Chart from './Chart';
import PlayerPrice from './PlayerPrice';
import Statistics from './Statistics';

import { useState, useEffect } from 'react';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://cursos.virtual.uniandes.edu.co/mine4206/">
      MINE 4206 - Análisis con Machine Learning
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const leagues = [
    'Premier League',
    'La Liga',
  ];

  const [selectedLeague, setSelectedLeague] = useState('Premier League');
  const [body_fetch_jugadores, setBody_fetch_jugadores] = useState("premier");
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [selected_equipo_local, setSelected_equipo_local] = useState([]);
  const [selected_equipo_visitante, setSelected_equipo_visitante] = useState([]);
  const [prediction, setPrediction] = useState('precio');

  // Set de jugadores obtenido por un fetch en http://127.0.0.1:5000/obtener_jugadores
  useEffect(() => {
    fetch('http://127.0.0.1:5000/obtener_jugadores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ liga: body_fetch_jugadores }),
    })
      .then(response => response.json())
      .then(data => {
        setPlayers(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [body_fetch_jugadores]);

  // Set de equipos obtenido por un fetch en http://127.0.0.1:5000/obtener_equipos
  useEffect(() => {
    fetch('http://127.0.0.1:5000/obtener_equipos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ liga: body_fetch_jugadores }),
    })
      .then(response => response.json())
      .then(data => {
        setEquipos(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [body_fetch_jugadores]);


  useEffect(() => {
    console.log("Selected Liga: ", selectedLeague);
    console.log("Leagues: ", leagues);
  }, [selectedLeague]);

  useEffect(() => {
    console.log("Prediction: ", prediction);
  }, [prediction]);





  const handleLeagueChange = (event, value) => {
    setSelectedLeague(value);
    // si value es premier, entonces setBody_fetch_jugadores = premier
    if (value === "Premier League") {
      setBody_fetch_jugadores("premier");
    }
    else if (value === "La Liga") {
      setBody_fetch_jugadores("laliga");
    }
  };

  const handlePlayerChange = (event, value) => {
    setSelectedPlayer(value);
  };

  const handleEquipoLocalChange = (event, value) => {
    setSelected_equipo_local(value);
  };

  const handleEquipoVisitanteChange = (event, value) => {
    setSelected_equipo_visitante(value);
  };

  const handlePredictionChange = (event) => {
    setPrediction(event.target.value);
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Bet Analysis: Predicciones futbolísticas basadas en datos
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          
          
          <List component="nav">
            <MainListItemsComponent 
              leagues={leagues} handleLeagueChange={handleLeagueChange}
              selectedLeague={selectedLeague}
              players={players} handlePlayerChange={handlePlayerChange}
              selectedPlayer={selectedPlayer}
              equipos={equipos} handleEquipoLocalChange={handleEquipoLocalChange} handleEquipoVisitanteChange={handleEquipoVisitanteChange}
              selected_equipo_local={selected_equipo_local} selected_equipo_visitante={selected_equipo_visitante}
              prediction={prediction} handlePredictionChange={handlePredictionChange}
            />
            
          </List>



        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Chart title={prediction === "precio"? "Desempeño Esperado": "Estadísticas Equipos"}/>
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <PlayerPrice title={prediction === "precio"? "Precio estimado": "Prediccion de goles"}/>
                </Paper>
              </Grid>

            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}