import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const slides = [
 {text:'Discover your next everyday favourite', to:'/collection', label:'Explore the collection'},
 {text:'Your account. Your orders. In one place.', to:'/profile', label:'Visit your account'},
 {text:'Find something for your home', to:'/collection?category=home', label:'Explore home'},
];
export default function AnnouncementBar() {
 const [index,setIndex]=useState(0), [paused,setPaused]=useState(false), [hover,setHover]=useState(false), [reduced,setReduced]=useState(false);
 useEffect(()=>{const m=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(m.matches);update();m.addEventListener('change',update);return()=>m.removeEventListener('change',update);},[]);
 useEffect(()=>{if(paused||hover||reduced)return;const id=setInterval(()=>setIndex(i=>(i+1)%slides.length),6000);return()=>clearInterval(id);},[paused,hover,reduced]);
 const slide=slides[index];
 return <section aria-label="Store announcements" className="bg-plum text-white" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocus={()=>setHover(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setHover(false);}}>
 <div className="wrap flex min-h-12 items-center justify-between gap-3 py-2 text-xs">
 <button className="p-2" aria-label="Previous announcement" onClick={()=>setIndex(i=>(i+slides.length-1)%slides.length)}>‹</button>
 <Link key={index} to={slide.to} className="announcement-copy text-center leading-5">{slide.text}<span className="ml-3 underline">{slide.label}</span></Link>
 <div className="flex items-center gap-2"><button className="p-2" aria-label={paused?'Resume announcements':'Pause announcements'} aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'Play':'Pause'}</button><button className="p-2" aria-label="Next announcement" onClick={()=>setIndex(i=>(i+1)%slides.length)}>›</button></div>
 </div></section>;
}
