import React, { useState, useEffect } from 'react';
import './VideoPopup.css';

const VideoPopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1500); // Show after 1.5 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="video-popup-overlay">
            <div className="video-popup-content">
                <button className="video-popup-close" onClick={handleClose}>
                    &times;
                </button>
                <div className="video-container">
                    <video
                        autoPlay
                        muted
                        controls
                        className="promo-video"
                        onEnded={handleClose}
                    >
                        <source src="/Trainvideo.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="video-popup-footer">
                    <h3>Experience the New Smart IRCTC</h3>
                    <p>Faster bookings, smarter seat allocation, and a seamless journey.</p>
                    <button className="start-journey-btn" onClick={handleClose}>Start Journey</button>
                </div>
            </div>
        </div>
    );
};

export default VideoPopup;
