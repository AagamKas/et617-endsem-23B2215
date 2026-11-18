import { useEffect, useState } from 'react'
import { checkAgreement, nounInfo } from './nlp'
import { G_NAME } from './data'
import { canListen, listen, speak } from './speech'
import { Btn, En, GenderPick, Speaker } from './ui'
import HindiInput, { hasRoman } from './HindiInput'

// Feedback text. Level 1 (first wrong try) = a hint that makes the learner test their own idea
// without giving the answer. Level 2 (second wrong try) = full explanation + model answer.
export function feedbackFor(r, level, gender) {
  const s = r.subject, G = G_NAME[r.gender] ?? ''
  if (r.why) return r.why.correct
    ? { tone: 'good', hi: 'शाबाश! ✓ तुमने सही कारण बताया — बस स्त्रीलिंग है, इसलिए "आई"।', en: 'Correct reasoning: बस is feminine, so the verb ends in -ई.' }
    : level === 1 ? { tone: 'hint', hi: r.why.hint, en: 'Hint: think about which word decides the ending.' }
      : { tone: 'bad', hi: r.why.explain, en: 'The noun being talked about (बस) decides the ending.' }
  if (r.type === 'ok' && !r.gender) return { tone: 'good', hi: 'शाबाश! ✓ सब शब्द सही डिब्बे में हैं।', en: 'All correct!' }
  if (r.type === 'spelling') return { tone: 'hint', hi: 'लगभग सही! बस वर्तनी (spelling) ठीक करो।', en: 'Almost there — just fix the spelling.' }
  if (r.type === 'ok') return { tone: 'good', hi: `शाबाश! ✓ "${s}" ${G} है, इसलिए यही सही है।`, en: `Correct — "${s}" is ${r.gender === 'm' ? 'masculine' : 'feminine'}.` }
  if (r.type === 'dialect') return { tone: 'good', hi: 'बिल्कुल ठीक! ✓', en: 'Correct — this is an accepted dialect form, not an error.' }
  if (r.type === 'M1') return level === 1
    ? { tone: 'hint', hi: `"${s}" के अंत में -ई है… पर क्या हर -ई वाला शब्द स्त्रीलिंग होता है? बोलकर देखो: "मेरा ${s}" या "मेरी ${s}"?`, en: 'Hint: does every word ending in -ई have to be feminine?' }
    : { tone: 'bad', hi: `"${s}" के अंत में -ई है, पर यह पुल्लिंग है! इसलिए "${r.fix}" आएगा, "${r.wrong}" नहीं।`, en: `${s} ends in -ई but is masculine, so "${r.fix}".` }
  if (r.type === 'M2') return level === 1
    ? { tone: 'hint', hi: `क्या चीज़ें हमेशा पुल्लिंग होती हैं? बोलकर देखो: "मेरा ${s}" या "मेरी ${s}"?`, en: 'Hint: are objects always masculine?' }
    : { tone: 'bad', hi: `चीज़ों का भी लिंग होता है! "${s}" स्त्रीलिंग है (मेरी ${s})। इसलिए "${r.fix}" आएगा, "${r.wrong}" नहीं।`, en: `${s} is feminine, so "${r.fix}".` }
  if (r.type === 'agreement') {
    const who = s === 'मैं' ? (gender === 'f' ? 'तुम लड़की हो' : 'तुम लड़का हो') : `"${s}" ${G} है`
    return level === 1
      ? { tone: 'hint', hi: `वाक्य में किसकी बात हो रही है? ${who} — क्या "${r.wrong}" उससे मिलता है?`, en: 'Hint: find the noun and match the ending to it.' }
      : { tone: 'bad', hi: `${who}, इसलिए "${r.wrong}" की जगह "${r.fix}" आएगा।`, en: `Match the noun: "${r.fix}", not "${r.wrong}".` }
  }
  return { tone: 'hint', hi: 'हमें वाक्य में संज्ञा नहीं मिली। पूरा वाक्य बोलो या लिखो।', en: "We couldn't find the noun — try a full sentence." }
}

function Feedback({ fb, notes = [], bridge, model, stars, onRetry, onNext, onRedo, redosLeft }) {
  const box = { good: 'bg-emerald-50 border-emerald-400', hint: 'bg-amber-50 border-amber-400', bad: 'bg-rose-50 border-rose-400' }[fb.tone]
  return (
    <div className={`border-2 rounded-2xl p-4 space-y-2 ${box}`} aria-live="polite">
      <div className="flex gap-2 items-start">
        <p className="text-lg font-semibold flex-1">{fb.hi}</p>
        <Speaker text={fb.hi} />
      </div>
      <p className="text-sm text-slate-500">{fb.en}</p>
      {notes.map((n, i) => <p key={i} className="text-sm bg-white/70 rounded-lg p-2">🗣️ {n}</p>)}
      {bridge && (
        <div className="bg-sky-50 border-2 border-sky-300 rounded-xl p-3 space-y-1">
          <p className="text-sm font-bold text-sky-800">📝 स्कूल की हिंदी में (school Hindi) — एक टिप, गलती नहीं</p>
          <p>अगर सिर्फ़ अपनी बात हो, तो लिखते समय ऐसे लिखते हैं:</p>
          <p className="text-xl font-semibold flex items-center gap-2">{bridge} <Speaker text={bridge} /></p>
          <p className="text-xs text-slate-500">Both are right — home language at home, this form in school writing.</p>
        </div>
      )}
      {model && <p className="font-semibold">सही उत्तर: <span className="text-emerald-700">{model}</span></p>}
      {stars != null && <p className="text-sm">{stars === 2 ? '⭐⭐ पहली बार में सही!' : stars === 1 ? '⭐ हिंट के बाद सही — बढ़िया!' : '💪 कोशिश के लिए शाबाश — अगली बार ज़रूर!'}</p>}
      <div className="flex flex-wrap gap-2 pt-1">
        {onRetry && <Btn onClick={onRetry} kind="ghost">🔁 फिर से करो</Btn>}
        {onNext && <Btn onClick={onNext}>आगे चलो →</Btn>}
        {onRedo && <Btn onClick={onRedo} kind="ghost" title="Practise one more question of this type">➕ इसी तरह का एक और ({redosLeft} बचे)</Btn>}
      </div>
    </div>
  )
}

function promptText(task, gender) {
  if (task.kind === 'mcq') return task.sentence.replace('___', '…')
  if (task.kind === 'why') return task.question
  if (task.kind === 'fix') return `${task.title}। ${task.wrongSentence}`
  if (task.kind === 'speak') return task.question ?? (gender === 'f' ? 'तुम रोज़ स्कूल कैसे जाती हो?' : 'तुम रोज़ स्कूल कैसे जाते हो?')
  return task.title
}

export default function Task({ id, task, profile, autoRead, onDone, setGender, redosLeft }) {
  // Interaction adaptivity: learners who keep tapping 🔊 get every new prompt read aloud automatically.
  useEffect(() => { if (autoRead) speak(promptText(task, profile.gender)) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const [tries, setTries] = useState(0)
  const [result, setResult] = useState(null) // { r, correct }
  const [attempts, setAttempts] = useState([])

  function submit(r, correct, input) {
    const n = tries + 1
    setTries(n)
    setResult({ r, correct })
    const entry = { step: id, input, type: correct ? (r.type === 'dialect' ? 'dialect' : 'ok') : r.type, attempt: n, at: Date.now() }
    setAttempts(a => [...a, entry])
    const fb = feedbackFor(r, correct ? 0 : n, profile.gender)
    speak(fb.hi) // spoken feedback for early readers
  }
  const finish = (redo = false) => onDone({ redo, firstTry: attempts[0]?.type === 'ok' || attempts[0]?.type === 'dialect', diagnosed: attempts.find(a => ['M1', 'M2', 'agreement'].includes(a.type))?.type, log: attempts })
  const retry = () => setResult(null)

  const level = result && !result.correct ? Math.min(tries, 2) : 0
  const fb = result && feedbackFor(result.r, level, profile.gender)
  const model = result && !result.correct && tries >= 2 ? modelAnswer(task, profile.gender) : null
  const fbEl = result && (
    <Feedback fb={fb} notes={result.r.notes} bridge={result.r.bridge} model={model}
      stars={result.correct ? (tries === 1 ? 2 : 1) : tries >= 2 ? 0 : null}
      onRetry={!result.correct && tries < 2 ? retry : null}
      onNext={result.correct || tries >= 2 ? () => finish(false) : null}
      onRedo={(result.correct || tries >= 2) && redosLeft > 0 ? () => finish(true) : null} redosLeft={redosLeft} />
  )

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold flex-1">{task.title}</h2>
          {task.pic && <span className="text-4xl">{task.pic}</span>}
        </div>
        <p className="text-sm text-slate-500">{task.en}</p>
      </div>
      {task.kind === 'mcq' && <Mcq task={task} profile={profile} locked={!!result} onSubmit={submit} />}
      {task.kind === 'why' && <Why task={task} locked={!!result} onSubmit={submit} />}
      {task.kind === 'sort' && <Sort task={task} locked={!!result} onSubmit={submit} />}
      {task.kind === 'fix' && <Fix task={task} profile={profile} locked={!!result} onSubmit={submit} />}
      {task.kind === 'tiles' && <Tiles task={task} profile={profile} locked={!!result} onSubmit={submit} />}
      {task.kind === 'speak' && <Speak task={task} profile={profile} locked={!!result} onSubmit={submit} setGender={setGender} />}
      {fbEl}
    </div>
  )
}

function modelAnswer(task, gender) {
  if (task.kind === 'why') return task.options.find(o => o.correct).text
  if (task.kind === 'mcq') return task.sentence.replace('___', task.answer)
  if (task.kind === 'sort') return task.words.map(([w]) => `${w} (${G_NAME[nounInfo(w).g]})`).join(', ')
  if (task.kind === 'speak') return task.example ?? (gender === 'f' ? 'मैं रोज़ स्कूल जाती हूँ।' : 'मैं रोज़ स्कूल जाता हूँ।')
  return task.model
}

// ---------- Format 1: multiple choice ----------
function Mcq({ task, profile, locked, onSubmit }) {
  const [parts] = useState(() => task.sentence.split('___'))
  const [pick, setPick] = useState(null)
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 text-3xl text-center font-semibold flex justify-center items-center gap-2 flex-wrap">
        {parts[0]}<span className="min-w-20 border-b-4 border-dashed border-indigo-400 text-indigo-700">{pick ?? ' '}</span>{parts[1]}
        <Speaker text={task.sentence.replace('___', '…')} />
      </div>
      <En className="text-center">{task.sentenceEn}</En>
      <div className="grid grid-cols-2 gap-3">
        {task.options.map(o => (
          <button key={o} disabled={locked} onClick={() => {
            setPick(o)
            const sentence = task.sentence.replace('___', o)
            onSubmit(checkAgreement(sentence, profile.gender), o === task.answer, sentence)
          }} className="py-5 text-2xl font-bold rounded-2xl bg-white border-2 border-indigo-200 active:scale-95 disabled:opacity-60 shadow-sm">{o}</button>
        ))}
      </div>
    </div>
  )
}

// ---------- Format 6: explain why (reasoning choice) ----------
function Why({ task, locked, onSubmit }) {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl p-4 text-xl font-semibold flex items-center gap-2">
        <span className="flex-1">{task.question}</span><Speaker text={task.question} />
      </div>
      <En>{task.questionEn}</En>
      {task.options.map(o => (
        <button key={o.text} disabled={locked} onClick={() => onSubmit({ type: o.correct ? 'ok' : o.type, why: o, notes: [] }, !!o.correct, o.text)}
          className="w-full text-left p-4 text-lg rounded-2xl bg-white border-2 border-indigo-200 active:scale-[.98] disabled:opacity-60 shadow-sm">{o.text}<En>{o.en}</En></button>
      ))}
    </div>
  )
}

// ---------- Format 2: sort into masculine / feminine (tap word, then tap box) ----------
function Sort({ task, locked, onSubmit }) {
  const [placed, setPlaced] = useState({})
  const [sel, setSel] = useState(null)
  const left = task.words.filter(([w]) => !placed[w])
  const put = g => { if (sel) { setPlaced(p => ({ ...p, [sel]: g })); setSel(null) } }
  function check() {
    const wrong = task.words.map(([w]) => w).filter(w => placed[w] !== nounInfo(w).g)
    if (!wrong.length) return onSubmit({ type: 'ok', subject: 'सब शब्द', gender: null, notes: [] }, true, JSON.stringify(placed))
    const w = wrong[0], n = nounInfo(w)
    const type = n.g === 'm' && /ी$/.test(w) ? 'M1' : n.g === 'f' && !n.animate ? 'M2' : 'agreement'
    onSubmit({ type, subject: w, gender: n.g, wrong: G_NAME[placed[w]], fix: G_NAME[n.g], notes: wrong.length > 1 ? [`${wrong.length} शब्द गलत डिब्बे में हैं: ${wrong.join(', ')}`] : [] }, false, JSON.stringify(placed))
  }
  // Drag and drop with pointer events (works for touch and mouse); tapping still works as a fallback.
  const [drag, setDrag] = useState(null) // { w, e, x, y, moved }
  const [over, setOver] = useState(null)
  useEffect(() => {
    if (!drag) return
    const boxAt = (x, y) => document.elementFromPoint(x, y)?.closest('[data-box]')?.dataset.box
    const move = ev => { setDrag(d => d && { ...d, x: ev.clientX, y: ev.clientY, moved: true }); setOver(boxAt(ev.clientX, ev.clientY) ?? null) }
    const up = ev => {
      const g = boxAt(ev.clientX, ev.clientY)
      if (g && drag) { setPlaced(p => ({ ...p, [drag.w]: g })); setSel(null) }
      setDrag(null); setOver(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [drag?.w]) // eslint-disable-line react-hooks/exhaustive-deps

  const Box = ({ g, label, hint, color }) => (
    <button data-box={g} onClick={() => put(g)} disabled={locked} className={`min-h-40 rounded-2xl border-4 border-dashed p-3 text-left transition ${color} ${sel || over === g ? 'ring-4 ring-indigo-300' : ''} ${over === g ? 'scale-[1.03]' : ''}`}>
      <div className="font-bold text-lg">{label}</div>
      <div className="text-sm text-slate-600">{hint}</div>
      <div className="flex flex-wrap gap-1 mt-2">
        {task.words.filter(([w]) => placed[w] === g).map(([w, e]) => (
          <span key={w} onClick={ev => { if (locked) return; ev.stopPropagation(); setPlaced(p => { const q = { ...p }; delete q[w]; return q }) }} className="px-2 py-1 bg-white rounded-lg text-lg shadow-sm">{e} {w}</span>
        ))}
      </div>
    </button>
  )
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-3 border-2 border-amber-200">
        <p className="text-sm font-bold text-amber-700 mb-2">👀 उदाहरण (example)</p>
        <div className="flex items-center gap-2 text-lg flex-wrap">
          <span className="px-3 py-1 bg-white border-2 rounded-xl shadow-sm">👦 लड़का</span><span>👉</span>
          <span className="px-3 py-1 rounded-xl border-2 border-dashed border-sky-400 bg-sky-50">पुल्लिंग · "<b>मेरा</b> लड़का" ✓</span>
        </div>
        <div className="flex items-center gap-2 text-lg flex-wrap mt-2">
          <span className="px-3 py-1 bg-white border-2 rounded-xl shadow-sm">👧 लड़की</span><span>👉</span>
          <span className="px-3 py-1 rounded-xl border-2 border-dashed border-pink-400 bg-pink-50">स्त्रीलिंग · "<b>मेरी</b> लड़की" ✓</span>
        </div>
        <p className="text-sm mt-2">तरकीब: शब्द के आगे "मेरा" और "मेरी" लगाकर बोलो — जो सही लगे, उसी डिब्बे में डालो।</p>
      </div>
      <p className="text-sm">शब्द को <b>खींचकर</b> डिब्बे में डालो, या शब्द पर टैप करके फिर डिब्बे पर टैप करो। <span className="text-slate-500">(Drag a word into a box, or tap the word then the box. Tap a placed word to take it back.)</span></p>
      <div className="flex flex-wrap gap-2 min-h-12">
        {left.map(([w, e, en]) => (
          <button key={w} disabled={locked} onClick={() => setSel(w)}
            onPointerDown={ev => { if (!locked) { ev.preventDefault(); setSel(w); setDrag({ w, e, x: ev.clientX, y: ev.clientY, moved: false }) } }}
            style={{ touchAction: 'none' }}
            className={`px-4 py-2 text-xl rounded-xl bg-white border-2 shadow-sm cursor-grab ${drag?.w === w && drag.moved ? 'opacity-30' : ''} ${sel === w ? 'border-indigo-500 ring-2 ring-indigo-300' : 'border-slate-200'}`}>{e} {w}{en && <span className="block text-xs text-slate-500">{en}</span>}</button>
        ))}
      </div>
      {drag?.moved && <div className="fixed z-50 pointer-events-none px-4 py-2 text-xl rounded-xl bg-white border-2 border-indigo-500 shadow-xl" style={{ left: drag.x - 40, top: drag.y - 24 }}>{drag.e} {drag.w}</div>}
      <div className="grid grid-cols-2 gap-3">
        <Box g="m" label="पुल्लिंग" hint='"मेरा ___"' color="border-sky-400 bg-sky-50" />
        <Box g="f" label="स्त्रीलिंग" hint='"मेरी ___"' color="border-pink-400 bg-pink-50" />
      </div>
      {!locked && <Btn onClick={check} disabled={left.length > 0} wide>जाँचो ✓</Btn>}
    </div>
  )
}

// ---------- Format 3: fix the sentence (typed, with spelling feedback) ----------
function Fix({ task, profile, locked, onSubmit }) {
  const [text, setText] = useState(task.wrongSentence)
  function check() {
    if (/आइ/.test(text)) return onSubmit({ type: 'spelling', subject: task.mustHave, notes: ['वर्तनी: "आइ" नहीं, "आई" — यहाँ बड़ी ई (ई) लगती है। (Spelling: use the long ई.)'] }, false, text)
    const r = checkAgreement(text, profile.gender)
    const correct = r.ok && text.includes(task.mustHave) && text.replace(/[।\s]/g, '') !== task.wrongSentence.replace(/[।\s]/g, '')
    onSubmit(correct ? r : (r.type === 'ok' ? { ...r, type: 'unknown' } : r), correct, text)
  }
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl p-4 text-2xl text-center"><s className="text-rose-500">{task.wrongSentence}</s> <Speaker text={task.wrongSentence} /><En>{task.wrongEn}</En></div>
      <p className="text-sm">ऊपर का गलत वाक्य नीचे ठीक करके लिखो। <span className="text-slate-500">(Edit the sentence below to make it correct.)</span></p>
      <HindiInput value={text} onChange={setText} disabled={locked} />
      {!locked && <Btn onClick={check} wide disabled={hasRoman(text)}>जाँचो ✓</Btn>}
    </div>
  )
}

// ---------- Format 4: build the sentence from word tiles ----------
function Tiles({ task, profile, locked, onSubmit }) {
  const [built, setBuilt] = useState([])
  const remaining = task.tiles.filter((t, i) => !built.includes(i))
  function check() {
    const s = built.map(i => task.tiles[i]).join(' ')
    const r = checkAgreement(s, profile.gender)
    const correct = task.accept.includes(s)
    onSubmit(correct ? r : (r.type === 'ok' ? { ...r, type: 'unknown', notes: ['शब्दों का क्रम देखो: कौन, क्या कर रहा/रही है, है।'] } : r), correct, s)
  }
  return (
    <div className="space-y-4">
      <En>{task.modelEn}</En>
      <div className="bg-white rounded-2xl p-4 min-h-20 flex flex-wrap gap-2 items-center border-2 border-dashed border-indigo-300">
        {built.length === 0 && <span className="text-slate-400">यहाँ वाक्य बनेगा…</span>}
        {built.map((i, k) => <button key={k} disabled={locked} onClick={() => setBuilt(b => b.filter(x => x !== i))} className="px-4 py-2 text-xl rounded-xl bg-indigo-600 text-white">{task.tiles[i]}</button>)}
      </div>
      <div className="flex flex-wrap gap-2">
        {task.tiles.map((t, i) => !built.includes(i) && <button key={i} disabled={locked} onClick={() => setBuilt(b => [...b, i])} className="px-4 py-2 text-xl rounded-xl bg-white border-2 border-slate-200 shadow-sm active:scale-95">{t}</button>)}
      </div>
      {!locked && <Btn onClick={check} disabled={built.length < task.model.split(' ').length} wide>जाँचो ✓</Btn>}
      {remaining.length === 0 && null}
    </div>
  )
}

// ---------- Format 5: speak (speech recognition in, speech out) ----------
function Speak({ task, profile, locked, onSubmit, setGender }) {
  const [heard, setHeard] = useState('')
  const [state, setState] = useState('idle')
  const [typed, setTyped] = useState('')
  const q = task.question ?? (profile.gender === 'f' ? 'तुम रोज़ स्कूल कैसे जाती हो?' : 'तुम रोज़ स्कूल कैसे जाते हो?')
  const eg = task.example ?? (profile.gender === 'f' ? 'मैं रोज़ स्कूल जाती हूँ।' : 'मैं रोज़ स्कूल जाता हूँ।')
  const run = text => { const r = checkAgreement(text, profile.gender); onSubmit(r, !!r.ok, text) }
  function mic() {
    setState('listening'); setHeard('')
    listen({
      onResult: t => { setHeard(t); setState('idle'); run(t) },
      onError: () => setState('error'),
      onEnd: () => setState(s => (s === 'listening' ? 'idle' : s)),
    })
  }
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 text-xl flex items-center gap-2">
        <span className="flex-1 font-semibold">{q}</span><Speaker text={q} />
      </div>
      <En>{task.questionEn}</En>
      <p className="text-sm text-slate-500">पूरा वाक्य बोलो, जैसे: "{eg}" · अपनी बोली में बोलो, कोई बात नहीं!</p>
      <En>Say a full sentence, {task.exampleEn ?? 'e.g. "I go to school every day."'} Speak in your own way, that is fine!</En>
      {!locked && <details className="text-sm bg-white rounded-xl p-2"><summary className="cursor-pointer">तुमने चुना: <b>"{profile.gender === 'f' ? 'मैं जाती हूँ' : 'मैं जाता हूँ'}"</b> — बदलना है? (change)</summary><div className="pt-2"><GenderPick compact gender={profile.gender} setGender={setGender} /></div></details>}
      {canListen && (
        <button disabled={locked || state === 'listening'} onClick={mic}
          className={`w-full py-8 rounded-3xl text-2xl font-bold text-white shadow-lg active:scale-95 ${state === 'listening' ? 'bg-rose-500 animate-pulse' : 'bg-indigo-600'}`}>
          {state === 'listening' ? '🎙️ सुन रहे हैं…' : '🎤 टैप करके बोलो'}
        </button>
      )}
      {heard && <p className="text-center text-lg">तुमने कहा: "<b>{heard}</b>"</p>}
      {(!canListen || state === 'error') && <p className="text-sm text-amber-700">माइक नहीं चल रहा — नीचे लिखकर भी जवाब दे सकते हो। (Mic unavailable — type instead.)</p>}
      <details className="text-sm" open={!canListen || state === 'error'}>
        <summary className="cursor-pointer text-slate-500">बोल नहीं पा रहे? लिखकर बताओ (type instead)</summary>
        <div className="space-y-2 mt-2">
          <HindiInput value={typed} onChange={setTyped} disabled={locked} placeholder={eg} />
          <Btn wide disabled={locked || !typed.trim() || hasRoman(typed)} onClick={() => run(typed)}>भेजो ✓</Btn>
        </div>
      </details>
    </div>
  )
}
