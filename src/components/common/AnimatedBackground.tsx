import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
    type: 'doctor' | 'patient' | 'hospital' | 'admin' | 'trainer';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ type }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Color themes for dots
        const themes = {
            doctor: { dot: 'rgba(16, 185, 129, 0.4)' },
            patient: { dot: 'rgba(59, 130, 246, 0.4)' },
            hospital: { dot: 'rgba(139, 92, 246, 0.4)' },
            admin: { dot: 'rgba(249, 115, 22, 0.4)' },
            trainer: { dot: 'rgba(236, 72, 153, 0.4)' },
        };

        const theme = themes[type];

        // Create floating dots
        const dots: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
        }> = [];

        for (let i = 0; i < 40; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 2,
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw dots
            dots.forEach((dot) => {
                dot.x += dot.vx;
                dot.y += dot.vy;

                if (dot.x < 0) dot.x = canvas.width;
                if (dot.x > canvas.width) dot.x = 0;
                if (dot.y < 0) dot.y = canvas.height;
                if (dot.y > canvas.height) dot.y = 0;

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fillStyle = theme.dot;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [type]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
};

