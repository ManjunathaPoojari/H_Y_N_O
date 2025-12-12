'use client';

import { useEffect, useRef } from 'react';

interface MinimalistHealthBackgroundProps {
    className?: string;
}

export const MinimalistHealthBackground = ({ className = '' }: MinimalistHealthBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

        // Hexagon grid settings
        const hexSize = 40;
        const hexHeight = hexSize * Math.sqrt(3);
        const hexWidth = hexSize * 2;

        interface Hexagon {
            x: number;
            y: number;
            opacity: number;
            opacityDir: number;
            delay: number;
        }

        const hexagons: Hexagon[] = [];

        // Create hexagon grid
        const cols = Math.ceil(canvas.width / (hexWidth * 0.75)) + 2;
        const rows = Math.ceil(canvas.height / hexHeight) + 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * hexWidth * 0.75;
                const y = row * hexHeight + (col % 2 === 0 ? 0 : hexHeight / 2);
                hexagons.push({
                    x,
                    y,
                    opacity: 0.03 + Math.random() * 0.05,
                    opacityDir: 0.0005 + Math.random() * 0.001,
                    delay: Math.random() * 100,
                });
            }
        }

        // Data flow particles
        interface Particle {
            x: number;
            y: number;
            targetX: number;
            targetY: number;
            speed: number;
            opacity: number;
        }

        const particles: Particle[] = [];
        for (let i = 0; i < 20; i++) {
            const startHex = hexagons[Math.floor(Math.random() * hexagons.length)];
            const endHex = hexagons[Math.floor(Math.random() * hexagons.length)];
            particles.push({
                x: startHex.x,
                y: startHex.y,
                targetX: endHex.x,
                targetY: endHex.y,
                speed: 0.5 + Math.random() * 1,
                opacity: 0.3 + Math.random() * 0.4,
            });
        }

        let frame = 0;
        let glowPulse = 0;

        const drawHexagon = (x: number, y: number, size: number, opacity: number) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 6;
                const hx = x + size * Math.cos(angle);
                const hy = y + size * Math.sin(angle);
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        };

        const drawWellnessIcon = () => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const size = 60;

            // Outer glow
            const glowSize = size + 20 + Math.sin(glowPulse) * 10;
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowSize);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
            gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
            ctx.fill();

            // Inner hexagon
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
            ctx.lineWidth = 2;
            drawHexagon(centerX, centerY, size, 0.3);

            // Wellness heart icon
            ctx.save();
            ctx.translate(centerX, centerY);

            // Heart shape
            ctx.beginPath();
            ctx.moveTo(0, 10);
            ctx.bezierCurveTo(-20, -10, -20, -25, 0, -10);
            ctx.bezierCurveTo(20, -25, 20, -10, 0, 10);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Pulse line through heart
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(-10, 0);
            ctx.lineTo(-5, -8);
            ctx.lineTo(0, 8);
            ctx.lineTo(5, -5);
            ctx.lineTo(10, 0);
            ctx.lineTo(25, 0);
            ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore();
        };

        const drawConnections = () => {
            // Draw subtle connections between nearby hexagons
            const connectionDistance = hexWidth * 1.5;

            for (let i = 0; i < hexagons.length; i++) {
                for (let j = i + 1; j < hexagons.length; j++) {
                    const dx = hexagons[i].x - hexagons[j].x;
                    const dy = hexagons[i].y - hexagons[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance && Math.random() < 0.01) {
                        ctx.beginPath();
                        ctx.moveTo(hexagons[i].x, hexagons[i].y);
                        ctx.lineTo(hexagons[j].x, hexagons[j].y);
                        ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;
            glowPulse += 0.02;

            // Draw hexagon grid
            hexagons.forEach((hex, index) => {
                if (frame > hex.delay) {
                    hex.opacity += hex.opacityDir;
                    if (hex.opacity > 0.1 || hex.opacity < 0.02) {
                        hex.opacityDir *= -1;
                    }
                    drawHexagon(hex.x, hex.y, hexSize, hex.opacity);
                }
            });

            // Draw connections occasionally
            if (frame % 30 === 0) {
                drawConnections();
            }

            // Update and draw particles (data flow)
            particles.forEach((p) => {
                const dx = p.targetX - p.x;
                const dy = p.targetY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 5) {
                    // Pick new target
                    const newTarget = hexagons[Math.floor(Math.random() * hexagons.length)];
                    p.targetX = newTarget.x;
                    p.targetY = newTarget.y;
                } else {
                    p.x += (dx / dist) * p.speed;
                    p.y += (dy / dist) * p.speed;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96, 165, 250, ${p.opacity})`;
                ctx.fill();
            });

            // Draw central wellness icon
            drawWellnessIcon();

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none ${className}`}
            style={{ zIndex: 0 }}
        />
    );
};
