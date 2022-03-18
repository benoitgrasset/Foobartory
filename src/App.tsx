import React from 'react';
import { Tooltip, Typography, Button, Backdrop, Snackbar, Alert, LinearProgress } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import './App.css';
import Robot from './ressources/robot.png';
import { LoadingButton } from './components/LoadingButton';

const nbRobotsInit = 2;
const nbMaxRobots = 20;

const robotInit = {
  time: 0,
  timeMax: 0,
  lastAction: undefined
};

type LastAction = undefined | "foo" | "bar" | "foobar"

type IRobot = {
  time: number,
  timeMax: number,
  id: number,
  lastAction: LastAction
}

const robotsInit: Array<IRobot> = [...Array(nbRobotsInit)].map((x, i) => ({ ...robotInit, id: i + 1 }));

const updateRobot = (robots: Array<IRobot>, id: number, increment: number, lastAction: LastAction) => {
  return robots.map(robot => {
    const time = robot.time + increment;
    if (robot.id === id) return { ...robot, time, timeMax: time, lastAction }
    else return robot
  })
}

const StyledButton = styled(Button)(() => ({
  textTransform: 'capitalize',
}))

const App: React.FC = () => {

  const [robots, setRobots] = React.useState(robotsInit);
  const [foo, setFoo] = React.useState(0);
  const [bar, setBar] = React.useState(0);
  const [foobar, setFoobar] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);

  const handleCloseBackdrop = () => {
    setOpen(false)
  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  const nbRobots = robots.length;

  const handleMineFoo = (id: number, lastAction: LastAction) => {
    const changeActivityTime = (lastAction === "foo" || lastAction === undefined) ? 0 : 5;
    setRobots(robots => updateRobot(robots, id, 1 + changeActivityTime, "foo"))
    setFoo(foo => foo + 1)
  }

  const handleMineBar = (id: number, lastAction: LastAction) => {
    const randomTime = Math.round(Math.round((Math.random() * 1.5 + 0.5) * 10) / 10);
    const changeActivityTime = (lastAction === "bar" || lastAction === undefined) ? 0 : 5;
    setRobots(robots => updateRobot(robots, id, randomTime + changeActivityTime, "bar"))
    setBar(bar => bar + 1)
  }

  const handleBuildFoobar = (id: number, lastAction: LastAction) => {
    const changeActivityTime = (lastAction === "foobar" || lastAction === undefined) ? 0 : 5;
    setRobots(robots => updateRobot(robots, id, 2 + changeActivityTime, "foobar"))
    const success = Math.random() < 0.6;
    if (success) {
      setFoobar(foobar => foobar + 1)
      setFoo(foo => foo - 1)
      setBar(bar => bar - 1)
    }
    else {
      setFoo(foo => foo - 1)
      setOpenAlert(true)
    }
  }

  const canBuildFoobars = foo > 0 && bar > 0

  const getBuildFoobarMessage = () => {
    if (foo < 1 && bar < 1) return "Pas assez de foos et de bars"
    if (foo < 1) return "Pas assez de foos"
    if (bar < 1) return "Pas assez de bars"
    else return ""
  }

  const canBuyRobots = foobar >= 3 && foo >= 6

  const getBuyRobotsMessage = () => {
    if (foobar < 3 && foo < 6) return "Pas assez de foobars et de foos"
    if (foobar < 3) return "Pas assez de foobars"
    if (foo < 6) return "Pas assez de foos"
    else return ""
  }

  const handleBuyRobots = () => {
    setFoobar(foobar => foobar - 3)
    setFoo(foo => foo - 6)
    setRobots(robot => ([...robot, { ...robotInit, id: robot.length + 1 }]))
    setOpen(robots.length + 1 === nbMaxRobots)
  }

  React.useEffect(() => {
    const timeoutHandler = () => {
      setRobots(robots => robots.map(robot => ({ ...robot, time: robot.time > 0 ? robot.time - 0.5 : robot.time })))
    }
    const interval = setInterval(timeoutHandler, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="app-header">
        Foobartory
        <img src={Robot} alt='robot' height={35} width={35} className='robot-image' />
      </header>
      <div className='container'>
        <div className="dashboard">
          <div><Typography>Nombre de foos: </Typography><Typography>{foo}</Typography></div>
          <div><Typography>Nombre de bars: </Typography><Typography>{bar}</Typography></div>
          <div><Typography>Nombre de foobars: </Typography><Typography>{foobar}</Typography></div>
          <div>
            <Typography color='secondary' className='fontWeightBold'>Nombre de robots: </Typography>
            <Typography color='secondary'>{nbRobots}</Typography>
          </div>
        </div>
        <Tooltip title={getBuyRobotsMessage()}>
          <span>
            <StyledButton color='secondary' variant='contained' onClick={handleBuyRobots}
              disabled={!canBuyRobots} size="medium">Acheter robot</StyledButton>
          </span>
        </Tooltip>
        <div className='robot-container'>
          {robots.map(robot => {
            const { id, time, timeMax, lastAction } = robot;
            const isWorking = time > 0;
            return (
              <div key={id} className='robot'>
                <div className='buttons'>
                  <Typography className='robot-text'>{`Robot ${id}`} {isWorking && '🚧'}</Typography>
                  <LoadingButton onClick={() => handleMineFoo(id, lastAction)}
                    loading={isWorking} variant={lastAction === "foo" ? "contained" : "outlined"}>
                    Miner foo
                  </LoadingButton>
                  <LoadingButton onClick={() => handleMineBar(id, lastAction)}
                    loading={isWorking} variant={lastAction === "bar" ? "contained" : "outlined"}>
                    Miner bar
                  </LoadingButton>
                  <Tooltip title={getBuildFoobarMessage()}>
                    <div>
                      <LoadingButton onClick={() => handleBuildFoobar(id, lastAction)}
                        disabled={!canBuildFoobars} loading={isWorking} variant={lastAction === "foobar" ? "contained" : "outlined"}>
                        Assembler foobar
                      </LoadingButton>
                    </div>
                  </Tooltip>
                </div>
                <Typography className='time-text'>⌛ Temps: {time} (s)</Typography>
                <LinearProgress variant="determinate" className='progress' value={(time * 100) / timeMax} />
              </div>
            )
          })}
        </div>
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme: Theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleCloseBackdrop}
      >
        <Typography variant='h4'>20 robots  !! You win 🎉🎉</Typography>
      </Backdrop>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error" elevation={6} variant="filled" sx={{ width: '100%' }}>
          Foobar building failed !!
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
