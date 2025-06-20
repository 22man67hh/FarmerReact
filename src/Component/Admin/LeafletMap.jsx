import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle click
const LocationMarker = ({ selectedPosition, setSelectedPosition }) => {
  useMapEvents({
    click(e) {
      setSelectedPosition(e.latlng);
    },
  });

  return selectedPosition ? <Marker position={selectedPosition} /> : null;
};

// Component to add geocoder search control
const GeocoderControl = ({ setSelectedPosition }) => {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false
    })
      .on('markgeocode', function (e) {
        const latlng = e.geocode.center;
        setSelectedPosition(latlng);
        map.setView(latlng, 16);
      })
      .addTo(map);

    return () => map.removeControl(geocoder);
  }, [map, setSelectedPosition]);

  return null;
};

export default function LeafletMap({ selectedPosition, setSelectedPosition }) {
  return (
    <MapContainer
      center={[27.7172, 85.3240]}
      zoom={13}
      style={{ height: '300px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
      />
      <GeocoderControl setSelectedPosition={setSelectedPosition} />
    </MapContainer>
  );
}
