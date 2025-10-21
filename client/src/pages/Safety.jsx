export default function Safety(){
  const places = ["Bay Bites Food Hall","Cornerstone Taproom","Slice & Smoke Pizza","Luna Coffee Bar","Neptune Oyster"];
  return (
    <div className="container" style={{padding:"18px 0 30px"}}>
      <div className="card">
        <h2 style={{marginTop:0}}>Safety & Nearby Recommendations</h2>
        <p>Safety Score: <span className="badge badge--ok">A</span></p>
        <h3>Nearby Food & Drinks</h3>
        <div className="row">{places.map(x=><span key={x} className="pill">{x}</span>)}</div>
      </div>
    </div>
  );
}
