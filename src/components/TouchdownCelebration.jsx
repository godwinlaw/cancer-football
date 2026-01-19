import { motion, AnimatePresence } from 'framer-motion'

export default function TouchdownCelebration({ show, team, onComplete }) {
  if (!show) return null

  const isNiners = team === '49ers'

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="touchdown-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onComplete}
        >
          <motion.div
            className={`touchdown-content ${isNiners ? 'niners' : 'seahawks'}`}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {isNiners ? (
              <>
                <motion.div
                  className="touchdown-text"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="touchdown-title">TOUCHDOWN!</span>
                  <span className="team-name">SAN FRANCISCO 49ERS</span>
                </motion.div>

                <motion.div
                  className="player-celebration"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  <div className="player-icon">
                    <span className="jersey-number">1</span>
                    <span className="player-name">MELVIN LUM</span>
                  </div>
                </motion.div>

                <motion.div
                  className="celebration-message"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span>AMAZING WORK TODAY!</span>
                  <span className="sub-message">You crushed your nutrition goals!</span>
                </motion.div>

                {/* Fireworks */}
                <div className="fireworks">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="firework"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 1.5, 0],
                        opacity: [1, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.15,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    />
                  ))}
                </div>

                {/* Confetti */}
                <div className="confetti-container">
                  {[...Array(50)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="confetti-piece"
                      style={{
                        left: `${Math.random() * 100}%`,
                        backgroundColor: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#AA0000' : '#ffffff',
                        width: `${5 + Math.random() * 10}px`,
                        height: `${5 + Math.random() * 10}px`,
                      }}
                      initial={{ y: -20, rotate: 0, opacity: 1 }}
                      animate={{
                        y: window.innerHeight + 100,
                        rotate: Math.random() * 720 - 360,
                        opacity: [1, 1, 0]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        delay: i * 0.05,
                        ease: 'linear'
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <motion.div
                  className="opponent-score"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <span className="score-title">SEAHAWKS SCORE</span>
                  <span className="encouragement">Don't worry - tomorrow is a new day!</span>
                  <span className="motivation">Every small step counts. Keep fighting!</span>
                </motion.div>
              </>
            )}

            <motion.button
              className="continue-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={onComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isNiners ? 'CELEBRATE & CONTINUE' : 'KEEP GOING'}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
