/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Bike, MapPin } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { useEffect, useMemo } from "react";

// Custom Icon Creator
const createCustomIcon = (IconComponent: any, color: string) => {
  const iconMarkup = renderToStaticMarkup(
    <div style={{ color, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
      <IconComponent size={32} strokeWidth={2.5} />
    </div>,
  );

  return L.divIcon({
    html: iconMarkup,
    className: "custom-leaflet-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// ✅ Map কে স্মুথলি আপডেট করার জন্য Helper Component
function MapUpdater({
  riderCoords,
  customerCoords,
}: {
  riderCoords: [number, number];
  customerCoords: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    if (riderCoords && !isNaN(riderCoords[0]) && !isNaN(riderCoords[1])) {
      // রাইডার মুভ করলে ম্যাপ তাকে ফলো করবে smoothly
      map.panTo(riderCoords, { animate: true, duration: 1.5 });
    }
  }, [riderCoords, map]);

  return null;
}

interface MapProps {
  riderLocation: [number, number];
  customerLocation: [number, number];
}

export default function MapComponent({
  riderLocation,
  customerLocation,
}: MapProps) {
  // Icons memoized logic
  const bikeIcon = useMemo(() => createCustomIcon(Bike, "#1A4E11"), []);
  const homeIcon = useMemo(() => createCustomIcon(MapPin, "#ef4444"), []);

  // Validation logic
  const isValidCustomer =
    Array.isArray(customerLocation) &&
    customerLocation.length === 2 &&
    !isNaN(customerLocation[0]) &&
    !isNaN(customerLocation[1]);

  const isValidRider =
    Array.isArray(riderLocation) &&
    riderLocation.length === 2 &&
    !isNaN(riderLocation[0]) &&
    !isNaN(riderLocation[1]);

  // Initial center prioritizing rider, then customer, then Dhaka
  const initialCenter: [number, number] = isValidRider
    ? riderLocation
    : isValidCustomer
      ? customerLocation
      : [23.8103, 90.4125];

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={initialCenter}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false} // Clean UI এর জন্য zoom control অফ রাখতে পারেন
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {/* কাস্টমার লোকেশন (Home) */}
        {isValidCustomer && (
          <Marker position={customerLocation} icon={homeIcon} />
        )}

        {/* রাইডার লোকেশন (Bike) */}
        {isValidRider && <Marker position={riderLocation} icon={bikeIcon} />}

        {/* ✅ ম্যাপ মুভমেন্ট হ্যান্ডেলার */}
        <MapUpdater
          riderCoords={isValidRider ? riderLocation : initialCenter}
          customerCoords={isValidCustomer ? customerLocation : initialCenter}
        />
      </MapContainer>
    </div>
  );
}
