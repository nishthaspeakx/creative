import {access,fail,HttpError} from '@/lib/server';
export async function GET(req:Request,{params}:{params:Promise<{key:string}>}){try{
 const {user,db,bucket}=await access();const {key}=await params;
 const media=await db.prepare('SELECT * FROM media WHERE key=? AND user_id=?').bind(key,user.userId).first<{name:string;mime:string;size:number}>();
 if(!media||!bucket)throw new HttpError(404,'Video not found.');
 const object=await bucket.get(key,{range:req.headers});if(!object)throw new HttpError(404,'Video not found.');
 const download=new URL(req.url).searchParams.has('download');
 const headers=new Headers({'Content-Type':media.mime,'Cache-Control':'private, no-store','Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff','Content-Disposition':`${download?'attachment':'inline'}; filename*=UTF-8''${encodeURIComponent(media.name)}`});
 let status=200;
 if(req.headers.has('range')&&object.range&&'offset' in object.range){const offset=object.range.offset??0;const length=object.range.length??(media.size-offset);headers.set('Content-Range',`bytes ${offset}-${offset+length-1}/${media.size}`);headers.set('Content-Length',String(length));status=206;}else headers.set('Content-Length',String(object.size));
 return new Response(object.body,{status,headers});
}catch(e){return fail(e);}}
