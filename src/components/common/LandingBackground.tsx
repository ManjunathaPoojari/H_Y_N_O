'use client';

import { useEffect, useRef } from 'react';

interface LandingBackgroundProps {
    className?: string;
}

export const LandingBackground = ({ className = '' }: LandingBackgroundProps) => {
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

        // Simple floating dots
        interface Dot {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            opacity: number;
        }

        const dots: Dot[] = [];
        const dotCount = 50;
        const connectionDistance = 150;

        // Create dots
        for (let i = 0; i < dotCount; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: 2 + Math.random() * 2,
                opacity: 0.2 + Math.random() * 0.3,
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw dots
            dots.forEach((dot) => {
                // Move
                dot.x += dot.vx;
                dot.y += dot.vy;

                // Wrap around
                if (dot.x < 0) dot.x = canvas.width;
                if (dot.x > canvas.width) dot.x = 0;
                if (dot.y < 0) dot.y = canvas.height;
                if (dot.y > canvas.height) dot.y = 0;

                // Draw dot
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(16, 185, 129, ${dot.opacity})`; // emerald
                ctx.fill();
            });

            // Draw connections
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.1;
                        ctx.beginPath();
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

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
