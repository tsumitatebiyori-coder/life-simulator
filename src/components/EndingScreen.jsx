import { useRef, useState } from 'react'
import { generateEnding, TRAIT_META } from '../data/templates'

const TRAIT_COLORS = {
  social: '#7ba7bc',
  risk: '#e07a5f',
  thinking: '#81b29a',
  energy: '#e9c46a',
}

function DiamondChart({ traits }) {
  const W = 240
  const H = 240
  const cx = W / 2
  const cy = H / 2
  const R = 90

  // 4 axes: top, right, bottom, left
  const axes = TRAIT_META.map(({ key }, i) => {
    const angle = (Math.PI / 2) * i - Math.PI / 2
    const val = traits[key] / 100
    return {
      key,
      endX: cx + Math.cos(angle) * R,
      endY: cy + Math.sin(angle) * R,
      valX: cx + Math.cos(angle) * R * val,
      valY: cy + Math.sin(angle) * R * val,
    }
  })

  const shapePath = axes.map((a, i) => `${i === 0 ? 'M' : 'L'} ${a.valX} ${a.valY}`).join(' ') + ' Z'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="diamond-chart">
      {/* Background rings */}
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon
          key={scale}
          points={axes.map((_, i) => {
            const angle = (Math.PI / 2) * i - Math.PI / 2
            return `${cx + Math.cos(angle) * R * scale},${cy + Math.sin(angle) * R * scale}`
          }).join(' ')}
          fill="none"
          stroke="#e2d5c3"
          strokeWidth={scale === 0.5 ? 1.5 : 0.5}
          opacity={0.5}
        />
      ))}

      {/* Axis lines */}
      {axes.map((a) => (
        <line key={a.key} x1={cx} y1={cy} x2={a.endX} y2={a.endY} stroke="#e2d5c3" strokeWidth="0.5" />
      ))}

      {/* Shape */}
      <path d={shapePath} fill="rgba(212,132,90,0.15)" stroke="#d4845a" strokeWidth="2" />

      {/* Axis labels */}
      {TRAIT_META.map(({ key, left, right }, i) => {
        const angle = (Math.PI / 2) * i - Math.PI / 2
        const lx = cx + Math.cos(angle) * (R + 28)
        const ly = cy + Math.sin(angle) * (R + 28)
        const val = traits[key]
        const label = val >= 50 ? right : left
        return (
          <text
            key={key}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="#718096"
            fontWeight="500"
          >
            {label}
          </text>
        )
      })}

      {/* Dots on vertices */}
      {axes.map((a) => (
        <circle key={a.key} cx={a.valX} cy={a.valY} r="4" fill={TRAIT_COLORS[a.key]} />
      ))}
    </svg>
  )
}

export default function EndingScreen({ settings, traits, history, fragments, onRestart }) {
  const cardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const ending = generateEnding(traits, fragments)

  const keyAges = [0, 6, 12, 15, 18, 20, 23]
  const timeline = history.filter((h) => keyAges.includes(h.age))

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#fff8f0',
        scale: 2,
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = '人生シミュレーター_結果.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error('Screenshot failed:', e)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="ending-screen">
      {/* Share Card */}
      <div className="share-card" ref={cardRef}>
        <div className="share-card-title">人生シミュレーター</div>
        <div className="share-card-settings">
          {settings.era} / {settings.birthplace} / {settings.siblings}
        </div>

        <h2 className="ending-title">{ending.title}</h2>
        <p className="ending-subtitle">{ending.description}</p>

        {/* Diamond Chart */}
        <div className="diamond-chart-container">
          <DiamondChart traits={traits} />
        </div>

        {/* Fragments Mosaic */}
        <div className="fragments-mosaic">
          <div className="mosaic-title">あなたの人生のかけら</div>
          <div className="mosaic-grid">
            {fragments.map((f, i) => (
              <span className={`mosaic-piece mosaic-color-${i % 6}`} key={i}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline">
          {timeline.map((h) => (
            <div className="timeline-item" key={h.age}>
              <span className="timeline-age">{h.age}歳</span>
              <span className="timeline-event">{h.event}</span>
            </div>
          ))}
        </div>

        <p className="ending-summary">{ending.overall}</p>

        <div className="watermark">人生シミュレーター ー もうひとつの人生、覗いてみない？</div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}>
          {downloading ? 'ダウンロード中...' : '結果を画像で保存'}
        </button>
        <button className="btn btn-ghost" onClick={onRestart}>
          もう一度はじめから
        </button>
      </div>
    </div>
  )
}
