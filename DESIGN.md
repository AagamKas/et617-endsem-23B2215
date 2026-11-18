# DESIGN.md — ET 617 End-Sem · 23B2215

## Exam card
| Field | Choice |
|---|---|
| P | **P2 – Contextual language and literacy application** (NLP · Language learning · Localisation) |
| T | **P2-T2 – Hindi: gender agreement (लिंग) in verbs and adjectives** |
| L | **L2 – First-generation learner, urban low-income settlement, NGO after-school centre with shared tablets** |
| C | **C4 – 10-minute sessions** (one complete sequence in ≤10 min; stop and resume) |
| ID | **23B2215** |

Working title: **"लिंग मेला" (Ling Mela)**, a short Hindi gender-agreement practice app.

## D1 – Educational problem
Children in Hindi-medium schools in urban settlements often speak a regional variety at home (e.g. Bhojpuri/Magahi-influenced Hindi) and get no one-to-one feedback on written and spoken Hindi grammar. Gender agreement (लिंग) is a frequent source of errors: the verb and adjective must change to match the noun's gender (*लड़का अच्छा **है** / लड़की अच्छी **है***, *बस आ**ई** / ट्रक आ**या***). Teachers at NGO centres cannot correct every child, and the children get only short turns on shared tablets. Our app gives a 10-minute, self-paced, feedback-rich practice sequence that resumes where each child stopped.

**Learning outcomes:** by the end of a session the learner can:
1. **Identify** the grammatical gender of common Hindi nouns, including ones that break the "-आ = masculine, -ई = feminine" pattern (पानी, दही, किताब, बात).
2. **Choose and produce** the correct verb and adjective form (-आ/-ई, -ता/-ती, -या/-ई) to match a noun in a sentence, in writing and in speech.
3. **Explain** why a sentence is wrong by pointing to the noun whose gender controls the agreement.

**Context of use:** NGO after-school centre in a Delhi resettlement colony, 4–6 PM. Each child gets about 10 minutes on a shared Android tablet (Chrome) while others wait, with a volunteer teacher nearby.

## D2 – Learner persona: Rani Kumari
**Who she is**
- **Age / class:** 11, Class 6, government Hindi-medium school, Sangam Vihar, South Delhi.
- **Family:** first-generation learner. Parents migrated from Siwan, Bihar, 8 years ago: father a daily-wage construction worker, mother a domestic worker; both read only a little. A younger brother (7). No storybooks or newspapers at home.
- **Where she learns:** NGO after-school centre in her lane, 4–6 PM. About 25 children share 5 Android tablets; a volunteer **"didi"** runs 10-minute turns while the others do worksheets.

**Language**
- **Home:** Bhojpuri-influenced Hindi. Says *"हम जा रहे हैं"* for "I am going". In this variety girls also use the -ते form with हम (*"हम जाते हैं"*), so this is a dialect feature, **not** a gender error. In speech she drops the nukta (*जरूर*, *रोज*).
- **School:** standard Hindi medium; teachers mark written gender errors in red without explaining them.
- **Why gender agreement is hard for her:** Bhojpuri verbs carry much less gender marking than Hindi verbs, so at home she rarely hears a verb change because of the noun. She learned "लड़का → -आ, लड़की → -ई" through people; for everything else she guesses.
- **Reading:** decodes Devanagari slowly, syllable by syllable; understands far better when she hears the text.

**Prior knowledge (prerequisites)**
- ✅ Knows all letters and matras (ा, ी, ि, े); reads and writes short sentences slowly.
- ✅ Knows everyday nouns (पानी, किताब, बस, रोटी, दीदी) and uses मेरा/मेरी correctly for *people*.
- ✅ Has heard the words पुल्लिंग / स्त्रीलिंग at school but cannot explain them.
- ❌ Never taught that adjectives *and* verbs agree with the noun, or that objects have grammatical gender.
- ❌ Confuses short इ and long ई matras when writing (*आइ* for *आई*).

**Two likely misconceptions**
| | Misconception | Typical error | Why she holds it |
|---|---|---|---|
| **M1** | Every **-ई** word is feminine and every **-आ** word is masculine | *पानी ठंडी है*, *दही खट्टी है* | Overgeneralises the लड़का/लड़की pattern to word endings |
| **M2** | **Objects** are masculine unless obviously female | *किताब अच्छा है*, *बस आया* | Learned gender only through people; defaults to masculine for things |

**Device and time**
- Shared 8-inch Android tablet (Chrome) at the centre; patchy Wi-Fi.
- Noisy room, **no headphones**: audio must be optional (tap-to-play) and speech recognition may fail, so a tap/typed fallback is always needed.
- About **10 minutes per turn, 3–4 days a week**. She may be stopped mid-way when the didi calls the next child, so she must **resume exactly where she stopped**, even if another child used the tablet in between.

**Motivation and feelings**
- Wants to write "proper Hindi like didi" and stop getting red marks.
- Loves stars and praise; **embarrassed by public correction**, so feedback must be private and kind, hint first so she can catch her own mistake.
- Prefers speaking to writing; confident when talking.

**Context of the content:** all examples use objects from Rani's day: the school bus, roti, chai, the water tank (पानी), दही, her दीदी and बहन.

**What this means for the design**
| Persona fact | Design response |
|---|---|
| Reads slowly, understands by ear | 🔊 on every prompt and feedback; short sentences; pictures |
| Noisy room, shared device | Optional audio; typed/tap fallback for speech; per-child profiles |
| 10-minute turns that get interrupted | Timer, auto-save each step, "⏸ अभी रुको", resume at the same step |
| Embarrassed by correction | Hint first (self-correction), full explanation second, no harsh "wrong" |
| Dialect at home | "हम" + -ते and nukta-less speech **accepted**; only gender errors corrected |
| Knows मेरा/मेरी for people | "मेरा या मेरी?" trick to test any noun's gender (the app's name) |

## D3 – Content plan (one complete learning activity, ≤10 min)
1. **Warm-up (1 min):** pick or create your profile on the shared tablet. If you're a returning learner, "Continue where you left off".
2. **Explain (2 min):** "मेरा / मेरी" with picture pairs (लड़का–लड़की, घोड़ा–घोड़ी) → the noun decides the ending of its adjective and verb. Spoken aloud (text-to-speech) for low-reading learners. Highlighted endings: **-आ** (blue) / **-ई** (pink).
3. **Practise (5–6 min), 6 tasks in 4 formats:**
   - T1 MCQ: *"पानी ___ है"*: ठंडा / ठंडी (targets M1)
   - T2 MCQ: *"किताब ___ है"*: अच्छा / अच्छी (targets M2)
   - T3 Sort: drag/tap nouns into पुल्लिंग / स्त्रीलिंग (पानी, किताब, घोड़ा, बस, दही, नदी)
   - T4 Fix the sentence (typed, with spelling feedback): *"बस आया"* → *"बस आई"*
   - T5 Build a sentence from word tiles: (लड़की / खेल रही / है)
   - T6 Speak it (speech recognition, hi-IN): say *"मेरी बहन स्कूल जाती है"*
4. **Wrap-up (1 min):** stars, a recap of the rule, and what's next time.

**Feedback:** correct → praise plus the reason; M1-type error → "Not every -ई word is feminine! पानी is masculine, so we say ठंडा पानी"; M2-type error → "Objects have gender too: किताब is feminine, so अच्छी किताब". Two wrong answers in a row → re-teach card + an easier item (adaptivity).

## Design challenge (P2): error vs acceptable variation
The agreement checker only judges **gender agreement between noun and verb/adjective**. It does not penalise:
- **Dialect variation (accepted):** *"हम स्कूल जाते हैं"* used for "I" (Bhojpuri-influenced singular हम). The app accepts it with a note: "बिल्कुल ठीक! (Some people say मैं, some say हम, and both are fine.)"
- **Pronunciation variation (accepted):** speech input *"जरूर"* for *"ज़रूर"* (nukta dropped), or ड़/ड. Recognised text is normalised before checking.
- **Language error (corrected):** *"मेरी भाई"*, *"पानी ठंडी है"*: a real agreement error, with feedback.

## C4 – 10-minute sessions
Visible session timer/progress bar (10 min budget), 6 short steps, an auto-save after every step, and a "Stop for now" button. Per-child profiles on the shared tablet so each child resumes their own position.

## Planned NLP / AI
- Rule-based Hindi agreement checker (noun-gender lexicon + ending analysis) as the primary, reliable checker.
- Browser speech recognition (Web Speech API, hi-IN) + text-to-speech for spoken items.
- Optional LLM for contextual sentence generation/explanations, with lexicon validation and a recorded fallback (details in report D6).

## Tech
Vite + React + Tailwind CSS (starter: `npm create vite`, template `react`). Hosted on Vercel at et617-23b2215.vercel.app. Progress stored per profile in localStorage.
