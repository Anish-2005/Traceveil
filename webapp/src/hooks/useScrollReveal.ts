import { useEffect } from 'react';

export function useScrollReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    } else {
                        // Reverse scrolling: remove class when out of view to re-trigger
                        // Only remove if we've scrolled past it (e.g. going up or down away)
                        // For a smoother feel, we can just toggle it based on intersection
                        entry.target.classList.remove('revealed');
                    }
                });
            },
            {
                threshold: 0.15, // Slightly higher threshold to avoid flickering at edges
                rootMargin: '0px 0px -50px 0px'
            }
        );

        const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
}
