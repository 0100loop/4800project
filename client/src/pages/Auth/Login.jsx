import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch, setToken } from '../../lib/api';

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  async function onSubmit(e){
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/login', { method:'POST', body: form });
      setToken(data.token);
      nav('/'); // go home
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{maxWidth:420, padding:'24px 16px'}}>
      <h1 className="h1">Log in</h1>
      <p className="muted" style={{marginBottom:16}}>Welcome back to ParkIt.</p>

      {err && <div className="alert alert-error" style={{marginBottom:12}}>{err}</div>}

      <form onSubmit={onSubmit} className="card" style={{padding:16}}>
        <label className="label">Email</label>
        <input className="input" type="email" name="email" value={form.email} onChange={onChange} required />

        <label className="label" style={{marginTop:12}}>Password</label>
        <input className="input" type="password" name="password" value={form.password} onChange={onChange} required />

        <button className="btn btn-primary" style={{marginTop:16}} disabled={loading}>
          {loading ? 'Signing in...' : 'Log in'}
        </button>

        <div style={{marginTop:12}} className="muted">
          New here? <Link to="/signup">Create account</Link>
        </div>
      </form>
    </div>
  );
}
