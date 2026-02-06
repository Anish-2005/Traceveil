'use client';

import { useEffect } from 'react';

/**
 * ScrollObserver Component
 * 
 * This component sets up an IntersectionObserver to watch for elements with 
 * 'scroll-reveal' classes. It toggles the 'revealed' class based on visibility,
 * enabling bi-directional scrolling animations (reveal on scroll down, hide on scroll up).
 */
export function ScrollObserver() {
    useEffect(() => {
        // Options for the observer
        const options = {
            root: null, // Use the viewport
            rootMargin: '0px',
            threshold: 0.1, // Trigger when 10% of the element is visible
        };

        // Callback function when intersection changes
        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                const element = entry.target as HTMLElement;

                // Check for data-once attribute to disable reverse animation
                const runOnce = element.dataset.once === 'true';

                if (entry.isIntersecting) {
                    // Element entered the viewport
                    element.classList.add('revealed');
                } else {
                    // Element left the viewport
                    if (!runOnce) {
                        element.classList.remove('revealed');
                    }
                }
            });
        };

        // Create the observer
        const observer = new IntersectionObserver(handleIntersect, options);

        // Keep track of observed elements to avoid duplicate observations
        const observedElements = new WeakSet();

        // Function to find and observe elements
        const observeElements = () => {
            const elements = document.querySelectorAll(
                '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
            );

            elements.forEach((el) => {
                if (!observedElements.has(el)) {
                    observer.observe(el);
                    observedElements.add(el);
                }
            });
        };

        // Initial observation
        observeElements();

        // Set up a mutation observer to handle dynamically loaded content
        const mutationObserver = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldUpdate = true;
                    break;
                }
            }
            if (shouldUpdate) {
                observeElements();
            }
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Cleanup
        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);

    return null; // This component handles side effects only
}
