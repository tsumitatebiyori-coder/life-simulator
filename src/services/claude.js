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

function buildSystemPrompt() {
  return `あなたは「人生シミュレーター」のナレーターです。架空の人物の人生を年ごとに温かく語ります。

このシミュレーターでは数値的な「良い/悪い」の評価をしません。
代わりに、4つの性格スペクトラム（どちらも良い・悪いはない）と「人生のかけら」（短い詩的なキーワード）を使います。

性格スペクトラム:
- social: 内向的(0) ↔ 外向的(100)
- risk: 慎重(0) ↔ 冒険的(100)
- thinking: 感性(0) ↔ 理性(100)
- energy: 穏やか(0) ↔ 情熱的(100)

ルール：
- 各年齢の出来事を2〜3文で簡潔に、情景が浮かぶように語る
- リアルで共感できる内容にする
- どの方向への変化も「良い」「悪い」と判断しない
- 必ず指定のJSON形式で返す（それ以外のテキストは不要）

出力JSON形式：
{"event": "出来事テキスト", "fragment": "詩的な短いキーワード（4〜8文字）", "traits": {"social": 0, "risk": 0, "thinking": 0, "energy": 0}}

traitsの値は各-8〜+8の範囲の整数で、その年のスペクトラムの変動値。`
}

function buildChoiceSystemPrompt() {
  return `あなたは「人生シミュレーター」のナレーターです。人生の選択肢を生成します。

このシミュレーターでは優劣をつけません。すべての選択肢は等しく価値があります。

性格スペクトラム:
- social: 内向的(0) ↔ 外向的(100)
- risk: 慎重(0) ↔ 冒険的(100)
- thinking: 感性(0) ↔ 理性(100)
- energy: 穏やか(0) ↔ 情熱的(100)

ルール：
- その年齢にふさわしい人生の分岐点を描く
- 選択肢は3つ生成する（すべて前向きな選択肢にする）
- どの選択肢も「正解」であり「ハズレ」はない
- 各選択肢に詩的なキーワード（fragment）を含める

出力JSON形式：
{"event": "状況説明", "prompt": "問いかけ", "choices": [{"label": "選択肢名", "description": "短い説明", "resultEvent": "結果テキスト", "fragment": "詩的キーワード", "traits": {"social": 0, "risk": 0, "thinking": 0, "energy": 0}}]}`
}

function buildUserMessage(age, traits, settings, history) {
  return `設定: ${settings.era}の${settings.birthplace}生まれ。父は${settings.fatherType}、母は${settings.motherType}。${settings.siblings}。
現在の傾向: ${traitDescription(traits)}
これまでの要約: ${summarizeHistory(history)}

${age}歳の出来事を生成してください。`
}

function buildChoiceUserMessage(age, traits, settings, history) {
  return `設定: ${settings.era}の${settings.birthplace}生まれ。父は${settings.fatherType}、母は${settings.motherType}。${settings.siblings}。
現在の傾向: ${traitDescription(traits)}
これまでの要約: ${summarizeHistory(history)}

${age}歳は人生の分岐点です。選択肢を生成してください。`
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

export async function generateWithAI(age, traits, settings, history) {
  const isChoice = CHOICE_AGES.includes(age)

  const body = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: isChoice ? 500 : 200,
    system: isChoice ? buildChoiceSystemPrompt() : buildSystemPrompt(),
    messages: [
      {
        role: 'user',
        content: isChoice
          ? buildChoiceUserMessage(age, traits, settings, history)
          : buildUserMessage(age, traits, settings, history),
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

  if (isChoice) {
    return {
      type: 'choice',
      event: parsed.event,
      prompt: parsed.prompt,
      choices: parsed.choices.map((c) => ({
        label: c.label,
        description: c.description,
        resultEvent: c.resultEvent,
        fragment: c.fragment || '',
        traits: clampTraitChanges(c.traits),
      })),
    }
  }

  return {
    type: 'event',
    event: parsed.event,
    fragment: parsed.fragment || '',
    traits: clampTraitChanges(parsed.traits),
  }
}
