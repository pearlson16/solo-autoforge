import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface ForgeEmberCanvasProps {
  isForging?: boolean;
  activeRarity?: string;
  triggerSparkCount?: number; // increments when a hammer hit happens
}

export function ForgeEmberCanvas({ isForging, activeRarity, triggerSparkCount = 0 }: ForgeEmberCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'Mythic':
        return '#e879f9'; // fuchsia/pink
      case 'Legendary':
        return '#f59e0b'; // amber/orange
      case 'Epic':
        return '#a855f7'; // purple
      case 'Rare':
        return '#38bdf8'; // cyan/blue
      default:
        return '#f97316'; // flame orange
    }
  };

  // Trigger explosive sparks on hammer hit
  useEffect(() => {
    if (triggerSparkCount > 0 && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const mainColor = getRarityColor(activeRarity);
      const newParticles: Particle[] = [];

      // Generate 40 explosive spark particles
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        newParticles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 2, // upward bias
          size: Math.random() * 4 + 2,
          color: Math.random() > 0.4 ? mainColor : '#fef08a', // mix yellow white
          alpha: 1,
          decay: Math.random() * 0.03 + 0.015,
        });
      }

      particlesRef.current.push(...newParticles);
    }
  }, [triggerSparkCount, activeRarity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Continuous ambient embers rising
    const spawnAmbientEmbers = () => {
      const maxEmbers = isForging ? 80 : 50;
      if (particlesRef.current.length < maxEmbers) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: height + 10,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -(Math.random() * (isForging ? 2.5 : 1.5) + 0.5),
          size: Math.random() * 2.5 + 1,
          color: Math.random() > 0.5 ? '#f97316' : '#fbbf24',
          alpha: Math.random() * 0.7 + 0.3,
          decay: Math.random() * 0.008 + 0.004,
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      spawnAmbientEmbers();

      const nextParticles: Particle[] = [];

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha > 0 && p.y > -20 && p.x > -20 && p.x < width + 20) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          nextParticles.push(p);
        }
      }

      particlesRef.current = nextParticles;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full overflow-hidden"
    />
  );
}
