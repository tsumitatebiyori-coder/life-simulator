import { CHOICE_AGES, TRAIT_META } from '../data/templates'

const TRAIT_KEYS = TRAIT_META.map((t) => t.key)

function summarizeHistory(history) {
  if (history.length === 0) return 'まだ始まったばかりです。'
  const recent = history.slice(-3)
  return recent.map((h) => `${h.age}歳: ${h.event}`).join(' / ')
}

function traitDescription(traits) {
  return TRAIT_META.map(({ key, left, right }) => {
    const val = traits[key]
    const label = val >= 50 ? right : left
    const strength = Math.abs(val - 50)
    const degree = strength > 20 ? 'かなり' : strength > 10 ? 'やや' : 'どちらでもない'
    return strength > 5 ? `${degree}${label}` : `${left}と${right}の中間`
  }).join(', ')
}

function buildChoiceSystemPrompt(isMajor) {
  const choiceCount = isMajor ? 3 : 2
  return `あなたは「人生シミュレーター」のナレーターです。人生の出来事と選択肢を生成します。

このシミュレーターでは優劣をつけません。すべての選択肢は等しく価値があります。

性格スペクトラム:
- social: 内向的(0) ↔ 外向的(100)
- risk: 慎重(0) ↔ 冒険的(100)
- thinking: 感性(0) ↔ 理性(100)
- energy: 穏やか(0) ↔ 情熱的(100)

ルール：
- その年齢にふさわしい出来事と分岐点を描く
- 選択肢は${choiceCount}つ生成する（すべて前向きな選択肢にする）
- どの選択肢も「正解」であり「ハズレ」はない
- 各選択肢に詩的なキーワード（fragment）を含める
- 簡潔に。各テキストは1〜2文。

出力JSON形式：
{"event": "状況説明（1〜2文）", "prompt": "問いかけ（短く）", "choices": [{"label": "選択肢名（短く）", "description": "短い説明", "resultEvent": "結果テキスト（1〜2文）", "fragment": "詩的キーワード（4〜8文字）", "traits": {"social": 0, "risk": 0, "thinking": 0, "energy": 0}}]}

traitsは各-8〜+8の範囲の整数。`
}

function buildFreeInputSystemPrompt() {
  return `あなたは「人生シミュレーター」のナレーターです。プレイヤーが自由入力した行動の結果を温かく語ります。

このシミュレーターでは数値的な「良い/悪い」の評価をしません。

性格スペクトラム:
- social: 内向的(0) ↔ 外向的(100)
- risk: 慎重(0) ↔ 冒険的(100)
- thinking: 感性(0) ↔ 理性(100)
- energy: 穏やか(0) ↔ 情熱的(100)

ルール：
- プレイヤーの自由入力を尊重し、その行動の結果を情景が浮かぶように語る
- 突飛な入力でも否定せず、物語として昇華する
- どんな選択も肯定的に描く
- 簡潔に。1〜2文で。

出力JSON形式：
{"event": "結果テキスト（1〜2文）", "fragment": "詩的キーワード（4〜8文字）", "traits": {"social": 0, "risk": 0, "thinking": 0, "energy": 0}}

traitsは各-8〜+8の範囲の整数。`
}

function buildSettingsLine(settings) {
  return `設定: ${settings.era}の${settings.birthplace}生まれ。父は${settings.fatherType}、母は${settings.motherType}。${settings.siblings}。`
}

function parseJSON(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found in response')
  return JSON.parse(jsonMatch[0])
}

function clampTraitChanges(traits) {
  const clamped = {}
  TRAIT_KEYS.forEach((k) => {
    const val = traits[k]
    if (typeof val === 'number') {
      clamped[k] = Math.max(-8, Math.min(8, Math.round(val)))
    } else {
      clamped[k] = 0
    }
  })
  return clamped
}

export async function generateWithAI(age, traits, settings, history, freeText) {
  const isMajor = CHOICE_AGES.includes(age)

  // 自由入力テキストがある場合 → 結果だけ生成
  if (freeText) {
    const body = {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: buildFreeInputSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: `${buildSettingsLine(settings)}
現在の傾向: ${traitDescription(traits)}
これまでの要約: ${summarizeHistory(history)}

${age}歳のとき、この人物は「${freeText}」を選びました。結果を生成してください。`,
        },
      ],
    }

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) throw new Error(`API error: ${res.status}`)

    const data = await res.json()
    const text = data.content?.[0]?.text || ''
    const parsed = parseJSON(text)

    return {
      type: 'event',
      event: parsed.event,
      fragment: parsed.fragment || freeText,
      traits: clampTraitChanges(parsed.traits),
    }
  }

  // 選択肢生成（全年齢共通）
  const body = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: isMajor ? 500 : 350,
    system: buildChoiceSystemPrompt(isMajor),
    messages: [
      {
        role: 'user',
        content: `${buildSettingsLine(settings)}
現在の傾向: ${traitDescription(traits)}
これまでの要約: ${summarizeHistory(history)}

${age}歳の出来事と選択肢を生成してください。`,
      },
    ],
  }

  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error(`API error: ${res.status}`)

  const data = await res.json()
  const text = data.content?.[0]?.text || ''
  const parsed = parseJSON(text)

  return {
    type: isMajor ? 'major-choice' : 'mini-choice',
    event: parsed.event,
    prompt: parsed.prompt,
    choices: parsed.choices.map((c) => ({
      label: c.label,
      description: c.description,
      resultEvent: c.resultEvent,
      fragment: c.fragment || '',
      traits: clampTraitChanges(c.traits),
    })),
    freeResult: null,
  }
}
