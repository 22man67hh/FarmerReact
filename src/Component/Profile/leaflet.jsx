import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import { IconButton, InputAdornment, TextField, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, onPositionSelected }) => {
  const map = useMapEvents({
    click(e) {
      onPositionSelected(e.latlng, 'mapClick');
    },
  });

  // Update marker position when dragged
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);

  return position ? <Marker position={position} draggable={true} eventHandlers={{
    dragend: (e) => {
      onPositionSelected(e.target.getLatLng(), 'markerDrag');
    }
  }} /> : null;
};

export default function LeafletMap({ selectedPosition, onPositionSelected, initialAddress }) {
  const [searchQuery, setSearchQuery] = useState(initialAddress || '');
  const mapRef = useRef();
  const [address, setAddress] = useState('');

  // Reverse geocode when position changes
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || '';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return '';
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const firstResult = data[0];
        const lat = parseFloat(firstResult.lat);
        const lon = parseFloat(firstResult.lon);
        const newPosition = { lat, lng: lon };
        
        // Get address from coordinates
        const address = await reverseGeocode(lat, lon);
        setAddress(address);
        setSearchQuery(address);
        
        // Update the map view
        if (mapRef.current) {
          mapRef.current.flyTo([lat, lon], 15);
        }
        
        // Update the selected position with address
        onPositionSelected({
          ...newPosition,
          address
        }, 'search');
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
    }
  };

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      <TextField
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search location..."
        size="small"
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1000,
          width: '300px',
          backgroundColor: 'white',
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
      
      <MapContainer
        center={selectedPosition ? [selectedPosition.lat, selectedPosition.lng] : [27.7172, 85.3240]}
        zoom={13}
        style={{ height: '300px', width: '100%' }}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          position={selectedPosition} 
          onPositionSelected={async (latlng, source) => {
            const address = await reverseGeocode(latlng.lat, latlng.lng);
            setAddress(address);
            setSearchQuery(address);
            onPositionSelected({
              ...latlng,
              address
            }, source);
          }} 
        />
      </MapContainer>
    </Box>
  );
}