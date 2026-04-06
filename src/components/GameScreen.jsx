import { useState, useEffect, useRef } from 'react'
import { getTemplateEvent, TRAIT_META } from '../data/templates'
import { generateWithAI } from '../services/claude'

const AGE_LABEL = {
  0: '誕生',
  6: '小学校入学',
  12: '中学校進学',
  15: '高校進学',
  18: '卒業・進路',
  20: '成人',
}

export default function GameScreen({ age, traits, settings, history, fragments, onAdvance }) {
  const [eventData, setEventData] = useState(null)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [useAI, setUseAI] = useState(false)
  const generatedAge = useRef(-1)

  useEffect(() => {
    if (generatedAge.current === age) return
    generatedAge.current = age

    setIsLoading(true)
    setEventData(null)
    setSelectedChoice(null)

    const generate = async () => {
      try {
        if (useAI) {
          const result = await generateWithAI(age, traits, settings, history)
          setEventData(result)
        } else {
          throw new Error('use template')
        }
      } catch {
        const result = getTemplateEvent(age, traits, settings, history)
        setEventData(result)
      } finally {
        setIsLoading(false)
      }
    }

    generate()
  }, [age, useAI])

  const handleChoice = (choice) => {
    setSelectedChoice(choice)
  }

  const handleNext = () => {
    if (selectedChoice) {
      onAdvance(selectedChoice.resultEvent, selectedChoice.traits, selectedChoice.fragment)
    } else if (eventData) {
      onAdvance(eventData.event, eventData.traits, eventData.fragment)
    }
  }

  const progress = (age / 24) * 100

  return (
    <>
      {/* Progress */}
      <div className="progress-container">
        <div className="progress-label">人生の {Math.round(progress)}%</div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Main Card */}
      <div className="card" key={age}>
        {/* Age Header */}
        <div className="game-header">
          <div className="age-badge">{age}</div>
          <div className="age-label">{AGE_LABEL[age] || `${age}歳`}</div>
        </div>

        {/* Event Text */}
        {isLoading ? (
          <div className="event-text loading">
            <span className="loading-dots">人生を紡いでいます</span>
          </div>
        ) : (
          <>
            {eventData?.type === 'choice' && !selectedChoice && (
              <div className="event-text">{eventData.event}</div>
            )}
            {eventData?.type === 'event' && (
              <div className="event-text">{eventData.event}</div>
            )}
            {selectedChoice && (
              <div className="event-text">{selectedChoice.resultEvent}</div>
            )}

            {/* Choices */}
            {eventData?.type === 'choice' && !selectedChoice && (
              <div className="choices-container">
                <div className="choices-prompt">{eventData.prompt}</div>
                {eventData.choices.map((choice, i) => (
                  <button key={i} className="choice-btn" onClick={() => handleChoice(choice)}>
                    <div className="choice-btn-label">{choice.label}</div>
                    <div className="choice-btn-desc">{choice.description}</div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Spectrum Traits */}
        <div className="traits-panel">
          <div className="traits-title">あなたの個性</div>
          {TRAIT_META.map(({ key, left, right }) => (
            <div className="spectrum-row" key={key}>
              <span className="spectrum-label-left">{left}</span>
              <div className="spectrum-track">
                <div
                  className="spectrum-marker"
                  style={{ left: `${traits[key]}%` }}
                />
                <div className="spectrum-center" />
              </div>
              <span className="spectrum-label-right">{right}</span>
            </div>
          ))}
        </div>

        {/* Collected Fragments */}
        {fragments.length > 0 && (
          <div className="fragments-panel">
            <div className="fragments-title">集めたかけら</div>
            <div className="fragments-list">
              {fragments.map((f, i) => (
                <span className={`fragment-tag fragment-color-${i % 6}`} key={i}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next Button */}
        {!isLoading && (eventData?.type === 'event' || selectedChoice) && (
          <button className="btn btn-primary" onClick={handleNext}>
            {age === 24 ? 'エンディングへ' : '次の年へ →'}
          </button>
        )}
      </div>

      {/* AI Toggle */}
      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <button
          className="btn btn-ghost"
          style={{ fontSize: '0.75rem', padding: '8px 16px' }}
          onClick={() => {
            setUseAI(!useAI)
            generatedAge.current = -1
          }}
        >
          {useAI ? '📖 テンプレートモードに切替' : '✨ AI生成モードに切替'}
        </button>
      </div>
    </>
  )
}
