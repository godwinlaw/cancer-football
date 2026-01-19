import Player from './Player'
import { OFFENSE_PLAYERS, DEFENSE_PLAYERS } from '../data/players'

// Orchestrates all players on the field, positions them relative to ball/scrimmage
export default function PlayersOnField({
  lineOfScrimmage = 50, // Field position (0-100)
  isPlayActive = false,
  yardsGained = 0
}) {
  // Convert field position (0-100) to SVG x coordinate
  // Field is 800 pixels wide in the playing area (100-900)
  const fieldToSvgX = (yardLine) => 100 + (yardLine * 8)

  // Convert field width position (0-100) to SVG y coordinate
  // Field is 500 pixels tall
  const fieldToSvgY = (widthPercent) => (widthPercent / 100) * 400 + 50

  // Line of scrimmage in SVG coordinates
  const scrimmageX = fieldToSvgX(lineOfScrimmage)

  // Calculate player position based on relative position to scrimmage
  const getPlayerPosition = (player, isDefense = false) => {
    const relX = player.relativePos.x
    const relY = player.relativePos.y

    // Convert relative yards to SVG pixels (8 pixels per yard)
    const xOffset = relX * 8
    const x = scrimmageX + xOffset

    // Y position based on field width percentage
    const y = fieldToSvgY(relY)

    // Animation target when play is active
    let animationTarget = null
    if (isPlayActive) {
      if (isDefense) {
        // Defense moves toward offense
        animationTarget = { x: -yardsGained * 4, y: 0 }
      } else {
        // Offense moves forward
        animationTarget = { x: yardsGained * 6, y: (Math.random() - 0.5) * 20 }
      }
    }

    return { x, y, animationTarget }
  }

  return (
    <g className="players-on-field">
      {/* Offense (49ers) */}
      <g className="offense-players">
        {OFFENSE_PLAYERS.map((player) => {
          const pos = getPlayerPosition(player, false)
          return (
            <Player
              key={player.id}
              x={pos.x}
              y={pos.y}
              number={player.number}
              team="niners"
              role={player.role}
              isAnimating={isPlayActive}
              animationTarget={pos.animationTarget}
            />
          )
        })}
      </g>

      {/* Defense (Seahawks) */}
      <g className="defense-players">
        {DEFENSE_PLAYERS.map((player) => {
          const pos = getPlayerPosition(player, true)
          return (
            <Player
              key={player.id}
              x={pos.x}
              y={pos.y}
              number={player.number}
              team="seahawks"
              role={player.role}
              isAnimating={isPlayActive}
              animationTarget={pos.animationTarget}
            />
          )
        })}
      </g>
    </g>
  )
}
