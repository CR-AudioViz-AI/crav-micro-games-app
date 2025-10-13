export function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }
export function shuffle(arr){ return arr.map(v=>[Math.random(), v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }

export function saveScore(gameId, name, score) {
  try {
    const key = `scores:${gameId}`;
    const raw = typeof window !== 'undefined' && window.localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push({ name: name || 'Player', score, ts: Date.now() });
    arr.sort((a,b) => b.score - a.score);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(arr));
    }
  } catch (_) {}
}
