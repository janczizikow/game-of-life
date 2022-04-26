import c from 'clsx'

export enum CellStatus {
  dead,
  alive,
}

export interface Point {
  x: number
  y: number
}

interface CellProps extends Point {
  status: CellStatus
  onClick: (p: Point) => void
}

const Cell: React.FC<CellProps> = ({ x, y, status, onClick }) => {
  const isAlive = status === CellStatus.alive
  const handleClick = () => {
    onClick({ x, y })
  }
  return (
    <div
      className={c('Cell', { 'Cell--alive': isAlive })}
      onClick={handleClick}
    />
  )
}

export default Cell
