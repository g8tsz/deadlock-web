"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type SchoolPin = { id: string; name: string; slug: string; lat: number; lng: number };

export default function SchoolsMap({ schools }: { schools: SchoolPin[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || schools.length === 0) return;

    const map = L.map(containerRef.current).setView([39.5, -98.35], 4);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OSM &copy; CARTO',
    }).addTo(map);

    schools.forEach((sc) => {
      L.marker([sc.lat, sc.lng])
        .addTo(map)
        .bindPopup(`<a href="/schools/${sc.slug}" style="color:#c9a227">${sc.name}</a>`);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [schools]);

  return <div ref={containerRef} className="h-[400px] w-full rounded-lg" />;
}
