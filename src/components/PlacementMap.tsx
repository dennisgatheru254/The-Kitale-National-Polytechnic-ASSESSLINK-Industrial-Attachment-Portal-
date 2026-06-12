/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import { 
  MapPin, 
  Map as MapIcon, 
  Search, 
  Filter, 
  HelpCircle, 
  Building, 
  User, 
  Phone, 
  Mail, 
  Navigation, 
  RotateCcw, 
  Users, 
  CheckCircle,
  Hash,
  Compass,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff
} from 'lucide-react';

interface PlacementMapProps {
  placements: any[];
  currentTraineePlacement?: any;
  onCaptureCoords?: (lat: number, lng: number) => void;
  onSelectPlacement?: (placement: any) => void;
}

const NAVIGATION_HUBS = [
  { name: "Nairobi City", coords: [-1.286389, 36.817223] as [number, number], zoom: 11 },
  { name: "Mombasa Coast", coords: [-4.043477, 39.668206] as [number, number], zoom: 12 },
  { name: "Kisumu Lake", coords: [-0.091702, 34.767957] as [number, number], zoom: 12 },
  { name: "Nakuru Town", coords: [-0.303099, 36.080025] as [number, number], zoom: 12 },
  { name: "Eldoret Tech", coords: [0.514277, 35.26978] as [number, number], zoom: 12 },
  { name: "Thika Industrial", coords: [-1.039602, 37.090001] as [number, number], zoom: 13 },
  { name: "Kakamega Forest", coords: [0.28422, 34.75229] as [number, number], zoom: 12 },
  { name: "Kisii Highlands", coords: [-0.68112, 34.77151] as [number, number], zoom: 12 },
  { name: "Machakos Hub", coords: [-1.517683, 37.263415] as [number, number], zoom: 12 },
  { name: "Naivasha Geothermal", coords: [-0.717178, 36.431026] as [number, number], zoom: 12 },
  { name: "Nanyuki Airfield", coords: [0.016335, 37.072221] as [number, number], zoom: 13 },
  { name: "Kericho Tea", coords: [-0.368889, 35.286389] as [number, number], zoom: 12 },
];

export default function PlacementMap({ 
  placements = [], 
  currentTraineePlacement, 
  onCaptureCoords,
  onSelectPlacement 
}: PlacementMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);

  // Filter states
  const [selectedCounty, setSelectedCounty] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedAssessor, setSelectedAssessor] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected placement for detail panel display
  const [activePlacement, setActivePlacement] = useState<any | null>(null);
  const [geoStatusMsg, setGeoStatusMsg] = useState<{ type: 'success' | 'error' | 'info' | null; text: string }>({ type: null, text: '' });
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);

  // View full screen toggle state
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [customLat, setCustomLat] = useState<string>('');
  const [customLng, setCustomLng] = useState<string>('');
  const [showCustomNav, setShowCustomNav] = useState<boolean>(false);
  const [showMapFilters, setShowMapFilters] = useState<boolean>(false);

  // States to inspect trainee full profile card dossier
  const [profileModalTrainee, setProfileModalTrainee] = useState<any | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Recalculate leaflet map bounds and size layout when full screen toggles
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
    }
  }, [isFullScreen]);

  // Capture list of unique counties, statuses, and assessors for filter dropdowns
  const counties = React.useMemo(() => Array.from(new Set(placements.map(p => p.county).filter(Boolean))), [placements]);
  const statuses = React.useMemo(() => Array.from(new Set(placements.map(p => p.status).filter(Boolean))), [placements]);
  const assessors = React.useMemo(() => Array.from(new Set(placements.map(p => p.assignedOfficer?.fullName || p.assignedOfficerId).filter(Boolean))), [placements]);

  // Filter placements list
  const filteredPlacements = React.useMemo(() => {
    return placements.filter(p => {
      // Coordinates validation
      const hasCoords = p.locationLat !== undefined && p.locationLng !== undefined && p.locationLat !== null && p.locationLng !== null;
      if (!hasCoords) return false;

      // Filters matching
      const matchesCounty = selectedCounty === 'ALL' || (p.county && p.county.toUpperCase() === selectedCounty.toUpperCase());
      const matchesStatus = selectedStatus === 'ALL' || (p.status && p.status.toUpperCase() === selectedStatus.toUpperCase());
      
      const assessorName = p.assignedOfficer?.fullName || p.assignedOfficerId || '';
      const matchesAssessor = selectedAssessor === 'ALL' || (assessorName && assessorName.toUpperCase() === selectedAssessor.toUpperCase());

      const query = searchQuery.toLowerCase().trim();
      const searchMatch = !query || 
        (p.companyName || '').toLowerCase().includes(query) ||
        (p.traineeUser?.fullName || '').toLowerCase().includes(query) ||
        (p.traineeEnrollment?.admissionNo || '').toLowerCase().includes(query) ||
        (p.supervisorName || '').toLowerCase().includes(query);

      return matchesCounty && matchesStatus && matchesAssessor && searchMatch;
    });
  }, [placements, selectedCounty, selectedStatus, selectedAssessor, searchQuery]);

  // Calculate high-level stats for Side Panel
  const totalTraineesCount = filteredPlacements.length;
  const uniqueCompanies = React.useMemo(() => Array.from(new Set(filteredPlacements.map(p => p.companyName))), [filteredPlacements]);
  const totalCompaniesCount = uniqueCompanies.length;
  
  // Extract assigned assessors
  const activeAssessors = React.useMemo(() => Array.from(new Set(filteredPlacements.map(p => p.assignedOfficer?.fullName || 'Unassigned'))), [filteredPlacements]);

  // Initialize map on mount and rebuild when Full Screen structure changes
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center in Nairobi County Area (Kenyatta Avenue)
    const map = L.map(mapContainerRef.current, {
      center: [-1.286389, 36.817223],
      zoom: 7,
      scrollWheelZoom: true
    });

    // Clean modern OSM tiles layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    markersGroupRef.current = L.featureGroup().addTo(map);
    mapInstanceRef.current = map;

    // Recalculate leaflet map bounds and size 
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isFullScreen]);

  // Sync / update markers on filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    // Clear old markers
    markersGroup.clearLayers();

    if (filteredPlacements.length === 0) return;

    // Perform manual responsive clustering mechanism (combines points at the exact same or near locations)
    const clusters: { lat: number; lng: number; items: any[] }[] = [];
    const PROXIMITY_THRESHOLD = 0.015; // Roughly 1.5km threshold for grouping/clustering

    filteredPlacements.forEach(p => {
      const pLat = parseFloat(p.locationLat);
      const pLng = parseFloat(p.locationLng);
      if (isNaN(pLat) || isNaN(pLng)) return;

      // Check proximity with existing cluster bubbles
      let closeCluster = clusters.find(c => {
        const dLat = Math.abs(c.lat - pLat);
        const dLng = Math.abs(c.lng - pLng);
        return dLat < PROXIMITY_THRESHOLD && dLng < PROXIMITY_THRESHOLD;
      });

      if (closeCluster) {
        closeCluster.items.push(p);
      } else {
        clusters.push({
          lat: pLat,
          lng: pLng,
          items: [p]
        });
      }
    });

    // Plot clustered markers
    clusters.forEach(cluster => {
      const isSingleGroup = cluster.items.length === 1;

      if (isSingleGroup) {
        const item = cluster.items[0];
        const isCurrentTrainee = currentTraineePlacement?.id === item.id;

        // Custom modern SVG marker matching design rules
        const singleMarkerIcon = L.divIcon({
          html: `<div class="relative flex items-center justify-center">
                   <div class="absolute w-10 h-10 bubble ${isCurrentTrainee ? 'bg-[#6D071A]/20 scale-125 animate-ping' : 'bg-blue-500/20'} rounded-full"></div>
                   <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-115 ${
                     isCurrentTrainee ? 'bg-[#6D071A] text-white ring-4 ring-[#6D071A]/20' : 'bg-blue-600 text-white hover:bg-blue-700'
                   }">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
                   </div>
                 </div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        });

        // Setup Leaflet Popup matching KNPSS modern design theme with a mini-profile card for the trainee
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 font-sans max-w-[280px] text-xs leading-relaxed text-slate-800 space-y-3';
        popupContent.innerHTML = `
          <div class="border-b border-gray-100 pb-1.5 mb-1.5 flex items-center justify-between">
            <span class="text-[9px] uppercase font-bold text-gray-400 block tracking-wider">Placement Marker</span>
            <span class="font-bold uppercase px-1.5 py-0.5 rounded text-[8px] bg-slate-100 text-[#6D071A] border border-[#6D071A]/10">${item.status}</span>
          </div>

          <!-- Mini-profile card for the trainee -->
          <div class="p-2.5 bg-slate-50 border border-slate-150 rounded-lg flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-[#6D071A] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
               ${(item.traineeUser?.fullName || 'T').charAt(0)}
            </div>
            <div class="min-w-0 flex-1">
              <h5 class="font-bold text-slate-950 truncate leading-none">${item.traineeUser?.fullName || 'Unspecified Trainee'}</h5>
              <p class="text-[10px] text-[#6D071A] truncate mt-1 font-semibold">${item.traineeEnrollment?.courseName || 'Industrial Attachment Track'}</p>
              <p class="text-[9px] text-gray-400 truncate mt-0.5 font-mono">${item.traineeEnrollment?.admissionNo || 'N/A'}</p>
            </div>
          </div>

          <div class="space-y-1 text-slate-700 bg-slate-50/50 p-2 rounded border border-dashed border-gray-200">
            <p class="flex items-center gap-1.5 truncate">
              <span class="font-semibold text-slate-900">Workplace:</span> <span>${item.companyName}</span>
            </p>
            <p class="flex items-center gap-1.5">
              <span class="font-semibold text-slate-900">County Hub:</span> ${item.county || 'Nairobi'}
            </p>
            <p class="flex items-center gap-1.5">
              <span class="font-semibold text-slate-900">Supervisor:</span> ${item.supervisorName || 'Pending assign'}
            </p>
          </div>

          <!-- View Full Profile Button -->
          <button
            type="button"
            data-view-profile-id="${item.id}"
            class="w-full bg-[#6D071A] hover:bg-[#5C0515] text-white py-1.5 px-3 rounded-lg text-center font-bold text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer hover:shadow-xs"
          >
            <span>View Full Profile</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
            </svg>
          </button>

          <p class="font-mono text-[8px] text-slate-400 text-center leading-none pt-1">
            GPS: ${parseFloat(item.locationLat).toFixed(5)}, ${parseFloat(item.locationLng).toFixed(5)}
          </p>
        `;

        const markerPopup = L.popup({
          maxWidth: 300,
          className: 'knpss-custom-popup'
        }).setContent(popupContent);

        markerPopup.on('open', () => {
          setTimeout(() => {
            const btn = popupContent.querySelector(`[data-view-profile-id="${item.id}"]`);
            if (btn) {
              btn.addEventListener('click', () => {
                setProfileModalTrainee(item);
                setIsProfileModalOpen(true);
              });
            }
          }, 80);
        });

        const marker = L.marker([cluster.lat, cluster.lng], { icon: singleMarkerIcon })
          .bindPopup(markerPopup)
          .on('click', () => {
            setActivePlacement(item);
            if (onSelectPlacement) onSelectPlacement(item);
          });

        markersGroup.addLayer(marker);
      } else {
        // Render Grouped / Clustered bubble pin for density control
        const isCurrentInGroup = cluster.items.some(x => x.id === currentTraineePlacement?.id);
        
        const clusterMarkerIcon = L.divIcon({
          html: `<div class="relative flex items-center justify-center">
                   <div class="absolute w-12 h-12 bg-amber-500/10 rounded-full scale-110 animate-pulse"></div>
                   <div class="flex items-center justify-center w-10 h-10 rounded-full text-white shadow-xl font-bold font-mono text-xs border-2 border-white transition-opacity ${
                     isCurrentInGroup ? 'bg-[#6D071A] ring-4 ring-[#6D071A]/20' : 'bg-slate-800 ring-4 ring-slate-800/15'
                   }">
                     <span>${cluster.items.length}</span>
                   </div>
                 </div>`,
          className: '',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20]
        });

        // Setup Cluster Leaflet popup with all grouped trainees listed
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 font-sans max-w-[290px] text-xs leading-relaxed text-slate-800 space-y-2';
        
        let traineesHtmlList = cluster.items.map(p => `
          <div class="py-1.5 border-b border-gray-100 last:border-b-0 space-y-0.5 flex flex-col">
            <div class="flex justify-between items-center gap-1">
              <span class="font-bold text-slate-900 hover:underline hover:text-[#6D071A] cursor-pointer block truncate" data-placement-id="${p.id}">${p.traineeUser?.fullName || 'Trainee'}</span>
              <span class="text-[8px] font-bold px-1.5 py-0.2 rounded uppercase leading-none bg-slate-100 text-slate-600 shrink-0">${p.status}</span>
            </div>
            <div class="flex justify-between items-center text-[10px] text-slate-500">
              <span class="truncate pr-2">${p.companyName}</span>
              <button
                type="button"
                data-cluster-profile-id="${p.id}"
                class="text-[#6D071A] font-extrabold hover:underline whitespace-nowrap cursor-pointer shrink-0"
              >
                Profile →
              </button>
            </div>
          </div>
        `).join('');

        popupContent.innerHTML = `
          <div class="border-b border-gray-100 pb-1.5 mb-2">
            <span class="text-[9px] uppercase font-bold text-amber-600 block tracking-wider">Trainees Density Cluster</span>
            <h4 class="font-bold text-[13px] text-slate-800 leading-snug">${cluster.items.length} Trainees Placed Here</h4>
          </div>
          <div class="max-h-[160px] overflow-y-auto space-y-1 pr-1">
            ${traineesHtmlList}
          </div>
          <p class="text-[9px] text-gray-450 text-center italic mt-1.5">Click on a name or profile button to inspect detailed file.</p>
        `;

        // Listen to dynamically generated elements inside Leaflet Popup
        const markerPopup = L.popup({
          maxWidth: 300,
          className: 'knpss-custom-popup'
        }).setContent(popupContent);

        markerPopup.on('open', () => {
          setTimeout(() => {
            const traineeLinks = popupContent.querySelectorAll('[data-placement-id]');
            traineeLinks.forEach(link => {
              link.addEventListener('click', (e) => {
                const pId = (e.target as HTMLElement).getAttribute('data-placement-id');
                const matchedItem = cluster.items.find(x => x.id === pId);
                if (matchedItem) {
                  setActivePlacement(matchedItem);
                  if (onSelectPlacement) onSelectPlacement(matchedItem);
                }
              });
            });

            // Handle the Profile click buttons inside clusters-
            const profileButtons = popupContent.querySelectorAll('[data-cluster-profile-id]');
            profileButtons.forEach(btn => {
              btn.addEventListener('click', (e) => {
                const pId = (e.currentTarget as HTMLElement).getAttribute('data-cluster-profile-id');
                const matchedItem = cluster.items.find(x => x.id === pId);
                if (matchedItem) {
                  setProfileModalTrainee(matchedItem);
                  setIsProfileModalOpen(true);
                }
              });
            });
          }, 100);
        });

        const marker = L.marker([cluster.lat, cluster.lng], { icon: clusterMarkerIcon })
          .bindPopup(markerPopup);

        markersGroup.addLayer(marker);
      }
    });

    // Auto fit bounds beautifully to visible markers so assessors/directors see them without zooming manual
    const bounds = markersGroup.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [filteredPlacements, currentTraineePlacement, isFullScreen]);

  // Center on current trainee coordinates trigger
  const handleViewOnMap = () => {
    const map = mapInstanceRef.current;
    if (!map || !currentTraineePlacement) return;

    const lat = parseFloat(currentTraineePlacement.locationLat);
    const lng = parseFloat(currentTraineePlacement.locationLng);

    if (isNaN(lat) || isNaN(lng)) {
      setGeoStatusMsg({ type: 'error', text: 'This trainee coordinates are not registered yet.' });
      return;
    }

    map.setView([lat, lng], 13);
    setGeoStatusMsg({ type: 'success', text: `Map centered on ${currentTraineePlacement.companyName || 'placement location'}!` });
    
    // Automatically retrieve the placement detail
    setActivePlacement(currentTraineePlacement);

    // Fade status message after 3 seconds
    setTimeout(() => setGeoStatusMsg({ type: null, text: '' }), 4000);
  };

  // Browser Geolocation capture function
  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatusMsg({ type: 'error', text: 'Browser Geolocation is not supported.' });
      return;
    }

    setIsLoadingGeo(true);
    setGeoStatusMsg({ type: 'info', text: 'Accessing device satellite/GPS triggers...' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsLoadingGeo(false);
        setGeoStatusMsg({
          type: 'success',
          text: `Location captured: Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`
        });

        // Trigger parent callback
        if (onCaptureCoords) {
          onCaptureCoords(latitude, longitude);
        }

        // Pans map automatically to newly registered position
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 14);
        }

        setTimeout(() => setGeoStatusMsg({ type: null, text: '' }), 4000);
      },
      (error) => {
        setIsLoadingGeo(false);
        let errorMsg = 'Failed to fetch GPS coordinates.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'GPS Permission Denied. Please enable location permissions in browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'GPS signal is currently unavailable.';
        }
        setGeoStatusMsg({ type: 'error', text: errorMsg });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleRecenterAll = () => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    const bounds = markersGroup.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 13 });
    } else {
      map.setView([-1.286389, 36.817223], 7);
    }
  };

  const mapContent = (
    <div className={`bg-white font-sans ${isFullScreen ? 'fixed inset-0 z-[99999] w-screen h-screen flex flex-col rounded-none overflow-hidden m-0 p-0' : 'border border-[#E8E8E8] rounded-xl overflow-hidden shadow-sm flex flex-col'}`}>
      
      {/* Search & Filtration Controls Bar (Only when not in fullscreen mode) */}
      {!isFullScreen && (
        <div className="p-4 bg-slate-50 border-b border-gray-150 flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-3 flex-grow">
            {/* Search query input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6D071A] text-ellipsis placeholder:text-gray-400"
                placeholder="Search Trainee, Company, Supervisor..."
              />
            </div>

            {/* County selection */}
            <div>
              <select
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6D071A]"
              >
                <option value="ALL">All Counties ({counties.length})</option>
                {counties.map(co => (
                  <option key={co} value={co.toUpperCase()}>{co}</option>
                ))}
              </select>
            </div>

            {/* Status Selection */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6D071A]"
              >
                <option value="ALL">All Attachment Statuses</option>
                {statuses.map(st => (
                  <option key={st} value={st.toUpperCase()}>{st}</option>
                ))}
              </select>
            </div>

            {/* Assessor selection */}
            <div>
              <select
                value={selectedAssessor}
                onChange={(e) => setSelectedAssessor(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6D071A]"
              >
                <option value="ALL">All Assigned Assessors</option>
                {assessors.map(as => (
                  <option key={as} value={as.toUpperCase()}>{as}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Viewport Full Screen button toggle */}
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border transition-all bg-white hover:bg-gray-100 text-slate-800 border-gray-300 shadow-sm"
            title="Expand Map Viewport"
          >
            <Maximize2 className="w-4 h-4 text-slate-600" />
            <span>Full Screen</span>
          </button>

        </div>
      )}

      {/* Primary Layout Block: Flex/Grid with Map and Sidebar Information pane */}
      <div className={`flex flex-col lg:flex-row relative ${isFullScreen ? 'flex-grow h-0 min-h-0 overflow-hidden' : 'min-h-[460px]'}`}>
        
        {/* Left Side Content: Actual Map Container */}
        <div className={`relative z-10 w-full map-overlay-keep-light ${isFullScreen ? 'flex-1 min-h-0 lg:h-full h-full' : 'flex-1 min-h-[350px] lg:min-h-[480px]'}`}>
          <div ref={mapContainerRef} className={`w-full h-full bg-slate-100 ${isFullScreen ? 'rounded-none' : 'min-h-[350px] lg:min-h-[480px]'}`} />
          
          {/* FLOATING MAP FILTERS CARD IN FULLSCREEN MODE */}
          {isFullScreen && showMapFilters && (
            <div className="absolute top-3 left-12 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-200/90 max-w-[310px] w-[calc(100vw-64px)] flex flex-col gap-3 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="font-bold text-xs text-gray-800 uppercase tracking-wide flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-[#6D071A]" />
                  <span>Map Filters</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowMapFilters(false)}
                  className="text-gray-400 hover:text-gray-600 font-extrabold text-sm"
                >
                  ×
                </button>
              </div>

              {/* Search query input */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6D071A] text-ellipsis placeholder:text-gray-400"
                  placeholder="Search Trainee, Company, Supervisor..."
                />
              </div>

              {/* County selection */}
              <div>
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6D071A]"
                >
                  <option value="ALL">All Counties ({counties.length})</option>
                  {counties.map(co => (
                    <option key={co} value={co.toUpperCase()}>{co}</option>
                  ))}
                </select>
              </div>

              {/* Status Selection */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6D071A]"
                >
                  <option value="ALL">All Attachment Statuses</option>
                  {statuses.map(st => (
                    <option key={st} value={st.toUpperCase()}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Assessor selection */}
              <div>
                <select
                  value={selectedAssessor}
                  onChange={(e) => setSelectedAssessor(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6D071A]"
                >
                  <option value="ALL">All Assigned Assessors</option>
                  {assessors.map(as => (
                    <option key={as} value={as.toUpperCase()}>{as}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCounty('ALL');
                  setSelectedStatus('ALL');
                  setSelectedAssessor('ALL');
                  setSearchQuery('');
                }}
                className="w-full py-1.5 mt-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold uppercase transition"
              >
                Clear All Filters
              </button>
            </div>
          )}
          
          {/* Quick Places & Navigation overlay panel (Top Left) */}
          <div className="absolute top-2 left-12 flex flex-col gap-1.5 z-[999]">
            <div className="bg-white/95 backdrop-blur-md p-1 px-2 rounded-lg shadow-md border border-gray-200/80 flex items-center gap-1.5 max-w-[200px] xs:max-w-xs transition-all">
              <Compass className="w-3.5 h-3.5 text-[#6D071A] shrink-0" />
              <select
                className="bg-transparent border-none text-[10px] sm:text-[11px] font-bold text-gray-800 focus:outline-none focus:ring-0 pr-5 pl-0.5 cursor-pointer max-w-[110px] sm:max-w-xs"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "ALL") return;
                  if (val === "CUSTOM") {
                    setShowCustomNav(true);
                    return;
                  }
                  const found = NAVIGATION_HUBS.find(h => h.name === val);
                  if (found && mapInstanceRef.current) {
                    mapInstanceRef.current.setView(found.coords, found.zoom);
                  }
                }}
                defaultValue="ALL"
              >
                <option value="ALL">🧭 Navigate to...</option>
                {NAVIGATION_HUBS.map((hub) => (
                  <option key={hub.name} value={hub.name}>{hub.name}</option>
                ))}
                <option value="CUSTOM">📍 Enter Custom GPS Coordinates...</option>
              </select>
            </div>

            {/* Custom Coordinates lookup drawer */}
            {showCustomNav && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const latVal = parseFloat(customLat);
                  const lngVal = parseFloat(customLng);
                  if (!isNaN(latVal) && !isNaN(lngVal) && mapInstanceRef.current) {
                    mapInstanceRef.current.setView([latVal, lngVal], 13);
                    const marker = L.marker([latVal, lngVal], {
                      icon: L.divIcon({
                        className: 'custom-gps-marker',
                        html: `<div class="bg-[#7B1C2E] border-2 border-white w-6 h-6 rounded-full shadow-lg flex items-center justify-center text-white"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B1C2E] opacity-75"></span>📍</div>`,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                      })
                    })
                    .addTo(mapInstanceRef.current)
                    .bindPopup(`<div class="font-sans text-xs p-1"><b>Custom Nav Target:</b><br/>Lat: ${latVal}<br/>Lng: ${lngVal}</div>`)
                    .openPopup();
                  }
                }}
                className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-gray-200/90 text-[10px] sm:text-xs text-gray-800 flex flex-col gap-2 max-w-[180px] xs:max-w-[210px] animate-fade-in"
              >
                <div className="flex items-center justify-between border-b pb-1">
                  <span className="font-bold text-[#6D071A]">Navigate Coordinates</span>
                  <button 
                    type="button" 
                    onClick={() => setShowCustomNav(false)} 
                    className="text-gray-400 hover:text-gray-600 font-extrabold text-xs"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-1">
                  <label className="block text-[8px] uppercase tracking-wider font-semibold text-gray-500">Latitude</label>
                  <input 
                    type="text" 
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    placeholder="-1.286389" 
                    className="w-full px-2 py-1 border rounded text-[10px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[8px] uppercase tracking-wider font-semibold text-gray-500">Longitude</label>
                  <input 
                    type="text" 
                    value={customLng}
                    onChange={(e) => setCustomLng(e.target.value)}
                    placeholder="36.817223" 
                    className="w-full px-2 py-1 border rounded text-[10px]"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#6D071A] hover:bg-[#5C0515] text-white py-1 rounded text-[10px] font-bold"
                >
                  Locate & Pin Area
                </button>
              </form>
            )}
          </div>

          {/* Quick Controls overlay panel */}
          <div className="absolute top-2 right-2 md:top-3 md:right-3 flex flex-col gap-1.5 z-[999] items-end">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="px-2 py-1 md:px-3 md:py-1.5 bg-[#6D071A] text-white text-[10px] md:text-[11px] font-semibold rounded-lg shadow-md border border-[#6D071A] hover:bg-[#5C0515] flex items-center gap-1 cursor-pointer leading-none"
              title={isFullScreen ? "Exit Viewport Full Screen" : "Expand Map Viewport"}
            >
              {isFullScreen ? (
                <>
                  <Minimize2 className="w-3 h-3 text-white" />
                  <span>Exit Full Screen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3 h-3 text-white" />
                  <span>Full Screen</span>
                </>
              )}
            </button>

            {isFullScreen && (
              <button
                type="button"
                onClick={() => setShowSidebar(!showSidebar)}
                className="px-2 py-1 md:px-3 md:py-1.5 bg-[#6D071A] text-white text-[10px] md:text-[11px] font-semibold rounded-lg shadow-md border border-[#6D071A] hover:bg-[#5C0515] flex items-center gap-1 cursor-pointer leading-none"
                title={showSidebar ? "Hide Stats and Metrics Panel" : "Show Stats and Metrics Panel"}
              >
                {showSidebar ? <EyeOff className="w-3 h-3 text-white" /> : <Eye className="w-3 h-3 text-white" />}
                <span>{showSidebar ? "Hide Stats" : "Show Stats"}</span>
              </button>
            )}

            {isFullScreen && (
              <button
                type="button"
                onClick={() => setShowMapFilters(!showMapFilters)}
                className="px-2 py-1 md:px-3 md:py-1.5 bg-[#6D071A] text-white text-[10px] md:text-[11px] font-semibold rounded-lg shadow-md border border-[#6D071A] hover:bg-[#5C0515] flex items-center gap-1 cursor-pointer leading-none"
                title={showMapFilters ? "Hide Map Filter Controls" : "Show Map Filter Controls"}
              >
                <Filter className="w-3 h-3 text-white" />
                <span>{showMapFilters ? "Hide Filters" : "Filter Map"}</span>
              </button>
            )}

            <button
              onClick={handleRecenterAll}
              className="px-2 py-1 md:px-3 md:py-1.5 bg-white text-slate-800 text-[10px] md:text-[11px] font-semibold rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 flex items-center gap-1 cursor-pointer leading-none"
              title="Recenter Map Bounds"
            >
              <RotateCcw className="w-3 h-3 text-[#6D071A]" />
              <span className="hidden xs:inline">Recenter Map</span>
              <span className="xs:hidden">Recenter</span>
            </button>
            
            {currentTraineePlacement && (
              <button
                onClick={handleViewOnMap}
                className="px-2 py-1 md:px-3 md:py-1.5 bg-white text-slate-800 text-[10px] md:text-[11px] font-semibold rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 flex items-center gap-1 cursor-pointer leading-none"
                title="Zoom directly to your placement location"
              >
                <Compass className="w-3 h-3 text-[#6D071A]" />
                <span>View on Map</span>
              </button>
            )}

            {onCaptureCoords && (
              <button
                onClick={handleCaptureLocation}
                disabled={isLoadingGeo}
                className={`px-2 py-1 md:px-3 md:py-1.5 bg-[#6D071A] text-white text-[10px] md:text-[11px] font-semibold rounded-lg shadow-md border border-[#6D071A] hover:bg-[#5C0515] flex items-center gap-1 cursor-pointer leading-none ${
                  isLoadingGeo ? 'opacity-70 cursor-wait' : ''
                }`}
                title="Detect and use current device location"
              >
                <Navigation className={`w-3 h-3 ${isLoadingGeo ? 'animate-spin' : ''}`} />
                <span>Capture Location</span>
              </button>
            )}
          </div>

          {/* Location details fallback banner */}
          {currentTraineePlacement && (!currentTraineePlacement.locationLat || !currentTraineePlacement.locationLng) && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-[999]">
              <div className="bg-white p-6 rounded-xl border max-w-sm text-center shadow-lg space-y-3.5">
                <MapPin className="w-12 h-12 text-[#6D071A] mx-auto animate-bounce" />
                <div>
                  <h5 className="font-bold text-gray-900 text-sm">Location not yet registered.</h5>
                  <p className="text-xs text-gray-500 mt-1">Please use the trainee intake form to register your GPS coordinates for audit dispatch mapping.</p>
                </div>
                {onCaptureCoords && (
                  <button
                    onClick={handleCaptureLocation}
                    disabled={isLoadingGeo}
                    className="w-full bg-[#6D071A] text-white py-1.5 text-xs font-bold rounded-lg hover:bg-[#5C0515] transition flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Capture GPS Location Now
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Horizontal Scrolling Quick-Jump Hubs overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 overflow-x-auto py-1 px-1.5 z-[999] bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-gray-200/80 max-w-[calc(100vw-32px)] md:max-w-xl scroll-smooth" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <div className="bg-[#6D071A] text-white text-[9px] uppercase font-extrabold py-1 px-2.5 rounded-full shrink-0 flex items-center gap-1">
              <Compass className="w-2.5 h-2.5 animate-pulse" />
              <span>Regions:</span>
            </div>
            {NAVIGATION_HUBS.map((hub) => (
              <button
                key={hub.name}
                type="button"
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView(hub.coords, hub.zoom);
                  }
                }}
                className="bg-white/85 hover:bg-[#6D071A] hover:text-white text-slate-800 text-[10px] font-bold py-0.5 px-2.5 rounded-full shadow-sm hover:shadow transition whitespace-nowrap border border-gray-200 shrink-0 cursor-pointer flex items-center gap-1"
              >
                {hub.name.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Interactive feedback status notification alerts */}
          {geoStatusMsg.text && (
            <div className="absolute bottom-16 left-4 z-[999] max-w-sm animate-fade-in">
              <div className={`p-2.5 px-4 rounded-lg shadow-lg border text-xs flex items-center gap-2 ${
                geoStatusMsg.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
                geoStatusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                'bg-blue-50 text-blue-800 border-blue-200'
              }`}>
                <Info className="w-4 h-4 shrink-0" />
                <span className="font-semibold leading-relaxed">{geoStatusMsg.text}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Panel: Attachment Stats and Selected Placement Inspector */}
        <div className={`bg-white border-[#E8E8E8] flex-col justify-between ${
          isFullScreen 
            ? `${showSidebar ? 'absolute bottom-0 left-0 right-0 h-[45vh] max-h-[45vh] z-[9999] p-0 shadow-2xl rounded-t-2xl border-t border-gray-300' : 'hidden'} lg:relative lg:flex lg:w-[320px] lg:h-full lg:max-h-full lg:border-l lg:border-t-0 shrink-0 overflow-y-auto` 
            : 'w-full lg:w-[320px] border-t lg:border-t-0 lg:border-l flex'
        }`}>
          
          {/* Top Panel Section: Interactive Dashboard Inspector */}
          <div className="p-4 space-y-4">
            
            {activePlacement ? (
              // Inspecting currently clicked placement card
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-[10px] uppercase font-extrabold text-[#6D071A] tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
                    Trainee Inspector
                  </span>
                  <button
                    onClick={() => setActivePlacement(null)}
                    className="text-[10px] text-gray-400 hover:text-gray-600 font-bold"
                  >
                    Clear selection
                  </button>
                </div>

                <div className="space-y-3 text-xs text-gray-700">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">TRAINEE DETAILS</p>
                    <h4 className="font-extrabold text-sm text-gray-900 leading-snug">{activePlacement.traineeUser?.fullName || 'Joseph Kurian'}</h4>
                    <p className="flex items-center gap-1 text-[11px] font-mono text-[#6D071A]">
                      <Hash className="w-3 h-3 text-[#6D071A]" />
                      <span>{activePlacement.traineeEnrollment?.admissionNo || 'KNPSS/DICT/2022/4102'}</span>
                    </p>
                    <p className="text-slate-500 leading-relaxed text-[11px] italic">{activePlacement.traineeEnrollment?.courseName || 'Diploma in Information Technology'}</p>
                  </div>

                  <div className="p-3 bg-red-50/20 border border-red-100 rounded-lg space-y-1.5">
                    <p className="text-[9px] font-bold text-[#6D071A] uppercase tracking-widest leading-none">WORKPLACE HOST</p>
                    <h5 className="font-bold text-gray-900 leading-snug">{activePlacement.companyName}</h5>
                    <p className="text-slate-500 text-[11px] leading-snug flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#6D071A] shrink-0 mt-0.5" />
                      <span>{activePlacement.companyAddress || 'Electricity House Nairobi'}</span>
                    </p>
                    <p className="text-[11px] text-slate-700">County: <b>{activePlacement.county || 'Nairobi'}</b></p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">SUPERVISOR & ASSESSOR</p>
                    <p className="flex items-center gap-1.5 text-gray-800">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{activePlacement.supervisorName || 'Pending local assignment'}</span>
                    </p>
                    {activePlacement.supervisorPhone && (
                      <p className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{activePlacement.supervisorPhone}</span>
                      </p>
                    )}
                    
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <span className="text-[9px] text-slate-400 font-bold block">ASSIGNED ASSESSOR DISPATCH</span>
                      <p className="font-semibold text-gray-800 flex items-center gap-1 text-[11px] mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{activePlacement.assignedOfficer?.fullName || 'Mary Wanjiku'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border">
                    <span>STATUS:</span>
                    <span className={`px-2 py-0.5 font-bold uppercase rounded text-[10px] ${
                      activePlacement.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border border-green-200' :
                      activePlacement.status === 'ACTIVE' ? 'bg-[#F5E8EB] text-[#6D071A] border border-[#EAC2C9]' :
                      activePlacement.status === 'PLACED' ? 'bg-blue-100 text-blue-850 border border-blue-200' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {activePlacement.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // Default view showing stats summaries
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <MapIcon className="w-4 h-4 text-[#6D071A]" />
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">Registry GIS Panel</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-red-50/30 border border-[#EAC2C9] rounded-lg text-center">
                    <span className="text-[20px] font-extrabold text-[#6D071A] block leading-none">{totalTraineesCount}</span>
                    <span className="text-[9px] font-bold text-gray-500 uppercase mt-1 block">Trainees Mapped</span>
                  </div>

                  <div className="p-3 bg-indigo-50/20 border border-indigo-150 rounded-lg text-center">
                    <span className="text-[20px] font-extrabold text-blue-800 block leading-none">{totalCompaniesCount}</span>
                    <span className="text-[9px] font-bold text-gray-500 uppercase mt-1 block">Companies</span>
                  </div>
                </div>

                {/* Assigned Assessors Breakdown block */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Assigned Assessors</span>
                  </div>
                  
                  <div className="space-y-1.5 text-xs">
                    {activeAssessors.length > 0 ? (
                      activeAssessors.map((officer, i) => (
                        <div key={i} className="flex items-center justify-between text-slate-700 bg-white p-1.5 px-2 rounded border border-gray-100">
                          <span className="font-semibold">{officer}</span>
                          <span className="text-[10px] text-gray-400 italic">Active Hub Assessor</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-500">No active hub assessors registered.</p>
                    )}
                  </div>
                </div>

                {/* Helpful Instruction Tip */}
                <div className="p-3 bg-amber-50/40 border border-amber-200 text-[11px] text-slate-700 rounded-lg flex gap-2 leading-relaxed">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Attachment Audit Legend:</span>
                    Pin placements are rendered using live coordinates. Densified clusters group automatically to prevent overlap. Toggle county and assessor selectors to audit specific dispatches.
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Panel Section: Brand footer or clear coordinates trigger details */}
          <div className="p-4 border-t border-gray-100 bg-slate-50 text-[10px] text-gray-400 font-medium text-center">
            KNPSS National TVET Placement Hub • Leaflet Engine
          </div>

        </div>

      </div>

      {/* Modern interactive Legend Ribbon */}
      <div className="p-3.5 bg-white border-t border-[#E8E8E8] grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px] font-semibold text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#6D071A] border-2 border-white shadow"></span>
          <span>Primary Trainee Placement</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow"></span>
          <span>Regional Trainee Placement</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-800 text-white font-bold text-[9px] leading-none shadow">C</span>
          <span>Multiple Trainees Cluster</span>
        </div>
        <div className="text-right flex items-center justify-end text-[#6D071A] gap-1 select-none">
          <Sparkles className="w-3 h-3 text-[#6D071A]" />
          <span>OpenStreetMap Live Integration</span>
        </div>
      </div>

      {/* Trainee Full Profile Modal Overlay */}
      {isProfileModalOpen && profileModalTrainee && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden text-left flex flex-col max-h-[90vh]">
            
            {/* Header branding */}
            <div className="bg-[#6D071A] text-white p-5 relative overflow-hidden shrink-0">
              {/* Pattern effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10"></div>
              
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#EAC2C9]">
                    KNPSS Certified Trainee Registry File
                  </span>
                  <h4 className="text-lg font-extrabold tracking-tight">
                    {profileModalTrainee.traineeUser?.fullName || 'Full Student Dossier'}
                  </h4>
                  <p className="font-mono text-xs text-[#F5E8EB]">
                    REG ID: {profileModalTrainee.traineeEnrollment?.admissionNo || 'KNPSS/DICT/2022/4102'}
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    setProfileModalTrainee(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white transition cursor-pointer"
                  title="Close Profile File"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable contents */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-750 font-sans bg-slate-50/50">
              
              {/* Profile Main Badge Card */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#6D071A] border-4 border-slate-100 text-white flex items-center justify-center font-bold text-lg shadow-inner shrink-0 uppercase">
                  {(profileModalTrainee.traineeUser?.fullName || 'T').charAt(0)}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase inline-block border ${
                    profileModalTrainee.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' :
                    profileModalTrainee.status === 'ACTIVE' ? 'bg-rose-50 text-[#6D071A] border-rose-150 animate-pulse' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {profileModalTrainee.status} STATUS
                  </span>
                  <h5 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {profileModalTrainee.traineeUser?.fullName || 'N/A'}
                  </h5>
                  <p className="text-slate-500 italic font-medium leading-none">
                    {profileModalTrainee.traineeUser?.email || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Course information */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center gap-1.5 border-b pb-1.5 border-slate-100">
                  <div className="p-1 rounded bg-[#6D071A]/10 text-[#6D071A]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <span className="font-extrabold uppercase text-[10px] text-gray-500 tracking-wider">Academic Program details</span>
                </div>

                <div className="grid grid-cols-2 gap-3 leading-relaxed">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Course enrolled</span>
                    <span className="font-semibold text-gray-800 text-[11px]">
                      {profileModalTrainee.traineeEnrollment?.courseName || 'Diploma in Technical Program'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Course code</span>
                    <span className="font-mono text-gray-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] w-max block mt-0.5">
                      {profileModalTrainee.traineeEnrollment?.courseCode || 'TECH'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Cohort year</span>
                    <span className="font-semibold text-gray-850">
                      {profileModalTrainee.traineeEnrollment?.cohort || '2023 Intake'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Attachment period</span>
                    <span className="font-semibold text-gray-850">
                      {profileModalTrainee.traineeEnrollment?.attachmentDurationWeeks || 12} Weeks
                    </span>
                  </div>
                </div>
              </div>

              {/* Placement information */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center gap-1.5 border-b pb-1.5 border-slate-100">
                  <div className="p-1 rounded bg-[#6D071A]/10 text-[#6D071A]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="font-extrabold uppercase text-[10px] text-gray-500 tracking-wider">Workplace Host Organization</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 font-bold uppercase text-[9px] w-20 pt-0.5 shrink-0">Company:</span>
                    <div className="min-w-0">
                      <span className="font-extrabold text-gray-900 block">{profileModalTrainee.companyName}</span>
                      <span className="text-[11px] text-gray-500">{profileModalTrainee.companyAddress || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-bold uppercase text-[9px] w-20 shrink-0">County Geo:</span>
                    <span className="font-semibold text-gray-805 bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                      {profileModalTrainee.county || 'Nairobi'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-gray-400 font-bold uppercase text-[9px] w-20 shrink-0 select-none">GPS Fix:</span>
                    <span className="bg-slate-100 p-1 px-1.5 rounded text-[10px] text-slate-700">
                      Lat {parseFloat(profileModalTrainee.locationLat).toFixed(6)}, Lng {parseFloat(profileModalTrainee.locationLng).toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Host/College Contacts */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center gap-1.5 border-b pb-1.5 border-slate-100">
                  <div className="p-1 rounded bg-[#6D071A]/10 text-[#6D071A]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="font-extrabold uppercase text-[10px] text-gray-500 tracking-wider">Supervision & Audit Officers</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-2 border border-slate-150 rounded-lg bg-slate-50/50">
                    <span className="text-[8px] font-extrabold text-blue-800 uppercase tracking-widest leading-none block">INDUSTRY SUPERVISOR</span>
                    <h6 className="font-bold text-gray-800 mt-1 leading-snug">{profileModalTrainee.supervisorName || 'Pending local assignment'}</h6>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{profileModalTrainee.supervisorPhone || 'No telephone'}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">{profileModalTrainee.supervisorEmail || 'No email'}</p>
                  </div>

                  <div className="p-2 border border-[#EAC2C9] rounded-lg bg-red-50/10">
                    <span className="text-[8px] font-extrabold text-[#6D071A] uppercase tracking-widest leading-none block">COLLEGE ASSESSMENT DISPATCH</span>
                    <h6 className="font-bold text-gray-800 mt-1 leading-snug">{profileModalTrainee.assignedOfficer?.fullName || 'Mary Wanjiku'}</h6>
                    <p className="text-[10px] text-[#6D071A] font-semibold mt-0.5">Assigned Field Assessor</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">KNP Industrial Liaison Office</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer action */}
            <div className="p-4 border-t bg-slate-50 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase select-none">
                Verified Active Entry
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setProfileModalTrainee(null);
                }}
                className="px-4 py-2 bg-[#6D071A] hover:bg-[#5C0515] text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer transition uppercase tracking-wider"
              >
                Close File View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );

  if (isFullScreen) {
    return createPortal(mapContent, document.body);
  }
  return mapContent;
}
