import {access,fail,HttpError} from '@/lib/server';
export async function POST(req:Request){try{
 const {user,db,bucket}=await access(req);if(!bucket)throw new HttpError(503,'Video storage is unavailable.');
 const max=25*1024*1024;if(Number(req.headers.get('content-length'))>max+100000)throw new HttpError(413,'Use a video smaller than 25 MB.');
 const data=await req.formData();const file=data.get('file');if(!(file instanceof File))throw new HttpError(400,'Select a video file.');
 if(!file.size||file.size>max)throw new HttpError(400,'Use a non-empty video smaller than 25 MB.');
 if(!['video/mp4','video/webm','video/quicktime'].includes(file.type))throw new HttpError(400,'Use MP4, WebM or MOV video.');
 const bytes=new Uint8Array(await file.slice(0,32).arrayBuffer());
 const iso=String.fromCharCode(...bytes.slice(4,8))==='ftyp',webm=bytes[0]===0x1a&&bytes[1]===0x45&&bytes[2]===0xdf&&bytes[3]===0xa3;
 if((file.type==='video/webm'&&!webm)||(file.type!=='video/webm'&&!iso))throw new HttpError(400,'The file contents do not match the video format.');
 const key=crypto.randomUUID();const name=file.name.replace(/[\r\n"\\/]/g,'_').slice(0,200);
 await bucket.put(key,file.stream(),{httpMetadata:{contentType:file.type}});
 await db.prepare('INSERT INTO media(key,user_id,name,mime,size) VALUES(?,?,?,?,?)').bind(key,user.userId,name,file.type,file.size).run();
 return Response.json({mediaKey:key,fileName:name,mimeType:file.type,size:file.size});
}catch(e){return fail(e);}}
