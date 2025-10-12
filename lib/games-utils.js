export function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }
export function shuffle(arr){ return arr.map(v=>[Math.random(), v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }

export function saveScore(gameId, name, score) {
  const key = `scores:${gameId}`;
  const raw = typeof window !== 'undefined' && localStorage.getItem(key);
  const scores = raw ? JSON.parse(raw) : [];
  scores.push({ name, score, ts: Date.now(), timestamp: Date.now(), id: Date.now() });
  scores.sort((a,b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(scores));
}
