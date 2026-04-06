import { useState, useCallback } from 'react'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import EndingScreen from './components/EndingScreen'

function clampTrait(val) {
  return Math.max(0, Math.min(100, Math.round(val)))
}

function computeInitialTraits(settings) {
  // All traits start at center (50) — neither pole is "better"
  const traits = { social: 50, risk: 50, thinking: 50, energy: 50 }

  const fatherEffects = {
    '厳格': { thinking: 6, social: -3 },
    '優しい': { energy: -3, social: 3 },
    'ユーモア': { social: 5, risk: 3 },
    '無口': { social: -5, thinking: 3 },
    '不在': { risk: 3, social: -3 },
  }

  const motherEffects = {
    '教育熱心': { thinking: 6, energy: 3 },
    'おおらか': { energy: -4, risk: 3 },
    '厳しい': { thinking: 4, risk: -3 },
    '働き者': { energy: 3, risk: 2 },
    '芸術家肌': { thinking: -6, energy: 3 },
    '不在': { social: -3, risk: 3 },
  }

  const eraEffects = {
    '昭和': { social: 3, thinking: 3 },
    '平成': { risk: 3, energy: 2 },
    '令和': { social: -2, thinking: -3 },
    '近未来': { thinking: 4, risk: 4 },
  }

  const siblingEffects = {
    '一人っ子': { social: -4, thinking: 3 },
    '兄/姉がいる': { social: 3, risk: -2 },
    '弟/妹がいる': { social: 2, energy: 3 },
    '大家族': { social: 6, energy: 3 },
  }

  const apply = (effects) => {
    if (!effects) return
    Object.entries(effects).forEach(([key, val]) => {
      if (traits[key] !== undefined) traits[key] += val
    })
  }

  apply(fatherEffects[settings.fatherType])
  apply(motherEffects[settings.motherType])
  apply(eraEffects[settings.era])
  apply(siblingEffects[settings.siblings])

  Object.keys(traits).forEach((k) => {
    traits[k] = clampTrait(traits[k])
  })

  return traits
}

export default function App() {
  const [phase, setPhase] = useState('start')
  const [settings, setSettings] = useState(null)
  const [traits, setTraits] = useState({ social: 50, risk: 50, thinking: 50, energy: 50 })
  const [age, setAge] = useState(0)
  const [history, setHistory] = useState([])
  const [fragments, setFragments] = useState([])

  const handleStart = useCallback((newSettings) => {
    const initialTraits = computeInitialTraits(newSettings)
    setSettings(newSettings)
    setTraits(initialTraits)
    setAge(0)
    setHistory([])
    setFragments([])
    setPhase('playing')
  }, [])

  const handleAdvance = useCallback((event, traitChanges, fragment) => {
    const newTraits = { ...traits }
    if (traitChanges) {
      Object.entries(traitChanges).forEach(([key, val]) => {
        if (newTraits[key] !== undefined) newTraits[key] = clampTrait(newTraits[key] + val)
      })
    }

    setTraits(newTraits)
    setHistory((prev) => [
      ...prev,
      { age, event, traits: { ...newTraits }, fragment },
    ])
    if (fragment) {
      setFragments((prev) => [...prev, fragment])
    }

    const nextAge = age + 1
    if (nextAge > 24) {
      setPhase('ending')
    } else {
      setAge(nextAge)
    }
  }, [age, traits])

  const handleRestart = useCallback(() => {
    setPhase('start')
    setSettings(null)
    setTraits({ social: 50, risk: 50, thinking: 50, energy: 50 })
    setAge(0)
    setHistory([])
    setFragments([])
  }, [])

  return (
    <div className="app">
      <div className="app-container">
        {phase === 'start' && <StartScreen onStart={handleStart} />}
        {phase === 'playing' && (
          <GameScreen
            age={age}
            traits={traits}
            settings={settings}
            history={history}
            fragments={fragments}
            onAdvance={handleAdvance}
          />
        )}
        {phase === 'ending' && (
          <EndingScreen
            settings={settings}
            traits={traits}
            history={history}
            fragments={fragments}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  )
}
