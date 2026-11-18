import { useState } from 'react'

// Typing Devanagari is hard on a shared tablet, so every typed answer gets
// (1) an on-screen Hindi keyboard and (2) a Roman → Hindi converter for common words ("bas aai" → "बस आई").

const ROWS = [
  ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'],
  ['ा', 'ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', 'ौ', 'ं', 'ँ', '्', '़'],
  ['क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ', 'ड', 'ढ', 'ड़', 'ण'],
  ['त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'स', 'ह'],
]

// Small Roman → Devanagari dictionary covering the words this activity needs (and common spellings of them).
const ROMAN = {
  bas: 'बस', bus: 'बस', aai: 'आई', aayi: 'आई', ayi: 'आई', aai_: 'आई', aaya: 'आया', aya: 'आया', ai: 'आई',
  main: 'मैं', mai: 'मैं', mein: 'मैं', hum: 'हम', ham: 'हम', school: 'स्कूल', skool: 'स्कूल', roz: 'रोज़', roj: 'रोज',
  jaati: 'जाती', jati: 'जाती', jaata: 'जाता', jata: 'जाता', jaate: 'जाते', jate: 'जाते', hoon: 'हूँ', hun: 'हूँ', hu: 'हूँ',
  hai: 'है', hain: 'हैं', paidal: 'पैदल', se: 'से', mein_: 'में', meri: 'मेरी', mera: 'मेरा', behen: 'बहन', bahan: 'बहन',
  ladki: 'लड़की', ladka: 'लड़का', khel: 'खेल', rahi: 'रही', raha: 'रहा', rahe: 'रहे', ja: 'जा', gayi: 'गई', gai: 'गई', gaya: 'गया',
  kitab: 'किताब', kitaab: 'किताब', paani: 'पानी', pani: 'पानी', thanda: 'ठंडा', thandi: 'ठंडी', achha: 'अच्छा', achhi: 'अच्छी',
  acchi: 'अच्छी', accha: 'अच्छा', cycle: 'साइकिल', saikil: 'साइकिल', auto: 'ऑटो', didi: 'दीदी', ke: 'के', saath: 'साथ', sath: 'साथ',
}
export const hasRoman = t => /[a-z]/i.test(t)

// Simple phonetic Roman → Devanagari for words not in the dictionary (e.g. names: "raani" → "रानी", "sunita" → "सुनीता").
// "aa / ee / oo" give long vowels; it's a best guess, and the learner can fix it with the keyboard.
const CONS = [['chh', 'छ'], ['kh', 'ख'], ['gh', 'घ'], ['ch', 'च'], ['jh', 'झ'], ['th', 'थ'], ['dh', 'ध'], ['ph', 'फ'], ['bh', 'भ'], ['sh', 'श'],
  ['k', 'क'], ['g', 'ग'], ['c', 'क'], ['j', 'ज'], ['t', 'त'], ['d', 'द'], ['n', 'न'], ['p', 'प'], ['b', 'ब'], ['m', 'म'], ['y', 'य'],
  ['r', 'र'], ['l', 'ल'], ['v', 'व'], ['w', 'व'], ['s', 'स'], ['h', 'ह'], ['z', 'ज़'], ['f', 'फ़'], ['q', 'क'], ['x', 'क्स']]
const VOW = [['aa', 'आ', 'ा'], ['ai', 'ऐ', 'ै'], ['au', 'औ', 'ौ'], ['ee', 'ई', 'ी'], ['ii', 'ई', 'ी'], ['oo', 'ऊ', 'ू'], ['uu', 'ऊ', 'ू'],
  ['a', 'अ', ''], ['i', 'इ', 'ि'], ['u', 'उ', 'ु'], ['e', 'ए', 'े'], ['o', 'ओ', 'ो']]
function translit(word) {
  let s = word.toLowerCase(), out = '', prevCons = false
  while (s) {
    const v = VOW.find(([r]) => s.startsWith(r))
    if (v) {
      const atEnd = s.length === v[0].length
      // word-final short i → ई, word-final a after a consonant → आ (common in Hindi names: sunita, rani)
      const sign = atEnd && v[0] === 'i' ? 'ी' : atEnd && v[0] === 'a' && prevCons && out.length > 1 ? 'ा' : v[2]
      out += prevCons ? sign : v[1]; s = s.slice(v[0].length); prevCons = false; continue
    }
    const c = CONS.find(([r]) => s.startsWith(r))
    if (c) { if (prevCons) out += '्'; out += c[1]; s = s.slice(c[0].length); prevCons = true; continue }
    out += s[0]; s = s.slice(1); prevCons = false
  }
  return out
}
export const toHindi = t => t.split(/(\s+)/).map(w => (/^[a-z]+$/i.test(w) ? ROMAN[w.toLowerCase()] ?? translit(w) : w)).join('')

export default function HindiInput({ value, onChange, disabled, placeholder, keyboardOpen = true, small }) {
  const [kb, setKb] = useState(keyboardOpen)
  const press = k => onChange(value + k)
  return (
    <div className="space-y-2">
      <input value={value} disabled={disabled} onChange={e => onChange(e.target.value)} lang="hi" placeholder={placeholder}
        className={`w-full ${small ? 'text-xl p-3' : 'text-2xl p-4'} rounded-2xl border-2 border-indigo-200 focus:outline-none focus:border-indigo-500 bg-white`} />
      {hasRoman(value) && !disabled && (
        <button type="button" onClick={() => onChange(toHindi(value))} className="w-full py-2 rounded-xl bg-amber-100 border-2 border-amber-300 font-semibold">
          🔤 → अ हिंदी में बदलो: <span className="text-lg">{toHindi(value)}</span>
        </button>
      )}
      <button type="button" onClick={() => setKb(k => !k)} disabled={disabled} className="text-sm text-indigo-700 underline">⌨️ {kb ? 'कीबोर्ड छिपाओ (hide keyboard)' : 'हिंदी कीबोर्ड दिखाओ (show Hindi keyboard)'}</button>
      {kb && !disabled && (
        <div className="bg-slate-100 rounded-2xl p-2 space-y-1 select-none">
          {ROWS.map((r, i) => (
            <div key={i} className="flex flex-wrap justify-center gap-1">
              {r.map(k => <button type="button" key={k} onClick={() => press(k)} className="min-w-9 h-11 px-1 text-xl rounded-lg bg-white shadow-sm active:bg-indigo-100">{k}</button>)}
            </div>
          ))}
          <div className="flex gap-1">
            <button type="button" onClick={() => press(' ')} className="flex-1 h-11 rounded-lg bg-white shadow-sm">स्पेस (space)</button>
            <button type="button" onClick={() => press('।')} className="w-12 h-11 rounded-lg bg-white shadow-sm text-xl">।</button>
            <button type="button" onClick={() => onChange([...value].slice(0, -1).join(''))} className="w-16 h-11 rounded-lg bg-white shadow-sm text-xl">⌫</button>
          </div>
        </div>
      )}
      {!disabled && <p className="text-xs text-slate-500">Tip: Roman में भी लिख सकते हो, जैसे "bas aai" या "raani" — फिर "हिंदी में बदलो" दबाओ। (लंबी आ/ई के लिए aa/ee)</p>}
    </div>
  )
}
