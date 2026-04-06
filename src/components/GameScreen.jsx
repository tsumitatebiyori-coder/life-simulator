import { useState, useEffect, useRef } from 'react'
import { getTemplateEvent, generateFreeResultText, TRAIT_META } from '../data/templates'
import { generateWithAI } from '../services/claude'

const AGE_LABEL = {
  0: '誕生',
  6: '小学校入学',
  12: '中学校進学',
  15: '高校進学',
  18: '卒業・進路',
  20: '成人',
  24: '体感時間の折り返し',
}

export default function GameScreen({ age, traits, settings, history, fragments, onAdvance }) {
  const [eventData, setEventData] = useState(null)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [freeText, setFreeText] = useState('')
  const [freeResult, setFreeResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFreeLoading, setIsFreeLoading] = useState(false)
  const generatedAge = useRef(-1)

  useEffect(() => {
    if (generatedAge.current === age) return
    generatedAge.current = age

    setIsLoading(true)
    setEventData(null)
    setSelectedChoice(null)
    setFreeText('')
    setFreeResult(null)

    // テンプレートから選択肢（サジェスト用）を取得
    const result = getTemplateEvent(age, traits)
    setEventData(result)
    setIsLoading(false)
  }, [age])

  const handleChoice = (choice) => {
    setSelectedChoice(choice)
    setFreeResult(null)
  }

  const handleFreeSubmit = async () => {
    if (!freeText.trim()) return

    setIsFreeLoading(true)
    try {
      // まずAIで生成を試みる
      const result = await generateWithAI(age, traits, settings, history, freeText.trim())
      setFreeResult({
        resultEvent: result.event,
        fragment: result.fragment || freeText.trim(),
        traits: result.traits,
      })
      setSelectedChoice(null)
    } catch {
      // AI失敗時：ユーザーのテキストを織り込んだフォールバック
      const fallback = generateFreeResultText(freeText.trim(), age)
      setFreeResult({
        resultEvent: fallback.result,
        fragment: fallback.fragment,
        traits: eventData?.freeResult?.traits || {},
      })
      setSelectedChoice(null)
    } finally {
      setIsFreeLoading(false)
    }
  }

  const handleNext = () => {
    if (freeResult) {
      onAdvance(freeResult.resultEvent, freeResult.traits, freeResult.fragment)
    } else if (selectedChoice) {
      onAdvance(selectedChoice.resultEvent, selectedChoice.traits, selectedChoice.fragment)
    }
  }

  const hasResult = selectedChoice || freeResult
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
            {/* 状況テキスト（結果がまだ出ていない時） */}
            {!hasResult && eventData && (
              <div className="event-text">{eventData.event}</div>
            )}

            {/* 結果テキスト */}
            {hasResult && (
              <div className="event-text result-text">
                {freeResult ? freeResult.resultEvent : selectedChoice.resultEvent}
              </div>
            )}

            {/* 選択エリア（まだ選んでいない時） */}
            {!hasResult && eventData && (
              <div className="choices-container">
                {/* 自由入力（メイン） */}
                <div className="free-input-main">
                  <div className="choices-prompt">{eventData.prompt}</div>
                  <div className="free-input-row">
                    <input
                      type="text"
                      className="free-input"
                      placeholder="あなたならどうする？"
                      value={freeText}
                      onChange={(e) => setFreeText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && freeText.trim()) handleFreeSubmit()
                      }}
                      disabled={isFreeLoading}
                    />
                    <button
                      className="btn btn-free"
                      onClick={handleFreeSubmit}
                      disabled={!freeText.trim() || isFreeLoading}
                    >
                      {isFreeLoading ? '...' : '決定'}
                    </button>
                  </div>
                  <div className="free-input-hint">AIがあなたの言葉に応えます</div>
                </div>

                {/* テンプレ選択肢（サジェスト） */}
                <div className="suggest-area">
                  <div className="suggest-divider">
                    <span>迷ったら</span>
                  </div>
                  <div className="suggest-buttons">
                    {eventData.choices.map((choice, i) => (
                      <button key={i} className="suggest-btn" onClick={() => handleChoice(choice)}>
                        {choice.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 獲得したかけら表示 */}
            {hasResult && (
              <div className="gained-fragment">
                <span className="gained-label">かけら獲得</span>
                <span className="gained-value">
                  {freeResult ? freeResult.fragment : selectedChoice.fragment}
                </span>
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
        {!isLoading && hasResult && (
          <button className="btn btn-primary" onClick={handleNext}>
            {age >= 24 ? 'エンディングへ' : '次の年へ →'}
          </button>
        )}
      </div>
    </>
  )
}
