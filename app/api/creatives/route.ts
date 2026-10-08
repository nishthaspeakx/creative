import {access,fail,body,HttpError} from '@/lib/server';
import {validateCreative} from '@/lib/domain.mjs';
import catalog from '@/lib/catalog.json';
import type {Creative} from '@/lib/types';
export async function POST(req:Request){try{
 const {user,db}=await access(req);const input=await body(req);const data=validateCreative(input,catalog.map(p=>p.id));
 const id=input.id||crypto.randomUUID();if(typeof id!=='string'||id.length>100)throw new HttpError(400,'Invalid creative ID.');
 const old=await db.prepare('SELECT payload,revision FROM creatives WHERE id=? AND user_id=?').bind(id,user.userId).first<{payload:string;revision:number}>();
 if(input.id&&!old)throw new HttpError(404,'Creative not found.');
 if(old&&input.revision!==old.revision)throw new HttpError(409,'This creative changed in another tab. Reload before saving.');
 if(data.adId){const duplicate=await db.prepare("SELECT id FROM creatives WHERE user_id=? AND id<>? AND json_extract(payload,'$.adId')=?").bind(user.userId,id,data.adId).first();if(duplicate)throw new HttpError(409,'This Meta ad is already linked to another creative. Edit that creative or use a different ad ID.');}
 if(data.mediaKey){const m=await db.prepare('SELECT key FROM media WHERE key=? AND user_id=?').bind(data.mediaKey,user.userId).first();if(!m)throw new HttpError(400,'Upload a video owned by this workspace.');}
 if(['Approved','Live'].includes(String(data.status))&&!data.mediaKey)throw new HttpError(400,'Upload a video before approving or launching this creative.');
 const previous=old?JSON.parse(old.payload) as Creative:null;const now=new Date().toISOString();
 const record={...data,id,revision:(old?.revision||0)+1,version:previous?(previous.mediaKey!==data.mediaKey?previous.version+1:previous.version):1,createdAt:previous?.createdAt||now,updatedAt:now,everUsed:previous?.everUsed||data.status==='Live'};
 const mutation=old?db.prepare('UPDATE creatives SET payload=?,revision=?,updated_at=?,ad_id=? WHERE id=? AND user_id=? AND revision=?').bind(JSON.stringify(record),record.revision,now,data.adId||null,id,user.userId,old.revision):db.prepare('INSERT INTO creatives(id,user_id,payload,revision,updated_at,ad_id) VALUES(?,?,?,?,?,?)').bind(id,user.userId,JSON.stringify(record),1,now,data.adId||null);
 const results=await db.batch([mutation,db.prepare('INSERT INTO audit(id,user_id,entity,action,at,payload) SELECT ?,?,?,?,?,? WHERE changes()=1').bind(crypto.randomUUID(),user.userId,id,old?'updated':'created',now,JSON.stringify(record))]);
 if(results[0].meta.changes!==1)throw new HttpError(409,'Save conflict. Reload before saving.');
 return Response.json(record);
}catch(e){return fail(e);}}
