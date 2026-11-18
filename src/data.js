// All learner-facing content for one 10-minute sequence.
// Each task's answer is judged by the agreement checker in nlp.js, which diagnoses M1 / M2.

export const AVATARS = ['🦁', '🐯', '🐼', '🦜', '🐢', '🐘', '🌻', '⭐']

export const LEARN = [
  { pic: '👦 👧', say: 'लड़का अच्छा है। लड़की अच्छी है।', text: ['लड़का अच्छ', 'ा', ' है। लड़की अच्छ', 'ी', ' है।'], tip: 'लड़का → -आ (ा),  लड़की → -ई (ी)' },
  { pic: '🐎 🚌', say: 'घोड़ा आया। बस आई।', text: ['घोड़ा आ', 'या', '। बस आ', 'ई', '।'], tip: 'चीज़ों का भी लिंग होता है! बस स्त्रीलिंग है।' },
  { pic: '💧 📕', say: 'पानी ठंडा है। मेरी किताब अच्छी है।', text: ['पानी ठंड', 'ा', ' है। मेरी किताब अच्छ', 'ी', ' है।'], tip: 'पानी के अंत में -ई है, फिर भी पुल्लिंग!' },
]

// Kept short and jargon-free for a first-generation 11-year-old; grammar terms only in small print.
export const RULE = 'जिसकी बात हो रही है, उसी से शब्द का अंत बदलता है।'
export const RULE_SMALL = '(संज्ञा का लिंग → विशेषण और क्रिया का अंत)'
export const RULE_EN = 'The noun decides the ending: masculine → -आ / -या / -ता, feminine → -ई / -ती.'

export const TASKS = {
  t1: { kind: 'mcq', pic: '💧', title: 'सही शब्द चुनो', en: 'Choose the right word', sentence: 'पानी ___ है।', options: ['ठंडा', 'ठंडी'], answer: 'ठंडा', targets: 'M1' },
  t2: { kind: 'mcq', pic: '📕', title: 'सही शब्द चुनो', en: 'Choose the right word', sentence: 'मेरी किताब बहुत ___ है।', options: ['अच्छा', 'अच्छी'], answer: 'अच्छी', targets: 'M2' },
  t3: {
    kind: 'sort', title: 'शब्दों को सही डिब्बे में रखो', en: 'Sort the nouns: masculine or feminine?',
    words: [['पानी', '💧'], ['किताब', '📕'], ['घोड़ा', '🐎'], ['बस', '🚌'], ['दही', '🥣'], ['नदी', '🏞️']],
  },
  t4: { kind: 'fix', pic: '🚌', title: 'वाक्य ठीक करो', en: 'Fix the sentence (type it correctly)', wrongSentence: 'बस आया।', model: 'बस आई।', mustHave: 'बस' },
  // Outcome 3 (explain why): each wrong option is a misconception the learner may actually hold.
  why: {
    kind: 'why', pic: '🤔', title: 'क्यों?', en: 'Why? Explain the change',
    question: '"बस आया" को हमने "बस आई" क्यों किया?',
    options: [
      { text: 'क्योंकि "बस" स्त्रीलिंग है — हम कहते हैं "मेरी बस"', correct: true },
      { text: 'क्योंकि वाक्य लिखने वाली लड़की है', type: 'agreement', hint: 'क्या शब्द का अंत लिखने वाले से बदलता है, या जिसकी बात हो रही है उससे? यहाँ बात किसकी हो रही है?', explain: 'शब्द का अंत लिखने वाले से नहीं, जिसकी बात हो रही है उससे बदलता है — यहाँ "बस" की बात है, और बस स्त्रीलिंग है।' },
      { text: 'क्योंकि "आई" लिखना ज़्यादा सुंदर लगता है', type: 'guess', hint: 'यह नियम से होता है, सुंदरता से नहीं। "मेरा बस" या "मेरी बस" — कौन सही लगता है?', explain: '"मेरी बस" — बस स्त्रीलिंग है, इसलिए "आई"। यह नियम है, पसंद नहीं।' },
    ],
  },
  t5: { kind: 'tiles', pic: '👧⚽', title: 'वाक्य बनाओ', en: 'Build the sentence from the tiles', tiles: ['रहा', 'लड़की', 'है', 'खेल', 'रही'], model: 'लड़की खेल रही है', accept: ['लड़की खेल रही है'] },
  t6: { kind: 'speak', pic: '🏫🚶', title: 'बोलकर बताओ', en: 'Say it aloud: how do you go to school every day?' },

  // "One more of the same type" variants (learner-chosen practice; max 3 per session to fit in 10 minutes)
  t1b: { kind: 'mcq', pic: '🐘', title: 'सही शब्द चुनो', en: 'Choose the right word', sentence: 'हाथी बहुत ___ है।', options: ['मोटा', 'मोटी'], answer: 'मोटा', targets: 'M1' },
  t2b: { kind: 'mcq', pic: '🖊️', title: 'सही शब्द चुनो', en: 'Choose the right word', sentence: 'मेरी कलम ___ है।', options: ['नया', 'नई'], answer: 'नई', targets: 'M2' },
  t3b: {
    kind: 'sort', title: 'शब्दों को सही डिब्बे में रखो', en: 'Sort the nouns: masculine or feminine?',
    words: [['घी', '🧈'], ['कलम', '🖊️'], ['हाथी', '🐘'], ['सड़क', '🛣️'], ['आदमी', '👨'], ['चाय', '☕']],
  },
  t4b: { kind: 'fix', pic: '🛣️', title: 'वाक्य ठीक करो', en: 'Fix the sentence (type it correctly)', wrongSentence: 'सड़क टूटा है।', model: 'सड़क टूटी है।', mustHave: 'सड़क' },
  whyb: {
    kind: 'why', pic: '🤔', title: 'क्यों?', en: 'Why? Explain the change',
    question: '"पानी ठंडी है" को हमने "पानी ठंडा है" क्यों किया?',
    options: [
      { text: 'क्योंकि "पानी" पुल्लिंग है — हम कहते हैं "मेरा पानी"', correct: true },
      { text: 'क्योंकि "पानी" के अंत में -ई है', type: 'M1', hint: 'क्या शब्द का अंत देखकर लिंग पता चलता है? "मेरा पानी" या "मेरी पानी" — बोलकर देखो।', explain: 'अंत में -ई होने से कोई शब्द स्त्रीलिंग नहीं हो जाता। "मेरा पानी" — पानी पुल्लिंग है, इसलिए "ठंडा"।' },
      { text: 'क्योंकि पानी ठंडा अच्छा लगता है', type: 'guess', hint: 'यह नियम से होता है, पसंद से नहीं। "मेरा पानी" या "मेरी पानी"?', explain: '"मेरा पानी" — पानी पुल्लिंग है, इसलिए "ठंडा"। यह नियम है, पसंद नहीं।' },
    ],
  },
  t5b: { kind: 'tiles', pic: '👩‍🍳', title: 'वाक्य बनाओ', en: 'Build the sentence from the tiles', tiles: ['बना', 'दीदी', 'रहा', 'है', 'खाना', 'रही'], model: 'दीदी खाना बना रही है', accept: ['दीदी खाना बना रही है'] },
  t6b: { kind: 'speak', pic: '👩‍🍳', title: 'बोलकर बताओ', en: 'Say it aloud: what does your didi do?', question: 'तुम्हारी दीदी शाम को क्या करती है?', example: 'दीदी खाना बनाती है।' },

  // Remedial items, inserted only when the matching misconception is diagnosed (adaptivity)
  rM1: { kind: 'mcq', remedial: 'M1', pic: '🥣', title: 'एक और कोशिश', en: 'One more, about -ई nouns', sentence: 'दही ___ है।', options: ['खट्टा', 'खट्टी'], answer: 'खट्टा' },
  rM2: { kind: 'mcq', remedial: 'M2', pic: '🛣️', title: 'एक और कोशिश', en: 'One more, about objects', sentence: 'सड़क बहुत ___ है।', options: ['लंबा', 'लंबी'], answer: 'लंबी' },
  ragree: { kind: 'mcq', remedial: 'agreement', pic: '👦⚽', title: 'एक और कोशिश', en: 'One more: match the noun', sentence: 'लड़का खेल ___ है।', options: ['रहा', 'रही'], answer: 'रहा' },
}

export const ALT = { t1: 't1b', t2: 't2b', t3: 't3b', t4: 't4b', why: 'whyb', t5: 't5b', t6: 't6b' }
export const MAX_REDOS = 3
export const isExercise = s => !!s && s !== 'learn' && s !== 'done' && !s.startsWith('reteach')
export const BASE_PLAN = ['learn', 't1', 't2', 't3', 't4', 'why', 't5', 't6', 'done']

// Re-teach cards shown before a remedial item
export const RETEACH = {
  M1: {
    title: 'हर -ई वाला शब्द स्त्रीलिंग नहीं होता!', en: 'Not every word ending in -ई is feminine.',
    body: 'कुछ शब्द -ई पर खत्म होते हैं पर पुल्लिंग हैं:', examples: ['ठंडा पानी 💧', 'खट्टा दही 🥣', 'मोटा हाथी 🐘', 'अच्छा आदमी 👨', 'सफ़ेद मोती ⚪'],
    trick: 'तरकीब: "मेरा" या "मेरी" लगाकर बोलो — "मेरा पानी" ✓, "मेरी पानी" ✗',
  },
  M2: {
    title: 'चीज़ों का भी लिंग होता है!', en: 'Objects have gender too — not all are masculine.',
    body: 'ये चीज़ें स्त्रीलिंग हैं:', examples: ['अच्छी किताब 📕', 'बस आई 🚌', 'लंबी सड़क 🛣️', 'गरम चाय ☕', 'मेरी कलम 🖊️'],
    trick: 'तरकीब: "मेरा" या "मेरी" लगाकर बोलो — "मेरी किताब" ✓, "मेरा किताब" ✗',
  },
  agreement: {
    title: 'संज्ञा से मिलाओ', en: 'Match the verb to the noun.',
    body: 'लड़का हो तो -आ, लड़की हो तो -ई:', examples: ['लड़का खेल रहा है 👦', 'लड़की खेल रही है 👧', 'भाई आया 👦', 'बहन आई 👧'],
    trick: 'पहले संज्ञा ढूँढो, फिर उसका लिंग सोचो।',
  },
}

export const G_NAME = { m: 'पुल्लिंग', f: 'स्त्रीलिंग' }
