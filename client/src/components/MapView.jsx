import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { formatWardLabel } from '../utils/ward';

const createIcon = (color) =>
  new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns='http://www.w3.org/2000/svg' width='32' height='48' viewBox='0 0 32 48'>
        <path d='M16 46s10-14.4 10-24A10 10 0 1 0 6 22c0 9.6 10 24 10 24z' fill='${color}' stroke='white' stroke-width='2'/>
        <circle cx='16' cy='22' r='5.5' fill='white' opacity='0.95' />
      </svg>
    `)}`,
    iconSize: [32, 48],
    iconAnchor: [16, 46],
    popupAnchor: [0, -42]
  });

const statusColors = {
  Reported: '#ef4444',
  'Under Review': '#ef4444',
  'In Progress': '#ef4444',
  Resolved: '#ef4444'
};

const DEFAULT_CENTER = [20.7168, 77.0016];

const toValidCoordinate = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const getMarkerPosition = (issue) => [
  toValidCoordinate(issue.latitude, DEFAULT_CENTER[0]),
  toValidCoordinate(issue.longitude, DEFAULT_CENTER[1])
];

function ClusterMarkers({ issues, onMarkerClick }) {
  const map = useMap();

  useEffect(() => {
    if (!issues.length) return undefined;

    const clusterGroup = L.markerClusterGroup({ chunkedLoading: true });

    issues.forEach((issue) => {
      const marker = L.marker(getMarkerPosition(issue), {
        icon: createIcon(statusColors[issue.status] || '#1d4ed8')
      });

      marker.bindPopup(`
        <div class="space-y-1">
          <div class="text-sm font-semibold text-slate-900">${issue.title}</div>
          <div class="text-xs text-slate-600">${issue.category}</div>
          <div class="text-xs text-slate-500">${formatWardLabel(issue.ward)}</div>
        </div>
      `);
      marker.on('click', () => onMarkerClick?.(issue));
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [issues, map, onMarkerClick]);

  return null;
}

export default function MapView({ issues = [], center = DEFAULT_CENTER, zoom = 13, onMarkerClick }) {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    });
  }, []);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-soft">
      <MapContainer center={center} zoom={zoom} className="h-[520px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClusterMarkers issues={issues} onMarkerClick={onMarkerClick} />
      </MapContainer>
    </div>
  );
}
