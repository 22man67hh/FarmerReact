import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import truck from '@/image/pickup.jpeg';
import tractor from '@/image/tractor.jpeg';
import th from '@/image/th.jpeg';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Dialog } from '@mui/material';
import LeafletMap from './LeafletMap';

const vehicles = [
  { id: 1, name: 'Tractor', OwnerName: 'Manish', type: 'tractor', image: truck, available: true },
  { id: 2, name: 'Truck', OwnerName: 'Manish', type: 'truck', image: tractor, available: false },
  { id: 3, name: 'Harvester', OwnerName: 'Manish', type: 'harvester', image: th, available: true }
];

export default function VehicleBooking() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState(null);
  const [purpose, setPurpose] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);

  // Reverse geocode when coordinates change
  useEffect(() => {
    if (selectedCoords) {
      const fetchAddress = async () => {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${selectedCoords.lat}&lon=${selectedCoords.lng}`
        );
        const data = await res.json();
        if (data?.display_name) {
          setLocation(data.display_name);
        }
      };
      fetchAddress();
    }
  }, [selectedCoords]);

  const handleBook = () => {
    if (!selectedVehicle || !bookingDate || !timeSlot || !purpose || !location) return;
    console.log({ selectedVehicle, bookingDate, timeSlot, purpose, location, coordinates: selectedCoords });
    alert('Booking request submitted!');
  };

  return (
    <div className="p-4 grid gap-6">
      <h2 className="text-2xl font-bold text-center">Book a Vehicle</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vehicles.map(vehicle => (
          <Card key={vehicle.id} className="hover:shadow-lg cursor-pointer" onClick={() => setSelectedVehicle(vehicle)}>
            <img src={vehicle.image} alt={vehicle.name} className="h-40 w-full object-cover rounded-t" />
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{vehicle.name}</h3>
              <p>Status: {vehicle.available ? '✅ Available' : '❌ Booked'}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedVehicle && (
        <Card className="p-4 mt-4">
          <h3 className="text-xl font-semibold mb-2">Booking Details</h3>
          <p className="mb-2 text-gray-600">
            Selected Vehicle: <span className="font-medium text-black">{selectedVehicle.name}</span>
          </p>
          <p className="mb-2 text-gray-600">
            Owner Name: <span className="font-medium text-black">{selectedVehicle.OwnerName}</span>
          </p>
          <div className="grid gap-4">
            <Calendar mode="single" selected={bookingDate} onSelect={setBookingDate} disabled={{ before: new Date() }} />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Select Time"
                value={timeSlot}
                onChange={(newValue) => setTimeSlot(newValue)}
                renderInput={({ inputRef, inputProps }) => <Input ref={inputRef} {...inputProps} />}
              />
            </LocalizationProvider>

            <Textarea
              placeholder="Purpose of booking"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />

            <Button variant="outline" onClick={() => setMapOpen(true)}>Pick Location on Map</Button>

            {selectedCoords && (
              <p className="text-sm text-gray-700">
                Selected Coords: {selectedCoords.lat.toFixed(5)}, {selectedCoords.lng.toFixed(5)}
              </p>
            )}

            <Input
              placeholder="Selected address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <Button onClick={handleBook} style={{ color: 'black' }}>Request Booking</Button>
          </div>
        </Card>
      )}

      {/* Map Dialog */}
      <Dialog open={mapOpen} onClose={() => setMapOpen(false)} fullWidth maxWidth="md">
        <div className="p-4">
          <LeafletMap
            setSelectedPosition={(pos) => {
              setSelectedCoords(pos);
              setMapOpen(false);
            }}
          />
        </div>
      </Dialog>
    </div>
  );
}
