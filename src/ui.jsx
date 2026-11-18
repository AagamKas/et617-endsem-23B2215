import { speak } from './speech'

export function Btn({ kind = 'primary', wide, className = '', ...p }) {
  const k = kind === 'primary' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-white border-2 border-slate-200'
  return <button {...p} className={`${k} ${wide ? 'w-full' : ''} px-5 py-3 rounded-2xl text-lg font-semibold active:scale-95 transition disabled:opacity-40 ${className}`} />
}

export function Speaker({ text }) {
  return (
    <button type="button" onClick={e => { e.stopPropagation(); speak(text) }} aria-label="सुनो (listen)" title="सुनो (listen)"
      className="shrink-0 w-11 h-11 rounded-full bg-amber-100 text-xl active:scale-90">🔊</button>
  )
}
