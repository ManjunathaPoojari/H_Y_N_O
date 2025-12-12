import React, { useEffect, useRef } from 'react';

interface SidebarBackgroundProps {
    type: 'doctor' | 'patient' | 'hospital' | 'admin' | 'trainer';
}

export const SidebarBackground: React.FC<SidebarBackgroundProps> = ({ type }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };

        resizeCanvas();

        // Color themes - subtle rising bubbles
        const themes = {
            doctor: { primary: 'rgba(16, 185, 129, 0.3)', secondary: 'rgba(16, 185, 129, 0.1)' },
            patient: { primary: 'rgba(59, 130, 246, 0.3)', secondary: 'rgba(59, 130, 246, 0.1)' },
            hospital: { primary: 'rgba(139, 92, 246, 0.3)', secondary: 'rgba(139, 92, 246, 0.1)' },
            admin: { primary: 'rgba(249, 115, 22, 0.3)', secondary: 'rgba(249, 115, 22, 0.1)' },
            trainer: { primary: 'rgba(236, 72, 153, 0.3)', secondary: 'rgba(236, 72, 153, 0.1)' },
        };

        const theme = themes[type];

        // Create rising bubbles
        const bubbles: Array<{
            x: number;
            y: number;
            radius: number;
            speed: number;
            opacity: number;
        }> = [];

        for (let i = 0; i < 15; i++) {
            bubbles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 100,
                radius: Math.random() * 4 + 2,
                speed: Math.random() * 0.5 + 0.3,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw subtle gradient overlay
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, theme.secondary);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw bubbles
            bubbles.forEach((bubble) => {
                bubble.y -= bubble.speed;

                // Reset bubble when it goes off screen
                if (bubble.y + bubble.radius < 0) {
                    bubble.y = canvas.height + bubble.radius;
                    bubble.x = Math.random() * canvas.width;
                }

                // Draw bubble with glow
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                ctx.fillStyle = theme.primary.replace('0.3', bubble.opacity.toFixed(2));
                ctx.fill();

                // Add subtle glow
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = theme.secondary;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [type]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'transparent' }}
        />
    );
};
