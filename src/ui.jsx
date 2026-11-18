import { useState } from 'react'
import { speak } from './speech'

export function Btn({ kind = 'primary', wide, className = '', ...p }) {
  const k = kind === 'primary' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-white border-2 border-slate-200'
  return <button {...p} className={`${k} ${wide ? 'w-full' : ''} px-5 py-3 rounded-2xl text-lg font-semibold active:scale-95 transition disabled:opacity-40 ${className}`} />
}

// English translation shown under a Hindi sentence (viva change: helps the teacher/volunteer and non-Hindi readers)
export function En({ children, className = '' }) {
  if (!children) return null
  return <p className={`text-sm italic text-slate-500 ${className}`} lang="en">🇬🇧 {children}</p>
}

// A destructive action that asks inside the page first (no browser pop-ups on a shared tablet).
export function ConfirmBtn({ label, question, yes, onYes }) {
  const [ask, setAsk] = useState(false)
  if (!ask) return <button type="button" onClick={() => setAsk(true)} className="w-full py-3 rounded-2xl bg-white border-2 border-rose-200 text-rose-700 font-semibold">{label}</button>
  return (
    <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3 space-y-2">
      <p className="font-semibold">{question}</p>
      <div className="flex gap-2">
        <button type="button" onClick={() => { setAsk(false); onYes() }} className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-semibold">{yes}</button>
        <button type="button" onClick={() => setAsk(false)} className="flex-1 py-2 rounded-xl bg-white border-2 border-slate-200">नहीं (cancel)</button>
      </div>
    </div>
  )
}

// Asked as a language choice ("how do you say it about yourself?"), not a personal question.
// Hindi verbs with मैं agree with the speaker, so the checker needs to know which form to expect.
export function GenderPick({ gender, setGender, compact }) {
  return (
    <div>
      <p className="text-sm mb-1 font-semibold">अपने बारे में बोलते समय तुम कैसे कहते हो? <Speaker text="अपने बारे में बोलते समय तुम कैसे कहते हो? मैं जाता हूँ, या मैं जाती हूँ?" /></p>
      {!compact && <p className="text-xs text-slate-500 mb-2">(How do you say it about yourself? Hindi verbs change with "मैं". You can change this later.)</p>}
      <div className="grid grid-cols-2 gap-2">
        {[['m', '🙋‍♂️', 'मैं जाता हूँ'], ['f', '🙋‍♀️', 'मैं जाती हूँ']].map(([g, e, l]) => (
          <button type="button" key={g} onClick={() => setGender(g)} className={`py-3 rounded-xl text-lg border-2 ${gender === g ? 'border-indigo-500 bg-indigo-50 font-bold' : 'border-slate-200 bg-white'}`}>{e} "{l}"</button>
        ))}
      </div>
    </div>
  )
}

export function Speaker({ text }) {
  return (
    <button type="button" onClick={e => { e.stopPropagation(); speak(text); window.dispatchEvent(new Event('listen-tap')) }} aria-label="सुनो (listen)" title="सुनो (listen)"
      className="shrink-0 w-11 h-11 rounded-full bg-amber-100 text-xl active:scale-90">🔊</button>
  )
}
