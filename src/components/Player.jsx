import { motion } from 'framer-motion'

// SVG Player component - renders a football player as a circle with jersey number
export default function Player({
  x,
  y,
  number,
  team = 'niners',
  role = 'player',
  isAnimating = false,
  animationTarget = null,
  scale = 1
}) {
  const colors = team === 'niners'
    ? { jersey: '#AA0000', text: '#FFD700', outline: '#FFD700' }
    : { jersey: '#002244', text: '#69BE28', outline: '#69BE28' }

  const baseSize = 18 * scale
  const fontSize = 10 * scale

  // Animation variants for play movement
  const playerVariants = {
    idle: {
      x: 0,
      y: 0,
      scale: 1
    },
    running: {
      x: animationTarget?.x || 0,
      y: animationTarget?.y || 0,
      scale: 1.1,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    },
    blocking: {
      x: animationTarget?.x || 0,
      y: animationTarget?.y || 0,
      scale: 1.05,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    },
    returning: {
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        delay: 0.3
      }
    }
  }

  // Get animation state based on role and animation status
  const getAnimationState = () => {
    if (!isAnimating) return 'idle'

    switch (role) {
      case 'quarterback':
      case 'runner':
      case 'receiver':
        return 'running'
      case 'lineman':
      case 'linebacker':
      case 'defensive-back':
        return 'blocking'
      default:
        return 'running'
    }
  }

  return (
    <motion.g
      variants={playerVariants}
      animate={getAnimationState()}
      initial="idle"
    >
      {/* Player position marker */}
      <g transform={`translate(${x}, ${y})`}>
        {/* Outer glow when animating */}
        {isAnimating && (
          <motion.circle
            cx="0"
            cy="0"
            r={baseSize + 4}
            fill="none"
            stroke={colors.outline}
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity
            }}
          />
        )}

        {/* Player body (circle) */}
        <circle
          cx="0"
          cy="0"
          r={baseSize}
          fill={colors.jersey}
          stroke={colors.outline}
          strokeWidth="2"
        />

        {/* Helmet indicator (small arc at top) */}
        <path
          d={`M ${-baseSize * 0.7} ${-baseSize * 0.5}
              A ${baseSize * 0.8} ${baseSize * 0.8} 0 0 1 ${baseSize * 0.7} ${-baseSize * 0.5}`}
          fill="none"
          stroke={colors.text}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Jersey number */}
        <text
          x="0"
          y={baseSize * 0.35}
          textAnchor="middle"
          fill={colors.text}
          fontSize={fontSize}
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          {number}
        </text>
      </g>
    </motion.g>
  )
}
