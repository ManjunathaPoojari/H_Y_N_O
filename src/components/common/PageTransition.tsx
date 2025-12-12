'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
    children: ReactNode;
    currentPath: string;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut' as const,
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: 'easeIn' as const,
        },
    },
};

export const PageTransition = ({ children, currentPath }: PageTransitionProps) => {
    const [displayChildren, setDisplayChildren] = useState(children);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        setIsTransitioning(true);
        const timer = setTimeout(() => {
            setDisplayChildren(children);
            setIsTransitioning(false);
        }, 150);

        return () => clearTimeout(timer);
    }, [currentPath, children]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentPath}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                className="w-full h-full"
            >
                {displayChildren}
            </motion.div>
        </AnimatePresence>
    );
};
