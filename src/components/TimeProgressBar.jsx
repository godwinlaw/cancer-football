import { motion } from 'framer-motion'

// Visual bar comparing expected vs actual progress
export default function TimeProgressBar({
  expectedProgress = 0,
  actualProgress = 0,
  paceStatus = 'on_pace',
  paceMessage = 'Keep Going!'
}) {
  // Convert to percentages
  const expectedPercent = Math.min(expectedProgress * 100, 100)
  const actualPercent = Math.min(actualProgress * 100, 100)

  // Get colors based on pace status
  const getStatusColors = () => {
    switch (paceStatus) {
      case 'ahead':
        return {
          primary: '#10B981',
          glow: 'rgba(16, 185, 129, 0.4)',
          text: '#10B981'
        }
      case 'on_pace':
        return {
          primary: '#FFD700',
          glow: 'rgba(255, 215, 0, 0.4)',
          text: '#FFD700'
        }
      case 'behind':
        return {
          primary: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.4)',
          text: '#F59E0B'
        }
      default:
        return {
          primary: '#FFD700',
          glow: 'rgba(255, 215, 0, 0.4)',
          text: '#FFD700'
        }
    }
  }

  const colors = getStatusColors()

  // Get status emoji
  const getStatusEmoji = () => {
    switch (paceStatus) {
      case 'ahead': return '🔥'
      case 'on_pace': return '👍'
      case 'behind': return '💪'
      default: return '🏈'
    }
  }

  return (
    <div className="time-progress-bar">
      <div className="tpb-header">
        <span className="tpb-label">Daily Pace</span>
        <motion.span
          className="tpb-status"
          style={{ color: colors.text }}
          key={paceMessage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {getStatusEmoji()} {paceMessage}
        </motion.span>
      </div>

      <div className="tpb-bar-container">
        {/* Background track */}
        <div className="tpb-track">
          {/* Expected progress marker */}
          <motion.div
            className="tpb-expected-marker"
            style={{ left: `${expectedPercent}%` }}
            animate={{ left: `${expectedPercent}%` }}
            transition={{ duration: 0.5 }}
          >
            <div className="marker-line" />
            <span className="marker-label">Target</span>
          </motion.div>

          {/* Actual progress fill */}
          <motion.div
            className="tpb-actual-fill"
            style={{
              backgroundColor: colors.primary,
              boxShadow: `0 0 10px ${colors.glow}`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${actualPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Progress indicator */}
          <motion.div
            className="tpb-progress-indicator"
            style={{
              left: `${actualPercent}%`,
              backgroundColor: colors.primary
            }}
            animate={{ left: `${actualPercent}%` }}
            transition={{ duration: 0.5 }}
          >
            <span>{Math.round(actualPercent)}%</span>
          </motion.div>
        </div>
      </div>

      <div className="tpb-footer">
        <span className="tpb-time">8 AM</span>
        <span className="tpb-time">11 PM</span>
      </div>
    </div>
  )
}
