import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const pos = useRef({ x: 0, y: 0 });
    const mouse = useRef({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY };
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseDown = () => {
            if (cursorRef.current) {
                cursorRef.current.style.transform += ' scale(0.8)';
            }
        };

        const handleMouseUp = () => {
            if (cursorRef.current) {
                cursorRef.current.style.transform = cursorRef.current.style.transform.replace(' scale(0.8)', '');
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        const animate = () => {
            // LERP (Linear Interpolation) for smooth movement
            pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
            pos.current.y += (mouse.current.y - pos.current.y) * 0.15;

            if (cursorRef.current) {
                cursorRef.current.style.left = `${pos.current.x}px`;
                cursorRef.current.style.top = `${pos.current.y}px`;

                // Rotation based on movement direction
                const dx = mouse.current.x - pos.current.x;
                const dy = mouse.current.y - pos.current.y;
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                cursorRef.current.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            }

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            cancelAnimationFrame(animationId);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            ref={cursorRef}
            style={{
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 9999,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
                width: '20px',
                height: '20px'
            }}
        >
            {/* Default cursor pointer */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#fb792b" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <style>{`
                body { cursor: none !important; }
                a, button, .cursor-pointer, input, textarea, select { cursor: none !important; }
            `}</style>
        </div>
    );
};

export default CustomCursor;
