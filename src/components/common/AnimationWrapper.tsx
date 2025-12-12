import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface AnimationWrapperProps {
    children: ReactNode;
    variant?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'stagger';
    delay?: number;
    className?: string;
}

const variants: Record<string, Variants> = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
    slideUp: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    },
    scaleIn: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
    },
    stagger: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    },
};

export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
    children,
    variant = 'fadeIn',
    delay = 0,
    className = '',
}) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants[variant]}
            transition={{
                duration: 0.3,
                delay,
                ease: 'easeOut',
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface StaggerItemProps {
    children: ReactNode;
    className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ children, className = '' }) => {
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    );
};

interface HoverScaleProps {
    children: ReactNode;
    scale?: number;
    className?: string;
}

export const HoverScale: React.FC<HoverScaleProps> = ({
    children,
    scale = 1.02,
    className = '',
}) => {
    return (
        <motion.div
            whileHover={{ scale, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
