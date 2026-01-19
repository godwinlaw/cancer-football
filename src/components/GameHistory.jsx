import { motion } from 'framer-motion'

export default function GameHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="game-history empty">
        <h3>Season Record</h3>
        <p className="empty-message">No games played yet. Start tracking to begin your season!</p>
      </div>
    )
  }

  // Calculate season stats
  const wins = history.filter(game => game.winner === '49ers').length
  const losses = history.filter(game => game.winner === 'seahawks').length
  const totalNinersPoints = history.reduce((sum, game) => sum + game.ninersScore, 0)
  const totalSeahawksPoints = history.reduce((sum, game) => sum + game.seahawksScore, 0)

  // Get win streak
  let currentStreak = 0
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].winner === '49ers') {
      currentStreak++
    } else {
      break
    }
  }

  return (
    <div className="game-history">
      <h3>Season Record</h3>

      <div className="season-stats">
        <div className="stat-card wins">
          <span className="stat-value">{wins}</span>
          <span className="stat-label">WINS</span>
        </div>
        <div className="stat-card losses">
          <span className="stat-value">{losses}</span>
          <span className="stat-label">LOSSES</span>
        </div>
        <div className="stat-card points">
          <span className="stat-value">{totalNinersPoints}</span>
          <span className="stat-label">49ERS PTS</span>
        </div>
        {currentStreak > 0 && (
          <div className="stat-card streak">
            <span className="stat-value">{currentStreak}</span>
            <span className="stat-label">WIN STREAK</span>
          </div>
        )}
      </div>

      <div className="games-list">
        <h4>Recent Games</h4>
        {history.slice(-7).reverse().map((game, index) => (
          <motion.div
            key={game.date}
            className={`game-row ${game.winner === '49ers' ? 'win' : 'loss'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="game-date">
              {new Date(game.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span className="game-score">
              <span className="niners-score">{game.ninersScore}</span>
              <span className="separator">-</span>
              <span className="seahawks-score">{game.seahawksScore}</span>
            </span>
            <span className={`game-result ${game.winner === '49ers' ? 'win' : 'loss'}`}>
              {game.winner === '49ers' ? 'W' : 'L'}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Motivational message based on performance */}
      <div className="motivation-box">
        {wins > losses ? (
          <p>You're having a winning season! Keep up the amazing work!</p>
        ) : wins === losses ? (
          <p>The season is tied - every day is a chance to pull ahead!</p>
        ) : (
          <p>Every champion has faced setbacks. Your comeback starts today!</p>
        )}
      </div>
    </div>
  )
}
