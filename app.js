const Wall = () => {
    const style = {
        backgroundColor: 'blue'
    }
    return <div style={style} className="wall" />
}

const Goal = () => {
    const goalSprite = './images/pacman.gif'
    const style = {
        backgroundImage: `url(${goalSprite})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    }
    return <div style={style} className="goal" />
}

const Player = ({ pos }) => {
    const style = {
        gridColumnStart: `${pos.x + 1}`,
        gridRowStart: `${pos.y + 1}`,
        backgroundImage: `url(${pos.sprite})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    }
    return <div style={style} className="player" />
}

const Empty = () => {
    return <div className="empty" />
}


const Maze = (params) => {

    const [mazeData, setMazeData] = React.useState({ maze: {}, req: true })

    React.useEffect(() => {
        fetch(`http://ubeje.xyz:3001/?type=json&w=${params.size.width}&h=${params.size.height}`)
            .then(r => r.json())
            .then(r => setMazeData({ maze: r, req: false }))
    }, [])

    const controls = (current, next) => {

        switch (next.action) {
            case 'KeyPress':
                switch (next.type) {
                    case 'ArrowUp':
                        if (current.maze[current.y - 1][current.x] !== "-" &&
                            current.maze[current.y - 1][current.x] !== "|" &&
                            current.maze[current.y - 1][current.x] !== "+") {
                            return {
                                ...current,
                                y: current.y - 1,
                                salts: current.salts + 1,
                                sprite: './images/sprite_u.png'
                            }
                        } else
                            return current
                    case 'ArrowDown':
                        if (current.maze[current.y + 1][current.x] !== "-" &&
                            current.maze[current.y + 1][current.x] !== "|" &&
                            current.maze[current.y + 1][current.x] !== "+") {
                            return {
                                ...current,
                                y: current.y + 1,
                                salts: current.salts + 1,
                                sprite: './images/sprite_d.png'
                            }
                        } else
                            return current
                    case 'ArrowLeft':
                        if (current.maze[current.y][current.x - 1] !== "-" &&
                            current.maze[current.y][current.x - 1] !== "|" &&
                            current.maze[current.y][current.x - 1] !== "+") {
                            return {
                                ...current,
                                x: current.x - 1,
                                salts: current.salts + 1,
                                sprite: './images/sprite_l.png'
                            }
                        } else
                            return current
                    case 'ArrowRight':
                        if (current.maze[current.y][current.x + 1] !== "-" &&
                            current.maze[current.y][current.x + 1] !== "|" &&
                            current.maze[current.y][current.x + 1] !== "+") {
                            return {
                                ...current,
                                x: current.x + 1,
                                salts: current.salts + 1,
                                sprite: './images/sprite_r.png'
                            }
                        } else
                            return current
                    default:
                        return current
                }
            case 'Cargado':
                return { ...current, maze: next.maze }
            default:
                return current
        }
    }

    const [position, dispatcher] = React.useReducer(controls, {
        x: 1,
        y: 1,
        maze: [],
        salts: params.salts,
        sprite: './images/sprite_r.png'
    })

    const handleKeyDown = (event) => {
        dispatcher({ type: event.key, action: "KeyPress" })
    }

    const finish = () => {
        if (position.x === params.size.width * 3 - 1 && position.y === params.size.height * 2 - 1) {
            params.setSalts(position.salts)
            params.setPlay(2)
        }
    }

    const focus = () => {
        dispatcher({ maze: mazeData.maze, action: "Cargado" })
        if (document.getElementById('gosth')) {
            document.getElementById('gosth').focus()
        }
    }

    React.useEffect(finish, [position])
    React.useEffect(focus, [mazeData])

    const board = {
        gridTemplateColumns: `repeat(${params.size.width * 3 + 1},${(100 / (params.size.width * 3 + 1)) - 0.1}vw)`,
        gridTemplateRows: `repeat(${params.size.height * 2 + 1},${(100 / (params.size.height * 2 + 1)) - 0.11}vh)`,
        justifyContent: 'strech'
    }

    if (!mazeData.req) {
        return (
            <div className="container">
                <div style={board} className="grid">
                    {mazeData.maze.map((row) =>
                        row.map((cell) => {
                            switch (cell) {
                                case 'p':
                                    return <Empty />
                                case 'g':
                                    return <Goal />
                                case ' ':
                                    return <Empty />
                                default:
                                    return <Wall />
                            }
                        })
                    )}
                </div>
                <div id="gosth" tabIndex="-1" style={board} className="grid" onKeyDown={handleKeyDown}>
                    {mazeData.maze.map((row) =>
                        row.map((cell) => {
                            if (cell === 'p')
                                return <Player pos={position} />
                        })
                    )}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Cargando</h1>
            </div>
        )

    }
}

const App = () => {
    const [play, setPlay] = React.useState(0)
    const [salts, setSalts] = React.useState(0)
    const [size, setSize] = React.useState({ width: "10", height: "10" })

    const playGame = () => {
        setPlay(1)
    }

    if (play === 0) {
        return (
            <div className="menu">
                <h1>Kill Pac-Man!</h1>
                <h3>Los valores de alto y ancho pueden ser un numero entre 0 y 30</h3>
                <label>Alto</label>
                <input type="number" className="input" placeHolder="Max 30" max="30" value={size.width}
                    onChange={e => {
                        setSize({ ...size, width: (e.target.value < 0) ? 0 : ((e.target.value > 30) ? 30 : e.target.value) })
                    }}
                />
                <label>Ancho</label>
                <input type="number" className="input" placeHolder="Max 30" max="30" value={size.height}
                    onChange={e => {
                        setSize({ ...size, height: (e.target.value < 0) ? 0 : ((e.target.value > 30) ? 30 : e.target.value) })
                    }}
                />
                <button className="button" onClick={playGame}> Jugar! </button>
            </div>
        )
    } else if (play === 1) {
        return <Maze size={size} salts={salts} setSalts={setSalts} setPlay={setPlay} />
    } else {
        return (
            <div className="end">
                <h1>Completo!</h1>
                <h3>Hizo {salts} saltos</h3>
                <button className="button"
                    onClick={() => {
                        setPlay(0)
                        setSalts(0)
                    }}
                >Ir al Menú!</button>
            </div>
        )
    }
}