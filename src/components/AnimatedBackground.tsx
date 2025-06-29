import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/use-mobile';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      originalX: number;
      originalY: number;
      angle: number;
      speed: number;
      amplitude: number;
    }> = [];

    const colors = ['#00f5ff', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

    // Create particles
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        originalX: x,
        originalY: y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
        amplitude: 20 + Math.random() * 50
      });
    }

    // Floating geometric shapes
    const shapes: Array<{
      x: number;
      y: number;
      rotation: number;
      rotationSpeed: number;
      size: number;
      type: 'triangle' | 'square' | 'hexagon';
      color: string;
      opacity: number;
      originalX: number;
      originalY: number;
      angle: number;
      speed: number;
      amplitude: number;
    }> = [];

    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      shapes.push({
        x,
        y,
        originalX: x,
        originalY: y,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        size: Math.random() * 40 + 10,
        type: ['triangle', 'square', 'hexagon'][Math.floor(Math.random() * 3)] as 'triangle' | 'square' | 'hexagon',
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.1 + 0.05,
        angle: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.01,
        amplitude: 10 + Math.random() * 30
      });
    }

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let mouseRadius = 100;
    let mouseInfluence = false;

    canvas.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseInfluence = true;
      
      // Gradually fade out mouse influence
      setTimeout(() => {
        mouseInfluence = false;
      }, 2000);
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach(particle => {
        if (prefersReducedMotion) {
          // Static position for reduced motion
          particle.x = particle.originalX;
          particle.y = particle.originalY;
        } else {
          // Update position with sine wave motion
          particle.angle += particle.speed;
          particle.x = particle.originalX + Math.sin(particle.angle) * particle.amplitude;
          particle.y = particle.originalY + Math.cos(particle.angle) * particle.amplitude;

          // Mouse interaction
          if (mouseInfluence) {
            const dx = particle.x - mouseX;
            const dy = particle.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseRadius) {
              const force = (mouseRadius - distance) / mouseRadius;
              const angle = Math.atan2(dy, dx);
              particle.x += Math.cos(angle) * force * 2;
              particle.y += Math.sin(angle) * force * 2;
            }
          }

          // Wrap around edges
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw connections between nearby particles
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (100 - distance) / 100 * 0.1;
            ctx.strokeStyle = '#00f5ff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      // Draw and update geometric shapes
      shapes.forEach(shape => {
        if (prefersReducedMotion) {
          // Static position for reduced motion
          shape.x = shape.originalX;
          shape.y = shape.originalY;
          shape.rotation = 0;
        } else {
          // Update position with sine wave motion
          shape.angle += shape.speed;
          shape.x = shape.originalX + Math.sin(shape.angle) * shape.amplitude;
          shape.y = shape.originalY + Math.cos(shape.angle) * shape.amplitude;
          shape.rotation += shape.rotationSpeed;

          // Mouse interaction
          if (mouseInfluence) {
            const dx = shape.x - mouseX;
            const dy = shape.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseRadius) {
              const force = (mouseRadius - distance) / mouseRadius;
              const angle = Math.atan2(dy, dx);
              shape.x += Math.cos(angle) * force * 3;
              shape.y += Math.sin(angle) * force * 3;
              shape.rotation += force * 0.1;
            }
          }
        }

        ctx.save();
        ctx.globalAlpha = shape.opacity;
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 2;

        ctx.beginPath();
        switch (shape.type) {
          case 'triangle':
            ctx.moveTo(0, -shape.size / 2);
            ctx.lineTo(-shape.size / 2, shape.size / 2);
            ctx.lineTo(shape.size / 2, shape.size / 2);
            ctx.closePath();
            break;
          case 'square':
            ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
            break;
          case 'hexagon':
            for (let i = 0; i < 6; i++) {
              const angle = (i * Math.PI) / 3;
              const x = Math.cos(angle) * shape.size / 2;
              const y = Math.sin(angle) * shape.size / 2;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            break;
        }
        ctx.stroke();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default AnimatedBackground;