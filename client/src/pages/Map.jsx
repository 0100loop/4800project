import { useEffect, useRef, useState } from "react";

function haversine(lat1,lng1,lat2,lng2){
  const R=6371, dLat=(lat2-lat1)*Math.PI/180, dLng=(lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}

export default function Map(){
  const mapRef = useRef(null);
  const [listings,setListings] = useState([]);
  const [venue,setVenue] = useState({lat:null,lng:null,name:""});

  // read query
  useEffect(()=>{
    const u = new URL(window.location.href);
    const lat = Number(u.searchParams.get("lat"));
    const lng = Number(u.searchParams.get("lng"));
    const name = u.searchParams.get("venue") || "Selected venue";
    if(!isNaN(lat) && !isNaN(lng)) setVenue({lat,lng,name});
  },[]);

  // init map & load listings
  useEffect(()=>{
    if (!window.L) return;
    if (!mapRef.current) {
      mapRef.current = window.L.map(document.getElementById("leafmap")).setView([37.3349,-121.8881], 12);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
        attribution: "&copy; OpenStreetMap"
      }).addTo(mapRef.current);
    }

    async function load(){
      const center = venue.lat ? venue : {lat:37.3349,lng:-121.8881};
      const r = await fetch(`/api/listings?lat=${center.lat}&lng=${center.lng}&maxKm=5`);
      const data = await r.json();
      setListings(data);

      const map = mapRef.current;
      map.setView([center.lat,center.lng], 14);
      const venueMarker = window.L.marker([center.lat,center.lng]).addTo(map);
      venueMarker.bindPopup(`<b>${venue.name || "Venue"}</b>`);

      data.forEach(s=>{
        const m = window.L.marker([s.lat,s.lng]).addTo(map);
        const km = haversine(center.lat, center.lng, s.lat, s.lng).toFixed(2);
        m.bindPopup(`<b>${s.title || "Driveway"}</b><br/>${km} km • $${s.pricePerHour}/hr`);
        window.L.polyline([[center.lat,center.lng],[s.lat,s.lng]],{opacity:0.4}).addTo(map);
      });
    }
    load();
  }, [venue.lat, venue.lng]);

  return (
    <div className="container" style={{padding:"18px 0 30px"}}>
      <div id="leafmap" style={{height:"420px", borderRadius:14, border:"1px solid rgba(255,255,255,.12)"}}></div>
      <div style={{marginTop:14}} className="grid">
        {listings.map(s=>(
          <div key={s._id} className="card">
            <div style={{width:44,height:44,borderRadius:12,background:"#0b1523",display:"grid",placeItems:"center"}}>🚗</div>
            <div style={{flex:1}}>
              <h4>{s.title || "Driveway"}</h4>
              <div className="row">
                {s.bathroom && <span className="pill">Bathroom</span>}
                {s.evCharging && <span className="pill">EV</span>}
                {s.shuttle && <span className="pill">Shuttle</span>}
                {s.tailgateFriendly && <span className="pill">Tailgate</span>}
                {s.overnightAllowed && <span className="pill">Overnight</span>}
              </div>
            </div>
            <div className="price">${s.pricePerHour}/hr</div>
          </div>
        ))}
      </div>
    </div>
  );
}
