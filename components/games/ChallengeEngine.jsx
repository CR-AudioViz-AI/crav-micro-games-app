'use client';
import React from 'react';
import { saveScore } from '@/lib/games-utils';

const WORDS = [
  'vector','planet','signal','cipher','relief','format','puzzle','hunter','orange',
  'galaxy','bridge','magnet','kernel','cobalt','quantum','matrix','jungle','rocket',
  'beacon','filter','copper','falcon','frozen','legend','dragon','turbo','shadow'
];

function shuffle(a){ return a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]); }
function scramble(w){ return shuffle(w.split('')).join(''); }

export default function ChallengeEngine({ gameId, mode='reflex', title='Challenge' }) {
  if (mode === 'anagram') return <AnagramEngine gameId={gameId} title={title} />;
  return <ReflexEngine gameId={gameId} title={title} />;
}

function ReflexEngine({ gameId, title }) {
  const [zone, setZone] = React.useState(1);
  const [target, setTarget] = React.useState(0);
  const [pos, setPos] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [lives, setLives] = React.useState(3);
  const [running, setRunning] = React.useState(false);

  const speed = Math.max(250, 900 - zone*100);

  React.useEffect(()=>{
    if(!running) return;
    const tick = setInterval(()=> setPos(p => (p+10)%100), speed/10);
    return ()=>clearInterval(tick);
  }, [running, speed]);

  function start(){ setRunning(true); setTarget(Math.floor(Math.random()*100)); }
  function tap(){
    const diff = Math.abs(pos - target);
    if(diff <= 5){
      const ns = score+10;
      setScore(ns);
      setTarget(Math.floor(Math.random()*100));
      if(ns % 50 === 0) setZone(z=>z+1);
    } else {
      setLives(l=>l-1);
      if(lives-1<=0){
        setRunning(false);
        const name = prompt('Game over! Your name for the board?') || 'Player';
        saveScore(gameId, name, score);
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-xl font-semibold">{title}</div>
      <div>Zone: {zone} • Score: {score} • Lives: {lives}</div>
      <div className="h-6 bg-gray-200 rounded overflow-hidden relative">
        <div className="absolute inset-y-0" style={{left: `${target}%`, width: '6%', background: 'rgba(34,197,94,0.45)'}} />
        <div className="absolute inset-y-0" style={{left: `${pos}%`, width: '3%', background: 'rgba(59,130,246,0.75)'}} />
      </div>
      {!running && <button onClick={start} className="border rounded px-3 py-2">Start</button>}
      {running && <button onClick={tap} className="border rounded px-3 py-2">Tap</button>}
    </div>
  );
}

function AnagramEngine({ gameId, title }) {
  const [time, setTime] = React.useState(60);
  const [score, setScore] = React.useState(0);
  const [word, setWord] = React.useState('');
  const [scr, setScr] = React.useState('');
  const [ans, setAns] = React.useState('');

  React.useEffect(()=>{
    next();
    const t = setInterval(()=> setTime(t=>t>0?t-1:0), 1000);
    return ()=>clearInterval(t);
  }, []);

  React.useEffect(()=>{
    if(time===0){
      const name = prompt('Time! Your name for the board?') || 'Player';
      saveScore(gameId, name, score);
    }
  }, [time]);

  function next(){
    const w = WORDS[Math.floor(Math.random()*WORDS.length)];
    setWord(w);
    setScr(scramble(w));
    setAns('');
  }

  function submit(e){
    e.preventDefault();
    if(ans.toLowerCase()===word.toLowerCase()){
      setScore(s=>s+10);
      next();
    } else {
      setScore(s=>Math.max(0, s-5));
      setAns('');
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-xl font-semibold">{title}</div>
      <div>Time: {time} • Score: {score}</div>
      <div className="text-3xl">{scr}</div>
      <form onSubmit={submit} className="flex gap-2">
        <input className="border rounded px-3 py-2" value={ans} onChange={e=>setAns(e.target.value)} placeholder="Unscramble…" />
        <button className="border rounded px-3 py-2">Submit</button>
      </form>
    </div>
  );
}
