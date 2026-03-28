const PARTICLES = [
  { size: 3, top: '15%', delay: '0s', duration: '22s', opacity: 0.2 },
  { size: 2, top: '35%', delay: '4s', duration: '28s', opacity: 0.15 },
  { size: 4, top: '55%', delay: '8s', duration: '25s', opacity: 0.2 },
  { size: 2, top: '72%', delay: '12s', duration: '30s', opacity: 0.18 },
  { size: 3, top: '88%', delay: '2s', duration: '24s', opacity: 0.25 },
];

export function SandParticles() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none motion-reduce:hidden"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: '-5%',
            backgroundColor: 'var(--gold)',
            opacity: p.opacity,
            animation: `particle-drift ${p.duration} linear ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
