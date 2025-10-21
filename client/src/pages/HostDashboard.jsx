import { useState } from "react";
import { Plus, Calendar, MapPin, Settings, Users, ChevronLeft, Zap, Home as HomeIcon, Truck, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/input"; // simple alias—replace with real component if needed

export function HostDashboard({ onNavigate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [tailgateFriendly, setTailgateFriendly] = useState(false);
  const [overnightParking, setOvernightParking] = useState(false);
  const [bathroomAccess, setBathroomAccess] = useState(false);
  const [evCharging, setEvCharging] = useState(false);
  const [shuttleService, setShuttleService] = useState(false);

  const spots = [
    { id:1, address:"1234 Oak Street", price:15, totalBookings:23, earnings:345, nextEvent:"Lakers vs Warriors - Oct 15", isActive:true },
    { id:2, address:"5678 Maple Avenue", price:20, totalBookings:18, earnings:360, nextEvent:"Taylor Swift - Oct 22", isActive:true },
  ];

  if (isAdding) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-[#0A2540] text-white px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={()=>setIsAdding(false)} className="text-white rounded-full"><ChevronLeft className="w-5 h-5"/></Button>
          <h2 className="text-white flex-1 text-lg font-semibold">List Your Spot</h2>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
          <Card className="mb-6">
            <CardHeader><CardTitle className="text-[#0A2540]">Spot Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="address">Address</Label><Input id="address" placeholder="123 Main Street" className="text-[#0A2540] bg-white"/></div>
              <div><Label htmlFor="desc">Description</Label><input id="desc" className="w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Describe your parking spot..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="price">Price per Event</Label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span><Input id="price" type="number" placeholder="15" className="pl-7 text-[#0A2540] bg-white"/></div></div>
                <div><Label htmlFor="spaces">Number of Spaces</Label><Input id="spaces" type="number" placeholder="1" className="text-[#0A2540] bg-white"/></div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader><CardTitle className="text-[#0A2540]">Amenities & Features</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="bg-[#06B6D4]/10 rounded-lg p-2"><Calendar className="w-5 h-5 text-[#06B6D4]"/></div><div><Label>Tailgate Friendly</Label><p className="text-sm text-gray-600">Allow pre-game gatherings</p></div></div>
                <Switch checked={tailgateFriendly} onCheckedChange={setTailgateFriendly}/>
              </div>
              <Separator/>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="bg-[#06B6D4]/10 rounded-lg p-2"><Calendar className="w-5 h-5 text-[#06B6D4]"/></div><div><Label>Overnight Parking</Label><p className="text-sm text-gray-600">Allow parking after event</p></div></div>
                <Switch checked={overnightParking} onCheckedChange={setOvernightParking}/>
              </div>
              <Separator/>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="bg-[#06B6D4]/10 rounded-lg p-2"><HomeIcon className="w-5 h-5 text-[#06B6D4]"/></div><div><Label>Bathroom Access</Label><p className="text-sm text-gray-600">+$3 per booking</p></div></div>
                <Switch checked={bathroomAccess} onCheckedChange={setBathroomAccess}/>
              </div>
              <Separator/>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="bg-[#06B6D4]/10 rounded-lg p-2"><Zap className="w-5 h-5 text-[#06B6D4]"/></div><div><Label>EV Charging</Label><p className="text-sm text-gray-600">+$8 per booking</p></div></div>
                <Switch checked={evCharging} onCheckedChange={setEvCharging}/>
              </div>
              <Separator/>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="bg-[#06B6D4]/10 rounded-lg p-2"><Truck className="w-5 h-5 text-[#06B6D4]"/></div><div><Label>Shuttle Service</Label><p className="text-sm text-gray-600">+$5 per booking</p></div></div>
                <Switch checked={shuttleService} onCheckedChange={setShuttleService}/>
              </div>
            </CardContent>
          </Card>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="max-w-2xl mx-auto">
              <Button onClick={()=>setIsAdding(false)} className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white py-6">Submit for Review</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-white">
      <div className="bg-[#0A2540] text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={()=>onNavigate('home')} className="text-white rounded-full"><ChevronLeft className="w-5 h-5"/></Button>
            <div className="flex-1">
              <h2 className="text-white text-lg font-semibold">Host Dashboard</h2>
              <p className="text-cyan-100 text-sm">Manage your parking spots</p>
            </div>
            <Button variant="ghost" size="icon" className="text-white rounded-full"><Settings className="w-5 h-5"/></Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-white/10 border-white/20 backdrop-blur"><CardContent className="p-3 text-center"><DollarSign className="w-5 h-5 text-[#06B6D4] mx-auto mb-1"/><div className="text-2xl text-white">$705</div><p className="text-xs text-cyan-100">Total Earnings</p></CardContent></Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur"><CardContent className="p-3 text-center"><Users className="w-5 h-5 text-[#06B6D4] mx-auto mb-1"/><div className="text-2xl text-white">41</div><p className="text-xs text-cyan-100">Total Bookings</p></CardContent></Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur"><CardContent className="p-3 text-center"><TrendingUp className="w-5 h-5 text-[#06B6D4] mx-auto mb-1"/><div className="text-2xl text-white">4.9</div><p className="text-xs text-cyan-100">Avg Rating</p></CardContent></Card>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0A2540] text-lg font-semibold">My Spots</h3>
            <Button onClick={()=>setIsAdding(true)} className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"><Plus className="w-4 h-4 mr-2"/> Add Spot</Button>
          </div>
          <div className="space-y-3">
            {spots.map(s=>(
              <Card key={s.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-[#0A2540] to-[#134E6F] rounded-lg p-3 flex items-center justify-center"><MapPin className="w-6 h-6 text-[#06B6D4]"/></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div><h4 className="text-[#0A2540] font-semibold">{s.address}</h4><p className="text-sm text-gray-600">${s.price} per event</p></div>
                        <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                        <div><p className="text-gray-600">Total Bookings</p><p className="text-[#0A2540]">{s.totalBookings}</p></div>
                        <div><p className="text-gray-600">Earnings</p><p className="text-[#0A2540]">${s.earnings}</p></div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600"><Calendar className="w-3 h-3"/><span>Next: {s.nextEvent}</span></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
