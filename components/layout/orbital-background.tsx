"use client";
import React from 'react';

// This component is designed to be aesthetically pleasing and lightweight.
// The positions are hardcoded for a consistent, curated look, avoiding randomization on each load.
export function OrbitalBackground() {
  const svgSize = 800;
  const center = { x: svgSize / 2, y: svgSize / 2 };

  const orbits = [
    { r: 100 },
    { r: 180 },
    { r: 250 },
    { r: 380 },
  ];

  const planets = [
    { orbitR: orbits[0].r, angle: 120, r: 4 },
    { orbitR: orbits[1].r, angle: 200, r: 6 },
    { orbitR: orbits[3].r, angle: 170, r: 7 },
  ];

  const subsystems = [
    {
      orbitR: orbits[1].r, angle: 310, r: 8,
      moons: [ { orbitR: 25, angle: 90, r: 2 }, { orbitR: 40, angle: 270, r: 3 } ],
      moonOrbits: [ { r: 25 }, { r: 40 } ],
    },
    {
      orbitR: orbits[2].r, angle: 70, r: 5,
      moons: [ { orbitR: 18, angle: 45, r: 1.5 } ],
      moonOrbits: [ { r: 18 } ],
    },
  ];

  const getCoords = (r: number, angle: number, origin = center) => ({
    x: origin.x + r * Math.cos((angle * Math.PI) / 180),
    y: origin.y + r * Math.sin((angle * Math.PI) / 180),
  });

  const allElements: React.ReactNode[] = [];

  // Main Orbits
  orbits.forEach(o => allElements.push(
    <circle key={`orbit-${o.r}`} cx={center.x} cy={center.y} r={o.r} strokeOpacity={0.5} />
  ));

  // Simple Planets
  planets.forEach((p, i) => {
    const coords = getCoords(p.orbitR, p.angle);
    allElements.push(
      <circle key={`planet-${i}`} cx={coords.x} cy={coords.y} r={p.r} fill="hsl(var(--foreground))" />
    );
  });

  // Subsystems
  subsystems.forEach((sub, i) => {
    const subCenter = getCoords(sub.orbitR, sub.angle);
    allElements.push(
      <circle key={`sub-planet-${i}`} cx={subCenter.x} cy={subCenter.y} r={sub.r} fill="hsl(var(--foreground))" />
    );
    sub.moonOrbits.forEach(o => allElements.push(
      <circle key={`sub-orbit-${i}-${o.r}`} cx={subCenter.x} cy={subCenter.y} r={o.r} strokeOpacity={0.5} />
    ));
    sub.moons.forEach((m, j) => {
      const moonCoords = getCoords(m.orbitR, m.angle, subCenter);
      allElements.push(
        <circle key={`moon-${i}-${j}`} cx={moonCoords.x} cy={moonCoords.y} r={m.r} fill="hsl(var(--foreground))" />
      );
    });
  });


  return (
    <div className="pointer-events-none absolute right-0 top-0 h-[1000px] w-[1000px] -translate-y-1/3 translate-x-1/3 opacity-15">
      <svg viewBox={`0 0 ${svgSize} ${svgSize}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="hsl(var(--foreground))" strokeWidth="0.5">
          {allElements}
        </g>
      </svg>
    </div>
  );
} 