import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { useMap } from 'react-leaflet';

export default function HeatmapLayer({ map, points }) {
  const leafletMap = useMap();

  useEffect(() => {
    const targetMap = map || leafletMap;
    if (!targetMap || !points?.length) return undefined;

    const heatLayer = L.heatLayer(points, { radius: 28, blur: 22, maxZoom: 16, gradient: { 0.2: '#60a5fa', 0.5: '#2563eb', 0.8: '#f97316' } });
    heatLayer.addTo(targetMap);

    return () => {
      heatLayer.remove();
    };
  }, [leafletMap, map, points]);

  return null;
}
