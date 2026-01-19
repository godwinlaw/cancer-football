import { useState } from 'react'
import { motion } from 'framer-motion'
import { calculateYardsGained } from '../data/gameConstants'

export default function TrackerCard({
  title,
  icon,
  current,
  goal,
  unit,
  onAdd,
  onSubtract,
  increment,
  multipliers = [1, 2, 5],
  allowCustom = false,
  color = '#AA0000',
  completed = false,
  paceModifier = 1.0,
  isAdmin = false
}) {
  const [customAmount, setCustomAmount] = useState('')
  const percentage = Math.min((current / goal) * 100, 100)
  const isComplete = current >= goal

  // Calculate predicted yards for each button
  const getYardsPreview = (amount) => {
    // Determine tracker type based on title
    let trackerType = 'fluids'
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('calorie')) trackerType = 'calories'
    if (lowerTitle.includes('baking')) trackerType = 'bakingSoda'

    return calculateYardsGained(trackerType, amount, paceModifier)
  }

  const handleCustomAdd = (e) => {
    e.preventDefault()
    const amount = parseInt(customAmount)
    if (!isNaN(amount) && amount > 0) {
      onAdd(amount)
      setCustomAmount('')
    }
  }

  return (
    <motion.div
      className={`tracker-card ${isComplete ? 'completed' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      style={{ '--tracker-color': color }}
    >
      <div className="tracker-header">
        <span className="tracker-icon">{icon}</span>
        <h3 className="tracker-title">{title}</h3>
        {isComplete && (
          <motion.span
            className="complete-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            COMPLETE
          </motion.span>
        )}
      </div>

      <div className="tracker-progress">
        <div className="progress-bar-bg">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ backgroundColor: color }}
          />
        </div>
        <div className="progress-text">
          <span className="current-value">{current}</span>
          <span className="separator">/</span>
          <span className="goal-value">{goal} {unit}</span>
        </div>
      </div>

      {/* Pace bonus indicator */}
      {paceModifier > 1 && !isComplete && (
        <div className="pace-bonus-indicator">
          <span className="bonus-badge">+{Math.round((paceModifier - 1) * 100)}% BONUS</span>
        </div>
      )}

      {isAdmin && (
        <div className="tracker-controls">
          <button
            className="tracker-btn subtract"
            onClick={onSubtract}
            disabled={current <= 0}
          >
            <span>-{increment}</span>
          </button>

          <div className="quick-add-buttons">
            {multipliers.map((multiplier) => {
              const amount = increment * multiplier
              const yardsPreview = getYardsPreview(amount)
              return (
                <button
                  key={multiplier}
                  className="quick-add-btn"
                  onClick={() => onAdd(amount)}
                  disabled={isComplete}
                  title={`+${yardsPreview} yards`}
                >
                  <span className="add-amount">+{amount}</span>
                  <span className="yards-preview">+{yardsPreview} yds</span>
                </button>
              )
            })}
          </div>

          {!allowCustom && (
            <button
              className="tracker-btn add"
              onClick={() => onAdd(increment)}
              disabled={isComplete}
            >
              <span>+{increment}</span>
            </button>
          )}
        </div>
      )}

      {isAdmin && allowCustom && !isComplete && (
        <form className="custom-add-container" onSubmit={handleCustomAdd}>
          <input
            type="number"
            className="custom-input"
            placeholder="Custom amount..."
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            min="1"
          />
          <button
            type="submit"
            className="custom-add-btn"
            disabled={!customAmount || parseInt(customAmount) <= 0}
            style={{ backgroundColor: color }}
          >
            ADD
          </button>
        </form>
      )}

      {/* Celebration effect when completed */}
      {completed && (
        <motion.div
          className="completion-celebration"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              className="confetti"
              style={{
                left: `${10 + i * 12}%`,
                backgroundColor: i % 2 === 0 ? '#FFD700' : '#AA0000'
              }}
              initial={{ y: 0, opacity: 1, rotate: 0 }}
              animate={{
                y: [0, -100, 50],
                opacity: [1, 1, 0],
                rotate: [0, 360, 720]
              }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
