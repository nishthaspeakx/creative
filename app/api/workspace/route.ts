import {access,fail,body,HttpError} from '@/lib/server';
import catalog from '@/lib/catalog.json';
import {competitorAds} from '@/lib/seeds';
export async function GET(){try{
 const {user,db}=await access();
 const [c,p,a]=await Promise.all([
 db.prepare('SELECT payload,revision FROM creatives WHERE user_id=? ORDER BY updated_at DESC').bind(user.userId).all<{payload:string;revision:number}>(),
 db.prepare('SELECT payload FROM performance WHERE user_id=?').bind(user.userId).all<{payload:string}>(),
 db.prepare('SELECT ad_id,persona_id FROM annotations WHERE user_id=?').bind(user.userId).all<{ad_id:string;persona_id:string}>()]);
 return Response.json({creatives:c.results.map(r=>({...JSON.parse(r.payload),revision:r.revision})),performance:p.results.map(r=>JSON.parse(r.payload)),annotations:Object.fromEntries(a.results.map(r=>[r.ad_id,r.persona_id]))},{headers:{'Cache-Control':'no-store'}});
}catch(e){return fail(e);}}
export async function POST(req:Request){try{
 const {user,db}=await access(req);const {adId,personaId}=await body(req);
 if(!competitorAds.some(a=>a.id===adId)||!(personaId===''||catalog.some(p=>p.id===personaId)))throw new HttpError(400,'Choose a known ad and persona.');
 await db.prepare('INSERT INTO annotations(user_id,ad_id,persona_id) VALUES(?,?,?) ON CONFLICT(user_id,ad_id) DO UPDATE SET persona_id=excluded.persona_id').bind(user.userId,adId,personaId).run();
 return Response.json({ok:true});
}catch(e){return fail(e);}}
