// Game timing and mechanics constants for the nutrition football game

// Game runs from 8 AM to 11 PM (15-hour window)
export const GAME_HOURS = {
  START: 8,  // 8 AM
  END: 23,   // 11 PM
  TOTAL: 15  // 15 hours total
}

// Quarter breakdown (15 hours / 4 quarters = 3.75 hours each)
export const QUARTERS = [
  { quarter: 1, start: 8, end: 11.75, label: 'Q1' },      // 8:00 AM - 11:45 AM
  { quarter: 2, start: 11.75, end: 15.5, label: 'Q2' },   // 11:45 AM - 3:30 PM
  { quarter: 3, start: 15.5, end: 19.25, label: 'Q3' },   // 3:30 PM - 7:15 PM
  { quarter: 4, start: 19.25, end: 23, label: 'Q4' }      // 7:15 PM - 11:00 PM
]

// Yard gain calculations
export const YARD_RATES = {
  fluids: 0.08,       // 0.08 yards per ml (100ml = 8 yards)
  calories: 0.08,     // 0.08 yards per calorie (100cal = 8 yards)
  bakingSoda: 5       // 5 yards per swish
}

// Pace modifiers (encouraging, not punitive)
export const PACE_MODIFIERS = {
  AHEAD: 1.2,         // On-track bonus: 20% extra yards
  ON_PACE: 1.0,       // Standard pace: normal yards
  BEHIND: 1.0         // Behind pace: no penalty (just no bonus)
}

// Pace thresholds (percentage of expected progress)
export const PACE_THRESHOLDS = {
  AHEAD: 1.0,         // At or above 100% expected
  ON_PACE: 0.8        // 80% to 100% expected = on pace
  // Below 80% = behind
}

// Down and distance settings
export const DOWNS = {
  YARDS_FOR_FIRST: 10,      // 10 yards for first down
  STARTING_DOWN: 1,
  MAX_DOWNS: 4,
  AUTO_CONVERT_ON_4TH: true // Automatically convert 4th down to 1st
}

// Field settings
export const FIELD = {
  TOTAL_YARDS: 100,
  TOUCHDOWN_LINE: 90,       // Field position where TD is scored (Seahawks end zone)
  START_POSITION: 20,       // Start at own 20 yard line
  FIRST_DOWN_MARKER_OFFSET: 10 // Yards ahead for first down marker
}

// Animation durations (milliseconds)
export const ANIMATIONS = {
  PLAY_DURATION: 1800,      // Total play animation time
  PLAYER_MOVE: 800,         // How long players move during play
  RESULT_DISPLAY: 1500,     // How long to show play result
  FIRST_DOWN_CELEBRATION: 2000
}

// Helper functions

/**
 * Get the current quarter based on hour
 */
export function getCurrentQuarter(hour) {
  if (hour < GAME_HOURS.START || hour >= GAME_HOURS.END) {
    return null // Game not active
  }

  for (const q of QUARTERS) {
    if (hour >= q.start && hour < q.end) {
      return q
    }
  }
  return QUARTERS[3] // Default to Q4
}

/**
 * Get expected progress (0-1) based on current time
 */
export function getExpectedProgress(hour) {
  if (hour < GAME_HOURS.START) return 0
  if (hour >= GAME_HOURS.END) return 1

  const elapsed = hour - GAME_HOURS.START
  return elapsed / GAME_HOURS.TOTAL
}

/**
 * Calculate actual progress based on current intake vs goals
 */
export function getActualProgress(current, goals) {
  const fluidProgress = Math.min(current.fluids / goals.fluids.goal, 1)
  const calorieProgress = Math.min(current.calories / goals.calories.goal, 1)
  const sodaProgress = Math.min(current.bakingSoda / goals.bakingSoda.goal, 1)

  return (fluidProgress + calorieProgress + sodaProgress) / 3
}

/**
 * Get pace status and modifier
 */
export function getPaceStatus(actualProgress, expectedProgress) {
  if (expectedProgress === 0) {
    return { status: 'ahead', modifier: PACE_MODIFIERS.AHEAD, message: 'Great Start!' }
  }

  const ratio = actualProgress / expectedProgress

  if (ratio >= PACE_THRESHOLDS.AHEAD) {
    return { status: 'ahead', modifier: PACE_MODIFIERS.AHEAD, message: 'On Track!' }
  } else if (ratio >= PACE_THRESHOLDS.ON_PACE) {
    return { status: 'on_pace', modifier: PACE_MODIFIERS.ON_PACE, message: 'Keep Going!' }
  } else {
    return { status: 'behind', modifier: PACE_MODIFIERS.BEHIND, message: "Let's catch up!" }
  }
}

/**
 * Calculate yards gained from an intake
 */
export function calculateYardsGained(tracker, amount, paceModifier = 1.0) {
  const baseRate = YARD_RATES[tracker] || 0
  const baseYards = amount * baseRate
  return Math.round(baseYards * paceModifier * 10) / 10
}

/**
 * Format time for display (e.g., "2:30 PM")
 */
export function formatGameTime(hour) {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayHour = h > 12 ? h - 12 : (h === 0 ? 12 : h)
  return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`
}

/**
 * Get time remaining in current quarter
 */
export function getQuarterTimeRemaining(hour) {
  const quarter = getCurrentQuarter(hour)
  if (!quarter) return null

  const remaining = quarter.end - hour
  const minutes = Math.floor(remaining * 60)
  return {
    hours: Math.floor(remaining),
    minutes: minutes % 60,
    formatted: `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, '0')}`
  }
}
