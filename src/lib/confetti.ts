
interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
  ticks?: number;
  gravity?: number;
  decay?: number;
  drift?: number;
  scalar?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  ticks: number;
  decay: number;
  gravity: number;
  drift: number;
  scalar: number;
}

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let animationId: number | null = null;

function createCanvas() {
  if (canvas) return;
  
  canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);
  
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle(options: ConfettiOptions): Particle {
  const origin = options.origin || { x: 0.5, y: 0.5 };
  const spread = (options.spread || 45) * Math.PI / 180;
  const angle = Math.random() * spread - spread / 2;
  const velocity = 15 + Math.random() * 10;
  
  return {
    x: (origin.x || 0.5) * window.innerWidth,
    y: (origin.y || 0.5) * window.innerHeight,
    vx: Math.cos(angle) * velocity,
    vy: Math.sin(angle) * velocity - Math.random() * 5,
    color: options.colors?.[Math.floor(Math.random() * options.colors.length)] || '#f0f0f0',
    ticks: options.ticks || 200,
    decay: options.decay || 0.94,
    gravity: options.gravity || 0.4,
    drift: options.drift || 0,
    scalar: options.scalar || 1,
  };
}

function updateParticle(particle: Particle): boolean {
  particle.x += particle.vx;
  particle.y += particle.vy;
  particle.vx *= particle.decay;
  particle.vy *= particle.decay;
  particle.vy += particle.gravity;
  particle.x += particle.drift;
  particle.ticks--;
  
  return particle.ticks > 0 && particle.y < window.innerHeight;
}

function drawParticle(particle: Particle) {
  if (!ctx) return;
  
  ctx.fillStyle = particle.color;
  ctx.fillRect(
    particle.x - 2 * particle.scalar,
    particle.y - 2 * particle.scalar,
    4 * particle.scalar,
    4 * particle.scalar
  );
}

function animate() {
  if (!ctx || !canvas) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles = particles.filter(particle => {
    const alive = updateParticle(particle);
    if (alive) drawParticle(particle);
    return alive;
  });
  
  if (particles.length > 0) {
    animationId = requestAnimationFrame(animate);
  } else {
    cleanup();
  }
}

function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (canvas) {
    document.body.removeChild(canvas);
    canvas = null;
    ctx = null;
  }
  window.removeEventListener('resize', resizeCanvas);
}

export default function confetti(options: ConfettiOptions = {}) {
  createCanvas();
  
  const particleCount = options.particleCount || 50;
  const colors = options.colors || ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle({ ...options, colors }));
  }
  
  if (!animationId) {
    animate();
  }
}
