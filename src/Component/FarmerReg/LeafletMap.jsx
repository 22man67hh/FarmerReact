import React, { useState, useRef } from 'react';
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

const LocationMarker = ({ onPositionSelected }) => {
  useMapEvents({
    click(e) {
      onPositionSelected(e.latlng);
    },
  });

  return null;
};

export default function LeafletMap({ selectedPosition, onPositionSelected }) {
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef();

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
        
        // Update the map view
        if (mapRef.current) {
          mapRef.current.flyTo([lat, lon], 15);
        }
        
        // Update the selected position
        onPositionSelected(newPosition);
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
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
        {selectedPosition && <Marker position={[selectedPosition.lat, selectedPosition.lng]} />}
        <LocationMarker onPositionSelected={onPositionSelected} />
      </MapContainer>
    </Box>
  );
}