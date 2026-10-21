import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { api, request } from "../lib/api";
import { login } from "../store/authSlice";
export default function Profile() {
 const user = useSelector(s => s.auth.user);
 const [name, setName] = useState(user?.name || "");
 const [busy, setBusy] = useState(false), [error, setError] = useState(""), [saved, setSaved] = useState(false);
 const dispatch = useDispatch(), navigate = useNavigate();
 async function save(e) {
  e.preventDefault(); if (busy) return; setBusy(true); setError(""); setSaved(false);
  try { const data = await request('/auth/profile', {method:'PATCH', body:JSON.stringify({name})}); dispatch(login(data.user)); setSaved(true); }
  catch(e) { setError(e.message); } finally { setBusy(false); }
 }
 async function signOut() { setBusy(true); setError(""); const result = await api.auth.signOut(); if(result.error) {setError(result.error.message); setBusy(false);} else navigate('/signin', {replace:true}); }
 return <main className="wrap py-14">
  <p className="eyebrow mb-4">Your personal corner</p><h1 className="heading">My account</h1>
  <p className="mt-4 mb-8 text-ink/60">Your details and shopping, together in one place.</p>
  <div className="grid gap-6 md:grid-cols-3"><section className="panel md:col-span-2" aria-labelledby="profile-details">
   <h2 id="profile-details" className="font-display text-2xl mb-6">Personal details</h2>
   <form onSubmit={save} className="space-y-5">
    <label className="block text-sm">Name<input className="field mt-2" autoComplete="name" value={name} onChange={e=>{setName(e.target.value);setSaved(false);}} required maxLength={100}/></label>
    <div><p className="text-sm">Email address</p><p className="mt-2 break-all">{user.email}</p></div>
    <p className="text-sm text-ink/60">Account type: {user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
    {error && <p role="alert" className="text-red-700">{error}</p>}{saved && <p role="status" className="text-green-800">Your details have been saved.</p>}
    <button className="btn" disabled={busy}>{busy ? 'Please wait…' : 'Save details'}</button>
   </form>
  </section><aside className="panel flex flex-col items-start gap-5"><h2 className="font-display text-2xl">Your market</h2>
   <Link to="/orders">View orders</Link><Link to="/cart">Shopping bag</Link><Link to="/contact">Contact us</Link>
   {user.role === 'admin' && <a className="btn-outline" href="/admin/">Open dashboard</a>}
   <button className="text-sm text-plum underline" disabled={busy} onClick={signOut}>Sign out</button>
  </aside></div>
 </main>;
}
