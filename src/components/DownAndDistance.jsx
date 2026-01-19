import { motion } from 'framer-motion'

// Displays current down and distance: "2nd & 7 at the 35"
export default function DownAndDistance({
  down = 1,
  yardsToGo = 10,
  fieldPosition = 20,
  quarter = 'Q1',
  quarterTimeRemaining = null
}) {
  // Format down number
  const formatDown = (d) => {
    switch (d) {
      case 1: return '1st'
      case 2: return '2nd'
      case 3: return '3rd'
      case 4: return '4th'
      default: return `${d}th`
    }
  }

  // Format field position (display as yard line)
  const formatPosition = (pos) => {
    if (pos <= 50) {
      return `own ${pos}`
    } else {
      return `SEA ${100 - pos}`
    }
  }

  // Determine display color based on situation
  const getSituationColor = () => {
    if (down === 4) return '#EF4444' // 4th down - red
    if (yardsToGo <= 3) return '#10B981' // Short yardage - green
    return '#FFD700' // Normal - gold
  }

  return (
    <motion.div
      className="down-and-distance"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="dad-main">
        <motion.span
          className="dad-down"
          key={`${down}-${yardsToGo}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          style={{ color: getSituationColor() }}
        >
          {formatDown(down)} & {yardsToGo}
        </motion.span>
        <span className="dad-separator">at the</span>
        <span className="dad-position">{formatPosition(fieldPosition)}</span>
      </div>

      <div className="dad-info">
        <span className="dad-quarter">{quarter}</span>
        {quarterTimeRemaining && (
          <span className="dad-time">{quarterTimeRemaining}</span>
        )}
      </div>
    </motion.div>
  )
}
