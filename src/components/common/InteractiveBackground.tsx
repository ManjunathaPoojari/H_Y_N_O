import React, { useEffect, useRef, useState } from 'react';

export const InteractiveBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const particlesRef = useRef<Array<{
        x: number;
        y: number;
        baseX: number;
        baseY: number;
        vx: number;
        vy: number;
    }>>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        // Initialize particles in a grid
        const initParticles = () => {
            particlesRef.current = [];
            const spacing = 40;
            const cols = Math.ceil(canvas.width / spacing);
            const rows = Math.ceil(canvas.height / spacing);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    particlesRef.current.push({
                        x: i * spacing,
                        y: j * spacing,
                        baseX: i * spacing,
                        baseY: j * spacing,
                        vx: 0,
                        vy: 0,
                    });
                }
            }
        };

        // Handle mouse move
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((particle) => {
                // Calculate distance from particle's current position to mouse
                const dx = mousePos.x - particle.x;
                const dy = mousePos.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 300;
                const visibleRadius = 200;

                // Particles flow toward cursor from their positions
                if (distance < maxDistance && distance > 20) {
                    // Stronger pull toward cursor
                    const force = Math.pow((maxDistance - distance) / maxDistance, 1.2);
                    particle.vx += (dx / distance) * force * 2.5;
                    particle.vy += (dy / distance) * force * 2.5;
                } else if (distance <= 20) {
                    // Slow down when very close to cursor
                    particle.vx *= 0.5;
                    particle.vy *= 0.5;
                } else {
                    // Return to base position when far from cursor
                    particle.vx += (particle.baseX - particle.x) * 0.05;
                    particle.vy += (particle.baseY - particle.y) * 0.05;
                }

                // Apply friction
                particle.vx *= 0.88;
                particle.vy *= 0.88;

                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Only draw particles that are visible (creating spotlight effect)
                if (distance < visibleRadius) {
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                    // Fade out particles as they get further from cursor
                    const opacity = Math.pow(1 - (distance / visibleRadius), 1.5) * 0.8;
                    ctx.fillStyle = `rgba(16, 185, 129, ${opacity})`;
                    ctx.fill();

                    // Add glow effect for particles very close to cursor
                    if (distance < 80) {
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                }
            });

            requestAnimationFrame(animate);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [mousePos]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
};
