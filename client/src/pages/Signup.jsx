import { useState } from "react";
export default function Signup(){
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [role,setRole]=useState("user"); const [msg,setMsg]=useState("");
  async function submit(){
    setMsg("");
    const r = await fetch("/api/auth/signup", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ name,email,password,role })});
    const data = await r.json();
    if(!r.ok){ setMsg(data.error||"Signup failed"); return; }
    setMsg("✅ Account created. Check your email for a welcome message.");
  }
  return (
    <div className="container" style={{padding:"18px 0 28px"}}>
      <div className="card" style={{display:"grid",gap:12,maxWidth:520}}>
        <h2>Create account</h2>
        <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
        <div className="row">
          <label><input type="radio" checked={role==="user"} onChange={()=>setRole("user")}/> I’m parking</label>
          <label><input type="radio" checked={role==="lister"} onChange={()=>setRole("lister")}/> I’m hosting</label>
        </div>
        <button className="btn" onClick={submit}>Create account</button>
        {msg && <div style={{color:"#9FE2F0"}}>{msg}</div>}
      </div>
    </div>
  );
}
