import { useState } from 'react'

const BIRTHPLACE_SUGGESTIONS = ['東京', '大阪', '北海道', '沖縄', '地方の田舎町', '海外']

const SELECT_OPTIONS = {
  fatherType: ['厳格', '優しい', 'ユーモア', '無口', '不在'],
  motherType: ['教育熱心', 'おおらか', '厳しい', '働き者', '芸術家肌', '不在'],
  era: ['昭和', '平成', '令和', '近未来'],
  siblings: ['一人っ子', '兄/姉がいる', '弟/妹がいる', '大家族'],
}

const LABELS = {
  birthplace: '出生地',
  fatherType: '父の雰囲気',
  motherType: '母の雰囲気',
  era: '時代',
  siblings: '兄弟構成',
}

export default function StartScreen({ onStart }) {
  const [form, setForm] = useState({
    birthplace: '',
    fatherType: '',
    motherType: '',
    era: '',
    siblings: '',
  })

  const isValid = Object.values(form).every((v) => v.trim() !== '')

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isValid) onStart(form)
  }

  return (
    <div className="card start-screen">
      <h1 className="start-title">人生シミュレーター</h1>
      <p className="start-subtitle">もうひとつの人生、覗いてみない？</p>

      <div className="start-concept">
        「人生の体感時間の半分は20歳で終わる」
        <br />
        ── 0歳から24歳まで、あなただけの物語が始まります。
      </div>

      <form onSubmit={handleSubmit}>
        {/* Birthplace: text input with suggestions */}
        <div className="form-group">
          <label>{LABELS.birthplace}</label>
          <input
            type="text"
            list="birthplace-list"
            value={form.birthplace}
            onChange={(e) => handleChange('birthplace', e.target.value)}
            placeholder="選択 or 自由に入力"
          />
          <datalist id="birthplace-list">
            {BIRTHPLACE_SUGGESTIONS.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </div>

        {/* Select fields */}
        {Object.entries(SELECT_OPTIONS).map(([key, options]) => (
          <div className="form-group" key={key}>
            <label>{LABELS[key]}</label>
            <select
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            >
              <option value="" disabled>
                選択してください
              </option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button type="submit" className="btn btn-primary" disabled={!isValid}>
          人生を始める
        </button>
      </form>
    </div>
  )
}
