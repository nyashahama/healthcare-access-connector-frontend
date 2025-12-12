import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const ClinicMap = ({ clinics, userLocation, onClinicSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView(
      userLocation || [-26.2041, 28.0473], // Default to Johannesburg
      12
    );

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    // Add user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: "user-location-marker",
        html: '<div class="w-6 h-6 bg-blue-500 border-2 border-white rounded-full shadow-lg"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup("Your Location");
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current || !clinics.length) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add clinic markers
    clinics.forEach((clinic) => {
      const clinicIcon = L.divIcon({
        className: "clinic-marker",
        html: `
          <div class="flex items-center justify-center w-8 h-8 bg-white rounded-full border-2 border-green-500 shadow-lg">
            <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(
        [clinic.coordinates.lat, clinic.coordinates.lng],
        { icon: clinicIcon }
      ).addTo(mapInstanceRef.current).bindPopup(`
          <div class="p-2">
            <h4 class="font-bold text-sm">${clinic.name}</h4>
            <p class="text-xs text-gray-600">${clinic.address}</p>
            <p class="text-xs mt-1"><strong>Status:</strong> ${clinic.status}</p>
            <p class="text-xs"><strong>Wait Time:</strong> ${clinic.waitTime}</p>
            <button 
              onclick="window.dispatchEvent(new CustomEvent('selectClinic', { detail: ${clinic.id} }))"
              class="mt-2 w-full bg-green-500 text-white text-xs py-1 px-2 rounded hover:bg-green-600"
            >
              View Details
            </button>
          </div>
        `);

      marker.on("click", () => {
        onClinicSelect(clinic);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (clinics.length > 0 && mapInstanceRef.current) {
      const bounds = L.latLngBounds(
        clinics.map((c) => [c.coordinates.lat, c.coordinates.lng])
      );
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [clinics, onClinicSelect, userLocation]);

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="h-full w-full rounded-lg" />
      <div className="absolute right-4 top-4 z-[1000] rounded-lg bg-white p-2 shadow-lg dark:bg-navy-800">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">You</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Clinic</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicMap;
