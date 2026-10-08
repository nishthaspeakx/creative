export const statuses = ['Draft','In production','In review','Approved','Live','Paused','Archived'];
export const productions = ['In-house UGC','In-house AI','Agency UGC','Agency AI','Hybrid','Other'];
export const origins = ['New idea','Iteration','Competitor-inspired','Clone'];
export function metrics(rows) {
 const total = key => rows.reduce((s,r)=>s+(Number(r[key])||0),0);
 const complete = key => rows.length>0 && rows.every(r=>r[key]!==null&&r[key]!==undefined);
 const ratio = (a,b,m=1) => b>0?a/b*m:null;
 const spend=total('spend'), impressions=total('impressions'), clicks=total('clicks');
 return {spend,impressions,clicks,installs:complete('installs')?total('installs'):null,trials:complete('trials')?total('trials'):null,revenue:complete('revenue')?total('revenue'):null,ctr:ratio(clicks,impressions,100),cpm:ratio(spend,impressions,1000),cpc:ratio(spend,clicks),cpi:complete('installs')?ratio(spend,total('installs')):null,trialCpa:complete('trials')?ratio(spend,total('trials')):null,roas:complete('revenue')?ratio(total('revenue'),spend):null};
}
export function parseCSV(text) {
 if (typeof text!=='string'||text.length>2_000_000) throw Error('CSV must be smaller than 2 MB.');
 text=text.replace(/^\uFEFF/,'');
 const rows=[];let row=[],cell='',quoted=false,closed=false;
 const pushCell=()=>{row.push(cell);cell='';closed=false;};
 const pushRow=()=>{pushCell();if(row.some(v=>v.trim()))rows.push(row);row=[];};
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=c;}
  else if(c==='"'){if(cell||closed)throw Error('Invalid CSV quoting.');quoted=true;}
  else if(c===',')pushCell();
  else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;pushRow();}
  else {if(closed)throw Error('Unexpected text after a quoted field.');cell+=c;}
 }
 if(quoted)throw Error('Unclosed quoted field.');if(cell||row.length||closed)pushRow();
 if(!rows.length)return [];
 const headers=rows.shift().map(h=>h.trim());
 if(headers.some(h=>!h)||new Set(headers).size!==headers.length)throw Error('CSV headers must be unique and non-empty.');
 return rows.map((r,i)=>{if(r.length!==headers.length)throw Error(`Row ${i+2} has the wrong number of columns.`);return Object.fromEntries(headers.map((h,j)=>[h,r[j]]));});
}
export function toCSV(rows) {
 if(!rows.length)return '';
 const headers=Object.keys(rows[0]);
 const quote=value=>{let s=String(value??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
 return '\uFEFF'+[headers.map(quote).join(','),...rows.map(r=>headers.map(h=>quote(r[h])).join(','))].join('\r\n');
}
export function validatePerformance(rows) {
 if(!Array.isArray(rows)||!rows.length||rows.length>1000)throw Error('Import between 1 and 1,000 daily rows.');
 const keys=new Set();
 return rows.map((r,i)=>{
  const fail=s=>{throw Error(`Row ${i+2}: ${s}`);};
  const date=String(r.date||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)fail('date must be a valid YYYY-MM-DD.');
  if(typeof r.ad_id!=='string')fail('ad_id must be supplied as text to preserve precision.');const ad_id=r.ad_id;if(!/^\d{5,30}$/.test(ad_id))fail('ad_id must be a full numeric ID stored as text.');
  const key=date+':'+ad_id;if(keys.has(key))fail('duplicate ad/date. Export without demographic or placement breakdowns.');keys.add(key);
  const out={date,ad_id,ad_name:String(r.ad_name||'Untitled ad').slice(0,200)};
  for(const k of ['spend','impressions','clicks','installs','trials','revenue']){
   const optional=['installs','trials','revenue'].includes(k);
   if(r[k]===undefined||r[k]===null||String(r[k]).trim()===''){if(optional){out[k]=null;continue;}fail(`${k} is required.`);}
   const n=Number(r[k]);if(!Number.isFinite(n)||n<0||n>1e13)fail(`${k} must be a non-negative number.`);
   if(['impressions','clicks'].includes(k)&&!Number.isInteger(n))fail(`${k} must be a whole number.`);out[k]=n;
  }
  return out;
 });
}
export function validateCreative(input, personaIds) {
 if(!input||typeof input!=='object')throw Error('Creative details are required.');
 const out={};
 for(const key of ['name','personaId','status','language','production','origin','script','hook','emotion','hesitation','cta','valuePersona','owner','agency','adId','campaign','notes','reference','age','gender','aiUsage','parentId','mediaKey','fileName','mimeType']){
  const value=input[key]??'';if(typeof value!=='string')throw Error(`${key} must be text.`);
  if(value.length>(['script','notes'].includes(key)?20000:500))throw Error(`${key} is too long.`);out[key]=value.trim();
 }
 if(!out.name)throw Error('Give this creative a name.');
 if(!personaIds.includes(out.personaId))throw Error('Choose a valid creative persona.');
 if(!statuses.includes(out.status))throw Error('Choose a valid status.');
 if(!productions.includes(out.production)||!origins.includes(out.origin))throw Error('Choose a production source and idea origin.');
 if(!out.language)throw Error('Choose a language.');
 if(out.adId&&!/^\d{5,30}$/.test(out.adId))throw Error('Enter the full Meta ad ID as digits.');
 if(out.status==='Live'&&!out.adId)throw Error('Add the Meta ad ID before marking this creative live.');
 if(out.reference){try{const u=new URL(out.reference);if(!['https:','http:'].includes(u.protocol))throw Error();}catch{throw Error('Reference must be an http or https link.');}}
 const cost=Number(input.cost??0);if(!Number.isFinite(cost)||cost<0||cost>1e9)throw Error('Production cost must be a non-negative amount.');out.cost=cost;
 return out;
}
