import { useEffect, useState } from 'react'
import { AVATARS, BASE_PLAN, G_NAME, LEARN, RETEACH, RULE, RULE_EN, RULE_SMALL, TASKS } from './data'
import { SESSION_SECONDS, fmt, newProfile, useStore } from './store'
import Task from './Task'
import { Btn, GenderPick, Speaker } from './ui'

const REMEDIAL = { M1: 'rM1', M2: 'rM2', agreement: 'ragree' }
const AUTO_READ_AFTER = 3 // interaction adaptivity: after 3 taps on 🔊, read every new prompt aloud automatically
const STEP_LABEL = { rM1: '🔁 याद', rM2: '🔁 याद', ragree: '🔁 याद', learn: '📖 समझो', t1: '💧 चुनो', t2: '📕 चुनो', t3: '🗂️ छाँटो', t4: '✏️ ठीक करो', why: '🤔 क्यों?', t5: '🧩 बनाओ', t6: '🎤 बोलो', done: '⭐ पूरा' }
const gWord = (g, m, f) => (g === 'f' ? f : m)
const isOk = l => l.type === 'ok' || l.type === 'dialect'
// Stars reward learning, not just being right: ⭐⭐ right first time, ⭐ right after the hint, none after the model answer.
export const starsFor = log => (log[0] && isOk(log[0]) ? 2 : log[1] && isOk(log[1]) ? 1 : 0)
const OUTCOMES = [
  ['O1', 'लिंग पहचानना', 'Identify noun gender', ['t3', 'rM1', 'rM2']],
  ['O2', 'सही शब्द चुनना/बनाना', 'Choose & produce agreeing forms', ['t1', 't2', 't4', 't5', 't6', 'ragree']],
  ['O3', '"क्यों" समझाना', 'Explain why', ['why']],
]

// Progress chart: every step's status + a bar per learning outcome (current session).
function ProgressChart({ me }) {
  const log = me.log.filter(l => l.session === me.sessions)
  const statusOf = i => {
    if (me.plan[i] === 'done') return i === me.pos && !me.ended ? 'good' : 'todo'
    if (i > me.pos || (i === me.pos && me.plan[i] !== 'done')) return i === me.pos ? 'now' : 'todo'
    const entries = log.filter(l => l.pos === i)
    if (!entries.length) return me.plan[i] === 'learn' || me.plan[i]?.startsWith('reteach') ? 'good' : 'todo'
    return isOk(entries[0]) ? 'good' : 'helped'
  }
  const STYLE = { good: ['bg-emerald-100', '✅'], helped: ['bg-amber-100', '🟡'], now: ['bg-indigo-100 ring-2 ring-indigo-400', '▶'], todo: ['bg-slate-100', '⬜'] }
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <h2 className="font-bold">मेरी प्रगति <span className="text-sm font-normal text-slate-500">(my progress)</span></h2>
      <ol className="grid grid-cols-4 gap-2 text-center text-xs">
        {me.plan.map((s, i) => [s, i]).filter(([s]) => STEP_LABEL[s]).map(([s, i]) => {
          const [cls, icon] = STYLE[statusOf(i)]
          return <li key={i} className={`rounded-xl p-2 ${cls}`}>{icon}<br />{STEP_LABEL[s]}</li>
        })}
      </ol>
      <p className="text-xs text-slate-500">✅ पहली बार में सही · 🟡 मदद से सीखा · ▶ अभी · ⬜ बाकी</p>
      <div className="space-y-2">
        {OUTCOMES.map(([id, hi, en, steps]) => {
          const tried = log.filter(l => steps.includes(l.step) && l.attempt === 1)
          const good = tried.filter(isOk).length
          const pct = tried.length ? Math.round((good / tried.length) * 100) : 0
          return (
            <div key={id}>
              <div className="flex justify-between text-sm"><span><b>{id}</b> {hi} <span className="text-slate-500 text-xs">({en})</span></span><span>{tried.length ? `${good}/${tried.length}` : '—'}</span></div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} /></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function App() {
  const [db, setDb] = useStore()
  const [screen, setScreen] = useState(db.current ? 'home' : 'profiles')
  const me = db.profiles.find(p => p.id === db.current)
  const update = fn => setDb(d => ({ ...d, profiles: d.profiles.map(p => (p.id === d.current ? fn(p) : p)) }))
  useEffect(() => { document.documentElement.classList.toggle('dark', !!db.dark) }, [db.dark])

  let body
  if (screen === 'about') body = <About back={() => setScreen(me ? 'home' : 'profiles')} />
  else if (!me || screen === 'profiles') body = <Profiles db={db} setDb={setDb} go={() => setScreen('home')} />
  else if (screen === 'home') body = <Home me={me} start={() => setScreen('session')} switchUser={() => setScreen('profiles')} restart={() => {
    // Profile adaptivity: a returning learner's new session opens with items targeting misconceptions diagnosed last time.
    update(p => ({ ...p, plan: [...p.diagnosed.filter(d => REMEDIAL[d]).map(d => REMEDIAL[d]), ...BASE_PLAN], pos: 0, elapsed: 0, ended: false, sessions: p.sessions + 1 }))
    setScreen('session')
  }} />
  else body = <Session me={me} update={update} stop={() => setScreen('home')} />

  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-4">{body}</main>
      <footer className="text-center text-xs text-slate-500 py-3 border-t border-amber-200">
        मेरा या मेरी? · ET 617 · <b>23B2215</b> · <button className="underline" onClick={() => setScreen('about')}>About</button>
        {' · '}<button className="underline" onClick={() => setDb(d => ({ ...d, dark: !d.dark }))} aria-label="Toggle dark mode">{db.dark ? '☀️ लाइट' : '🌙 डार्क'}</button>
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
          <GenderPick gender={gender} setGender={setGender} />
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
  const finished = step === 'done'
  const resuming = me.pos > 0 && !finished
  return (
    <div className="space-y-5 pt-4">
      <div className="text-center">
        <div className="text-6xl">{me.avatar}</div>
        <h1 className="text-3xl font-bold">नमस्ते, {me.name}!</h1>
        <p className="text-slate-600">⭐ {me.stars} तारे · ⏱ {fmt(me.elapsed)} / 10:00</p>
      </div>
      <ProgressChart me={me} />
      <p className="text-xs text-center text-slate-500">⭐⭐ पहली बार में सही · ⭐ हिंट के बाद सही (stars: 2 = right first time, 1 = right after a hint)</p>
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
  const [ending, setEnding] = useState(false)
  const step = me.plan[me.pos]
  const over = me.elapsed >= SESSION_SECONDS

  // C4: count time spent in the session; saved every second so a closed tab resumes correctly.
  useEffect(() => {
    if (step === 'done') return
    const t = setInterval(() => update(p => ({ ...p, elapsed: p.elapsed + 1 })), 1000)
    return () => clearInterval(t)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  // Interaction log: count taps on 🔊 (used to switch on auto-read for learners who rely on listening)
  useEffect(() => {
    const onTap = () => update(p => ({ ...p, listenTaps: (p.listenTaps || 0) + 1 }))
    window.addEventListener('listen-tap', onTap)
    return () => window.removeEventListener('listen-tap', onTap)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const autoRead = (me.listenTaps || 0) >= AUTO_READ_AFTER
  const warmUp = me.pos < me.plan.indexOf('learn')

  const next = () => update(p => ({ ...p, pos: Math.min(p.pos + 1, p.plan.length - 1) }))

  // Adaptivity: a diagnosed misconception inserts a re-teach card + an easier targeted item next.
  function taskDone({ firstTry, diagnosed, log }) {
    update(p => {
      const plan = [...p.plan]
      const rem = REMEDIAL[diagnosed]
      if (diagnosed && rem && !plan.includes(`reteach:${diagnosed}`)) plan.splice(p.pos + 1, 0, `reteach:${diagnosed}`, rem)
      return { ...p, plan, pos: p.pos + 1, stars: p.stars + starsFor(log), log: [...p.log, ...log.map(l => ({ ...l, session: p.sessions, pos: p.pos }))], diagnosed: diagnosed && !p.diagnosed.includes(diagnosed) ? [...p.diagnosed, diagnosed] : p.diagnosed }
    })
  }

  const progress = (me.pos / (me.plan.length - 1)) * 100
  let content
  if (step === 'learn') content = <Learn gender={me.gender} onDone={next} />
  else if (step?.startsWith('reteach:')) content = <Reteach type={step.split(':')[1]} gender={me.gender} onDone={next} />
  else if (step === 'done') content = <Done me={me} home={stop} />
  else content = (
    <>
      {warmUp && <p className="bg-sky-50 border-2 border-sky-300 rounded-xl p-3 text-sm">🔁 <b>पिछली बार की याद:</b> पिछली बार यह थोड़ा मुश्किल लगा था — चलो पहले इसे देखें। <span className="text-slate-500">(Warm-up based on last session's misconception.)</span></p>}
      <Task key={me.pos} id={step} task={TASKS[step]} profile={me} autoRead={autoRead} onDone={taskDone}
        setGender={g => update(p => ({ ...p, gender: g }))} />
    </>
  )

  return (
    <div className="space-y-4">
      {step !== 'done' && (
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-2xl">{me.avatar}</span>
            <span className={`font-mono px-2 py-1 rounded-lg ${over ? 'bg-rose-100 text-rose-700' : 'bg-white'}`}>⏱ {fmt(me.elapsed)} / 10:00</span>
            <span className="text-slate-500">कदम {me.pos + 1}/{me.plan.length - 1}</span>
            {autoRead && <span className="text-xs bg-amber-100 rounded-lg px-2 py-1" title="Auto-read is on because you often tap 🔊">🔊 अपने-आप</span>}
            <button onClick={stop} className="ml-auto px-3 py-2 rounded-xl bg-white border-2 border-slate-200 font-semibold" title="Pause — continue later from here">⏸ रुको</button>
            <button onClick={() => setEnding(true)} className="px-3 py-2 rounded-xl bg-white border-2 border-rose-200 text-rose-700 font-semibold" title="End today's session">⏹ खत्म</button>
          </div>
          {ending && (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 space-y-2">
              <p className="font-semibold">क्या आज का खेल यहीं खत्म करें? <span className="text-sm font-normal text-slate-500">(End today's session? You'll see what you finished. "⏸ रुको" instead lets you continue later.)</span></p>
              <div className="flex gap-2">
                <Btn onClick={() => { setEnding(false); update(p => ({ ...p, pos: p.plan.length - 1, ended: true })) }} className="bg-rose-600! shadow-none">हाँ, खत्म करो</Btn>
                <Btn kind="ghost" onClick={() => setEnding(false)}>नहीं, जारी रखो</Btn>
              </div>
            </div>
          )}
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
  const log = me.log.filter(l => l.session === me.sessions)
  const firstTry = log.filter(l => l.attempt === 1 && isOk(l)).length
  const tasks = log.filter(l => l.attempt === 1).length
  return (
    <div className="space-y-4 text-center pt-2">
      <div className="text-6xl">{me.ended ? '👋' : '🎉'}</div>
      <h2 className="text-3xl font-bold">{me.ended ? `आज इतना किया, ${me.name}!` : `बहुत बढ़िया, ${me.name}!`}</h2>
      <p className="text-lg">⭐ {me.stars} तारे · ⏱ {fmt(me.elapsed)} मिनट · पहली बार में सही: {firstTry}/{tasks}</p>
      <div className="text-left"><ProgressChart me={me} /></div>
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
        <p><b>What it does:</b> a 10-minute practice sequence (explain → 7 tasks in 6 formats → recap) with feedback that diagnoses two misconceptions: M1 "every -ई noun is feminine" and M2 "objects are masculine". Feedback is a hint first, then an explanation with the model answer.</p>
        <p><b>Adaptivity:</b> performance (a diagnosed misconception inserts a re-teach card + targeted question), profile (a returning learner starts with last session's misconception; gender sets मैं-forms), interaction (after 3 taps on 🔊, every prompt is read aloud automatically).</p>
        <p><b>NLP:</b> rule-based Hindi agreement checker (noun-gender lexicon + ending analysis), spelling feedback, Hindi speech recognition and text-to-speech (browser Web Speech API). Dialect forms (हम for मैं) and pronunciation variants (ज़/ज, ड़/ड) are accepted, not marked wrong.</p>
        <p><b>C4:</b> 10-minute timer, auto-save after every step, "stop" button, and per-child profiles so each child on a shared tablet resumes where they left off.</p>
        <p><b>Built with:</b> Vite + React starter, Tailwind CSS, hosted on Vercel. Code written with AI assistance (Claude Code).</p>
        <p className="text-slate-500">Gender words: {G_NAME.m} = masculine, {G_NAME.f} = feminine.</p>
      </div>
      <Btn kind="ghost" onClick={back}>← वापस</Btn>
    </div>
  )
}
