export default function Navbar() {
  return (
    <header style={styles.header}>
      <div style={styles.brand}>4800project</div>
      <nav style={styles.nav}>
        <a href="/" style={styles.link}>Home</a>
        <a href="https://github.com/0100loop/4800project" style={styles.link}>Repo</a>
      </nav>
    </header>
  );
}

const styles = {
  header: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid #e5e7eb', position:'sticky', top:0, background:'#fff' },
  brand: { fontWeight:700 },
  nav: { display:'flex', gap:12 },
  link: { textDecoration:'none', color:'#111827' }
};
