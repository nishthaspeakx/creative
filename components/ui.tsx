'use client';
import {useEffect,useRef} from 'react';
import {X,ArrowUpRight,Film,Download} from 'lucide-react';
export function Badge({children,tone='neutral'}:{children:React.ReactNode;tone?:string}){return <span className={`badge ${tone}`}>{children}</span>}
export function Empty({title,description,children}:{title:string;description:string;children?:React.ReactNode}){return <div className="empty"><div className="empty-icon"><Film size={27}/></div><h3>{title}</h3><p>{description}</p>{children}</div>}
export function Modal({title,children,close,wide=false}:{title:string;children:React.ReactNode;close:()=>void;wide?:boolean}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const el=ref.current;el?.showModal();return()=>el?.close()},[]);
 return <dialog ref={ref} className={wide?'modal wide':'modal'} onCancel={close} onClick={e=>{if(e.target===ref.current)close()}}><div className="modal-head"><h2>{title}</h2><button className="icon-btn" aria-label="Close dialog" onClick={close}><X size={20}/></button></div>{children}</dialog>
}
export function External({href,children}:{href:string;children:React.ReactNode}){return <a className="text-link" href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={14}/></a>}
export function downloadText(name:string,text:string){
 const frame=document.createElement('iframe');frame.name='export-'+crypto.randomUUID();frame.hidden=true;document.body.appendChild(frame);
 const form=document.createElement('form');form.method='POST';form.action='/api/export';form.target=frame.name;form.hidden=true;
 for(const [key,value] of Object.entries({filename:name,content:text})){const input=document.createElement('input');input.type='hidden';input.name=key;input.value=value;form.appendChild(input);}
 document.body.appendChild(form);form.submit();form.remove();setTimeout(()=>frame.remove(),60000);
}
export function ExportButton({onClick,disabled=false}:{onClick:()=>void;disabled?:boolean}){return <button className="button secondary" onClick={onClick} disabled={disabled}><Download size={16}/> Export CSV</button>}
export const number=(n:number|null|undefined,digits=0)=>n==null?'—':new Intl.NumberFormat('en-IN',{maximumFractionDigits:digits}).format(n);
export const money=(n:number|null|undefined)=>n==null?'—':'₹'+number(n,2);
export const date=(d:string)=>new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
export async function request<T = any>(path:string,options?:RequestInit):Promise<T>{const r=await fetch(path,options);const data:any=await r.json();if(!r.ok)throw Error(data.error||'Request failed. Please try again.');return data}
export const post=(path:string,data:unknown)=>request(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
