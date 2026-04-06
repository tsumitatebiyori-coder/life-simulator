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

// ---------- Mini Choices (非キー年齢用の2択) ----------
const miniChoices = {
  0: {
    event: 'この世に生まれ落ちた。小さな産声が分娩室に響き渡る。',
    prompt: 'あなたの最初の反応は？',
    options: [
      { label: '大声で泣く', desc: '力強い産声を上げた', result: '元気いっぱいの産声が響き渡り、分娩室が笑顔に包まれた。', fragment: 'はじまりの産声', traits: { energy: 3, social: 2 } },
      { label: '静かに目を開ける', desc: 'じっと世界を見つめた', result: '不思議そうに世界を見つめる瞳。静かだけど、確かにそこにいた。', fragment: '静かなまなざし', traits: { thinking: 3, social: -2 } },
    ],
    freeResult: { result: '新しい物語が、今始まった。', fragment: 'はじまりの日', traits: { risk: 2 } },
  },
  1: {
    event: 'よちよち歩きの毎日。世界は発見の連続。',
    prompt: '何に手を伸ばした？',
    options: [
      { label: '家族に向かって歩く', desc: '「ママ」「パパ」に向かってよちよち', result: 'はじめて「ママ」と言えた日。家族みんなが拍手してくれて、世界が温かかった。', fragment: 'はじめてのことば', traits: { social: 3, energy: 2 } },
      { label: '気になるものを触る', desc: '何でも手に取って確かめる', result: '何度転んでも立ち上がって、気になるものに手を伸ばし続けた。', fragment: '何度でも立ち上がる足', traits: { risk: 3, thinking: -2 } },
    ],
    freeResult: { result: '小さな手で世界に触れた。すべてが新しく、すべてが不思議だった。', fragment: '小さな手の冒険', traits: { risk: 2 } },
  },
  2: {
    event: '公園デビューの日。はじめて家族以外の子どもと出会う。',
    prompt: 'どうする？',
    options: [
      { label: '一緒に遊ぼうと近づく', desc: '砂場で隣の子に話しかける', result: '砂場で隣の子と一緒にお山を作った。崩れたけど、二人で笑った。', fragment: '砂場の友達', traits: { social: 4, energy: 2 } },
      { label: '遠くから様子を見る', desc: 'ベンチの横でじっと観察', result: '他の子たちの遊びをじっと見ていた。観察するのが好きだった。', fragment: '観察する瞳', traits: { thinking: 3, social: -2 } },
    ],
    freeResult: { result: '公園で自分なりの過ごし方を見つけた。', fragment: '公園の午後', traits: { energy: 2 } },
  },
  3: {
    event: '幼稚園に入園。知らない子ばかりの新しい世界。',
    prompt: '最初の日、どうした？',
    options: [
      { label: '泣いたけど頑張った', desc: 'ママと離れるのが寂しくて', result: '泣きながらも教室に入った。帰り道に「明日も行く」と言った自分がいた。', fragment: '涙のあとの勇気', traits: { energy: 3, risk: 2 } },
      { label: 'ワクワクして飛び込んだ', desc: '新しい場所が楽しみ', result: '初日から教室を探検。おもちゃ箱を全部開けて先生を困らせた。', fragment: '探検家のまなざし', traits: { risk: 4, social: 2 } },
    ],
    freeResult: { result: '新しい場所で、自分なりに一歩を踏み出した。', fragment: '最初の一歩', traits: { social: 2 } },
  },
  4: {
    event: '幼稚園にも慣れてきた。毎日が小さな冒険。',
    prompt: '夢中になったのは？',
    options: [
      { label: 'お絵かきや工作', desc: '作ることが大好き', result: '画用紙いっぱいに絵を描いた。先生に「上手だね」と言われて、もっと描きたくなった。', fragment: '画用紙の世界', traits: { thinking: -4, energy: 3 } },
      { label: '友達との遊び', desc: 'みんなと鬼ごっこやままごと', result: '毎日友達と遊ぶのが楽しくて、お迎えの時間がいつも名残惜しかった。', fragment: 'お揃いの約束', traits: { social: 5, energy: 2 } },
    ],
    freeResult: { result: '幼稚園で自分の「好き」を見つけた。', fragment: '好きの芽生え', traits: { risk: 2 } },
  },
  5: {
    event: '七五三の年。もうすぐ小学生。少しだけ「お兄ちゃん/お姉ちゃん」の自覚が芽生える。',
    prompt: 'どんな出来事があった？',
    options: [
      { label: 'はじめてのおつかい', desc: 'ドキドキしながら一人で買い物', result: 'ドキドキしながらお豆腐を買って帰れた。「ありがとう」と言われて誇らしかった。', fragment: 'はじめてのおつかい', traits: { risk: 3, social: 2 } },
      { label: '虫取りに夢中', desc: '夏の間ずっと虫かごを持っていた', result: 'カブトムシを捕まえて、ヒーローになった気分。夏が終わるのが寂しかった。', fragment: 'カブトムシの夏', traits: { risk: 4, thinking: -2 } },
    ],
    freeResult: { result: '小さな挑戦が、確かな自信になった。', fragment: '小さな挑戦', traits: { energy: 2 } },
  },
  7: {
    event: '小学校にも慣れてきた2年目。世界がどんどん広がる。',
    prompt: '一番の思い出は？',
    options: [
      { label: 'かけっこで全力を出した', desc: '運動会でみんなの前を走った', result: 'かけっこで全力を出し切った。順位より、走り切った爽快感が嬉しかった。', fragment: '風を切る足', traits: { energy: 4, risk: 2 } },
      { label: '図書室で本に出会った', desc: '冒険物語に夢中になった', result: '初めて図書室で本を借りた。冒険物語に夢中になり、読書好きになった。', fragment: '冒険物語の世界', traits: { thinking: -3, risk: 3 } },
    ],
    freeResult: { result: '小学校で忘れられない思い出ができた。', fragment: '忘れられない日', traits: { social: 2 } },
  },
  8: {
    event: '学校生活も3年目。自分の「得意」と「苦手」が見えてきた。',
    prompt: 'どう過ごした？',
    options: [
      { label: '友達と秘密基地を作った', desc: '放課後の大プロジェクト', result: 'クラスで一番の仲良しと秘密基地を作った。毎日放課後が冒険だった。', fragment: '秘密基地の設計図', traits: { social: 5, risk: 2 } },
      { label: '習い事を始めた', desc: 'コツコツ続ける日々', result: '習い事を始めた。最初はつらかったけど、続けるうちに少しずつ上達した。', fragment: '続けることの意味', traits: { thinking: 2, energy: 2 } },
    ],
    freeResult: { result: '自分なりのペースで、日々を過ごした。', fragment: '自分のペース', traits: { risk: 2 } },
  },
  9: {
    event: '夏休み。長い長い休みの中で、特別な体験をする。',
    prompt: '何をした？',
    options: [
      { label: '自由研究に没頭した', desc: '一つのテーマを深く掘り下げた', result: '自由研究で入賞した。初めて「没頭する楽しさ」を知った。', fragment: '没頭した夏', traits: { thinking: 4, energy: 3 } },
      { label: '家族旅行で海に行った', desc: '波と砂浜と夏の思い出', result: '家族旅行で海に行った。波と砂浜と笑い声。忘れられない夏の記憶。', fragment: '波と笑い声', traits: { energy: -2, social: 2 } },
    ],
    freeResult: { result: '夏休みの思い出が、心に刻まれた。', fragment: '夏の記憶', traits: { risk: 2 } },
  },
  10: {
    event: '10歳。将来の夢を初めて真剣に考え始める年頃。',
    prompt: '何を思った？',
    options: [
      { label: '将来の夢を作文に書いた', desc: '漠然とした憧れを言葉にした', result: '将来の夢を作文に書いた。漠然としていたけれど、心の奥で何かが芽生えた。', fragment: '漠然とした夢', traits: { risk: 2, thinking: 2 } },
      { label: '夜空を一人で眺めた', desc: '静かな時間が心地よかった', result: '一人で夜空を眺める時間が好きになった。誰にも邪魔されない、静かな幸せ。', fragment: '星空のひとり時間', traits: { social: -4, thinking: -2 } },
    ],
    freeResult: { result: '10歳の自分が、未来の自分に何かを約束した。', fragment: '10歳の約束', traits: { energy: 2 } },
  },
  11: {
    event: '卒業が近づく6年生。クラスの雰囲気が少し大人びてきた。',
    prompt: '印象に残ったのは？',
    options: [
      { label: '学芸会で大きな拍手をもらった', desc: '舞台の上で見た景色は特別だった', result: '学芸会の劇で大きな拍手をもらった。舞台の上で見た景色は特別だった。', fragment: '拍手の記憶', traits: { social: 3, energy: 4 } },
      { label: '初恋かもしれない', desc: '隣の席のあの子が気になる', result: '隣の席のあの子が気になって、授業に集中できない。これが恋というものか。', fragment: '隣の席の横顔', traits: { thinking: -3, energy: 3 } },
    ],
    freeResult: { result: '小学校最後の年。たくさんの思い出ができた。', fragment: '卒業前の空気', traits: { social: 2 } },
  },
  13: {
    event: '思春期の入り口。自分が何者なのか、ぼんやりと考え始める。',
    prompt: 'どう過ごした？',
    options: [
      { label: '友達と夜遅くまで電話した', desc: 'くだらない話が一番楽しい年頃', result: '友達と夜遅くまで電話で話した。くだらない話が一番楽しかった。', fragment: '夜更かしの電話', traits: { social: 4, energy: 2 } },
      { label: '一人で考える時間が増えた', desc: '自分の中の問いと向き合う', result: '「自分って何だろう」と考え始めた。答えは出ないけど、考えること自体が大切だった。', fragment: '「自分」という問い', traits: { social: -3, thinking: -2 } },
    ],
    freeResult: { result: '中学生の日々は、大人でも子どもでもない不思議な時間。', fragment: '不思議な季節', traits: { risk: 2 } },
  },
  14: {
    event: '文化祭の季節。クラスで何かを作り上げる経験。',
    prompt: '一番の出来事は？',
    options: [
      { label: '文化祭の準備が最高だった', desc: 'クラスが一つになる感覚', result: '文化祭の準備が楽しすぎた。クラスが一つになる感覚を初めて味わった。', fragment: '一つになる瞬間', traits: { social: 4, energy: 4 } },
      { label: '趣味にハマった', desc: '自分だけの世界を見つけた', result: '偶然見つけた趣味にハマった。自分だけの世界ができた気がして心が満たされた。', fragment: '自分だけの世界', traits: { thinking: -2, risk: 3, social: -2 } },
    ],
    freeResult: { result: '中学2年生。自分なりのスタイルが少しずつ見えてきた。', fragment: '自分のスタイル', traits: { energy: 2 } },
  },
  16: {
    event: '高校生活にも慣れてきた。自分の居場所を見つけた安心感。',
    prompt: 'どう過ごした？',
    options: [
      { label: 'アルバイトを始めた', desc: '自分で稼ぐ経験', result: 'アルバイトを始めた。自分で稼いだお金で買ったものは特別だった。', fragment: '初めての給料', traits: { risk: 3, social: 2 } },
      { label: '勉強に本気を出した', desc: '自分と向き合った', result: '模試の結果を見て、自分と向き合った。数字よりも、頑張った自分を認めた。', fragment: '数字じゃない価値', traits: { thinking: 3, energy: 3 } },
    ],
    freeResult: { result: '高校2年生。少しずつ、大人の世界が見えてきた。', fragment: '大人への一歩', traits: { risk: 2 } },
  },
  17: {
    event: '受験が迫る中、最後の夏。人生で一番長くて短い季節。',
    prompt: '最後の夏、何をした？',
    options: [
      { label: '友達との思い出を作った', desc: '最後だから、一つでも多く', result: '友達と最後の夏を過ごした。たくさん笑って、少し泣いた。', fragment: '最後の夏', traits: { social: 3, energy: 2 } },
      { label: '将来のことを考えた', desc: '眠れない夜が増えた', result: '進路に悩む夜が増えた。でも悩めること自体が自分の特権なのかもしれない。', fragment: '眠れない夜の思索', traits: { thinking: 3, energy: -2 } },
    ],
    freeResult: { result: '17歳の夏。人生で忘れられない季節になった。', fragment: '17歳の夏', traits: { risk: 2 } },
  },
  19: {
    event: '新しい環境での1年目。右も左もわからない中、少しずつ自分の足で歩き始めた。',
    prompt: 'どう過ごした？',
    options: [
      { label: '新しい出会いを楽しんだ', desc: '世界が広がる感覚', result: '新しい友人との出会い。地元の仲間とはまた違う、世界が広がる感覚。', fragment: '広がる世界', traits: { social: 5, risk: 2 } },
      { label: '自分の時間を大切にした', desc: '一人暮らしの自由を味わう', result: '一人暮らしを始めた。自炊の大変さと自由の味を同時に知った。', fragment: '自由の味', traits: { risk: 3, social: -2 } },
    ],
    freeResult: { result: '新しい環境で、自分なりの居場所を作り始めた。', fragment: '新しい居場所', traits: { energy: 2 } },
  },
  21: {
    event: '自分のやりたいことが少しずつ見えてきた。霧の中に光が差し込むように。',
    prompt: '何があった？',
    options: [
      { label: '夢中になれるものに出会った', desc: '寝食を忘れるほど', result: '初めて本気で打ち込めるものに出会った。寝食を忘れるほど夢中になった。', fragment: '夢中になれるもの', traits: { energy: 5, risk: 3 } },
      { label: '大切な人との別れ', desc: 'いなくなって初めて気づく', result: '大切な人との別れがあった。いなくなって初めて、その人の大きさを知った。', fragment: '別れの重さ', traits: { social: -2, thinking: -3 } },
    ],
    freeResult: { result: '21歳。人生の輪郭が、少しずつはっきりしてきた。', fragment: '霧の中の光', traits: { energy: 2 } },
  },
  22: {
    event: '社会の複雑さを知り始めた。答えのない問いと付き合う日々。',
    prompt: '印象に残ったのは？',
    options: [
      { label: '旅に出た', desc: '知らない街で新しい自分に出会う', result: '旅に出た。知らない街、知らない人々。世界は思っていたより広かった。', fragment: '知らない街の朝', traits: { risk: 5, social: 2 } },
      { label: '大きな失敗をした', desc: 'でも、そこから学んだ', result: '大きな失敗をした。でも、転んだ場所から見える景色もあると気づいた。', fragment: '転んだ先の景色', traits: { risk: -2, thinking: -2 } },
    ],
    freeResult: { result: '22歳の経験が、自分をまた一つ大人にした。', fragment: '答えのない問い', traits: { thinking: 2 } },
  },
  23: {
    event: '24歳を前に、ふと立ち止まって振り返る。いろんなことがあったな。',
    prompt: '最後の1年、何を大切にした？',
    options: [
      { label: '夢に向かって一歩踏み出す', desc: '怖いけどワクワクしている', result: '夢に向かって一歩踏み出した。怖いけど、ワクワクしている自分がいる。', fragment: '一歩目の足跡', traits: { risk: 4, energy: 3 } },
      { label: '大切な人に感謝を伝えた', desc: '照れくさいけど、今しかない', result: '親に「ありがとう」と伝えた。照れくさかったけど、言えてよかった。', fragment: '伝えた「ありがとう」', traits: { social: 2, energy: 2 } },
    ],
    freeResult: { result: '24歳を目前に、自分の人生を肯定できた。', fragment: '全部が自分', traits: { energy: 2 } },
  },
  24: {
    event: '24歳。人生の体感時間の折り返し地点。これまでの全部が、あなたを作った。',
    prompt: '今の気持ちは？',
    options: [
      { label: 'まだまだこれから', desc: '本当の人生はここから始まる', result: 'まだ何も終わっていない。むしろ、ここからが本番だ。', fragment: 'これからの予感', traits: { risk: 3, energy: 3 } },
      { label: '全部、自分の人生だった', desc: '良いも悪いもない', result: '振り返ると、全部が繋がっている。良いも悪いもない。全部が、自分の人生だ。', fragment: '人生の肯定', traits: { thinking: -2, social: 2 } },
    ],
    freeResult: { result: '24年分の日々が、あなただけの物語になった。', fragment: 'あなたの物語', traits: {} },
  },
}

// ---------- Major Choice Events (キー年齢の3択) ----------
const majorChoices = {
  6: {
    prompt: '小学校入学！どんな毎日を過ごしたい？',
    event: '大きなランドセルを背負って校門をくぐった。ドキドキの小学校生活が始まる。',
    options: [
      { label: 'みんなと仲良くなりたい', desc: '友達をたくさん作って、一緒に笑い合う', result: '入学初日から積極的に話しかけた。すぐにクラスの人気者になり、毎日がキラキラしていた。', fragment: '友達の輪', traits: { social: 8, energy: 3 } },
      { label: 'いろんなことを知りたい', desc: '新しいことを学ぶのが楽しくて仕方がない', result: '授業が楽しくて仕方なかった。先生に「よく手を挙げるね」と褒められ、学ぶ喜びを知った。', fragment: '好奇心の芽', traits: { thinking: 8, social: -2 } },
      { label: 'とにかく遊びたい', desc: '校庭を駆け回って、毎日を思いっきり楽しむ', result: '休み時間が待ち遠しくて仕方なかった。泥だらけになって遊ぶ日々は、最高の思い出。', fragment: '泥だらけの笑顔', traits: { risk: 8, energy: 5 } },
    ],
    freeResult: { result: '小学校生活が始まった。自分だけの冒険が、ここから始まる。', fragment: 'ランドセルの日', traits: { risk: 3 } },
  },
  12: {
    prompt: '中学校進学。どう過ごしたい？',
    event: '制服に袖を通した日。少しだけ大人になった気分。新しいステージが始まる。',
    options: [
      { label: '運動部に入る', desc: '仲間と汗を流して、全力でぶつかる', result: '厳しい練習の毎日。でも仲間との絆は何にも代えがたかった。試合に負けて泣いた日もある。', fragment: '仲間との汗と涙', traits: { social: 5, energy: 6, risk: 2 } },
      { label: '文化部に入る', desc: '好きなことをじっくり深掘りする', result: '自分の「好き」を見つけられた。コンクールに向けて打ち込む日々は充実していた。', fragment: '好きを深める時間', traits: { thinking: -3, energy: 3, social: -1 } },
      { label: '自分のペースで過ごす', desc: '部活にも塾にも縛られない、自由な放課後', result: '放課後は自分の時間。本を読んだり、街を歩いたり。自分だけのリズムを見つけた。', fragment: '自分だけの放課後', traits: { social: -4, risk: 3, thinking: -2 } },
    ],
    freeResult: { result: '中学校で、自分のスタイルを模索し始めた。', fragment: '制服の自分', traits: { risk: 3 } },
  },
  15: {
    prompt: 'どんな高校生活を送りたい？',
    event: '受験を乗り越えて、新しい制服に袖を通す。15歳の春、新たな扉が開く。',
    options: [
      { label: '高い目標に挑戦する', desc: '難しい環境で自分を磨いていく', result: 'レベルの高い環境に刺激を受けた。ついていくのは大変だけど、確実に成長している実感がある。', fragment: '高い壁の向こう側', traits: { thinking: 6, energy: 4, risk: -2 } },
      { label: '自分らしくいられる場所へ', desc: '個性を大切にする、のびのびとした毎日', result: '自由な雰囲気の中で、自分らしさを見つけた。色んな価値観を持つ友人との出会いが財産になった。', fragment: '自分らしさの発見', traits: { social: 5, energy: -2, thinking: -3 } },
      { label: '手を動かして学びたい', desc: '実際にものを作ったり、体を使って覚える', result: '座学より実技が楽しい。ものづくりの面白さに目覚め、自分の手で何かを生み出す喜びを知った。', fragment: '手で作る喜び', traits: { risk: 5, thinking: -4, energy: 3 } },
    ],
    freeResult: { result: '高校生活が始まった。自分の道は、自分で選ぶ。', fragment: '15歳の春', traits: { risk: 3 } },
  },
  18: {
    prompt: '高校卒業。次の一歩は？',
    event: '卒業式の日。仲間との写真を何枚も撮った。ここからは、自分で道を選んでいく。',
    options: [
      { label: '学びを深めに行く', desc: 'もっと知りたいことがある。探求の旅へ', result: '新しい学びの世界が広がった。知れば知るほど、知らないことの広さに気づく。それが楽しい。', fragment: '知の海へ', traits: { thinking: 6, risk: 2 } },
      { label: '社会に飛び込む', desc: '自分の力で生きていく。現場で学ぶ', result: '社会人1年目。覚えることだらけで毎日がヘトヘト。でも初給料で親にプレゼントを買えた。', fragment: '社会への扉', traits: { social: 4, risk: -2, energy: 3 } },
      { label: '自分だけの道を探す', desc: 'まだ決められない。だからこそ、色々経験したい', result: 'いろいろなことに手を出した。回り道かもしれないけど、全部が自分の糧になっていく気がした。', fragment: '回り道の景色', traits: { risk: 8, social: 2, thinking: -3 } },
    ],
    freeResult: { result: '卒業の日。新しい道を自分の足で歩き始めた。', fragment: '旅立ちの日', traits: { risk: 3 } },
  },
  20: {
    prompt: '成人。これからの日々をどう過ごす？',
    event: '20歳になった。成人として社会に認められる年齢。人生の体感時間の半分が過ぎた、と言われている。',
    options: [
      { label: '地に足をつけて歩く', desc: '着実に、一歩ずつ。自分のペースで進む', result: '派手さはないけど、穏やかな日常の中に確かな手応えを感じた。焦らなくていい。', fragment: '地に足のついた一歩', traits: { energy: -4, risk: -3, thinking: 2 } },
      { label: '心の声に従う', desc: 'やりたいことに正直に、挑戦し続ける', result: '周囲に心配されても、自分の声を信じた。うまくいかない日もある。でも、後悔はない。', fragment: '自分の声', traits: { risk: 8, energy: 5, social: -2 } },
      { label: '人とのつながりを大切に', desc: '出会いの中で、自分を見つけていく', result: 'いろいろな人に会いに行った。一人ひとりとの出会いが、自分の輪郭をはっきりさせてくれた。', fragment: '出会いの輪郭', traits: { social: 8, energy: 2 } },
    ],
    freeResult: { result: '20歳の自分が選んだ道を、信じて歩き始めた。', fragment: '成人の決意', traits: { risk: 3 } },
  },
}

// ---------- Free Input Fallback (AI失敗時にユーザー入力を織り込む) ----------
const freeResultTemplates = [
  (text, age) => ({ result: `「${text}」── ${age}歳のあなたにとって、それは特別な体験になった。`, fragment: text }),
  (text, age) => ({ result: `${text}。その瞬間、${age}歳の世界が少しだけ広がった気がした。`, fragment: text }),
  (text, age) => ({ result: `${text}── 振り返れば、それが${age}歳の一番の思い出になるのかもしれない。`, fragment: text }),
  (text, age) => ({ result: `${text}。誰に言われたわけでもない。自分で決めたことだから、胸を張れた。`, fragment: text }),
  (text, age) => ({ result: `${text}── その選択が、あなたの物語に新しい色を加えた。`, fragment: text }),
  (text, age) => ({ result: `${age}歳の日、${text}。何気ない一日のはずだったのに、ずっと心に残った。`, fragment: text }),
  (text, age) => ({ result: `${text}。小さな決断だったけれど、確かに人生が動いた瞬間だった。`, fragment: text }),
  (text, age) => ({ result: `「${text}」── そう決めた日の空の色を、なぜかずっと覚えている。`, fragment: text }),
]

export function generateFreeResultText(text, age) {
  const template = freeResultTemplates[Math.floor(Math.random() * freeResultTemplates.length)]
  return template(text, age)
}

// ---------- Ending Generator ----------
export function generateEnding(traits, fragments) {
  const deviations = TRAIT_META.map(({ key, left, right }) => {
    const val = traits[key]
    const dev = Math.abs(val - 50)
    const direction = val >= 50 ? right : left
    return { key, direction, dev, val }
  }).sort((a, b) => b.dev - a.dev)

  const primary = deviations[0]
  const secondary = deviations[1]

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
export function getTemplateEvent(age, traits) {
  const isMajor = CHOICE_AGES.includes(age)
  const source = isMajor ? majorChoices[age] : miniChoices[age]

  if (!source) {
    return {
      type: isMajor ? 'major-choice' : 'mini-choice',
      event: `${age}歳。日々は静かに、でも確実に流れていった。`,
      prompt: '何をした？',
      choices: [
        { label: '新しいことに挑戦した', description: '未知の世界へ', resultEvent: '新しい挑戦が、自分を少し変えた。', fragment: `${age}歳の挑戦`, traits: { risk: 2 } },
        { label: '日常を大切にした', description: 'いつもの毎日を丁寧に', resultEvent: '穏やかな日々の中に、小さな幸せを見つけた。', fragment: `${age}歳の日々`, traits: { energy: -2 } },
      ],
      freeResult: { resultEvent: `${age}歳の日々が、静かに過ぎていった。`, fragment: `${age}歳の記憶`, traits: {} },
    }
  }

  return {
    type: isMajor ? 'major-choice' : 'mini-choice',
    event: source.event,
    prompt: source.prompt,
    choices: source.options.map((o) => ({
      label: o.label,
      description: o.desc,
      resultEvent: o.result,
      fragment: o.fragment,
      traits: o.traits,
    })),
    freeResult: {
      resultEvent: source.freeResult.result,
      fragment: source.freeResult.fragment,
      traits: source.freeResult.traits,
    },
  }
}
