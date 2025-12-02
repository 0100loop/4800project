import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function MapView({ eventData }) {
  if (!eventData) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold text-red-600">No Event Selected</h1>
        <p className="text-gray-600">Return to HomeScreen and choose an event.</p>
      </div>
    );
  }

  // Fix Leaflet Marker Icons
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

  const { name, venueName, lat, lng, date, time } = eventData;

  const parkingSpots = [
    {
      id: 1,
      name: "Parking Lot A",
      lat: lat + 0.002,
      lng: lng - 0.002,
      price: 20,
    },
    {
      id: 2,
      name: "Parking Garage B",
      lat: lat - 0.001,
      lng: lng + 0.003,
      price: 15,
    },
    {
      id: 3,
      name: "Street Parking Zone C",
      lat: lat + 0.003,
      lng: lng + 0.001,
      price: 10,
    },
  ];

  return (
    <div className="w-full h-screen">
      <div className="p-4 bg-gray-800 text-white">
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-sm opacity-80">{venueName} — {date} {time}</p>
      </div>

      <MapContainer
        center={[lat, lng]}
        zoom={15}
        className="w-full h-[90vh]"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]}>
          <Popup>
            <strong>{venueName}</strong><br />
            Event Location
          </Popup>
        </Marker>

        {parkingSpots.map((spot) => (
          <Marker key={spot.id} position={[spot.lat, spot.lng]}>
            <Popup>
              <strong>{spot.name}</strong><br />
              Price: ${spot.price}<br />
              <button className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">
                Book Spot
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
