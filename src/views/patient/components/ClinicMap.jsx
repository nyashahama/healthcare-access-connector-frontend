import React, { useEffect, useRef, useState } from "react";
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
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    // Wait for the ref to be attached and have dimensions
    if (!mapRef.current || mapRef.current.clientHeight === 0) {
      return;
    }

    // Prevent multiple initializations
    if (mapInstanceRef.current) {
      return;
    }

    // Small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      try {
        // Initialize map
        const map = L.map(mapRef.current, {
          center: userLocation || [-26.2041, 28.0473],
          zoom: 12,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map);

        // Force map to invalidate size after initialization
        setTimeout(() => {
          map.invalidateSize();
          setIsMapReady(true);
        }, 100);

        // Add user location marker
        if (userLocation) {
          const userIcon = L.divIcon({
            className: "user-location-marker",
            html: '<div style="width: 24px; height: 24px; background-color: #3B82F6; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup("Your Location");
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error("Error cleaning up map:", error);
        }
      }
    };
  }, [userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady || !clinics.length) return;

    try {
      // Clear existing markers
      markersRef.current.forEach((marker) => {
        try {
          marker.remove();
        } catch (e) {
          console.warn("Error removing marker:", e);
        }
      });
      markersRef.current = [];

      // Add clinic markers
      clinics.forEach((clinic) => {
        const clinicIcon = L.divIcon({
          className: "clinic-marker",
          html: `
            <div style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background-color: white; border: 2px solid #10B981; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              <svg style="width: 16px; height: 16px; color: #10B981;" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(
          [clinic.coordinates.lat, clinic.coordinates.lng],
          { icon: clinicIcon }
        )
          .addTo(mapInstanceRef.current)
          .bindPopup(
            `
          <div style="padding: 8px; min-width: 200px;">
            <h4 style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${clinic.name}</h4>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${clinic.address}</p>
            <p style="font-size: 12px; margin-bottom: 2px;"><strong>Status:</strong> ${clinic.status}</p>
            <p style="font-size: 12px; margin-bottom: 8px;"><strong>Wait Time:</strong> ${clinic.waitTime}</p>
          </div>
        `,
            {
              maxWidth: 300,
              className: "custom-popup",
            }
          );

        marker.on("click", () => {
          onClinicSelect(clinic);
        });

        markersRef.current.push(marker);
      });

      // Fit bounds to show all markers
      if (clinics.length > 0) {
        const bounds = L.latLngBounds(
          clinics.map((c) => [c.coordinates.lat, c.coordinates.lng])
        );
        if (userLocation) {
          bounds.extend([userLocation.lat, userLocation.lng]);
        }
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (error) {
      console.error("Error adding markers:", error);
    }
  }, [clinics, onClinicSelect, userLocation, isMapReady]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={mapRef}
        className="h-full w-full rounded-lg"
        style={{ minHeight: "500px", zIndex: 1 }}
      />
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
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-navy-800">
          <div className="text-center">
            <div className="border-t-transparent mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-500"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Loading map...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicMap;
