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

## D3 – Content plan: one complete 10-minute sequence
| # | Step | Format | Targets | ~Time |
|---|---|---|---|---|
| 0 | Pick your profile on the shared tablet (or resume) | Tap | C4, L2 | 0:20 |
| 0b | Returning learner only: warm-up item on last session's misconception | MCQ | Adaptivity (profile) | 0:20 |
| 1 | **Explain:** 3 picture cards (लड़का/लड़की, घोड़ा/बस, पानी/किताब), endings highlighted **-आ** blue / **-ई** pink, 🔊 read-aloud. Rule: *"जिसकी बात हो रही है, उसी से शब्द का अंत बदलता है।"* | Explanation | O1, O2 | 2:00 |
| 2 | *पानी ___ है।* ठंडा / ठंडी | MCQ | **M1** | 0:30 |
| 3 | *मेरी किताब बहुत ___ है।* अच्छा / अच्छी | MCQ | **M2** | 0:30 |
| 4 | Sort पानी, किताब, घोड़ा, बस, दही, नदी → पुल्लिंग / स्त्रीलिंग | Sorting | O1, M1+M2 | 1:00 |
| 5 | Fix *"बस आया"* → *"बस आई"* | Typed + spelling feedback (आइ → आई) | O2, M2 | 1:00 |
| 6 | **क्यों?** Why did we write *बस आई*? (a) बस स्त्रीलिंग है — "मेरी बस" ✓ (b) लिखने वाली लड़की है ✗ (c) "आई" ज़्यादा सुंदर है ✗ | Reasoning choice | **O3** | 0:30 |
| 7 | Build *लड़की खेल रही है* from tiles (distractor: रहा) | Word tiles | O2 | 0:45 |
| 8 | Speak: *"तुम रोज़ स्कूल कैसे जाती हो?"* | Speech in + speech out | O2, design challenge | 1:00 |
| + | Re-teach card + targeted item, only if M1 / M2 / agreement error diagnosed (max 2 extra) | — | Adaptivity (performance) | 0–1:30 |
| 9 | Recap: stars, today's rule, the "मेरा/मेरी" trick | Summary | — | 0:30 |
| | **Total: 7 tasks, 6 formats** | | | **≈ 8–9.5 min** |

**Model answers:** ठंडा · अच्छी · पुल्लिंग: पानी, घोड़ा, दही / स्त्रीलिंग: किताब, बस, नदी · बस आई। · (a) · लड़की खेल रही है · मैं रोज़ स्कूल जाती हूँ।

**Feedback (two levels: hint first, so the learner can find her own error; then explanation + model answer):**
- **Correct:** *शाबाश! ✓ "पानी" पुल्लिंग है, इसलिए यही सही है।*
- **M1 hint:** *"पानी" के अंत में -ई है… पर क्या हर -ई वाला शब्द स्त्रीलिंग होता है? बोलकर देखो: "मेरा पानी" या "मेरी पानी"?* → **M1 explanation:** *"पानी" के अंत में -ई है, पर यह पुल्लिंग है! इसलिए "ठंडा" आएगा, "ठंडी" नहीं।*
- **M2 hint:** *क्या चीज़ें हमेशा पुल्लिंग होती हैं? बोलकर देखो: "मेरा किताब" या "मेरी किताब"?* → **M2 explanation:** *चीज़ों का भी लिंग होता है! "किताब" स्त्रीलिंग है (मेरी किताब)। इसलिए "अच्छी" आएगा।*
- After an M1/M2 diagnosis → re-teach card (*"हर -ई वाला शब्द स्त्रीलिंग नहीं होता!"* / *"चीज़ों का भी लिंग होता है!"*) + targeted item (*दही ___ है* / *सड़क बहुत ___ है*).

## Adaptivity rules
- **Performance:** 1st wrong → hint (no answer); 2nd wrong → explanation + model answer; diagnosed misconception → re-teach card + targeted item inserted next (once per misconception).
- **Profile:** learner gender sets the expected मैं-forms (जाती/जाता); a returning learner's next session opens with items for previously diagnosed misconceptions.
- **Interaction:** taps on 🔊 are logged; after 3 taps every new prompt is read aloud automatically.

## Design challenge (P2): error vs acceptable variation — three different responses
The checker only judges **gender agreement between the noun and its adjective/verb/possessive**.
- **Language error → corrected:** *"पानी ठंडी है"*, *"बस आया"*, *"मैं स्कूल जाता हूँ"* (girl) → hint → explanation → retry.
- **Dialect variation → accepted and bridged:** *"हम रोज स्कूल जाते हैं"* (Bhojpuri-influenced हम for "I"; girls also use -ते) → ✓ with no lost stars, plus a blue tip, not an error: *"स्कूल की हिंदी में, अगर सिर्फ़ अपनी बात हो: मैं रोज स्कूल जाती हूँ।"* (Worded "if you mean only yourself" because हम also means "we".)
- **Pronunciation variation → accepted:** *रोज / रोज़*, *जरूर / ज़रूर*, *लडकी / लड़की*. Text is normalised (nukta removed) before checking, with the note "दोनों ठीक हैं".

## C4 – 10-minute sessions (visible in the app)
⏱ timer "x:xx / 10:00" and progress bar on every task screen; 7 short tasks fitting in ≈ 9 minutes; auto-save every second and after every step; "⏸ अभी रुको" stop button; "▶ जहाँ छोड़ा था, वहीं से" resume; per-child profiles so each child on the shared tablet resumes their own position; a gentle "10 मिनट पूरे" notice at 10:00.

## NLP / AI features
- **Rule-based Hindi agreement checker** (`src/nlp.js`): normalisation → subject detection with a noun-gender lexicon → ending analysis of agreeing words → classification (ok / dialect / M1 / M2 / agreement). Regression tests in `tests/nlp.test.mjs`.
- **Spelling feedback** for the इ/ई matra (आइ → आई).
- **Speech recognition** (browser Web Speech API, hi-IN) for the speaking task, with a typed fallback; **text-to-speech** (hi-IN, slowed) for prompts and feedback.
- No LLM is used (no API key available): every judgement is deterministic and explainable, which avoids wrong AI feedback reaching a 11-year-old.

## Tech
Vite + React + Tailwind CSS (starter: `npm create vite`, template `react`). Hosted on Vercel at et617-23b2215.vercel.app. Progress stored per profile in localStorage.
