import { useState } from "react";
export default function Login(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [msg,setMsg]=useState("");
  async function submit(){
    setMsg("");
    const r = await fetch("/api/auth/login", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email,password })});
    const data = await r.json();
    if(!r.ok){ setMsg(data.error||"Login failed"); return; }
    localStorage.setItem("token", data.token);
    setMsg("✅ Logged in!");
  }
  return (
    <div className="container" style={{padding:"18px 0 28px"}}>
      <div className="card" style={{display:"grid",gap:12,maxWidth:520}}>
        <h2>Login</h2>
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
        <button className="btn" onClick={submit}>Login</button>
        {msg && <div style={{color:"#9FE2F0"}}>{msg}</div>}
      </div>
    </div>
  );
}
