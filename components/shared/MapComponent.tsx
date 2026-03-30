/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bike, MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useEffect, useMemo } from 'react';

const createCustomIcon = (IconComponent: any, color: string) => {
  const iconMarkup = renderToStaticMarkup(
    <div style={{ color, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
      <IconComponent size={32} strokeWidth={3} />
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    const [lat, lng] = coords;

    // ✅ FIX: proper validation (0 allow, NaN block)
    if (!isNaN(lat) && !isNaN(lng)) {
      map.setView([lat, lng], map.getZoom(), {
        animate: true,
      });
    }
  }, [coords, map]); // ✅ FIX: full dependency

  return null;
}

interface MapProps {
  riderLocation: [number, number];
  customerLocation: [number, number];
}

export default function MapComponent({ riderLocation, customerLocation }: MapProps) {

  const bikeIcon = useMemo(() => createCustomIcon(Bike, '#1A4E11'), []);
  const homeIcon = useMemo(() => createCustomIcon(MapPin, '#ef4444'), []);

  // ✅ FIX: better validation
  const isValidCustomer =
    Array.isArray(customerLocation) &&
    !isNaN(customerLocation[0]) &&
    !isNaN(customerLocation[1]);

  const isValidRider =
    Array.isArray(riderLocation) &&
    !isNaN(riderLocation[0]) &&
    !isNaN(riderLocation[1]);

  // ✅ FIX: fallback center logic improved
  const center: [number, number] = isValidCustomer
    ? customerLocation
    : isValidRider
    ? riderLocation
    : [23.8103, 90.4125];

  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />

      {isValidCustomer && (
        <Marker position={customerLocation} icon={homeIcon} />
      )}

      {isValidRider && (
        <Marker position={riderLocation} icon={bikeIcon} />
      )}

      {/* ✅ FIX: fallback if rider নাই */}
      <RecenterMap coords={isValidRider ? riderLocation : center} />
    </MapContainer>
  );
}
