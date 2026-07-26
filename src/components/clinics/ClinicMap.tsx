'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

type MarkerData = {
  id: string | number;
  name: string;
  lat: number;
  lng: number;
  address: string;
};

type ClinicMapProps = {
  markers: MarkerData[];
  height?: string;
  onSelect?: (id: string | number) => void;
};

export default function ClinicMap({
  markers,
  height = 'h-64',
  onSelect,
}: ClinicMapProps) {
  const center = useMemo(() => {
    if (markers.length > 0) {
      const first = markers[0];
      return [first.lat, first.lng] as [number, number];
    }
    return [35.6892, 51.3890] as [number, number];
  }, [markers]);

  if (markers.length === 0) {
    return (
      <div className={`relative w-full ${height} rounded-lg overflow-hidden border border-neutral-200 flex items-center justify-center`}>
        <span className="text-neutral-600">موقعیتی موجود نیست</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${height} rounded-lg overflow-hidden border border-neutral-200`}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        zoomControl={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            eventHandlers={{
              click: () => {
                onSelect?.(marker.id);
              },
            }}
          >
            <Popup>
              <div className="text-sm font-medium text-neutral-900">{marker.name}</div>
              <div className="text-xs text-neutral-600">{marker.address}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
