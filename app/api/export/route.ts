import {access,fail,HttpError} from '@/lib/server';
export async function POST(req:Request){try{
 await access(req);const raw=await req.text();if(raw.length>6_000_000)throw new HttpError(413,'Export is too large. Narrow your filters.');
 const data=new URLSearchParams(raw);const content=data.get('content')||'';const filename=(data.get('filename')||'speakx-report.csv').replace(/[^a-zA-Z0-9_.-]/g,'_').slice(0,120);
 return new Response(content,{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="${filename}"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
}catch(e){return fail(e);}}
