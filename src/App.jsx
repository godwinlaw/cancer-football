import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FootballField from './components/FootballField'
import TrackerCard from './components/TrackerCard'
import TouchdownCelebration from './components/TouchdownCelebration'
import GameHistory from './components/GameHistory'
import PlayAnimation from './components/PlayAnimation'
import {
  FIELD,
  DOWNS,
  ANIMATIONS,
  getCurrentQuarter,
  getExpectedProgress,
  getActualProgress,
  getPaceStatus,
  calculateYardsGained,
  getQuarterTimeRemaining
} from './data/gameConstants'
import './nutrition-game.css'
import { db, auth } from './firebase'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import SupporterBoard from './components/SupporterBoard'

// Nutritional goals
const GOALS = {
  fluids: { goal: 1000, unit: 'ml', increment: 100, icon: '💧', title: 'Fluids', color: '#3B82F6' },
  calories: { goal: 1500, unit: 'cal', increment: 100, icon: '🍽️', title: 'Calories', color: '#F59E0B' },
  bakingSoda: { goal: 2, unit: 'swishes', increment: 1, icon: '🧂', title: 'Baking Soda', color: '#10B981' }
}

// Local storage keys
const STORAGE_KEY = 'melvin-nutrition-tracker'
const HISTORY_KEY = 'melvin-nutrition-history'

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

function loadTodayData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      if (data.date === getTodayKey()) {
        return data
      }
    }
  } catch (e) {
    console.error('Failed to load data:', e)
  }
  return {
    date: getTodayKey(),
    fluids: 0,
    calories: 0,
    bakingSoda: 0,
    ninersScore: 0,
    seahawksScore: 0,
    goalsCompleted: [],
    fieldPosition: FIELD.START_POSITION,
    down: DOWNS.STARTING_DOWN,
    yardsToGo: DOWNS.YARDS_FOR_FIRST,
    totalYards: 0,
    plays: []
  }
}

function loadHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load history:', e)
  }
  return []
}

export default function App() {
  const [gameData, setGameData] = useState(loadTodayData)
  const [history, setHistory] = useState(loadHistory)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationTeam, setCelebrationTeam] = useState(null)
  const [lastPlay, setLastPlay] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // State for play animations
  const [isPlayActive, setIsPlayActive] = useState(false)
  const [showPlayAnimation, setShowPlayAnimation] = useState(false)
  const [currentPlayResult, setCurrentPlayResult] = useState({
    yardsGained: 0,
    isFirstDown: false,
    isTouchdown: false,
    tracker: null
  })

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false)

  // Time-based state
  const [currentHour, setCurrentHour] = useState(() => {
    const now = new Date()
    return now.getHours() + now.getMinutes() / 60
  })

  // Update current hour every minute
  useEffect(() => {
    const updateHour = () => {
      const now = new Date()
      setCurrentHour(now.getHours() + now.getMinutes() / 60)
    }

    const interval = setInterval(updateHour, 60000)
    return () => clearInterval(interval)
  }, [])

  // Firebase Auth & Data Sync
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)

        // Load initial data
        const todayKey = getTodayKey()
        const docRef = doc(db, 'users', currentUser.uid, 'games', todayKey)
        const historyRef = doc(db, 'users', currentUser.uid, 'data', 'history')

        try {
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setGameData(docSnap.data())
          }

          const historySnap = await getDoc(historyRef)
          if (historySnap.exists()) {
            setHistory(historySnap.data().records || [])
          }
        } catch (error) {
          console.error("Error fetching data:", error)
        } finally {
          setLoading(false)
        }
      } else {
        // Sign in anonymously if not authenticated
        signInAnonymously(auth).catch((error) => {
          console.error("Error signing in anonymously:", error)
          setLoading(false)
        })
      }
    })

    return () => unsubscribeAuth()
  }, [])

  // Save to Firestore whenever gameData changes
  useEffect(() => {
    if (user && !loading) {
      const todayKey = getTodayKey()
      // Deep check to prevent overwriting with initial empty state if data hasn't loaded yet?
      // Actually `loading` state handles this.

      const docRef = doc(db, 'users', user.uid, 'games', todayKey)
      setDoc(docRef, gameData, { merge: true }).catch(e => console.error("Error saving gameData:", e))
    }
    // Also keep local storage as backup/offline cache
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData))
  }, [gameData, user, loading])

  // Save history whenever it changes
  useEffect(() => {
    if (user && !loading) {
      const historyRef = doc(db, 'users', user.uid, 'data', 'history')
      setDoc(historyRef, { records: history }, { merge: true }).catch(e => console.error("Error saving history:", e))
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history, user, loading])

  // Calculate time-based progress
  const expectedProgress = getExpectedProgress(currentHour)
  const actualProgress = getActualProgress(gameData, GOALS)
  const paceInfo = getPaceStatus(actualProgress, expectedProgress)
  const quarterInfo = getCurrentQuarter(currentHour)
  const quarterTime = getQuarterTimeRemaining(currentHour)

  // Check for new day and save yesterday's game
  useEffect(() => {
    const todayKey = getTodayKey()
    if (gameData.date !== todayKey) {
      // Save yesterday's game to history
      if (gameData.ninersScore > 0 || gameData.seahawksScore > 0) {
        const yesterdayGame = {
          date: gameData.date,
          ninersScore: gameData.ninersScore,
          seahawksScore: gameData.seahawksScore,
          winner: gameData.ninersScore >= gameData.seahawksScore ? '49ers' : 'seahawks',
          fluids: gameData.fluids,
          calories: gameData.calories,
          bakingSoda: gameData.bakingSoda,
          totalYards: gameData.totalYards
        }
        setHistory(prev => [...prev, yesterdayGame])
      }

      // Reset for new day
      setGameData({
        date: todayKey,
        fluids: 0,
        calories: 0,
        bakingSoda: 0,
        ninersScore: 0,
        seahawksScore: 0,
        goalsCompleted: [],
        fieldPosition: FIELD.START_POSITION,
        down: DOWNS.STARTING_DOWN,
        yardsToGo: DOWNS.YARDS_FOR_FIRST,
        totalYards: 0,
        plays: []
      })
    }
  }, [gameData.date])

  // Execute a play with animation
  const executePlay = useCallback((tracker, yardsGained, paceModifier) => {
    return new Promise((resolve) => {
      setIsPlayActive(true)

      setTimeout(() => {
        setGameData(prev => {
          let newFieldPosition = prev.fieldPosition + yardsGained
          let newDown = prev.down + 1
          let newYardsToGo = prev.yardsToGo - yardsGained
          let newScore = prev.ninersScore
          let isFirstDown = false
          let isTouchdown = false

          if (yardsGained >= prev.yardsToGo || newYardsToGo <= 0) {
            isFirstDown = true
            newDown = DOWNS.STARTING_DOWN
            newYardsToGo = DOWNS.YARDS_FOR_FIRST
          }

          if (newDown > DOWNS.MAX_DOWNS && DOWNS.AUTO_CONVERT_ON_4TH) {
            newDown = DOWNS.STARTING_DOWN
            newYardsToGo = DOWNS.YARDS_FOR_FIRST
          }

          if (newFieldPosition >= FIELD.TOUCHDOWN_LINE) {
            isTouchdown = true
            newScore += 7
            newFieldPosition = FIELD.START_POSITION
            newDown = DOWNS.STARTING_DOWN
            newYardsToGo = DOWNS.YARDS_FOR_FIRST
          }

          newFieldPosition = Math.max(0, Math.min(100, newFieldPosition))

          const play = {
            tracker,
            yardsGained,
            fieldPosition: newFieldPosition,
            down: newDown,
            yardsToGo: newYardsToGo,
            isFirstDown,
            isTouchdown,
            paceModifier,
            timestamp: Date.now()
          }

          setCurrentPlayResult({
            yardsGained,
            isFirstDown,
            isTouchdown,
            tracker
          })

          return {
            ...prev,
            fieldPosition: newFieldPosition,
            down: newDown,
            yardsToGo: newYardsToGo,
            totalYards: prev.totalYards + yardsGained,
            ninersScore: newScore,
            plays: [...prev.plays, play]
          }
        })

        setShowPlayAnimation(true)
        setIsPlayActive(false)

        setTimeout(() => {
          setShowPlayAnimation(false)
          resolve()
        }, ANIMATIONS.RESULT_DISPLAY)
      }, ANIMATIONS.PLAYER_MOVE)
    })
  }, [])

  // Check if a goal was just completed and trigger touchdown
  const checkForTouchdown = useCallback((tracker, newValue) => {
    const goalConfig = GOALS[tracker]
    const wasComplete = gameData[tracker] >= goalConfig.goal
    const isNowComplete = newValue >= goalConfig.goal

    if (!wasComplete && isNowComplete && !gameData.goalsCompleted.includes(tracker)) {
      setGameData(prev => ({
        ...prev,
        ninersScore: prev.ninersScore + 7,
        goalsCompleted: [...prev.goalsCompleted, tracker]
      }))
      setCelebrationTeam('49ers')
      setShowCelebration(true)
      setLastPlay({
        team: 'niners',
        message: `TOUCHDOWN! ${goalConfig.title} goal complete! +7 points!`
      })

      setTimeout(() => setLastPlay(null), 5000)
    }
  }, [gameData])

  // Handle adding to a tracker (triggers a play)
  const handleAdd = useCallback(async (tracker, amount) => {
    const yards = calculateYardsGained(tracker, amount, paceInfo.modifier)

    setGameData(prev => {
      const newValue = prev[tracker] + amount
      return { ...prev, [tracker]: newValue }
    })

    await executePlay(tracker, yards, paceInfo.modifier)

    setTimeout(() => {
      checkForTouchdown(tracker, gameData[tracker] + amount)
    }, 100)

    setLastPlay({
      team: 'niners',
      message: `+${yards} yards on ${GOALS[tracker].title}!`
    })
    setTimeout(() => setLastPlay(null), 3000)
  }, [gameData, checkForTouchdown, paceInfo.modifier, executePlay])

  // Handle subtracting from a tracker
  const handleSubtract = useCallback((tracker) => {
    const goalConfig = GOALS[tracker]
    setGameData(prev => ({
      ...prev,
      [tracker]: Math.max(0, prev[tracker] - goalConfig.increment)
    }))
  }, [])

  const resetDay = useCallback(async () => {
    if (window.confirm("Are you sure you want to RESET TODAY'S progress? This cannot be undone.")) {
      const todayKey = getTodayKey()
      const emptyGame = {
        date: todayKey,
        fluids: 0,
        calories: 0,
        bakingSoda: 0,
        ninersScore: 0,
        seahawksScore: 0,
        goalsCompleted: [],
        fieldPosition: FIELD.START_POSITION,
        down: DOWNS.STARTING_DOWN,
        yardsToGo: DOWNS.YARDS_FOR_FIRST,
        totalYards: 0,
        plays: []
      }
      setGameData(emptyGame)
      setLastPlay({
        team: 'system',
        message: 'Daily progress has been reset.'
      })
      setTimeout(() => setLastPlay(null), 3000)

      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid, 'games', todayKey)
          await setDoc(docRef, emptyGame)
        } catch (e) {
          console.error("Error resetting day in Firestore:", e)
        }
      }
    }
  }, [user])

  const resetSeason = useCallback(async () => {
    if (window.confirm("Are you sure you want to RESET THE ENTIRE SEASON? All history will be lost forever.")) {
      setHistory([])
      if (user) {
        try {
          const historyRef = doc(db, 'users', user.uid, 'data', 'history')
          await setDoc(historyRef, { records: [] })
        } catch (e) {
          console.error("Error resetting season in Firestore:", e)
        }
      }
    }
  }, [user])

  const allGoalsComplete = Object.keys(GOALS).every(
    key => gameData[key] >= GOALS[key].goal
  )

  if (loading) {
    return <div className="loading-screen">Loading game data...</div>
  }

  return (
    <div className="nutrition-game">
      <header className="game-header">
        <div className="header-content">
          <h1>
            <span className="team-text">GO MELVIN!</span>
            <span className="subtitle">Nutrition Tracker</span>
          </h1>
          <div className="header-actions">
            <button
              className="history-toggle"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Back to Game' : 'Season Stats'}
            </button>
          </div>
        </div>
      </header>

      <div className="game-content-wrapper">
        <div className="main-column">
          <AnimatePresence mode="wait">
            {showHistory ? (
              <motion.main
                key="history"
                className="history-view"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <GameHistory history={history} />
                <div className="history-actions" style={{ textAlign: 'center', marginTop: '20px' }}>
                  {isAdmin && (
                    <button
                      className="reset-button delete-season"
                      onClick={resetSeason}
                      style={{ backgroundColor: '#EF4444', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                    >
                      Reset Entire Season
                    </button>
                  )}
                </div>
              </motion.main>
            ) : (
              <motion.main
                key="game"
                className="game-view"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
              >
                <FootballField
                  niners49Score={gameData.ninersScore}
                  seahawksScore={gameData.seahawksScore}
                  fieldPosition={gameData.fieldPosition}
                  lastPlay={lastPlay}
                  isPlayActive={isPlayActive}
                  yardsGained={currentPlayResult.yardsGained}
                  down={gameData.down}
                  yardsToGo={gameData.yardsToGo}
                  quarter={quarterInfo?.label || 'Q1'}
                  quarterTimeRemaining={quarterTime?.formatted}
                  expectedProgress={expectedProgress}
                  actualProgress={actualProgress}
                  paceStatus={paceInfo.status}
                  paceMessage={paceInfo.message}
                />

                <div className="trackers-section">
                  <h2>Today's Goals</h2>
                  <div className="trackers-grid">
                    <TrackerCard
                      {...GOALS.fluids}
                      current={gameData.fluids}
                      onAdd={(amount) => handleAdd('fluids', amount)}
                      onSubtract={() => handleSubtract('fluids')}
                      completed={!gameData.goalsCompleted.includes('fluids') && gameData.fluids >= GOALS.fluids.goal}
                      paceModifier={paceInfo.modifier}
                      allowCustom={true}
                      isAdmin={isAdmin}
                    />
                    <TrackerCard
                      {...GOALS.calories}
                      current={gameData.calories}
                      onAdd={(amount) => handleAdd('calories', amount)}
                      onSubtract={() => handleSubtract('calories')}
                      completed={!gameData.goalsCompleted.includes('calories') && gameData.calories >= GOALS.calories.goal}
                      paceModifier={paceInfo.modifier}
                      allowCustom={true}
                      isAdmin={isAdmin}
                    />
                    <TrackerCard
                      {...GOALS.bakingSoda}
                      current={gameData.bakingSoda}
                      onAdd={(amount) => handleAdd('bakingSoda', amount)}
                      onSubtract={() => handleSubtract('bakingSoda')}
                      completed={!gameData.goalsCompleted.includes('bakingSoda') && gameData.bakingSoda >= GOALS.bakingSoda.goal}
                      paceModifier={paceInfo.modifier}
                      multipliers={[1, 2]}
                      isAdmin={isAdmin}
                    />
                  </div>

                  <div className="yard-stats">
                    <div className="stat-item">
                      <span className="stat-value">{gameData.totalYards}</span>
                      <span className="stat-label">Total Yards</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{gameData.plays.length}</span>
                      <span className="stat-label">Plays</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{gameData.plays.length > 0 ? (gameData.totalYards / gameData.plays.length).toFixed(1) : 0}</span>
                      <span className="stat-label">Avg Yards/Play</span>
                    </div>
                  </div>

                  {allGoalsComplete && (
                    <motion.div
                      className="all-complete-banner"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <span className="banner-icon">🏆</span>
                      <span className="banner-text">ALL GOALS COMPLETE! AMAZING DAY!</span>
                      <span className="banner-icon">🏆</span>
                    </motion.div>
                  )}
                </div>

                <div className="game-actions">
                  <p className="date-display">
                    Game Day: {new Date(gameData.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {isAdmin && (
                    <div className="debug-actions" style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button
                        className="reset-button"
                        onClick={resetDay}
                        style={{ backgroundColor: '#ffdad6', color: '#ba1a1a', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Reset Today
                      </button>
                    </div>
                  )}
                </div>
              </motion.main>
            )}
          </AnimatePresence>
        </div>

        <div className="side-column">
          <SupporterBoard isAdmin={isAdmin} />
        </div>
      </div>

      <PlayAnimation
        show={showPlayAnimation}
        yardsGained={currentPlayResult.yardsGained}
        isFirstDown={currentPlayResult.isFirstDown}
        isTouchdown={currentPlayResult.isTouchdown}
        tracker={currentPlayResult.tracker}
      />

      <TouchdownCelebration
        show={showCelebration}
        team={celebrationTeam}
        onComplete={() => setShowCelebration(false)}
      />

      <AdminLogin
        isAdmin={isAdmin}
        onLogin={(status) => setIsAdmin(status)}
      />
    </div>
  )
}

function AdminLogin({ isAdmin, onLogin }) {
  const [showInput, setShowInput] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'cancerslayer') {
      onLogin(true)
      setShowInput(false)
      setPassword('')
      setError(false)
    } else {
      setError(true)
    }
  }

  const handleLogout = () => {
    onLogin(false)
    setShowInput(false)
  }

  return (
    <div className="admin-login-container" style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 1000 }}>
      {isAdmin ? (
        <button
          onClick={handleLogout}
          style={{ background: '#333', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', opacity: 0.7 }}
        >
          Admin Logout
        </button>
      ) : showInput ? (
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', display: 'flex', gap: '5px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ padding: '5px', border: error ? '1px solid red' : '1px solid #ccc', borderRadius: '4px' }}
            autoFocus
          />
          <button type="submit" style={{ background: '#333', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Go</button>
          <button type="button" onClick={() => setShowInput(false)} style={{ background: '#ccc', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>X</button>
        </form>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          style={{
            background: 'rgba(170, 0, 0, 0.8)',
            color: '#FFD700',
            border: '2px solid #FFD700',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          🔐 Admin Controls
        </button>
      )}
    </div>
  )
}
