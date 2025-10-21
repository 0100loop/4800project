import { useState } from "react";
import { Search, MapPin, Calendar, TrendingUp, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function HomeScreen({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const allVenues = [
    { id: 1, name: 'Crypto.com Arena', city: 'Los Angeles, CA', type: 'Arena' },
    { id: 2, name: 'SoFi Stadium', city: 'Inglewood, CA', type: 'Stadium' },
    { id: 3, name: 'Dodger Stadium', city: 'Los Angeles, CA', type: 'Baseball Stadium' },
    { id: 4, name: 'Rose Bowl Stadium', city: 'Pasadena, CA', type: 'Football Stadium' },
    { id: 5, name: 'Hollywood Bowl', city: 'Los Angeles, CA', type: 'Amphitheater' },
    { id: 6, name: 'The Forum', city: 'Inglewood, CA', type: 'Arena' },
    { id: 7, name: 'Banc of California Stadium', city: 'Los Angeles, CA', type: 'Soccer Stadium' },
    { id: 8, name: 'Angel Stadium', city: 'Anaheim, CA', type: 'Baseball Stadium' },
    { id: 9, name: 'Honda Center', city: 'Anaheim, CA', type: 'Arena' },
    { id: 10, name: 'Greek Theatre', city: 'Los Angeles, CA', type: 'Theater' },
  ];

  const featuredEvents = [
    { id:1, name:'Lakers vs Warriors', venue:'Crypto.com Arena', date:'Oct 15, 2025', image:'https://images.unsplash.com/photo-1592841897894-108b4aa4f076?q=80&w=1200', spotsAvailable:42, priceFrom:15 },
    { id:2, name:'Taylor Swift Concert', venue:'SoFi Stadium', date:'Oct 22, 2025', image:'https://images.unsplash.com/photo-1534050055340-71c7fa612a99?q=80&w=1200', spotsAvailable:28, priceFrom:25 },
    { id:3, name:'Dodgers vs Giants', venue:'Dodger Stadium', date:'Oct 18, 2025', image:'https://images.unsplash.com/photo-1592841897894-108b4aa4f076?q=80&w=1200', spotsAvailable:56, priceFrom:18 },
    { id:4, name:'USC vs UCLA Game', venue:'Rose Bowl Stadium', date:'Nov 2, 2025', image:'https://images.unsplash.com/photo-1592841897894-108b4aa4f076?q=80&w=1200', spotsAvailable:34, priceFrom:22 },
  ];

  const filteredVenues = searchQuery.trim()
    ? allVenues.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.type.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white">
      <div className="bg-[#0A2540] text-white px-4 pt-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white mb-2 text-3xl font-bold">Find Your Spot</h1>
          <p className="text-cyan-100 mb-6">Park with locals near your favorite venues</p>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <Input
              placeholder="Search venues, events, or locations..."
              className="pl-12 pr-12 py-6 rounded-xl border-0 bg-white shadow-lg text-[#0A2540]"
              value={searchQuery}
              onChange={(e)=>{ setSearchQuery(e.target.value); setShowSearchResults(!!e.target.value.trim()); }}
              onFocus={()=>setShowSearchResults(!!searchQuery.trim())}
            />
            {searchQuery && (
              <button onClick={()=>{setSearchQuery(""); setShowSearchResults(false);}}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10">
                <X className="w-5 h-5" />
              </button>
            )}

            {showSearchResults && filteredVenues.length>0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                {filteredVenues.map(v=>(
                  <button key={v.id}
                    onClick={()=>{ setSearchQuery(""); setShowSearchResults(false); onNavigate("map",{venue:v}); }}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-start gap-3 text-left border-b border-gray-100 last:border-b-0">
                    <MapPin className="w-5 h-5 text-[#06B6D4]" />
                    <div className="flex-1">
                      <p className="text-[#0A2540]">{v.name}</p>
                      <p className="text-sm text-gray-600">{v.city} • {v.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
            <Button onClick={()=>onNavigate("map")} className="rounded-full px-6">
              <MapPin className="w-4 h-4 mr-2"/> View Map
            </Button>
            <Button variant="outline" className="rounded-full px-6"> <Calendar className="w-4 h-4 mr-2"/> My Bookings</Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#0A2540] text-xl font-semibold">Popular Events</h2>
            <p className="text-gray-600 mt-1">Find parking near these events</p>
          </div>
          <TrendingUp className="w-5 h-5 text-[#06B6D4]" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {featuredEvents.map(e=>(
            <Card key={e.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-gray-200"
              onClick={()=>onNavigate('map',{event:e, venue: allVenues.find(v=>v.name===e.venue)})}>
              <div className="relative h-40">
                <ImageWithFallback src={e.image} alt={e.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-[#06B6D4] text-white border-0">{e.spotsAvailable} spots</Badge>
                </div>
              </div>
              <CardContent>
                <h3 className="text-[#0A2540] font-semibold">{e.name}</h3>
                <div className="flex items-center text-gray-600 mb-1"><MapPin className="w-4 h-4 mr-1"/><span className="text-sm">{e.venue}</span></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600"><Calendar className="w-4 h-4 mr-1"/><span className="text-sm">{e.date}</span></div>
                  <span className="text-[#06B6D4]">From ${e.priceFrom}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-[#0A2540] to-[#134E6F] text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-white mb-2 text-lg font-semibold">Become a Host</h3>
                <p className="text-cyan-100 mb-4">Turn your driveway into extra income on event days</p>
                <Button onClick={()=>onNavigate('host')} className="bg-[#06B6D4] hover:bg-[#0891B2]">List Your Spot</Button>
              </div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1630350215986-ddaf3124eeb1?q=80&w=600"
                alt="Host" className="w-24 h-24 rounded-lg object-cover hidden md:block"/>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
