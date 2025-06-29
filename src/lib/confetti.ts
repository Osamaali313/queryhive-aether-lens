// Simple confetti effect for celebrations
interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: {
    x?: number;
    y?: number;
  };
  colors?: string[];
  shapes?: string[];
  scalar?: number;
  zIndex?: number;
}

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function createElements(root: HTMLElement, elementCount: number, colors: string[], shapes: string[]): HTMLElement[] {
  return Array.from({ length: elementCount }).map((_, index) => {
    const element = document.createElement('div');
    const color = colors[index % colors.length];
    const shape = shapes[index % shapes.length];
    
    element.style.backgroundColor = color;
    element.style.width = '10px';
    element.style.height = '10px';
    element.style.position = 'absolute';
    element.style.zIndex = '9999';
    element.style.pointerEvents = 'none';
    
    if (shape === 'circle') {
      element.style.borderRadius = '50%';
    }
    
    root.appendChild(element);
    
    return element;
  });
}

function randomPhysics(angle: number, spread: number, startVelocity: number, random: number): { x: number; y: number } {
  const radAngle = angle * (Math.PI / 180);
  const radSpread = spread * (Math.PI / 180);
  
  return {
    x: 0,
    y: 0,
    wobble: random * 10,
    wobbleSpeed: 0.1 + random * 0.1,
    velocity: startVelocity * 0.5 + random * startVelocity,
    angle2D: -radAngle + ((0.5 * radSpread) - (random * radSpread)),
    angle3D: -(Math.PI / 4) + random * (Math.PI / 2),
    tiltAngle: random * Math.PI,
    tiltAngleSpeed: 0.1 + random * 0.3
  };
}

function updateFetti(fetti: any, progress: number, decay: number, gravity: number, drift: number): void {
  fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
  fetti.physics.wobble += fetti.physics.wobbleSpeed;
  
  // Slow down
  fetti.physics.velocity *= decay;
  
  // Apply gravity
  fetti.physics.y += gravity;
  
  // Apply drift
  fetti.physics.x += drift;
  
  // Update rotation
  fetti.physics.tiltAngle += fetti.physics.tiltAngleSpeed;
  
  // Update element
  const { x, y, tiltAngle, wobble } = fetti.physics;
  const wobbleX = x + (10 * Math.cos(wobble));
  const wobbleY = y + (10 * Math.sin(wobble));
  const transform = `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotate3d(1, 1, 1, ${tiltAngle}rad)`;
  
  fetti.element.style.transform = transform;
  fetti.element.style.opacity = 1 - progress;
}

export default function confetti(options: ConfettiOptions = {}): void {
  const {
    particleCount = 50,
    spread = 70,
    startVelocity = 30,
    decay = 0.9,
    gravity = 1,
    drift = 0,
    ticks = 200,
    origin = { x: 0.5, y: 0.3 },
    colors = ['#00d4ff', '#8b5cf6', '#10b981', '#f472b6', '#f59e0b'],
    shapes = ['square', 'circle'],
    scalar = 1,
    zIndex = 100
  } = options;
  
  const root = document.createElement('div');
  root.style.position = 'fixed';
  root.style.top = '0';
  root.style.left = '0';
  root.style.width = '100%';
  root.style.height = '100%';
  root.style.pointerEvents = 'none';
  root.style.zIndex = String(zIndex);
  document.body.appendChild(root);
  
  const elements = createElements(root, particleCount, colors, shapes);
  
  const fettis = elements.map(element => ({
    element,
    physics: randomPhysics(
      Math.random() * 360,
      spread,
      startVelocity,
      Math.random()
    )
  }));
  
  let tick = 0;
  
  function update() {
    const progress = tick / ticks;
    
    if (tick++ < ticks) {
      fettis.forEach(fetti => {
        updateFetti(fetti, progress, decay, gravity, drift);
      });
      
      requestAnimationFrame(update);
    } else {
      root.remove();
    }
  }
  
  // Set initial positions
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  
  fettis.forEach(fetti => {
    fetti.element.style.left = `${origin.x * width}px`;
    fetti.element.style.top = `${origin.y * height}px`;
  });
  
  requestAnimationFrame(update);
}