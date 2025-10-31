import { useState } from "react";
import { MapPin, Navigation, DollarSign, Clock, Filter, ChevronLeft, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

export function MapView({ onNavigate, viewData }) {
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showVenueSearch, setShowVenueSearch] = useState(false);

  const currentVenue = viewData?.venue?.name || viewData?.venue || "Crypto.com Arena";
  const currentEvent = viewData?.event?.name || "Find Parking";
  const currentDate = viewData?.event?.date || "";

  const allVenues = [
    { id: 1, name: 'Crypto.com Arena', city: 'Los Angeles, CA' },
    { id: 2, name: 'SoFi Stadium', city: 'Inglewood, CA' },
    { id: 3, name: 'Dodger Stadium', city: 'Los Angeles, CA' },
  ];

  const filteredVenues = (searchQuery.trim()? allVenues.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.city.toLowerCase().includes(searchQuery.toLowerCase())) : allVenues);

  const parkingSpots = [
    { id:1, price:15, distance:'0.3 mi', walkTime:'6 min', rating:4.8, host:'Mike T.', amenities:['EV Charging','Bathroom'], tailgateFriendly:true },
    { id:2, price:20, distance:'0.4 mi', walkTime:'8 min', rating:4.9, host:'Sarah L.', amenities:['Covered','Shuttle'], tailgateFriendly:false },
    { id:3, price:12, distance:'0.5 mi', walkTime:'10 min', rating:4.6, host:'John D.', amenities:['Bathroom','Food Nearby'], tailgateFriendly:true },
    { id:4, price:18, distance:'0.2 mi', walkTime:'4 min', rating:5.0, host:'Emma R.', amenities:['EV Charging','Covered','Bathroom'], tailgateFriendly:false },
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center gap-3 mb-3">
          <Button variant="ghost" size="icon" onClick={()=>onNavigate('home')} className="rounded-full text-[#0A2540]">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h3 className="text-[#0A2540]">{currentVenue}</h3>
            {currentDate && <p className="text-sm text-gray-600">{currentEvent} - {currentDate}</p>}
          </div>
          <Button variant="outline" size="icon" className="rounded-full"><Filter className="w-4 h-4"/></Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10"/>
          <Input placeholder="Search different venue..." className="pl-10 pr-4 py-2 rounded-lg border-gray-200 text-sm text-[#0A2540]"
            value={searchQuery} onChange={e=>{setSearchQuery(e.target.value); setShowVenueSearch(true);}} onFocus={()=>setShowVenueSearch(true)} />
          {showVenueSearch && (
            <>
              <div className="fixed inset-0 z-20" onClick={()=>setShowVenueSearch(false)} />
              <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-xl overflow-hidden z-30 max-h-64 overflow-y-auto border border-gray-200">
                {filteredVenues.map(v=>(
                  <button key={v.id} onClick={()=>{ setSearchQuery(""); setShowVenueSearch(false); onNavigate('map',{venue:v}); }}
                    className="w-full px-3 py-2 hover:bg-gray-50 flex items-start gap-2 text-left border-b border-gray-100 last:border-b-0">
                    <MapPin className="w-4 h-4 text-[#06B6D4]"/><div><p className="text-sm text-[#0A2540]">{v.name}</p><p className="text-xs text-gray-500">{v.city}</p></div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mock map background */}
      <div className="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200">
        <Button className="absolute top-4 right-4 bg-white text-[#0A2540] hover:bg-gray-50 shadow-lg rounded-full z-30" size="icon">
          <Navigation className="w-4 h-4"/>
        </Button>
      </div>

      <div className="bg-white rounded-t-3xl shadow-2xl max-h-[50vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-4 pt-4 pb-2 border-b border-gray-100">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
          <h3 className="text-[#0A2540]">{parkingSpots.length} Spots Available</h3>
          <p className="text-gray-600 text-sm mt-1">Sorted by distance</p>
        </div>
        <div className="p-4 space-y-3">
          {parkingSpots.map(s=>(
            <Card key={s.id} className={`cursor-pointer transition-all ${selected===s.id?"border-[#06B6D4] border-2 shadow-md":"border-gray-200 hover:shadow-md"}`}
              onClick={()=>onNavigate('spot', {spot:s})}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#0A2540] to-[#134E6F] rounded-lg flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-[#06B6D4]"/>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-[#0A2540] text-lg font-semibold">${s.price}</h4>
                          <Badge className="text-xs border-[#06B6D4] text-[#06B6D4] border"> {s.rating} ⭐</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Hosted by {s.host}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{s.distance}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{s.walkTime} walk</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {s.tailgateFriendly && <Badge className="bg-[#06B6D4]/10 text-[#06B6D4] text-xs border-0">🎉 Tailgate OK</Badge>}
                      {s.amenities.slice(0,2).map(a=><Badge key={a} className="bg-gray-100 text-gray-800 text-xs">{a}</Badge>)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
