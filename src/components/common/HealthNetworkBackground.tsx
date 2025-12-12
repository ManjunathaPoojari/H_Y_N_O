'use client';

import { useEffect, useRef } from 'react';

interface HealthNetworkBackgroundProps {
    className?: string;
}

export const HealthNetworkBackground = ({ className = '' }: HealthNetworkBackgroundProps) => {
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

        // Network nodes
        interface Node {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            type: 'node' | 'dna' | 'pulse' | 'cross';
        }

        const nodes: Node[] = [];
        const nodeCount = 60;

        // Create network nodes
        for (let i = 0; i < nodeCount; i++) {
            const type = Math.random() < 0.7 ? 'node' :
                Math.random() < 0.5 ? 'dna' :
                    Math.random() < 0.5 ? 'pulse' : 'cross';
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: type === 'node' ? 2 + Math.random() * 3 : 8 + Math.random() * 8,
                type,
            });
        }

        // DNA helix animation offset
        let dnaOffset = 0;
        // Pulse animation offset
        let pulseOffset = 0;

        const connectionDistance = 150;

        const drawNode = (node: Node) => {
            ctx.save();
            ctx.translate(node.x, node.y);

            if (node.type === 'node') {
                // Simple dot
                ctx.beginPath();
                ctx.arc(0, 0, node.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(59, 130, 246, 0.5)'; // blue-500
                ctx.fill();
            } else if (node.type === 'dna') {
                // DNA helix
                ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)'; // blue-400
                ctx.lineWidth = 1.5;
                for (let i = 0; i < 20; i++) {
                    const y = (i - 10) * 3;
                    const x1 = Math.sin((i + dnaOffset) * 0.5) * 8;
                    const x2 = -Math.sin((i + dnaOffset) * 0.5) * 8;

                    ctx.beginPath();
                    ctx.arc(x1, y, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x2, y, 1.5, 0, Math.PI * 2);
                    ctx.fill();

                    if (i % 3 === 0) {
                        ctx.beginPath();
                        ctx.moveTo(x1, y);
                        ctx.lineTo(x2, y);
                        ctx.stroke();
                    }
                }
            } else if (node.type === 'pulse') {
                // Pulse/heartbeat line
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(-20, 0);
                ctx.lineTo(-15, 0);
                ctx.lineTo(-12, -8);
                ctx.lineTo(-8, 10);
                ctx.lineTo(-4, -12);
                ctx.lineTo(0, 8);
                ctx.lineTo(4, 0);
                ctx.lineTo(20, 0);
                ctx.stroke();
            } else if (node.type === 'cross') {
                // Medical cross
                ctx.strokeStyle = 'rgba(147, 197, 253, 0.5)'; // blue-300
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-8, 0);
                ctx.lineTo(8, 0);
                ctx.moveTo(0, -8);
                ctx.lineTo(0, 8);
                ctx.stroke();
            }

            ctx.restore();
        };

        const drawConnections = () => {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.15;
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const drawHumanSilhouette = () => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const scale = Math.min(canvas.width, canvas.height) * 0.003;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.scale(scale, scale);

            // Faint human silhouette made of dots
            ctx.fillStyle = 'rgba(147, 197, 253, 0.08)';

            // Head
            for (let a = 0; a < Math.PI * 2; a += 0.3) {
                const r = 35;
                ctx.beginPath();
                ctx.arc(Math.cos(a) * r, -120 + Math.sin(a) * r, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Body outline with dots
            const bodyPoints = [
                // Neck
                { x: 0, y: -80 },
                // Shoulders
                { x: -50, y: -60 }, { x: 50, y: -60 },
                // Arms
                { x: -70, y: -40 }, { x: 70, y: -40 },
                { x: -85, y: 0 }, { x: 85, y: 0 },
                { x: -95, y: 40 }, { x: 95, y: 40 },
                // Torso
                { x: -40, y: -40 }, { x: 40, y: -40 },
                { x: -35, y: 0 }, { x: 35, y: 0 },
                { x: -30, y: 40 }, { x: 30, y: 40 },
                // Legs
                { x: -25, y: 80 }, { x: 25, y: 80 },
                { x: -30, y: 120 }, { x: 30, y: 120 },
                { x: -35, y: 160 }, { x: 35, y: 160 },
            ];

            bodyPoints.forEach((point) => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });

            // Connect body points with lines
            ctx.strokeStyle = 'rgba(147, 197, 253, 0.05)';
            ctx.lineWidth = 1;
            for (let i = 0; i < bodyPoints.length - 1; i++) {
                for (let j = i + 1; j < bodyPoints.length; j++) {
                    const dx = bodyPoints[i].x - bodyPoints[j].x;
                    const dy = bodyPoints[i].y - bodyPoints[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 60) {
                        ctx.beginPath();
                        ctx.moveTo(bodyPoints[i].x, bodyPoints[i].y);
                        ctx.lineTo(bodyPoints[j].x, bodyPoints[j].y);
                        ctx.stroke();
                    }
                }
            }

            ctx.restore();
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw human silhouette first (background)
            drawHumanSilhouette();

            // Update animation offsets
            dnaOffset += 0.05;
            pulseOffset += 0.1;

            // Update and draw nodes
            nodes.forEach((node) => {
                node.x += node.vx;
                node.y += node.vy;

                // Wrap around edges
                if (node.x < -20) node.x = canvas.width + 20;
                if (node.x > canvas.width + 20) node.x = -20;
                if (node.y < -20) node.y = canvas.height + 20;
                if (node.y > canvas.height + 20) node.y = -20;

                drawNode(node);
            });

            // Draw connections between nodes
            drawConnections();

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
