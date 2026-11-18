// Browser speech: text-to-speech (output) and speech recognition (input), both in Hindi (hi-IN).
// Both are optional: the app always offers a tap/typed fallback when the browser lacks support.

export function speak(text) {
  try {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'hi-IN'
    u.rate = 0.85 // slower for early readers
    const v = window.speechSynthesis.getVoices().find(v => v.lang?.startsWith('hi'))
    if (v) u.voice = v
    window.speechSynthesis.speak(u)
  } catch { /* speech not available */ }
}

const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
export const canListen = !!SR

export function listen({ onResult, onError, onEnd }) {
  if (!SR) { onError?.('unsupported'); return () => {} }
  const r = new SR()
  r.lang = 'hi-IN'
  r.interimResults = false
  r.maxAlternatives = 1
  r.onresult = e => onResult(e.results[0][0].transcript)
  r.onerror = e => onError?.(e.error)
  r.onend = () => onEnd?.()
  r.start()
  return () => r.stop()
}
