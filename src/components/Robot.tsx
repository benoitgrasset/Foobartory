import React from 'react'
import { Tooltip, Typography, LinearProgress } from '@mui/material'
import '../App.css'
import { LoadingButton } from './LoadingButton'

export type LastAction = undefined | 'foo' | 'bar' | 'foobar'

export type IRobot = {
    time: number
    timeMax: number
    id: number
    lastAction: LastAction
}

type RobotProps = {
    robot: IRobot
    handleMineFoo: (id: number, lastAction: LastAction) => void
    handleMineBar: (id: number, lastAction: LastAction) => void
    handleBuildFoobar: (id: number, lastAction: LastAction) => void
    foo: number
    bar: number
}

export const Robot: React.FC<RobotProps> = (props) => {
    const { foo, bar, robot, handleMineFoo, handleMineBar, handleBuildFoobar } =
        props
    const { id, time, timeMax, lastAction } = robot
    const isWorking = time > 0

    const canBuildFoobars = foo > 0 && bar > 0

    const getBuildFoobarMessage = () => {
        if (foo < 1 && bar < 1) return 'Pas assez de foos et de bars'
        if (foo < 1) return 'Pas assez de foos'
        if (bar < 1) return 'Pas assez de bars'
        else return ''
    }

    return (
        <div className="robot" data-testid="robot">
            <div className="buttons">
                <Typography className="robot-text">
                    {`Robot ${id}`} {isWorking && '🚧'}
                </Typography>
                <LoadingButton
                    onClick={() => handleMineFoo(id, lastAction)}
                    data-testid="mine-foo"
                    loading={isWorking}
                    variant={lastAction === 'foo' ? 'contained' : 'outlined'}
                >
                    {lastAction === 'foo' ? 'Miner foo 🤖' : 'Miner foo'}
                </LoadingButton>
                <LoadingButton
                    onClick={() => handleMineBar(id, lastAction)}
                    data-testid="mine-bar"
                    loading={isWorking}
                    variant={lastAction === 'bar' ? 'contained' : 'outlined'}
                >
                    {lastAction === 'bar' ? 'Miner bar 🤖' : 'Miner bar'}
                </LoadingButton>
                <Tooltip title={getBuildFoobarMessage()}>
                    <div>
                        <LoadingButton
                            onClick={() => handleBuildFoobar(id, lastAction)}
                            data-testid="build-foobar"
                            disabled={!canBuildFoobars}
                            loading={isWorking}
                            variant={
                                lastAction === 'foobar'
                                    ? 'contained'
                                    : 'outlined'
                            }
                        >
                            {lastAction === 'foobar'
                                ? 'Assember foobar 🤖'
                                : 'Assembler foobar'}
                        </LoadingButton>
                    </div>
                </Tooltip>
            </div>
            <Typography className="time-text">⌛ Temps: {time} (s)</Typography>
            <LinearProgress
                variant="determinate"
                className="progress"
                value={(time * 100) / timeMax}
            />
        </div>
    )
}
