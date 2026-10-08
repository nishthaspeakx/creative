import type {Performance} from './types';
export const statuses:string[];export const productions:string[];export const origins:string[];
export function metrics(rows:Partial<Performance>[]):{spend:number;impressions:number;clicks:number;installs:number|null;trials:number|null;revenue:number|null;ctr:number|null;cpm:number|null;cpc:number|null;cpi:number|null;trialCpa:number|null;roas:number|null};
export function parseCSV(text:string):Record<string,string>[];
export function toCSV(rows:Record<string,unknown>[]):string;
export function validatePerformance(rows:unknown):Performance[];
export function validateCreative(input:unknown,personaIds:string[]):Record<string,unknown>;
