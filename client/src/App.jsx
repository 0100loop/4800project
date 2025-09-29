import { useEffect, useState } from 'react'

export default function App() {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => console.error('API error:', err))
  }, [])

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>4800project Client</h1>
      <h2>API Health Check:</h2>
      <pre>{health ? JSON.stringify(health, null, 2) : 'Loading...'}</pre>
    </main>
  )
}
