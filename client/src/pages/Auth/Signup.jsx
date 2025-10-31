import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch, setToken } from '../../lib/api';

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'user' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  async function onSubmit(e){
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      // Create account
      await apiFetch('/api/auth/signup', { method:'POST', body: form });
      // Then log in to get token
      const login = await apiFetch('/api/auth/login', { method:'POST', body: { email: form.email, password: form.password }});
      setToken(login.token);
      nav('/'); // go home after sign up
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{maxWidth:420, padding:'24px 16px'}}>
      <h1 className="h1">Create account</h1>
      <p className="muted" style={{marginBottom:16}}>Join ParkIt to find or host nearby parking.</p>

      {err && <div className="alert alert-error" style={{marginBottom:12}}>{err}</div>}

      <form onSubmit={onSubmit} className="card" style={{padding:16}}>
        <label className="label">Name</label>
        <input className="input" name="name" value={form.name} onChange={onChange} required />

        <label className="label" style={{marginTop:12}}>Email</label>
        <input className="input" type="email" name="email" value={form.email} onChange={onChange} required />

        <label className="label" style={{marginTop:12}}>Password</label>
        <input className="input" type="password" name="password" value={form.password} onChange={onChange} required />

        <label className="label" style={{marginTop:12}}>Account type</label>
        <select className="input" name="role" value={form.role} onChange={onChange}>
          <option value="user">Event-goer</option>
          <option value="lister">Host (list driveway)</option>
        </select>

        <button className="btn btn-primary" style={{marginTop:16}} disabled={loading}>
          {loading ? 'Creating...' : 'Create account'}
        </button>

        <div style={{marginTop:12}} className="muted">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </form>
    </div>
  );
}
