import React from 'react'
import './App.css'
import Cell, { CellStatus, Point } from './Cell'
import useInterval from './useInterval'
import gosperGliderGun from './preset'
type Grid = CellStatus[][]

const getCellNeighbors = ({
  x,
  y,
  size,
}: Point & { size: number }): Point[] => {
  return [
    { x: x - 1, y: y - 1 },
    { x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y },
    { x: x + 1, y },
    { x: x - 1, y: y + 1 },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ].filter(({ x, y }) => {
    // get rid off out of bounds coordinates
    if (x < 0 || x >= size) {
      return false
    }
    if (y < 0 || y >= size) {
      return false
    }

    return true
  })
}

const getLiveCount = (cells: Point[], grid: Grid) => {
  return cells.reduce((acc, { x, y }) => (acc += grid[y][x]), 0)
}

function App() {
  const size = 42 // could be settable too
  const [speed, setSpeed] = React.useState(500)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [grid, setGrid] = React.useState<Grid>(gosperGliderGun)
  const toggleStatus = ({ x, y }: Point) => {
    setGrid((g) => {
      const cp = g.map((row) => [...row])
      cp[y][x] =
        cp[y][x] === CellStatus.alive ? CellStatus.dead : CellStatus.alive
      console.log(cp)
      return cp
    })
  }
  const clear = () => {
    setGrid(Array(size).fill(Array(size).fill(0)))
  }

  React.useEffect(() => {
    const togglePlaying = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPlaying((v) => !v)
      }
    }
    document.addEventListener('keydown', togglePlaying)

    return () => {
      document.removeEventListener('keydown', togglePlaying)
    }
  }, [])

  useInterval(
    () => {
      const nextGrid = grid.map((row) => [...row])
      grid.forEach((row, y) =>
        row.forEach((status, x) => {
          const liveNeighbourCount = getLiveCount(
            getCellNeighbors({ x, y, size }),
            grid
          )

          if (status === CellStatus.alive) {
            console.log('alive', x, y)
            if (liveNeighbourCount === 2 || liveNeighbourCount === 3) {
              nextGrid[y][x] = CellStatus.alive
            } else {
              nextGrid[y][x] = CellStatus.dead
            }
          } else {
            if (liveNeighbourCount === 3) {
              nextGrid[y][x] = CellStatus.alive
            } else {
              nextGrid[y][x] = CellStatus.dead
            }
          }
        })
      )
      setGrid(nextGrid)
    },
    isPlaying ? speed : null
  )

  return (
    <div className="App">
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Start'}
      </button>
      <button onClick={clear}>Clear</button>
      <label>
        Speed ({speed}ms):
        <input
          type="range"
          min={100}
          value={speed}
          max={1500}
          onChange={(e) => {
            setSpeed(e.currentTarget.valueAsNumber)
          }}
        />
      </label>
      <div className="board">
        {grid.map((row, y) => (
          <div key={y} className="row">
            {row.map((status, x) => (
              <Cell
                key={x}
                x={x}
                y={y}
                status={status}
                onClick={toggleStatus}
              ></Cell>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
