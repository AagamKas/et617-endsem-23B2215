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
export const toHindi = t => t.split(/(\s+)/).map(w => ROMAN[w.toLowerCase()] ?? w).join('')

export default function HindiInput({ value, onChange, disabled, placeholder }) {
  const [kb, setKb] = useState(true)
  const press = k => onChange(value + k)
  return (
    <div className="space-y-2">
      <input value={value} disabled={disabled} onChange={e => onChange(e.target.value)} lang="hi" placeholder={placeholder}
        className="w-full text-2xl p-4 rounded-2xl border-2 border-indigo-200 focus:outline-none focus:border-indigo-500 bg-white" />
      {hasRoman(value) && !disabled && (
        <button onClick={() => onChange(toHindi(value))} className="w-full py-2 rounded-xl bg-amber-100 border-2 border-amber-300 font-semibold">
          🔤 → अ हिंदी में बदलो: <span className="text-lg">{toHindi(value)}</span>
        </button>
      )}
      <button onClick={() => setKb(k => !k)} disabled={disabled} className="text-sm text-indigo-700 underline">⌨️ {kb ? 'कीबोर्ड छिपाओ (hide keyboard)' : 'हिंदी कीबोर्ड दिखाओ (show Hindi keyboard)'}</button>
      {kb && !disabled && (
        <div className="bg-slate-100 rounded-2xl p-2 space-y-1 select-none">
          {ROWS.map((r, i) => (
            <div key={i} className="flex flex-wrap justify-center gap-1">
              {r.map(k => <button key={k} onClick={() => press(k)} className="min-w-9 h-11 px-1 text-xl rounded-lg bg-white shadow-sm active:bg-indigo-100">{k}</button>)}
            </div>
          ))}
          <div className="flex gap-1">
            <button onClick={() => press(' ')} className="flex-1 h-11 rounded-lg bg-white shadow-sm">स्पेस (space)</button>
            <button onClick={() => press('।')} className="w-12 h-11 rounded-lg bg-white shadow-sm text-xl">।</button>
            <button onClick={() => onChange([...value].slice(0, -1).join(''))} className="w-16 h-11 rounded-lg bg-white shadow-sm text-xl">⌫</button>
          </div>
        </div>
      )}
      {!disabled && <p className="text-xs text-slate-500">Tip: Roman में भी लिख सकते हो, जैसे "bas aai" — फिर "हिंदी में बदलो" दबाओ।</p>}
    </div>
  )
}
