'use client';

import { useEffect, useRef } from 'react';

interface WellnessBackgroundProps {
    className?: string;
}

export const WellnessBackground = ({ className = '' }: WellnessBackgroundProps) => {
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

        // Wellness elements: leaves, ripples, light flares
        interface Element {
            type: 'leaf' | 'ripple' | 'flare';
            x: number;
            y: number;
            size: number;
            rotation: number;
            rotationSpeed: number;
            vx: number;
            vy: number;
            opacity: number;
            opacityDir: number;
            color: string;
        }

        const elements: Element[] = [];
        const colors = [
            'rgba(16, 185, 129, 0.15)', // emerald-500
            'rgba(52, 211, 153, 0.12)', // emerald-400
            'rgba(110, 231, 183, 0.1)', // emerald-300
            'rgba(167, 243, 208, 0.15)', // emerald-200
            'rgba(255, 255, 255, 0.2)', // white
        ];

        // Create elements
        for (let i = 0; i < 15; i++) {
            elements.push({
                type: 'leaf',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 20 + Math.random() * 40,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                vx: (Math.random() - 0.5) * 0.3,
                vy: -0.2 - Math.random() * 0.3,
                opacity: 0.3 + Math.random() * 0.4,
                opacityDir: Math.random() > 0.5 ? 0.002 : -0.002,
                color: colors[Math.floor(Math.random() * 3)],
            });
        }

        for (let i = 0; i < 8; i++) {
            elements.push({
                type: 'ripple',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 30 + Math.random() * 50,
                rotation: 0,
                rotationSpeed: 0,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                opacity: 0.1 + Math.random() * 0.2,
                opacityDir: 0.003,
                color: colors[3],
            });
        }

        for (let i = 0; i < 12; i++) {
            elements.push({
                type: 'flare',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 50 + Math.random() * 100,
                rotation: 0,
                rotationSpeed: 0,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1,
                opacity: 0.05 + Math.random() * 0.1,
                opacityDir: 0.001,
                color: colors[4],
            });
        }

        const drawLeaf = (el: Element) => {
            ctx.save();
            ctx.translate(el.x, el.y);
            ctx.rotate(el.rotation);
            ctx.globalAlpha = el.opacity;

            // Draw a leaf shape
            ctx.beginPath();
            ctx.moveTo(0, -el.size / 2);
            ctx.bezierCurveTo(
                el.size / 3, -el.size / 3,
                el.size / 3, el.size / 3,
                0, el.size / 2
            );
            ctx.bezierCurveTo(
                -el.size / 3, el.size / 3,
                -el.size / 3, -el.size / 3,
                0, -el.size / 2
            );
            ctx.fillStyle = el.color;
            ctx.fill();

            // Leaf stem
            ctx.beginPath();
            ctx.moveTo(0, -el.size / 2);
            ctx.lineTo(0, el.size / 2);
            ctx.strokeStyle = el.color;
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.restore();
        };

        const drawRipple = (el: Element) => {
            ctx.save();
            ctx.translate(el.x, el.y);
            ctx.globalAlpha = el.opacity;

            // Draw concentric circles
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(0, 0, el.size * (0.5 + i * 0.25), 0, Math.PI * 2);
                ctx.strokeStyle = el.color;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            ctx.restore();
        };

        const drawFlare = (el: Element) => {
            ctx.save();
            ctx.translate(el.x, el.y);
            ctx.globalAlpha = el.opacity;

            // Radial gradient for soft light flare
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, el.size);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(0.5, 'rgba(167, 243, 208, 0.1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, el.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            elements.forEach((el) => {
                // Update position
                el.x += el.vx;
                el.y += el.vy;
                el.rotation += el.rotationSpeed;

                // Wrap around edges
                if (el.x < -el.size) el.x = canvas.width + el.size;
                if (el.x > canvas.width + el.size) el.x = -el.size;
                if (el.y < -el.size) el.y = canvas.height + el.size;
                if (el.y > canvas.height + el.size) el.y = -el.size;

                // Pulse opacity for ripples and flares
                if (el.type === 'ripple' || el.type === 'flare') {
                    el.opacity += el.opacityDir;
                    if (el.opacity > 0.3 || el.opacity < 0.05) {
                        el.opacityDir *= -1;
                    }
                }

                // Draw based on type
                if (el.type === 'leaf') {
                    drawLeaf(el);
                } else if (el.type === 'ripple') {
                    drawRipple(el);
                } else if (el.type === 'flare') {
                    drawFlare(el);
                }
            });

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
