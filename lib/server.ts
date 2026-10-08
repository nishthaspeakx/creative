import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
export class HttpError extends Error {constructor(public status:number,message:string){super(message);}}
export async function access(request?:Request){
 const user=await getChatGPTUser();if(!user)throw new HttpError(401,'Sign in to access your workspace.');
 if(request && !['GET','HEAD'].includes(request.method)){
  const origin=request.headers.get('origin');
  if(origin && origin!==new URL(request.url).origin)throw new HttpError(403,'Cross-origin write rejected.');
  if(request.headers.get('sec-fetch-site')==='cross-site')throw new HttpError(403,'Cross-origin write rejected.');
 }
 if(!env.DB)throw new HttpError(503,'Database is not available.');
 return {user,db:env.DB,bucket:env.BUCKET};
}
export function fail(error:unknown){
 const status=error instanceof HttpError?error.status:400;
 return Response.json({error:error instanceof Error?error.message:'The request could not be completed.'},{status});
}
export async function body(request:Request){
 const text=await request.text();if(text.length>2_000_000)throw new HttpError(413,'Request is too large.');
 try{return JSON.parse(text);}catch{throw new HttpError(400,'Invalid JSON request.');}
}
