import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleLeft, ToggleRight } from "lucide-react";
import { Dialog } from '@mui/material';
import LeafletMap from './LeafletMap';
import { useSelector } from 'react-redux';
import { API_URL } from '../Config/api';
import axios from 'axios';

export default function FarmerVehicle() {
  const { farmer } = useSelector((state) => state.farmer);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/vehicles/farmersVehicle/${farmer.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        setVehicles(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch vehicles');
        console.error('Error fetching vehicles:', err);
      } finally {
        setLoading(false);
      }
    };

    if (farmer?.id) {
      fetchVehicles();
    }
  }, [farmer]);

  // Formik form for vehicle availability
  const formik = useFormik({
    initialValues: {
      rentalPrice: '',
      startWorkTime: '',
      endWorkTime: '',
      isAvailable: false
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `${API_URL}/api/vehicles/update/${selectedVehicle.id}`,
          {
            ...values,

        },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
          }
        );
        setVehicles(vehicles.map(v => 
          v.id === selectedVehicle.id ? { ...v, ...response.data } : v
        ));
        setSelectedVehicle(response.data);
      } catch (error) {
        console.error('Error updating vehicle:', error);
      }
    }
  });

  useEffect(() => {
    if (selectedVehicle) {
      formik.setValues({
        rentalPrice: selectedVehicle.rentalPrice || '',
        startWorkTime: selectedVehicle.startWorkTime || '',
        endWorkTime: selectedVehicle.endWorkTime || '',
        isAvailable: selectedVehicle.isAvailable || false
      });
    }
  }, [selectedVehicle]);

  return (
    <div className="p-4 grid gap-6">
      <h2 className="text-2xl font-bold text-center">Your Vehicles</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vehicles.map(vehicle => (
          <Card 
            key={vehicle.id} 
            className={`hover:shadow-lg cursor-pointer ${selectedVehicle?.id === vehicle.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedVehicle(vehicle)}
          >
            <img src={vehicle.images} alt={vehicle.type} className="h-40 w-full object-cover rounded-t" />
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{vehicle.type}</h3>
              <p>Reg No: {vehicle.registration}</p>
              <div className="flex items-center gap-2 mt-2">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    formik.setFieldValue('isAvailable', !vehicle.isAvailable);
                  }}
                  style={{ background: "none", border: "none" }}
                >
                  {vehicle.isAvailable ? (
                    <ToggleRight color="#4CAF50" size={24} />
                  ) : (
                    <ToggleLeft color="#9E9E9E" size={24} />
                  )}
                </button>
                <span>Available: {vehicle.isAvailable ? 'Yes' : 'No'}</span>
              </div>
              <p className="mt-2">
                Status: {vehicle.rentalPrice ? '✅ Ready' : '❌ Setup required'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedVehicle && (
        <Card className="p-4 mt-4">
          <h3 className="text-xl font-semibold mb-2">{selectedVehicle.registration}</h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price per hour (Rs)</label>
                <Input
                  name="rentalPrice"
                  type="number"
                  value={formik.values.rentalPrice}
                  onChange={formik.handleChange}
                  placeholder="Enter price per hour"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <Input
                  name="startWorkTime"
                  type="time"
                  value={formik.values.startWorkTime}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <Input
                  name="endWorkTime"
                  type="time"
                  value={formik.values.endWorkTime}
                  onChange={formik.handleChange}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => formik.setFieldValue('isAvailable', !formik.values.isAvailable)}
                  style={{ background: "none", border: "none" }}
                >
                  {formik.values.isAvailable ? (
                    <ToggleRight color="#4CAF50" size={24} />
                  ) : (
                    <ToggleLeft color="#9E9E9E" size={24} />
                  )}
                </button>
                <span>Make this vehicle available</span>
              </div>

              <Button type="submit">Update Vehicle Details</Button>
            </div>
          </form>
        </Card>
      )}

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