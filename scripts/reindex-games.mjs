import { readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
const APP='./app', OUT='./content/games/generated.json';
const EXCLUDE=new Set(['api','pay','games-addons','dashboard']);
const hasPage=dir=>{try{return readdirSync(dir).some(f=>/^page\.(jsx?|tsx?)$/.test(f));}catch{return false;}};
function walk(base=''){
  const dir=join(APP,base); let out=[]; let ents=[];
  try{ents=readdirSync(dir);}catch{return out;}
  for(const d of ents){
    if(EXCLUDE.has(d)) continue;
    const full=join(dir,d);
    let st; try{st=statSync(full);}catch{continue;}
    if(st.isDirectory()){
      const slug=base?`${base}/${d}`:d;
      if(hasPage(full)) out.push(slug);
      out = out.concat(walk(slug));
    }
  }
  return out;
}
const pretty=s=>s.split('/').slice(-1)[0].replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
const slugs=walk().sort();
const auto=slugs.map(s=>({slug:s,title:pretty(s)}));
writeFileSync(OUT, JSON.stringify({ auto }, null, 2));
console.log(JSON.stringify({ ok:true, reindexed:auto.length }, null, 2));
