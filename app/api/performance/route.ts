import {access,fail,body,HttpError} from '@/lib/server';
import {validatePerformance} from '@/lib/domain.mjs';
export async function POST(req:Request){try{
 const {user,db}=await access(req);const input=await body(req);const rows=validatePerformance(input.rows);
 const account=String(input.account||'').trim(),basis=String(input.basis||'').trim();
 if(!account||!basis||account.length>100||basis.length>200)throw new HttpError(400,'Enter the account and attribution basis for this import.');
 const statements=rows.map(r=>db.prepare('INSERT INTO performance(user_id,key,payload) VALUES(?,?,?) ON CONFLICT(user_id,key) DO UPDATE SET payload=excluded.payload').bind(user.userId,JSON.stringify([account,basis,r.date,r.ad_id]),JSON.stringify({...r,account,basis})));
 await db.batch(statements);return Response.json({imported:rows.length});
}catch(e){return fail(e);}}
