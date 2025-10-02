import { useEffect, useState } from 'react';

export default function HomePage() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // If your API is on 5001, change to http://127.0.0.1:5001
    fetch('http://127.0.0.1:5000/api/health')
      .then(r => r.json())
      .then(setHealth)
      .catch(e => setError(String(e)));
  }, []);

  return (
    <section style={styles.wrap}>
      <h1>Welcome to 4800project</h1>
      <p>Backend health:</p>
      <pre style={styles.code}>
        {error ? `Error: ${error}` : JSON.stringify(health, null, 2) || 'Loading...'}
      </pre>
    </section>
  );
}

const styles = {
  wrap: { maxWidth: 960, margin: '16px auto', padding: '0 16px' },
  code: { background: '#f9fafb', border: '1px solid #e5e7eb', padding: '12px', borderRadius: 8, overflow: 'auto' }
};

