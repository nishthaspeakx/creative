import test from 'node:test';
import assert from 'node:assert/strict';
import {metrics, parseCSV, toCSV, validatePerformance, validateCreative} from '../lib/domain.mjs';
test('aggregate ratios from sums, retaining unavailable conversion metrics',()=>{
 const m=metrics([{spend:100,impressions:100,clicks:10,installs:null},{spend:300,impressions:900,clicks:9,installs:null}]);
 assert.equal(m.ctr,1.9); assert.equal(m.cpc,400/19); assert.equal(m.cpi,null); assert.equal(m.spend,400);
 assert.equal(metrics([]).ctr,null);
});
test('partial installs do not produce a misleading CPI',()=>{
 assert.equal(metrics([{spend:100,impressions:100,clicks:2,installs:10},{spend:100,impressions:100,clicks:2,installs:null}]).cpi,null);
});
test('CSV parses quoted commas, escaped quotes and multiline content',()=>{
 assert.deepEqual(parseCSV('name,script\r\n"A, B","Say ""hello""\nagain"\r\n'),[{name:'A, B',script:'Say "hello"\nagain'}]);
 assert.throws(()=>parseCSV('a,a\n1,2')); assert.throws(()=>parseCSV('a,b\n"unterminated,2'));
});
test('CSV export neutralises formulas and preserves exact identifiers',()=>{
 const s=toCSV([{id:'1083327227503975',name:'=1+1',script:'a,b'}]);
 assert.equal(parseCSV(s)[0].id,'1083327227503975'); assert.equal(parseCSV(s)[0].name,"'=1+1"); assert.equal(parseCSV(s)[0].script,'a,b');
});
test('performance import validates dates, identifiers and non-negative finite metrics',()=>{
 const row={date:'2026-10-01',ad_id:'1083327227503975',ad_name:'Trial',spend:'100',impressions:'1000',clicks:'10',installs:''};
 assert.equal(validatePerformance([row])[0].installs,null);
 assert.throws(()=>validatePerformance([{...row,spend:'-1'}]));
 assert.throws(()=>validatePerformance([{...row,date:'2026-02-31'}]));
 assert.throws(()=>validatePerformance([{...row,ad_id:'1e18'}]));
 assert.throws(()=>validatePerformance([{...row,impressions:'NaN'}]));
 assert.throws(()=>validatePerformance([row,row]));
});
test('creative requires name and valid persona; deployment status needs ad id',()=>{
 const base={name:'A meeting with confidence',personaId:'p1',status:'Draft',language:'Hindi',production:'In-house UGC',origin:'New idea'};
 assert.equal(validateCreative(base,['p1']).name,base.name);
 assert.throws(()=>validateCreative({...base,name:'   '},['p1']));
 assert.throws(()=>validateCreative({...base,personaId:'bad'},['p1']));
 assert.throws(()=>validateCreative({...base,status:'Live'},['p1']));
});
test('numeric JSON ad identifiers are rejected before precision loss can be persisted',()=>{
 assert.throws(()=>validatePerformance([{date:'2026-10-01',ad_id:12345678901234567890,spend:1,impressions:1,clicks:0}]));
});
