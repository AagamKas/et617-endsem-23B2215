import { useState } from 'react'

export default function App() {
  const [screen, setScreen] = useState('home')
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-xl w-full mx-auto p-4">
        {screen === 'home' ? (
          <div className="text-center space-y-4 pt-16">
            <h1 className="text-4xl font-bold">मेरा या मेरी?</h1>
            <p>हिंदी में लिंग का खेल — coming soon</p>
            <button onClick={() => setScreen('about')} className="underline">About</button>
          </div>
        ) : (
          <div className="space-y-2 pt-16">
            <h2 className="text-2xl font-bold">About</h2>
            <p>ET 617 End-Semester Exam · Roll no. 23B2215</p>
            <button onClick={() => setScreen('home')} className="underline">Back</button>
          </div>
        )}
      </main>
      <footer className="text-center text-xs text-slate-500 py-3">ET 617 · 23B2215</footer>
    </div>
  )
}
