import { motion, AnimatePresence } from 'framer-motion'
import PlayersOnField from './PlayersOnField'
import DownAndDistance from './DownAndDistance'
import TimeProgressBar from './TimeProgressBar'

// Field position based on game progress (0-100)
export default function FootballField({
  niners49Score,
  seahawksScore,
  fieldPosition = 50,
  isScoring = false,
  scoringTeam = null,
  lastPlay = null,
  // New props for play mechanics
  isPlayActive = false,
  yardsGained = 0,
  down = 1,
  yardsToGo = 10,
  quarter = 'Q1',
  quarterTimeRemaining = null,
  // Time progress props
  expectedProgress = 0,
  actualProgress = 0,
  paceStatus = 'on_pace',
  paceMessage = 'Keep Going!'
}) {
  // Calculate ball position on field (0 = 49ers end zone, 100 = Seahawks end zone)
  const ballX = (fieldPosition / 100) * 100

  // Line of scrimmage position (same as ball position)
  const scrimmageX = 100 + (fieldPosition * 8)

  // First down marker position
  const firstDownX = 100 + (Math.min(fieldPosition + yardsToGo, 100) * 8)

  return (
    <div className="football-field-container">
      {/* Down and Distance Display */}
      <DownAndDistance
        down={down}
        yardsToGo={yardsToGo}
        fieldPosition={fieldPosition}
        quarter={quarter}
        quarterTimeRemaining={quarterTimeRemaining}
      />

      <svg viewBox="0 0 1000 500" className="football-field">
        {/* Field background - green turf */}
        <defs>
          <pattern id="turf" patternUnits="userSpaceOnUse" width="50" height="50">
            <rect width="50" height="50" fill="#2d5a27" />
            <rect width="25" height="50" fill="#326b2c" />
          </pattern>
          <linearGradient id="49ersGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <linearGradient id="seahawksBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#002244" />
            <stop offset="100%" stopColor="#001a33" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="footballGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#654321" />
          </radialGradient>
        </defs>

        {/* Main field */}
        <rect x="0" y="0" width="1000" height="500" fill="url(#turf)" />

        {/* 49ers End Zone (left) */}
        <rect x="0" y="0" width="100" height="500" fill="#AA0000" />
        <text className="field-endzone-text" x="50" y="250" fill="#FFD700" fontSize="24" fontWeight="bold" textAnchor="middle" transform="rotate(-90, 50, 250)">
          49ERS
        </text>

        {/* Seahawks End Zone (right) */}
        <rect x="900" y="0" width="100" height="500" fill="#002244" />
        <text className="field-endzone-text" x="950" y="250" fill="#69BE28" fontSize="24" fontWeight="bold" textAnchor="middle" transform="rotate(90, 950, 250)">
          SEAHAWKS
        </text>

        {/* Yard lines */}
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((yard) => (
          <g key={yard}>
            <line
              x1={yard * 8 + 100}
              y1="0"
              x2={yard * 8 + 100}
              y2="500"
              stroke="white"
              strokeWidth="2"
            />
            {/* Yard numbers */}
            {yard !== 50 && (
              <>
                <text
                  x={yard * 8 + 100}
                  y="40"
                  fill="white"
                  fontSize="20"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {yard <= 50 ? yard : 100 - yard}
                </text>
                <text
                  x={yard * 8 + 100}
                  y="480"
                  fill="white"
                  fontSize="20"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {yard <= 50 ? yard : 100 - yard}
                </text>
              </>
            )}
          </g>
        ))}

        {/* 50 yard line - special */}
        <line x1="500" y1="0" x2="500" y2="500" stroke="white" strokeWidth="4" />
        <text x="500" y="40" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">50</text>
        <text x="500" y="480" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">50</text>

        {/* Hash marks */}
        {Array.from({ length: 99 }, (_, i) => i + 1).map((yard) => (
          <g key={`hash-${yard}`}>
            <line
              x1={yard * 8 + 100}
              y1="185"
              x2={yard * 8 + 100}
              y2="195"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1={yard * 8 + 100}
              y1="305"
              x2={yard * 8 + 100}
              y2="315"
              stroke="white"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* Line of Scrimmage (yellow dashed line) */}
        <motion.line
          x1={scrimmageX}
          y1="0"
          x2={scrimmageX}
          y2="500"
          stroke="#FFD700"
          strokeWidth="3"
          strokeDasharray="10,5"
          animate={{ x1: scrimmageX, x2: scrimmageX }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        />

        {/* First Down Marker (blue line) */}
        {fieldPosition + yardsToGo <= 100 && (
          <motion.line
            x1={firstDownX}
            y1="0"
            x2={firstDownX}
            y2="500"
            stroke="#3B82F6"
            strokeWidth="4"
            animate={{ x1: firstDownX, x2: firstDownX }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
        )}

        {/* First Down Marker Label */}
        {fieldPosition + yardsToGo <= 100 && (
          <motion.g animate={{ x: firstDownX - scrimmageX }}>
            <rect
              x={firstDownX - 20}
              y="5"
              width="40"
              height="24"
              rx="4"
              fill="#3B82F6"
            />
            <text
              x={firstDownX}
              y="22"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
            >
              1ST
            </text>
          </motion.g>
        )}

        {/* Players on Field */}
        <PlayersOnField
          lineOfScrimmage={fieldPosition}
          isPlayActive={isPlayActive}
          yardsGained={yardsGained}
        />

        {/* Football with animation */}
        <AnimatePresence>
          <motion.g
            key="football"
            initial={{ x: 500, y: 250 }}
            animate={{
              x: 100 + (ballX * 8),
              y: 250,
              scale: isScoring ? [1, 1.5, 1] : 1
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            {/* Football shadow */}
            <ellipse cx="0" cy="10" rx="20" ry="8" fill="rgba(0,0,0,0.3)" />

            {/* Football */}
            <ellipse cx="0" cy="0" rx="18" ry="10" fill="#8B4513" />
            <ellipse cx="0" cy="0" rx="18" ry="10" fill="url(#footballGradient)" />

            {/* Football laces */}
            <line x1="-8" y1="0" x2="8" y2="0" stroke="white" strokeWidth="2" />
            <line x1="-4" y1="-3" x2="-4" y2="3" stroke="white" strokeWidth="1.5" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="white" strokeWidth="1.5" />
            <line x1="4" y1="-3" x2="4" y2="3" stroke="white" strokeWidth="1.5" />
          </motion.g>
        </AnimatePresence>

        {/* Scoring celebration overlay */}
        <AnimatePresence>
          {isScoring && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Fireworks / celebration effects */}
              {scoringTeam === '49ers' && (
                <>
                  {[...Array(12)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={50 + Math.random() * 100}
                      cy={100 + Math.random() * 300}
                      r="5"
                      fill="#FFD700"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 2, 0],
                        opacity: [1, 1, 0],
                        y: [0, -50]
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.1,
                        repeat: 2
                      }}
                    />
                  ))}
                </>
              )}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Time Progress Bar */}
      <TimeProgressBar
        expectedProgress={expectedProgress}
        actualProgress={actualProgress}
        paceStatus={paceStatus}
        paceMessage={paceMessage}
      />

      {/* Scoreboard */}
      <div className="scoreboard">
        <div className="team niners">
          <div className="team-logo">
            <div className="niners-logo">SF</div>
          </div>
          <div className="team-info">
            <span className="team-name">49ERS</span>
            <span className="quarterback">QB: Melvin Lum</span>
          </div>
          <motion.span
            className="score"
            key={niners49Score}
            initial={{ scale: 1.5, color: '#FFD700' }}
            animate={{ scale: 1, color: '#ffffff' }}
          >
            {niners49Score}
          </motion.span>
        </div>

        <div className="game-status">
          <span className="quarter">{quarter}</span>
          <span className="time">GAME DAY</span>
        </div>

        <div className="team seahawks">
          <motion.span
            className="score"
            key={seahawksScore}
            initial={{ scale: 1.5, color: '#69BE28' }}
            animate={{ scale: 1, color: '#ffffff' }}
          >
            {seahawksScore}
          </motion.span>
          <div className="team-info">
            <span className="team-name">SEAHAWKS</span>
            <span className="quarterback">QB: Cancer</span>
          </div>
          <div className="team-logo">
            <div className="seahawks-logo">SEA</div>
          </div>
        </div>
      </div>

      {/* Last play notification */}
      <AnimatePresence>
        {lastPlay && (
          <motion.div
            className={`last-play ${lastPlay.team}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            {lastPlay.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
