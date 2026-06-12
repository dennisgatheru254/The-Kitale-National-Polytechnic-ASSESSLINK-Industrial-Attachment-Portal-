/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Sparkles } from 'lucide-react';

interface CapturePreviewMapProps {
  lat: number;
  lng: number;
  companyName?: string;
  companyAddress?: string;
}

export default function CapturePreviewMap({
  lat,
  lng,
  companyName = 'My Location',
  companyAddress = 'Captured Landmark Address'
}: CapturePreviewMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false, // keep it friendly inside forms
    });

    // Clean, high quality Osm tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; Light Spatial Mappings'
    }).addTo(map);

    // Dynamic modern marker icon
    const previewIcon = L.divIcon({
      html: `<div class="relative flex items-center justify-center">
               <div class="absolute w-10 h-10 bg-[#7B1C2E]/20 scale-125 animate-ping rounded-full"></div>
               <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg bg-[#7B1C2E] text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
               </div>
             </div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });

    const marker = L.marker([lat, lng], { icon: previewIcon }).addTo(map);

    const popupContent = document.createElement('div');
    popupContent.className = 'p-2 font-sans text-xs leading-normal text-slate-850';
    popupContent.innerHTML = `
      <div class="font-bold text-[#7B1C2E] text-[11px] mb-0.5">${companyName}</div>
      <div class="text-[10px] text-gray-550 leading-snug">${companyAddress}</div>
      <div class="font-mono text-[9px] text-[#7B1C2E] mt-1 border-t pt-1">
        🛰️ GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}
      </div>
    `;

    marker.bindPopup(L.popup({ maxWidth: 200, className: 'knpss-custom-popup' }).setContent(popupContent)).openPopup();

    markerRef.current = marker;
    mapInstanceRef.current = map;

    // Auto-adjust layout sizes in React virtual domes
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [lat, lng, companyName, companyAddress]);

  return (
    <div className="space-y-2 mt-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold text-[#7B1C2E] tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#7B1C2E] animate-pulse" />
          Live GPS Location Preview Map
        </span>
        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Ready to Register
        </span>
      </div>
      <div 
        ref={mapContainerRef} 
        className="w-full h-[180px] rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-slate-50 relative z-25"
        id="preview-map-container"
      />
      <p className="text-[10px] text-gray-500 leading-snug">
        📍 Centered exactly over <strong>{companyName}</strong> at <strong>{lat.toFixed(5)}, {lng.toFixed(5)}</strong>. Please verify this pin fits your host workplace boundaries.
      </p>
    </div>
  );
}
