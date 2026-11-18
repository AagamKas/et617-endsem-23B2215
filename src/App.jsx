import { useEffect, useState } from 'react'
import { AVATARS, BASE_PLAN, G_NAME, LEARN, RETEACH, RULE, RULE_EN, RULE_SMALL, TASKS } from './data'
import { SESSION_SECONDS, fmt, newProfile, useStore } from './store'
import Task from './Task'
import { Btn, Speaker } from './ui'

const REMEDIAL = { M1: 'rM1', M2: 'rM2', agreement: 'ragree' }
const STEP_LABEL = { learn: '📖 समझो', t1: '💧 चुनो', t2: '📕 चुनो', t3: '🗂️ छाँटो', t4: '✏️ ठीक करो', t5: '🧩 बनाओ', t6: '🎤 बोलो', done: '⭐ पूरा' }
const gWord = (g, m, f) => (g === 'f' ? f : m)

export default function App() {
  const [db, setDb] = useStore()
  const [screen, setScreen] = useState(db.current ? 'home' : 'profiles')
  const me = db.profiles.find(p => p.id === db.current)
  const update = fn => setDb(d => ({ ...d, profiles: d.profiles.map(p => (p.id === d.current ? fn(p) : p)) }))

  let body
  if (screen === 'about') body = <About back={() => setScreen(me ? 'home' : 'profiles')} />
  else if (!me || screen === 'profiles') body = <Profiles db={db} setDb={setDb} go={() => setScreen('home')} />
  else if (screen === 'home') body = <Home me={me} start={() => setScreen('session')} switchUser={() => setScreen('profiles')} restart={() => { update(p => ({ ...p, plan: [...BASE_PLAN], pos: 0, elapsed: 0, sessions: p.sessions + 1 })); setScreen('session') }} />
  else body = <Session me={me} update={update} stop={() => setScreen('home')} />

  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-4">{body}</main>
      <footer className="text-center text-xs text-slate-500 py-3 border-t border-amber-200">
        मेरा या मेरी? · ET 617 · <b>23B2215</b> · <button className="underline" onClick={() => setScreen('about')}>About</button>
      </footer>
    </div>
  )
}

// ---------- Screen 1: who is using the shared tablet? ----------
function Profiles({ db, setDb, go }) {
  const [adding, setAdding] = useState(db.profiles.length === 0)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [gender, setGender] = useState(null)
  const pick = id => { setDb(d => ({ ...d, current: id })); go() }
  function create(e) {
    e.preventDefault()
    const p = newProfile(name.trim(), avatar, gender)
    setDb(d => ({ profiles: [...d.profiles, p], current: p.id }))
    go()
  }
  return (
    <div className="space-y-5">
      <div className="text-center pt-4">
        <div className="text-5xl">🎪</div>
        <h1 className="text-4xl font-extrabold mt-1">मेरा या मेरी?</h1>
        <p className="text-slate-600">हिंदी में लिंग का 10 मिनट का खेल</p>
      </div>
      {db.profiles.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-bold text-lg">यह टैबलेट सबका है — अपना नाम चुनो <Speaker text="यह टैबलेट सबका है। अपना नाम चुनो।" /></h2>
          <div className="grid grid-cols-2 gap-3">
            {db.profiles.map(p => (
              <button key={p.id} onClick={() => pick(p.id)} className="bg-white rounded-2xl p-4 shadow-sm border-2 border-transparent active:border-indigo-400 text-left">
                <div className="text-4xl">{p.avatar}</div>
                <div className="font-bold text-xl">{p.name}</div>
                <div className="text-xs text-slate-500">⭐ {p.stars} · कदम {Math.min(p.pos + 1, p.plan.length)}/{p.plan.length}</div>
              </button>
            ))}
          </div>
        </section>
      )}
      {adding ? (
        <form onSubmit={create} className="bg-white rounded-2xl p-4 space-y-4 shadow-sm">
          <h2 className="font-bold text-lg">नया बच्चा जोड़ो <span className="text-sm font-normal text-slate-500">(new learner)</span></h2>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="तुम्हारा नाम" lang="hi" className="w-full text-xl p-3 rounded-xl border-2 border-slate-200" />
          <div className="flex flex-wrap gap-2">
            {AVATARS.map(a => <button type="button" key={a} onClick={() => setAvatar(a)} className={`w-12 h-12 text-2xl rounded-xl ${avatar === a ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'bg-slate-50'}`}>{a}</button>)}
          </div>
          <div>
            <p className="text-sm mb-1">तुम लड़का हो या लड़की? <span className="text-slate-500">(Hindi verbs change with "मैं" — we need this for the speaking task)</span></p>
            <div className="grid grid-cols-2 gap-2">
              {[['m', '👦 लड़का'], ['f', '👧 लड़की']].map(([g, l]) => <button type="button" key={g} onClick={() => setGender(g)} className={`py-3 rounded-xl text-lg border-2 ${gender === g ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>{l}</button>)}
            </div>
          </div>
          <Btn wide disabled={!name.trim() || !gender}>शुरू करो →</Btn>
        </form>
      ) : (
        <Btn kind="ghost" wide onClick={() => setAdding(true)}>➕ नया बच्चा</Btn>
      )}
    </div>
  )
}

// ---------- Screen 2: welcome / resume ----------
function Home({ me, start, switchUser, restart }) {
  const step = me.plan[me.pos]
  const finished = step === 'done' && me.pos === me.plan.length - 1 && me.log.length > 0
  const resuming = me.pos > 0 && !finished
  return (
    <div className="space-y-5 pt-4">
      <div className="text-center">
        <div className="text-6xl">{me.avatar}</div>
        <h1 className="text-3xl font-bold">नमस्ते, {me.name}!</h1>
        <p className="text-slate-600">⭐ {me.stars} तारे · ⏱ {fmt(me.elapsed)} / 10:00</p>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-bold mb-2">आज का खेल — 10 मिनट <span className="text-sm font-normal text-slate-500">(today's 10-minute plan)</span></h2>
        <ol className="grid grid-cols-4 gap-2 text-center text-xs">
          {me.plan.filter(s => STEP_LABEL[s]).map(s => {
            const i = me.plan.indexOf(s), done = i < me.pos
            return <li key={s} className={`rounded-xl p-2 ${done ? 'bg-emerald-100' : i === me.pos ? 'bg-indigo-100 ring-2 ring-indigo-400' : 'bg-slate-50'}`}>{done ? '✅' : ''} {STEP_LABEL[s]}</li>
          })}
        </ol>
      </div>
      {finished ? (
        <Btn wide onClick={restart}>🔁 नया खेल शुरू करो</Btn>
      ) : (
        <Btn wide onClick={start} className="py-5 text-2xl">{resuming ? `▶ जहाँ छोड़ा था, वहीं से (${STEP_LABEL[step] ?? 'अभ्यास'})` : '▶ शुरू करो'}</Btn>
      )}
      <Btn kind="ghost" wide onClick={switchUser}>👥 टैबलेट किसी और को दो</Btn>
    </div>
  )
}

// ---------- Screen 3+: the 10-minute session ----------
function Session({ me, update, stop }) {
  const step = me.plan[me.pos]
  const over = me.elapsed >= SESSION_SECONDS

  // C4: count time spent in the session; saved every second so a closed tab resumes correctly.
  useEffect(() => {
    if (step === 'done') return
    const t = setInterval(() => update(p => ({ ...p, elapsed: p.elapsed + 1 })), 1000)
    return () => clearInterval(t)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => update(p => ({ ...p, pos: Math.min(p.pos + 1, p.plan.length - 1) }))

  // Adaptivity: a diagnosed misconception inserts a re-teach card + an easier targeted item next.
  function taskDone({ firstTry, diagnosed, log }) {
    update(p => {
      const plan = [...p.plan]
      const rem = REMEDIAL[diagnosed]
      if (diagnosed && rem && !plan.includes(rem)) plan.splice(p.pos + 1, 0, `reteach:${diagnosed}`, rem)
      return { ...p, plan, pos: p.pos + 1, stars: p.stars + (firstTry ? 2 : 1), log: [...p.log, ...log], diagnosed: diagnosed && !p.diagnosed.includes(diagnosed) ? [...p.diagnosed, diagnosed] : p.diagnosed }
    })
  }

  const progress = (me.pos / (me.plan.length - 1)) * 100
  let content
  if (step === 'learn') content = <Learn gender={me.gender} onDone={next} />
  else if (step?.startsWith('reteach:')) content = <Reteach type={step.split(':')[1]} gender={me.gender} onDone={next} />
  else if (step === 'done') content = <Done me={me} home={stop} />
  else content = <Task key={me.pos} id={step} task={TASKS[step]} profile={me} onDone={taskDone} />

  return (
    <div className="space-y-4">
      {step !== 'done' && (
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-2xl">{me.avatar}</span>
            <span className={`font-mono px-2 py-1 rounded-lg ${over ? 'bg-rose-100 text-rose-700' : 'bg-white'}`}>⏱ {fmt(me.elapsed)} / 10:00</span>
            <span className="text-slate-500">कदम {me.pos + 1}/{me.plan.length - 1}</span>
            <button onClick={stop} className="ml-auto px-3 py-2 rounded-xl bg-white border-2 border-slate-200 font-semibold">⏸ अभी रुको</button>
          </div>
          <div className="h-3 bg-white rounded-full overflow-hidden"><div className="h-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} /></div>
          {over && <p className="text-sm bg-rose-50 border border-rose-200 rounded-xl p-2">⏰ 10 मिनट पूरे! तुम रुक सकते हो — अगली बार यहीं से शुरू करेंगे। <span className="text-slate-500">(Time's up — you can stop; progress is saved.)</span></p>}
        </header>
      )}
      {content}
    </div>
  )
}

function Learn({ gender, onDone }) {
  const [i, setI] = useState(0)
  const card = LEARN[i]
  const last = i === LEARN.length - 1
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">चलो समझते हैं <span className="text-sm font-normal text-slate-500">(Let's understand)</span></h2>
      <div key={i} className="bg-white rounded-3xl p-6 text-center space-y-4 shadow-sm">
        <div className="text-6xl">{card.pic}</div>
        <p className="text-3xl font-semibold leading-relaxed">
          {card.text.map((t, k) => k % 2 === 1
            ? <mark key={k} className={`px-1 rounded ${/ी|ई/.test(t) ? 'bg-pink-200' : 'bg-sky-200'}`}>{t}</mark>
            : <span key={k}>{t}</span>)}
        </p>
        <Speaker text={card.say} />
        <p className="bg-amber-50 rounded-xl p-3 text-lg">💡 {card.tip}</p>
      </div>
      <div className="flex justify-center gap-2">{LEARN.map((_, k) => <span key={k} className={`w-3 h-3 rounded-full ${k === i ? 'bg-indigo-600' : 'bg-slate-300'}`} />)}</div>
      {last && (
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4">
          <p className="font-bold text-xl">📌 {RULE}</p>
          <p className="text-sm text-slate-600">{RULE_SMALL}</p>
          <p className="text-sm text-slate-500">{RULE_EN}</p>
        </div>
      )}
      <div className="flex gap-2">
        {i > 0 && <Btn kind="ghost" onClick={() => setI(i - 1)}>←</Btn>}
        <Btn wide onClick={() => (last ? onDone() : setI(i + 1))}>{last ? `${gWord(gender, 'समझ गया', 'समझ गई')}! अभ्यास करें →` : 'आगे →'}</Btn>
      </div>
    </div>
  )
}

function Reteach({ type, onDone }) {
  const c = RETEACH[type]
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-6 space-y-3 shadow-sm border-4 border-amber-300">
        <p className="text-sm font-bold text-amber-700">💡 चलो इसे फिर से देखें (Let's look at this again)</p>
        <h2 className="text-2xl font-bold flex items-center gap-2">{c.title} <Speaker text={`${c.title} ${c.body} ${c.examples.join(', ')}`} /></h2>
        <p className="text-sm text-slate-500">{c.en}</p>
        <p className="text-lg">{c.body}</p>
        <ul className="grid grid-cols-2 gap-2">{c.examples.map(e => <li key={e} className="bg-amber-50 rounded-xl p-2 text-lg">{e}</li>)}</ul>
        <p className="bg-indigo-50 rounded-xl p-3 font-semibold">🪄 {c.trick}</p>
      </div>
      <Btn wide onClick={onDone}>एक और सवाल करके देखो →</Btn>
    </div>
  )
}

function Done({ me, home }) {
  const firstTry = me.log.filter(l => l.attempt === 1 && (l.type === 'ok' || l.type === 'dialect')).length
  const tasks = new Set(me.log.map(l => l.step)).size
  return (
    <div className="space-y-4 text-center pt-2">
      <div className="text-6xl">🎉</div>
      <h2 className="text-3xl font-bold">बहुत बढ़िया, {me.name}!</h2>
      <p className="text-lg">⭐ {me.stars} तारे · ⏱ {fmt(me.elapsed)} मिनट · पहली बार में सही: {firstTry}/{tasks}</p>
      <div className="bg-white rounded-2xl p-4 text-left space-y-2">
        <h3 className="font-bold">📌 आज हमने सीखा</h3>
        <p>{RULE}</p>
        {me.diagnosed.includes('M1') && <p>💧 पानी, दही जैसे -ई वाले कुछ शब्द पुल्लिंग हैं।</p>}
        {me.diagnosed.includes('M2') && <p>📕 किताब, बस जैसी चीज़ें स्त्रीलिंग हैं।</p>}
        <p className="text-sm text-slate-500">तरकीब: "मेरा" या "मेरी" लगाकर बोलो!</p>
      </div>
      <Btn wide onClick={home}>🏠 वापस जाओ</Btn>
    </div>
  )
}

function About({ back }) {
  return (
    <div className="space-y-4 pt-2">
      <h1 className="text-3xl font-bold">About · मेरा या मेरी?</h1>
      <div className="bg-white rounded-2xl p-4 space-y-2 text-sm">
        <p><b>Identity token:</b> 23B2215 · ET 617 End-Semester Exam, 18 Nov 2026</p>
        <p><b>Card:</b> P2 (Contextual language &amp; literacy) · P2-T2 Hindi gender agreement (लिंग) in verbs and adjectives · L2 First-generation learner, NGO after-school centre with shared tablets · C4 10-minute sessions</p>
        <p><b>What it does:</b> a 10-minute practice sequence (explain → 6 tasks in 5 formats → recap) with feedback that diagnoses two misconceptions: M1 "every -ई noun is feminine" and M2 "objects are masculine". A diagnosed misconception triggers a re-teach card and an extra targeted question.</p>
        <p><b>NLP:</b> rule-based Hindi agreement checker (noun-gender lexicon + ending analysis), spelling feedback, Hindi speech recognition and text-to-speech (browser Web Speech API). Dialect forms (हम for मैं) and pronunciation variants (ज़/ज, ड़/ड) are accepted, not marked wrong.</p>
        <p><b>C4:</b> 10-minute timer, auto-save after every step, "stop" button, and per-child profiles so each child on a shared tablet resumes where they left off.</p>
        <p><b>Built with:</b> Vite + React starter, Tailwind CSS, hosted on Vercel. Code written with AI assistance (Claude Code).</p>
        <p className="text-slate-500">Gender words: {G_NAME.m} = masculine, {G_NAME.f} = feminine.</p>
      </div>
      <Btn kind="ghost" onClick={back}>← वापस</Btn>
    </div>
  )
}
