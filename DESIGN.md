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

## D2 – Learner persona
- **Name / age:** Rani Kumari, 11, Class 6, government Hindi-medium school, Sangam Vihar (Delhi).
- **Background:** first-generation learner; parents migrated from Bihar (father a construction worker, mother a domestic worker). No books at home.
- **Language:** speaks Bhojpuri-influenced Hindi at home (says *"हम जा रहे हैं"* for "I am going"). Reads Devanagari slowly; prefers listening.
- **Prior knowledge:** knows Devanagari letters and matras, can read short sentences, knows nouns for everyday things. Has not been explicitly taught that the verb and adjective agree with the noun.
- **Misconception M1, ending-rule overgeneralisation:** believes every noun ending in **-ई is feminine** and every noun ending in **-आ is masculine**, so writes *"पानी ठंडी है"* (should be ठंडा, since पानी is masculine).
- **Misconception M2, inanimate nouns default to masculine:** treats objects as masculine unless they "look" feminine, so writes *"किताब अच्छा है"* or *"बस आया"* (किताब and बस are feminine).
- **Device / time:** shared Android tablet at the centre; about 10 minutes per turn, 3–4 days a week; patchy Wi-Fi.
- **Motivation:** wants to read and write "proper" Hindi like her teacher; enjoys stars and praise; embarrassed by public correction, so private, kind feedback matters.

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
