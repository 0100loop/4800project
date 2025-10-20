export default function Safety(){
  return (
    <div className="container" style={{padding:"18px 0 30px"}}>
      <div className="panel">
        <h2 style={{marginTop:0}}>Safety & Nearby Recommendations</h2>
        <p>Safety Score: <span className="badge badge--ok">A</span></p>

        <h3>Nearby Food & Drinks</h3>
        <div className="row">
          {[
            "Bay Bites Food Hall",
            "Cornerstone Taproom",
            "Slice & Smoke Pizza",
            "Luna Coffee Bar",
            "Neptune Oyster"
          ].map(x => (
            <span key={x} className="pill">{x}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
