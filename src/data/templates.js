/**
 * A + C 設計: 「人生のかけら」コレクション + 性格スペクトラム
 *
 * Traits (内部値 0〜100、50が中央):
 *   social:    内向的(0)  ↔ 外向的(100)
 *   risk:      慎重(0)    ↔ 冒険的(100)
 *   thinking:  感性(0)    ↔ 理性(100)
 *   energy:    穏やか(0)  ↔ 情熱的(100)
 *
 * どちらに振れても「個性」。優劣はない。
 */

export const CHOICE_AGES = [6, 12, 15, 18, 20]

export const TRAIT_META = [
  { key: 'social', left: '内向的', right: '外向的' },
  { key: 'risk', left: '慎重', right: '冒険的' },
  { key: 'thinking', left: '感性', right: '理性' },
  { key: 'energy', left: '穏やか', right: '情熱的' },
]

// ---------- Helper ----------
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function weighted(arr, traits) {
  const eligible = arr.filter((e) => !e.cond || e.cond(traits))
  return eligible.length > 0 ? pick(eligible) : pick(arr)
}

// ---------- Regular Events ----------
const events = {
  0: [
    { text: 'この世に生まれ落ちた。小さな産声が分娩室に響き渡る。新しい物語が、今始まった。', fragment: 'はじまりの産声', traits: {} },
  ],
  1: [
    { text: 'はじめて「ママ」と言えた日。家族みんなが拍手してくれて、世界が温かかった。', fragment: 'はじめてのことば', traits: { social: 3, energy: 2 } },
    { text: 'よちよち歩きで転んでばかり。でも何度でも立ち上がった。', fragment: '何度でも立ち上がる足', traits: { risk: 3 } },
  ],
  2: [
    { text: '公園デビュー。砂場で隣の子のスコップを奪って大泣きさせてしまった。', fragment: '砂場のケンカ', traits: { energy: 3, social: -2 } },
    { text: '絵本の読み聞かせが大好きになった。毎晩「もう一回！」とせがむ日々。', fragment: 'もう一回の絵本', traits: { thinking: -3, social: -1 } },
  ],
  3: [
    { text: 'はじめて自転車に乗れた日。転んで泣いたけど、最後は笑顔で走り抜けた。', fragment: '自転車と風', traits: { risk: 4, energy: 2 } },
    { text: '幼稚園に入園。知らない子ばかりで最初は泣いていたけど、少しずつ慣れていった。', fragment: '知らない場所の不安', traits: { social: 2 } },
  ],
  4: [
    { text: '幼稚園でいちばんの友達ができた。毎日お揃いの靴下を履いてくる約束をした。', fragment: 'お揃いの約束', traits: { social: 5, energy: 2 } },
    { text: 'お遊戯会で主役に選ばれた。緊張したけど、やり切った時の達成感は忘れられない。', fragment: '舞台の上の光', traits: { energy: 4, risk: 2 } },
    { text: 'ひらがなを全部覚えた。自分の名前が書けた時、すごく嬉しかった。', fragment: '自分の名前', traits: { thinking: 3 } },
  ],
  5: [
    { text: '七五三のお祝い。千歳飴が長すぎて持て余した。家族写真は少し緊張した顔。', fragment: '千歳飴の甘さ', traits: { energy: -2 } },
    { text: '初めてのおつかい。ドキドキしながらお豆腐を買って帰れた。', fragment: 'はじめてのおつかい', traits: { risk: 3, social: 2 } },
    { text: '虫取りに夢中になった夏。カブトムシを捕まえて、ヒーローになった気分。', fragment: 'カブトムシの夏', traits: { risk: 4, thinking: -2 } },
  ],
  7: [
    {
      text: 'かけっこで1位になった。みんなが「すごい！」と言ってくれて嬉しかった。',
      fragment: '1位のゴールテープ',
      traits: { energy: 4, social: 2 },
      cond: (t) => t.social >= 50,
    },
    {
      text: '算数のテストで100点をとった。先生に「よく頑張ったね」と褒められた。',
      fragment: '100点の余白',
      traits: { thinking: 5 },
      cond: (t) => t.thinking >= 50,
    },
    { text: '友達とケンカしてしまった。仲直りするまで3日かかった。', fragment: '3日間の沈黙', traits: { social: -3 } },
    { text: '初めて図書室で本を借りた。冒険物語に夢中になり、読書好きになった。', fragment: '冒険物語の世界', traits: { thinking: -3, risk: 3 } },
  ],
  8: [
    { text: 'クラスで一番の仲良しができた。毎日一緒に帰って、秘密基地を作った。', fragment: '秘密基地の設計図', traits: { social: 5, risk: 2 } },
    { text: '習い事を始めた。最初はつらかったけど、続けるうちに少しずつ上達していった。', fragment: '続けることの意味', traits: { thinking: 2, energy: 2 } },
    {
      text: '転校生が来た。勇気を出して最初に話しかけたのは自分だった。',
      fragment: '最初の一歩',
      traits: { social: 4, risk: 3 },
      cond: (t) => t.social >= 55,
    },
  ],
  9: [
    { text: '夏休みの自由研究で入賞した。初めて「没頭する楽しさ」を知った。', fragment: '没頭した夏', traits: { thinking: 4, energy: 3 } },
    { text: 'クラス対抗リレーで足を引っ張ってしまった。悔しくて夜、布団の中で泣いた。', fragment: '布団の中の涙', traits: { energy: 3, social: -2 } },
    { text: '家族旅行で海に行った。波と砂浜と、笑い声。忘れられない夏の記憶。', fragment: '波と笑い声', traits: { energy: -2, social: 2 } },
  ],
  10: [
    { text: '将来の夢を作文に書いた。漠然としていたけれど、心の奥で何かが芽生えた。', fragment: '漠然とした夢', traits: { risk: 2 } },
    { text: '初めてお小遣いで友達にプレゼントを買った。喜んでくれた顔が嬉しかった。', fragment: '手渡したプレゼント', traits: { social: 4 } },
    {
      text: '一人で夜空を眺める時間が好きになった。誰にも邪魔されない、静かな幸せ。',
      fragment: '星空のひとり時間',
      traits: { social: -4, thinking: -2 },
      cond: (t) => t.social < 50,
    },
  ],
  11: [
    { text: '卒業を意識し始める6年生。クラスの雰囲気が少し大人びてきた。', fragment: '大人への予感', traits: { thinking: 2 } },
    { text: '初恋かもしれない。隣の席のあの子が気になって、授業に集中できない。', fragment: '隣の席の横顔', traits: { thinking: -3, energy: 3, social: 2 } },
    { text: '学芸会の劇で大きな拍手をもらった。舞台の上で見た景色は特別だった。', fragment: '拍手の記憶', traits: { social: 3, energy: 4 } },
  ],
  13: [
    { text: '思春期の入り口。自分が何者なのか、ぼんやりと考え始めた。', fragment: '「自分」という問い', traits: { social: -2, thinking: -2 } },
    {
      text: '部活の先輩に憧れるようになった。自分もあんな風になりたいと思った。',
      fragment: '憧れの背中',
      traits: { energy: 4, social: 3 },
      cond: (t) => t.social >= 50,
    },
    {
      text: '教科書の片隅に落書き。授業より窓の外の空が気になる日々。',
      fragment: '窓の外の空',
      traits: { thinking: -3, risk: 2 },
      cond: (t) => t.thinking < 50,
    },
    { text: '友達と夜遅くまで電話で話した。くだらない話が一番楽しい年頃。', fragment: '夜更かしの電話', traits: { social: 4 } },
  ],
  14: [
    { text: '文化祭の準備が楽しすぎた。クラスが一つになる感覚を初めて味わった。', fragment: '一つになる瞬間', traits: { social: 4, energy: 4 } },
    { text: '将来について親と初めて真剣に話した。まだ答えは出ないけど、考えるきっかけになった。', fragment: '食卓の会話', traits: { thinking: 3, risk: -2 } },
    {
      text: '一人で音楽を聴く時間が増えた。歌詞の意味が、前より深く沁みる。',
      fragment: 'イヤホンの中の世界',
      traits: { social: -3, thinking: -3 },
      cond: (t) => t.social < 50,
    },
    { text: '偶然見つけた趣味にハマった。自分だけの世界ができた気がして心が満たされた。', fragment: '自分だけの世界', traits: { thinking: -2, risk: 3 } },
  ],
  16: [
    { text: '高校生活にも慣れてきた。自分の居場所を見つけた安心感。', fragment: '自分の居場所', traits: { energy: -2, social: 2 } },
    {
      text: '模試の結果を見て、自分と向き合った。数字に一喜一憂するのはやめようと思った。',
      fragment: '数字じゃない価値',
      traits: { thinking: 3, risk: -2 },
      cond: (t) => t.thinking >= 50,
    },
    { text: 'アルバイトを始めた。自分で稼いだお金で買ったものは特別だった。', fragment: '初めての給料', traits: { risk: 3, social: 2 } },
    { text: '文化祭で初めてリーダーを任された。大変だったけど、やり遂げた達成感。', fragment: 'リーダーの重み', traits: { social: 4, energy: 4 } },
  ],
  17: [
    { text: '受験が迫る中、最後の夏。友達との思い出を一つでも多く作ろうとした。', fragment: '最後の夏', traits: { social: 3, energy: 2 } },
    { text: '進路に悩む夜が増えた。でも、悩めること自体が自分の特権なのかもしれない。', fragment: '眠れない夜の思索', traits: { thinking: 3, energy: -2 } },
    {
      text: '大好きだった先生が転任。「自分を信じろ」という最後の言葉が胸に残った。',
      fragment: '「自分を信じろ」',
      traits: { risk: 3 },
    },
    {
      text: '告白した。結果はどうあれ、自分の気持ちに正直になれたことが誇らしかった。',
      fragment: '正直な気持ち',
      traits: { energy: 4, risk: 3, social: 2 },
      cond: (t) => t.social >= 50,
    },
  ],
  19: [
    {
      text: '新しい環境での1年目。右も左もわからない中、少しずつ自分の足で歩き始めた。',
      fragment: '自分の足で歩く',
      traits: { risk: 2, social: 2 },
    },
    {
      text: '一人暮らしを始めた。自炊の大変さと自由の味を同時に知った。',
      fragment: '自由の味',
      traits: { risk: 3, social: -2 },
    },
    {
      text: '新しい友人との出会い。地元の仲間とはまた違う、世界が広がる感覚。',
      fragment: '広がる世界',
      traits: { social: 5 },
      cond: (t) => t.social >= 50,
    },
    {
      text: '思っていたのと違う現実。でも「違う」ということは、想像を超えたということだ。',
      fragment: '想像を超えた現実',
      traits: { thinking: 2, risk: -2 },
    },
  ],
  21: [
    { text: '自分のやりたいことが少しずつ見えてきた。霧の中に光が差し込むように。', fragment: '霧の中の光', traits: { energy: 3, thinking: 2 } },
    { text: '大切な人との別れがあった。いなくなって初めて、その人の大きさを知った。', fragment: '別れの重さ', traits: { social: -2, thinking: -3 } },
    {
      text: '初めて本気で打ち込めるものに出会った。寝食を忘れるほど夢中になった。',
      fragment: '夢中になれるもの',
      traits: { energy: 5, risk: 3 },
      cond: (t) => t.risk >= 50,
    },
    { text: '人間関係で深く悩んだ。でも、悩んだぶんだけ人の気持ちがわかるようになった。', fragment: '他者への想像力', traits: { social: -1, thinking: -3 } },
  ],
  22: [
    { text: '社会の複雑さを知り始めた。答えのない問いと付き合う日々。', fragment: '答えのない問い', traits: { thinking: 2 } },
    {
      text: '信頼できる仲間に出会えた。この人たちとなら大丈夫だと思えた。',
      fragment: '信頼という財産',
      traits: { social: 5 },
      cond: (t) => t.social >= 55,
    },
    { text: '大きな失敗をした。でも、転んだ場所から見える景色もあると気づいた。', fragment: '転んだ先の景色', traits: { risk: -2, thinking: -2 } },
    { text: '旅に出た。知らない街、知らない人々。世界は思っていたより広かった。', fragment: '知らない街の朝', traits: { risk: 5, social: 2 } },
  ],
  23: [
    { text: '24歳を前に、ふと立ち止まって振り返る。いろんなことがあったな。全部、自分の人生だ。', fragment: '振り返る背中', traits: { energy: -2 } },
    {
      text: '夢に向かって一歩踏み出した。怖いけど、ワクワクしている自分がいる。',
      fragment: '一歩目の足跡',
      traits: { risk: 4, energy: 3 },
      cond: (t) => t.risk >= 50,
    },
    {
      text: '静かな日常の中に、小さな幸せを見つけられるようになった。それだけで十分。',
      fragment: '小さな幸せ',
      traits: { energy: -3, social: -1 },
      cond: (t) => t.energy < 50,
    },
    { text: '親に「ありがとう」と伝えた。照れくさかったけど、言えてよかった。', fragment: '伝えた「ありがとう」', traits: { social: 2, energy: 2 } },
  ],
}

// ---------- Choice Events ----------
const choices = {
  6: {
    prompt: '小学校入学！どんな毎日を過ごしたい？',
    event: '大きなランドセルを背負って校門をくぐった。ドキドキの小学校生活が始まる。',
    options: [
      {
        label: 'みんなと仲良くなりたい',
        desc: '友達をたくさん作って、一緒に笑い合う',
        result: '入学初日から積極的に話しかけた。すぐにクラスの人気者になり、毎日がキラキラしていた。',
        fragment: '友達の輪',
        traits: { social: 8, energy: 3 },
      },
      {
        label: 'いろんなことを知りたい',
        desc: '新しいことを学ぶのが楽しくて仕方がない',
        result: '授業が楽しくて仕方なかった。先生に「よく手を挙げるね」と褒められ、学ぶ喜びを知った。',
        fragment: '好奇心の芽',
        traits: { thinking: 8, social: -2 },
      },
      {
        label: 'とにかく遊びたい',
        desc: '校庭を駆け回って、毎日を思いっきり楽しむ',
        result: '休み時間が待ち遠しくて仕方なかった。泥だらけになって遊ぶ日々は、最高の思い出。',
        fragment: '泥だらけの笑顔',
        traits: { risk: 8, energy: 5 },
      },
    ],
  },
  12: {
    prompt: '中学校進学。どう過ごしたい？',
    event: '制服に袖を通した日。少しだけ大人になった気分。新しいステージが始まる。',
    options: [
      {
        label: '運動部に入る',
        desc: '仲間と汗を流して、全力でぶつかる',
        result: '厳しい練習の毎日。でも仲間との絆は何にも代えがたかった。試合に負けて泣いた日もある。',
        fragment: '仲間との汗と涙',
        traits: { social: 5, energy: 6, risk: 2 },
      },
      {
        label: '文化部に入る',
        desc: '好きなことをじっくり深掘りする',
        result: '自分の「好き」を見つけられた。コンクールに向けて打ち込む日々は充実していた。',
        fragment: '好きを深める時間',
        traits: { thinking: -3, energy: 3, social: -1 },
      },
      {
        label: '自分のペースで過ごす',
        desc: '部活にも塾にも縛られない、自由な放課後',
        result: '放課後は自分の時間。本を読んだり、街を歩いたり。自分だけのリズムを見つけた。',
        fragment: '自分だけの放課後',
        traits: { social: -4, risk: 3, thinking: -2 },
      },
    ],
  },
  15: {
    prompt: 'どんな高校生活を送りたい？',
    event: '受験を乗り越えて、新しい制服に袖を通す。15歳の春、新たな扉が開く。',
    options: [
      {
        label: '高い目標に挑戦する',
        desc: '難しい環境で自分を磨いていく',
        result: 'レベルの高い環境に刺激を受けた。ついていくのは大変だけど、確実に成長している実感がある。',
        fragment: '高い壁の向こう側',
        traits: { thinking: 6, energy: 4, risk: -2 },
      },
      {
        label: '自分らしくいられる場所へ',
        desc: '個性を大切にする、のびのびとした毎日',
        result: '自由な雰囲気の中で、自分らしさを見つけた。色んな価値観を持つ友人との出会いが財産になった。',
        fragment: '自分らしさの発見',
        traits: { social: 5, energy: -2, thinking: -3 },
      },
      {
        label: '手を動かして学びたい',
        desc: '実際にものを作ったり、体を使って覚える',
        result: '座学より実技が楽しい。ものづくりの面白さに目覚め、自分の手で何かを生み出す喜びを知った。',
        fragment: '手で作る喜び',
        traits: { risk: 5, thinking: -4, energy: 3 },
      },
    ],
  },
  18: {
    prompt: '高校卒業。次の一歩は？',
    event: '卒業式の日。仲間との写真を何枚も撮った。ここからは、自分で道を選んでいく。',
    options: [
      {
        label: '学びを深めに行く',
        desc: 'もっと知りたいことがある。探求の旅へ',
        result: '新しい学びの世界が広がった。知れば知るほど、知らないことの広さに気づく。それが楽しい。',
        fragment: '知の海へ',
        traits: { thinking: 6, risk: 2 },
      },
      {
        label: '社会に飛び込む',
        desc: '自分の力で生きていく。現場で学ぶ',
        result: '社会人1年目。覚えることだらけで毎日がヘトヘト。でも初給料で親にプレゼントを買えた。',
        fragment: '社会への扉',
        traits: { social: 4, risk: -2, energy: 3 },
      },
      {
        label: '自分だけの道を探す',
        desc: 'まだ決められない。だからこそ、色々経験したい',
        result: 'いろいろなことに手を出した。回り道かもしれないけど、全部が自分の糧になっていく気がした。',
        fragment: '回り道の景色',
        traits: { risk: 8, social: 2, thinking: -3 },
      },
    ],
  },
  20: {
    prompt: '成人。これからの日々をどう過ごす？',
    event: '20歳になった。成人として社会に認められる年齢。人生の体感時間の半分が過ぎた、と言われている。',
    options: [
      {
        label: '地に足をつけて歩く',
        desc: '着実に、一歩ずつ。自分のペースで進む',
        result: '派手さはないけど、穏やかな日常の中に確かな手応えを感じた。焦らなくていい。',
        fragment: '地に足のついた一歩',
        traits: { energy: -4, risk: -3, thinking: 2 },
      },
      {
        label: '心の声に従う',
        desc: 'やりたいことに正直に、挑戦し続ける',
        result: '周囲に心配されても、自分の声を信じた。うまくいかない日もある。でも、後悔はない。',
        fragment: '自分の声',
        traits: { risk: 8, energy: 5, social: -2 },
      },
      {
        label: '人とのつながりを大切に',
        desc: '出会いの中で、自分を見つけていく',
        result: 'いろいろな人に会いに行った。一人ひとりとの出会いが、自分の輪郭をはっきりさせてくれた。',
        fragment: '出会いの輪郭',
        traits: { social: 8, energy: 2 },
      },
    ],
  },
}

// ---------- Ending Generator ----------
export function generateEnding(traits, fragments) {
  // 最も中央(50)から離れた軸を見つける
  const deviations = TRAIT_META.map(({ key, left, right }) => {
    const val = traits[key]
    const dev = Math.abs(val - 50)
    const direction = val >= 50 ? right : left
    return { key, direction, dev, val }
  }).sort((a, b) => b.dev - a.dev)

  const primary = deviations[0]
  const secondary = deviations[1]

  // 性格タイプ名 — すべてポジティブ
  const typeNames = {
    '内向的': '心の宇宙の旅人',
    '外向的': '太陽のような存在',
    '慎重': '確かな足取りの人',
    '冒険的': '未知を愛する開拓者',
    '感性': '世界を色で感じる人',
    '理性': '真理への探求者',
    '穏やか': '凪の海のような人',
    '情熱的': '燃え続ける魂の持ち主',
  }

  // 性格タイプの説明 — すべて肯定的
  const typeDescs = {
    '内向的': '心の内側に、誰よりも広い宇宙を持っている。静かな時間が、あなたを豊かにする。',
    '外向的': '人との関わりの中で輝く。あなたがいるだけで、その場が明るくなる。',
    '慎重': '一歩ずつ確かめながら進む姿は、実はとても強い。焦らない勇気を持っている。',
    '冒険的': '未知の世界を恐れず、飛び込んでいける。その勇気が、道なき道を拓いていく。',
    '感性': '目に見えないものを感じ取れる。その繊細さは、世界を美しく見る力。',
    '理性': '物事の本質を見つめる目を持っている。その冷静さが、周りの人の支えにもなる。',
    '穏やか': '嵐の中でも揺るがない。その穏やかさは、周りの人の安心になっている。',
    '情熱的': '心の炎が、自分だけでなく周りも照らしている。その熱は、きっと誰かに届いている。',
  }

  const title = typeNames[primary.direction] || 'あなただけの存在'
  const description = typeDescs[primary.direction] || ''

  // すべてのバランスが取れている場合
  const isBalanced = deviations[0].dev < 10

  let overall
  if (isBalanced) {
    overall = 'どの方向にも偏らず、あらゆる経験を自分のものにしてきた。そのバランス感覚は、あなただけの強さ。'
  } else {
    overall = `${fragments.length}個のかけらが集まって、あなただけの人生になった。良いも悪いもない。全部が、あなた。`
  }

  return {
    title: isBalanced ? '調和を奏でる人' : title,
    description: isBalanced
      ? 'いろんな経験を受け入れ、自分の中でバランスを取れる人。その柔軟さこそが、あなたの魅力。'
      : description,
    overall,
    primaryTrait: primary.direction,
    secondaryTrait: secondary.direction,
  }
}

// ---------- Public API ----------
export function getTemplateEvent(age, traits, settings, history) {
  if (CHOICE_AGES.includes(age)) {
    const c = choices[age]
    return {
      type: 'choice',
      event: c.event,
      prompt: c.prompt,
      choices: c.options.map((o) => ({
        label: o.label,
        description: o.desc,
        resultEvent: o.result,
        fragment: o.fragment,
        traits: o.traits,
      })),
    }
  }

  const pool = events[age]
  if (!pool) {
    return {
      type: 'event',
      event: `${age}歳。日々は静かに、でも確実に流れていった。`,
      fragment: `${age}歳の日々`,
      traits: {},
    }
  }

  const chosen = weighted(pool, traits)
  return {
    type: 'event',
    event: chosen.text,
    fragment: chosen.fragment,
    traits: chosen.traits,
  }
}
