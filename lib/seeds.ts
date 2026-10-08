import type {CompetitorAd} from './types';
export const brands=[
 {name:'Supernova',initials:'S',color:'#7658b4',category:'India · AI speaking',url:'https://www.getsupernova.ai/'},
 {name:'MySivi',initials:'my',color:'#ee7048',category:'India · AI + peer practice',url:'https://www.mysivi.ai/'},
 {name:'Duolingo',initials:'D',color:'#68a626',category:'Global · Language learning',url:'https://www.duolingo.com/'},
 {name:'Speak.com',initials:'s',color:'#2574d8',category:'Global · AI conversation',url:'https://www.speak.com/'},
 {name:'ELSA',initials:'E',color:'#2a9cb7',category:'Global · Pronunciation + AI',url:'https://elsaspeak.com/'},
 {name:'Stimuler',initials:'St',color:'#bd5790',category:'India · AI speaking',url:'https://stimuler.tech/'},
 {name:'Praktika',initials:'P',color:'#8259cc',category:'Global · AI avatars',url:'https://praktika.ai/'},
 {name:'Clapingo',initials:'C',color:'#168f83',category:'India · Human tutors',url:'https://clapingo.com/'},
 {name:'EngVarta',initials:'Ev',color:'#377cb6',category:'India · Human practice',url:'https://engvarta.com/'},
 {name:'Cambly',initials:'c',color:'#ce9b31',category:'Global · Native tutors',url:'https://www.cambly.com/'}
];
export const competitorAds:CompetitorAd[]=[
 {id:'1373260911320164',brand:'Stimuler',title:'Instant feedback. More speaking.',description:'Public ad copy promotes instant grammar and vocabulary feedback, with AI practice available 24×7. Creative footage has not been transcribed.',started:'2026-06-17',observed:'2026-10-07',seconds:59,destination:'iOS app · 1627501632',format:'Video',language:'Unreviewed',hook:'Instant feedback',personaId:'',status:'Active when observed'},
 {id:'1578357076674269',brand:'Stimuler',title:'AI speaking practice',description:'An observed Android app-install creative, grouped with two ads in the library. Open the original to review the script, language and audience.',started:'2026-09-15',observed:'2026-10-07',seconds:45,destination:'Android · com.stimuler',format:'Video',language:'Unreviewed',hook:'Unreviewed',personaId:'',status:'Active when observed'},
 {id:'1358011079653040',brand:'Supernova',title:'15 minutes for your English',description:'Public copy claims improvement in seven days with 15 minutes of daily practice. This is the advertiser’s claim, not a verified learning outcome.',started:'2026-09-11',observed:'2026-10-07',seconds:84,destination:'Android · live.gosupernova.app',format:'Video',language:'Unreviewed',hook:'Short daily habit',personaId:'',status:'Active when observed'},
 {id:'2280369769468339',brand:'Supernova',title:'A longer speaking-English story',description:'A 165-second video creative linking to the Supernova Android app. Persona, emotion and production method need a human video review.',started:'2026-09-09',observed:'2026-10-07',seconds:165,destination:'Android · live.gosupernova.app',format:'Video',language:'Unreviewed',hook:'Unreviewed',personaId:'',status:'Active when observed'},
 {id:'1083327227503975',brand:'MySivi',title:'Start speaking with a ₹1 trial',description:'Public ad copy promotes a ₹1 trial and shows multiple versions. The observed destination is the MySivi iOS app. Recurring price is not established by this record.',started:'2026-09-02',observed:'2026-10-07',seconds:57,destination:'iOS app · 1644736135',format:'Video',language:'Unreviewed',hook:'Low-entry offer',personaId:'',status:'Active when observed'}
];
// Internal value personas and commercial figures are intentionally excluded.
export const valuePersonas: readonly (readonly [string, number, number])[] = [];
export const languages=['Hindi / Hinglish','English','Tamil','Telugu','Malayalam','Kannada','Bengali','Marathi','Other'];
export const libraryURL=(id:string)=>`https://www.facebook.com/ads/library/?id=${id}`;
export const brandSearch=(name:string)=>`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=IN&q=${encodeURIComponent(name)}&search_type=keyword_unordered`;
