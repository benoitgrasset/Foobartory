import React, { useEffect, useState } from 'react'
import {
    Tooltip,
    Typography,
    Button,
    Backdrop,
    Snackbar,
    Alert,
} from '@mui/material'
import { styled, Theme } from '@mui/material/styles'
import './App.css'
import RobotImg from './ressources/robot.png'
import { Robot, IRobot, LastAction } from './components/Robot'
import { FooBarToryParams, nbMaxRobots, robotInit } from './index'

const updateRobot = (
    robots: Array<IRobot>,
    id: number,
    increment: number,
    lastAction: LastAction
) => {
    return robots.map((robot) => {
        const time = robot.time + increment
        if (robot.id === id)
            return { ...robot, time, timeMax: time, lastAction }
        else return robot
    })
}

const StyledButton = styled(Button)(() => ({
    textTransform: 'capitalize',
}))

const App: React.FC<{ params: FooBarToryParams; nbRobots: number }> = (
    props
) => {
    const { params } = props
    const robotsInit: Array<IRobot> = [...Array(props.nbRobots)].map(
        (x, i) => ({ ...robotInit, id: i + 1 })
    )

    const [robots, setRobots] = useState(robotsInit)
    const [foo, setFoo] = useState(params.foo)
    const [bar, setBar] = useState(params.bar)
    const [foobar, setFoobar] = useState(params.foobar)
    const [open, setOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)

    const handleCloseBackdrop = () => {
        setOpen(false)
    }

    const handleCloseAlert = () => {
        setOpenAlert(false)
    }

    const nbRobots = robots.length

    const handleMineFoo = (id: number, lastAction: LastAction) => {
        const changeActivityTime =
            lastAction === 'foo' || lastAction === undefined ? 0 : 5
        setRobots((robots) =>
            updateRobot(robots, id, 1 + changeActivityTime, 'foo')
        )
        setFoo((foo) => foo + 1)
    }

    const handleMineBar = (id: number, lastAction: LastAction) => {
        const randomTime = Math.round(
            Math.round((Math.random() * 1.5 + 0.5) * 10) / 10
        )
        const changeActivityTime =
            lastAction === 'bar' || lastAction === undefined ? 0 : 5
        setRobots((robots) =>
            updateRobot(robots, id, randomTime + changeActivityTime, 'bar')
        )
        setBar((bar) => bar + 1)
    }

    const handleBuildFoobar = (id: number, lastAction: LastAction) => {
        const changeActivityTime =
            lastAction === 'foobar' || lastAction === undefined ? 0 : 5
        setRobots((robots) =>
            updateRobot(robots, id, 2 + changeActivityTime, 'foobar')
        )
        const success = Math.random() < 0.6
        if (success) {
            setFoobar((foobar) => foobar + 1)
            setFoo((foo) => foo - 1)
            setBar((bar) => bar - 1)
        } else {
            setFoo((foo) => foo - 1)
            setOpenAlert(true)
        }
    }

    const canBuyRobots = foobar >= 3 && foo >= 6

    const getBuyRobotsMessage = () => {
        if (foobar < 3 && foo < 6) return 'Pas assez de foobars et de foos'
        if (foobar < 3) return 'Pas assez de foobars'
        if (foo < 6) return 'Pas assez de foos'
        else return ''
    }

    const handleBuyRobots = () => {
        setFoobar((foobar) => foobar - 3)
        setFoo((foo) => foo - 6)
        setRobots((robot) => [...robot, { ...robotInit, id: robot.length + 1 }])
        setOpen(robots.length + 1 === nbMaxRobots)
    }

    useEffect(() => {
        const timeoutHandler = () => {
            setRobots((robots) =>
                robots.map((robot) => {
                    if (false)
                        return {
                            ...robot,
                            time:
                                robot.time > 0 ? robot.time - 0.5 : robot.time,
                        }
                    else return robot
                })
            )
        }
        const interval = setInterval(timeoutHandler, 500)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <header className="app-header">
                Foobartory
                <img
                    src={RobotImg}
                    alt="robot"
                    height={35}
                    width={35}
                    className="robot-image"
                />
            </header>
            <div className="container">
                <div className="dashboard">
                    <div>
                        <Typography>Nombre de foos: </Typography>
                        <Typography data-testid="foo">{foo}</Typography>
                    </div>
                    <div>
                        <Typography>Nombre de bars: </Typography>
                        <Typography data-testid="bar">{bar}</Typography>
                    </div>
                    <div>
                        <Typography>Nombre de foobars: </Typography>
                        <Typography data-testid="foobar">{foobar}</Typography>
                    </div>
                    <div>
                        <Typography
                            color="secondary"
                            className="fontWeightBold"
                        >
                            Nombre de robots:{' '}
                        </Typography>
                        <Typography color="secondary">{nbRobots}</Typography>
                    </div>
                </div>
                <Tooltip title={getBuyRobotsMessage()}>
                    <span>
                        <StyledButton
                            color="secondary"
                            variant="contained"
                            onClick={handleBuyRobots}
                            disabled={!canBuyRobots}
                            size="medium"
                        >
                            Acheter robot
                        </StyledButton>
                    </span>
                </Tooltip>
                <div className="robot-container" data-testid="robot-container">
                    {robots.map((robot) => {
                        return (
                            <Robot
                                robot={robot}
                                foo={foo}
                                bar={bar}
                                handleMineFoo={handleMineFoo}
                                handleMineBar={handleMineBar}
                                handleBuildFoobar={handleBuildFoobar}
                                key={robot.id}
                            />
                        )
                    })}
                </div>
            </div>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
                }}
                open={open}
                onClick={handleCloseBackdrop}
            >
                <Typography variant="h4">20 robots !! You win 🎉🎉</Typography>
            </Backdrop>
            <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity="error"
                    elevation={6}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Foobar building failed !!
                </Alert>
            </Snackbar>
        </>
    )
}

export default App
