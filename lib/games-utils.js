export function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }
export function shuffle(arr){ return arr.map(v=>[Math.random(), v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }
