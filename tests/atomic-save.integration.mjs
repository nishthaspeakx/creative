import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const base='http://127.0.0.1:5173';
const login=await fetch(base+'/signin-with-chatgpt?return_to=/',{redirect:'manual'});
const cookie=login.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
const sql=(command)=>execFileSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state','--command',command],{stdio:'pipe'});
const name='Atomic rollback QA '+Date.now();
sql("CREATE TRIGGER qa_reject_audit BEFORE INSERT ON audit WHEN json_extract(NEW.payload,'$.name') LIKE 'Atomic rollback QA %' BEGIN SELECT RAISE(ABORT,'QA audit failure'); END");
try{
 const response=await fetch(base+'/api/creatives',{method:'POST',headers:{Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify({name,personaId:'DEMO_P1',status:'Draft',language:'English',production:'In-house UGC',origin:'New idea'})});
 assert.equal(response.ok,false);
 const state=await (await fetch(base+'/api/workspace',{headers:{Cookie:cookie}})).json();
 assert.equal(state.creatives.some(c=>c.name===name),false,'A failed audit must roll back the creative');
 console.log('PASS: injected audit failure rolls back creative save.');
}finally{sql('DROP TRIGGER qa_reject_audit')}
