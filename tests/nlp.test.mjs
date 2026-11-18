import { checkAgreement as c } from '../src/nlp.js'
const cases = [['हम स्कूल जा रहे हैं','m','dialect'],['हम रोज स्कूल जाते हैं','f','dialect'],['लड़की जा रही है','f','ok'],['लड़की जा रहा है','f','agreement'],['मैं स्कूल जा रही हूँ','f','ok'],['मैं स्कूल जा रहा हूँ','f','agreement'],['बस आ गई','f','ok'],['बस आ गया','f','M2'],['दीदी खाना बना रही है','f','ok'],['पानी ठंडी है','f','M1'],['पानी ठंडा है','f','ok'],['मेरी किताब बहुत अच्छा है','f','M2'],['बस आई','f','ok'],['लड़की खेल रही है','f','ok'],['मैं रोज़ पैदल स्कूल जाती हूँ','f','ok'],['मैं रोज़ स्कूल जाता हूँ','m','ok']]
let bad=0; for (const [s,g,exp] of cases) { const r=c(s,g); if (r.type!==exp) { bad++; console.log('FAIL',s,g,'got',r.type,'expected',exp) } }
console.log(bad? bad+' failures' : `all ${cases.length} cases pass`)
