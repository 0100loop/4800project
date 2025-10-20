import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import MapView from "./pages/MapView";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 12 }}>
        <Link to="/" style={{ marginRight: 12 }}>Home</Link>
        <Link to="/map">Map</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapView />} />
      </Routes>
    </BrowserRouter>
  );
}
