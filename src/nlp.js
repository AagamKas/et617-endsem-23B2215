// Rule-based Hindi gender-agreement checker (the app's NLP core).
// 1. normalise the text (drop nukta / chandrabindu, punctuation) so pronunciation variants are not errors
// 2. find the subject (lexicon noun or pronoun) and its grammatical gender
// 3. find words that must agree with it (adjectives, verbs, possessives) and read their gender from the ending
// 4. classify: correct · accepted dialect variation · misconception M1 · misconception M2 · other agreement error

// Noun lexicon: g = grammatical gender, animate = living thing
export const NOUNS = {
  'पानी': { g: 'm' }, 'दही': { g: 'm' }, 'घी': { g: 'm' }, 'मोती': { g: 'm' }, 'हाथी': { g: 'm', animate: true },
  'आदमी': { g: 'm', animate: true }, 'भाई': { g: 'm', animate: true }, 'घोड़ा': { g: 'm', animate: true },
  'लड़का': { g: 'm', animate: true }, 'कमरा': { g: 'm' }, 'केला': { g: 'm' }, 'ट्रक': { g: 'm' }, 'आम': { g: 'm' },
  'दूध': { g: 'm' }, 'स्कूल': { g: 'm' }, 'खाना': { g: 'm' },
  'किताब': { g: 'f' }, 'बस': { g: 'f' }, 'बात': { g: 'f' }, 'सड़क': { g: 'f' }, 'चाय': { g: 'f' }, 'कलम': { g: 'f' },
  'गाड़ी': { g: 'f' }, 'नदी': { g: 'f' }, 'रोटी': { g: 'f' }, 'लड़की': { g: 'f', animate: true },
  'बहन': { g: 'f', animate: true }, 'दीदी': { g: 'f', animate: true }, 'माँ': { g: 'f', animate: true },
  'घोड़ी': { g: 'f', animate: true }, 'दाल': { g: 'f' }, 'घड़ी': { g: 'f' },
}

// Words that never carry gender agreement (auxiliaries, adverbs, postpositions)
const NEUTRAL = new Set(['है', 'हैं', 'हूं', 'हो', 'बहुत', 'रोज', 'आज', 'को', 'में', 'से', 'पर', 'का', 'की', 'के', 'भी', 'नहीं', 'और', 'पैदल', 'गरम', 'लाल'])
const PRONOUNS = new Set(['मैं', 'हम', 'तुम', 'वह', 'वो', 'ये', 'यह'])

// Accepted pronunciation / spelling variants (shown to the learner as "both are fine")
const VARIANTS = { 'रोज': 'रोज़', 'जरूर': 'ज़रूर', 'लडकी': 'लड़की', 'लडका': 'लड़का', 'सडक': 'सड़क', 'गाडी': 'गाड़ी' }

export function normalise(text) {
  return text
    .normalize('NFD')
    .replace(/़/g, '') // nukta: ज़→ज, ड़→ड (common spoken / typed variation)
    .replace(/ँ/g, 'ं') // chandrabindu → anusvara
    .replace(/[।|.,!?'"“”‘’]/g, ' ')
    .normalize('NFC')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

const NORM_NOUNS = Object.fromEntries(Object.entries(NOUNS).map(([k, v]) => [normalise(k)[0], { ...v, word: k }]))
const NORM_NEUTRAL = new Set([...NEUTRAL].map(w => normalise(w)[0]))

export const nounInfo = word => NORM_NOUNS[normalise(word)[0]]

// Gender carried by an inflected adjective/verb/possessive, from its ending.
export function genderOf(word) {
  if (/(ा|या)$/.test(word)) return 'm'
  if (/(ी|ई)$/.test(word)) return 'f'
  if (/े$/.test(word)) return 'mpl' // masculine plural / respectful form (जाते, अच्छे)
  return null
}

export function flip(word) {
  if (/या$/.test(word)) return word.replace(/या$/, 'ई')
  if (/ा$/.test(word)) return word.replace(/ा$/, 'ी')
  if (/[ाआ]ई$|आई$/.test(word) || /ई$/.test(word)) return word.replace(/ई$/, 'या')
  if (/ी$/.test(word)) return word.replace(/ी$/, 'ा')
  return word
}

// learnerGender ('m' | 'f') is needed for sentences with मैं, where Hindi verbs agree with the speaker.
export function checkAgreement(text, learnerGender = 'f') {
  const raw = text.trim().split(/\s+/)
  const toks = normalise(text)
  const notes = []
  raw.forEach(w => { const k = w.replace(/[।.,!?]/g, ''); if (VARIANTS[k]) notes.push(`"${k}" और "${VARIANTS[k]}" — दोनों ठीक हैं (pronunciation variation, not an error).`) })

  // find subject
  let si = toks.findIndex(t => PRONOUNS.has(t) || NORM_NOUNS[t])
  if (si === -1) return { type: 'unknown', notes }
  const subj = toks[si]
  let gender, noun = null
  if (subj === 'मैं') gender = learnerGender
  else if (subj === 'हम') gender = 'hum'
  else if (PRONOUNS.has(subj)) gender = null
  else { noun = NORM_NOUNS[subj]; gender = noun.g }

  // words that must agree: possessive/adjective right before subject + predicate words after it
  const agreeing = []
  if (si > 0 && genderOf(toks[si - 1]) && !NORM_NOUNS[toks[si - 1]]) agreeing.push(toks[si - 1])
  for (const t of toks.slice(si + 1)) {
    if (NORM_NOUNS[t] || NORM_NEUTRAL.has(t) || PRONOUNS.has(t)) continue
    if (genderOf(t)) agreeing.push(t)
  }

  // Dialect: हम (Bhojpuri/Bihari-influenced "I") with -ते/-े forms is accepted, not an error.
  if (gender === 'hum') {
    const bad = agreeing.find(w => genderOf(w) !== 'mpl')
    if (!bad) return { type: 'dialect', ok: true, subject: 'हम', notes: [...notes, '"हम" का प्रयोग "मैं" के लिए — यह आपके इलाके की बोली है, बिल्कुल सही है। (Dialect variation, accepted.)'] }
    return { type: 'agreement', ok: false, subject: 'हम', wrong: bad, fix: bad.replace(/[ाी]$/, 'े'), notes }
  }
  if (!gender) return { type: 'unknown', notes }

  const wrong = agreeing.find(w => { const g = genderOf(w); return g && g !== 'mpl' && g !== gender })
  if (!wrong) return { type: 'ok', ok: true, subject: noun?.word ?? subj, gender, notes }

  let type = 'agreement'
  if (noun && noun.g === 'm' && /ी$/.test(noun.word) && genderOf(wrong) === 'f') type = 'M1'
  else if (noun && noun.g === 'f' && !noun.animate && genderOf(wrong) === 'm') type = 'M2'
  return { type, ok: false, subject: noun?.word ?? subj, gender, wrong, fix: flip(wrong), notes }
}
