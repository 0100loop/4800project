import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  const center = [37.7749, -122.4194]; // Example: SF
  return (
    <div className="bg-darkblue text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold text-teal mb-4">Nearby Parking</h1>
      <div className="rounded-md overflow-hidden" style={{ height: "70vh" }}>
        <MapContainer center={center} zoom={13} style={{ height: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[37.778, -122.42]}>
            <Popup>$20 • 8 min walk • EV</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
