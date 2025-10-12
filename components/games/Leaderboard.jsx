'use client';
import React from 'react';

export default function Leaderboard({ gameId }) {
  const [scores, setScores] = React.useState([]);
  React.useEffect(() => {
    const key = `scores:${gameId}`;
    const raw = typeof window !== 'undefined' && localStorage.getItem(key);
    setScores(raw ? JSON.parse(raw) : []);
  }, [gameId]);
  return (
    <div className="border rounded-md p-3">
      <div className="font-semibold mb-2">Leaderboard (local)</div>
      <ol className="list-decimal pl-6 space-y-1">
        {scores.slice(0,10).map((s, i) => (<li key={i}>{s.name} — {s.score}</li>))}
        {scores.length===0 && <li>No scores yet.</li>}
      </ol>
    </div>
  );
}

export function saveScore(gameId, name, score) {
  const key = `scores:${gameId}`;
  const raw = typeof window !== 'undefined' && localStorage.getItem(key);
  const scores = raw ? JSON.parse(raw) : [];
  scores.push({ name, score, ts: Date.now() });
  scores.sort((a,b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(scores));
}
