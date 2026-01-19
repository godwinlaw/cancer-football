import { motion, AnimatePresence } from 'framer-motion'

// Overlay showing play result: "+8 yards!", "FIRST DOWN!", etc.
export default function PlayAnimation({
  show = false,
  yardsGained = 0,
  isFirstDown = false,
  isTouchdown = false,
  tracker = null
}) {
  // Get emoji and color based on tracker type
  const getTrackerInfo = () => {
    switch (tracker) {
      case 'fluids':
        return { emoji: '💧', color: '#3B82F6' }
      case 'calories':
        return { emoji: '🍽️', color: '#F59E0B' }
      case 'bakingSoda':
        return { emoji: '🧂', color: '#10B981' }
      default:
        return { emoji: '🏈', color: '#FFD700' }
    }
  }

  const { emoji, color } = getTrackerInfo()

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="play-animation-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="play-result-card"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: -50, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25
            }}
          >
            {/* Touchdown celebration */}
            {isTouchdown ? (
              <>
                <motion.div
                  className="touchdown-banner"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="td-emoji">🏈</span>
                  <span className="td-text">TOUCHDOWN!</span>
                  <span className="td-emoji">🏈</span>
                </motion.div>
                <div className="yards-display" style={{ color }}>
                  +{yardsGained} yards
                </div>
              </>
            ) : isFirstDown ? (
              // First down celebration
              <>
                <motion.div
                  className="first-down-banner"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="fd-text">FIRST DOWN!</span>
                  <span className="fd-icon">→</span>
                </motion.div>
                <div className="yards-display" style={{ color }}>
                  +{yardsGained} yards
                </div>
                <div className="tracker-indicator">
                  {emoji}
                </div>
              </>
            ) : (
              // Regular play result
              <>
                <motion.div
                  className="yards-gained"
                  style={{ color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.4 }}
                >
                  +{yardsGained}
                </motion.div>
                <div className="yards-label">YARDS</div>
                <div className="tracker-indicator">
                  {emoji}
                </div>
              </>
            )}

            {/* Progress particles */}
            <div className="play-particles">
              {[...Array(8)].map((_, i) => (
                <motion.span
                  key={i}
                  className="particle"
                  style={{ backgroundColor: color }}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.05
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
