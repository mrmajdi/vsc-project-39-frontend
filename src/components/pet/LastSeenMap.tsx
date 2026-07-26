'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const LastSeenMap = ({ location }: { lat: number; lng: number; address?: string }) => {
  const [leaflet, setLeaflet] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load Leaflet CSS and library
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        await import('leaflet/dist/leaflet.css');
        const leafletModule = await import('leaflet');
        setLeaflet(leafletModule.default);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
        setLoading(false);
      }
    };

    loadLeaflet();
  }, []);

  // Initialize or update map when leaflet and location are available
  useEffect(() => {
    if (!leaflet || !location || !mapRef.current || !loading) return;

    const L = leaflet;

    if (!mapInstanceRef.current) {
      // Initialize map
      const mapInstance = L.map(mapRef.current, {
        center: [location.lat, location.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      const marker = L.marker([location.lat, location.lng]).addTo(mapInstance);
      markerRef.current = marker;
      mapInstanceRef.current = mapInstance;
      setMap(mapInstance);
    } else {
      // Update existing map
      markerRef.current?.setLatLng([location.lat, location.lng]);
      mapInstanceRef.current?.setView([location.lat, location.lng], 13);
    }
  }, [leaflet, location, loading]);

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="h-64 w-full rounded-lg border border-neutral-200 overflow-hidden">
        <div className="bg-neutral-100 animate-pulse h-full w-full"></div>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">آخرین موقعیت دیده شدن</h3>
      <div className="h-64 w-full rounded-lg border border-neutral-200 overflow-hidden">
        <div ref={mapRef} className="h-full w-full"></div>
      </div>
      {location.address && (
        <div className="mt-2 flex items-center text-sm text-neutral-600">
          <span className="me-2 flex-shrink-0">
            <span className="h-2.5 w-2.5 bg-secondary rounded-full"></span>
          </span>
          <span>{location.address}</span>
        </div>
      )}
    </>
  );
};

export default LastSeenMap;
