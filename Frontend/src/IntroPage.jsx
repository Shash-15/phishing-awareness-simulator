import React, { useEffect, useState } from 'react';
import './IntroPage.css';

export default function IntroPage({ onStart }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="intro-container">
            {/* Navigation */}
            <nav className="intro-nav">
                <div className="nav-logo-container">
                    <img src="/logo.png" alt="PhishSim Logo" className="nav-logo" />
                </div>
            </nav>

            {/* Main Content */}
            <div className="intro-content">

                {/* Hero Section */}
                <div className="hero-section animate-slide-up">
                    <p className="section-header">BREAKING FREE FROM THE FRUSTRATION</p>
                    <h1 className="hero-title">
                        Phished security awareness <br />
                        training <span className="highlight-text">closes the gaps</span>
                    </h1>
                    <p className="hero-subtitle">
                        Phished is designed to eliminate human error as a risk — through automated training
                        in a safe environment that requires no effort from your IT team.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="features-grid animate-slide-up delay-200">
                    <FeatureCard
                        icon="📨" // Placeholder icon
                        title="ZERO INCIDENT MAIL™"
                        desc="Personalized training for first-time clickers, repeat offenders and people who enter data - all in a secure environment."
                    />
                    <FeatureCard
                        icon="🔄" // Placeholder icon
                        title="AUTOMATED PHISHING SIMULATIONS"
                        desc="Localized to your company, tailored to your employees, automated to save you time."
                    />
                    <FeatureCard
                        icon="🎓" // Placeholder icon
                        title="GAMIFIED TRAINING AND CERTIFICATIONS"
                        desc="Interactive, recognizable workflows and best practices for all employees — with certificates to reward every accomplishment."
                    />
                    <FeatureCard
                        icon="⚠️" // Placeholder icon
                        title="REAL-TIME THREAT ALERTS"
                        desc="A cyber defense team informs your employees on the latest cyber threats with quick guides showing them how to respond."
                    />
                </div>

                <div className="cta-container animate-slide-up delay-300">
                    <button onClick={onStart} className="btn-primary cta-btn">
                        Get Started
                    </button>
                </div>

            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="feature-card">
            <div className="feature-icon-wrapper">
                {icon}
            </div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-desc">{desc}</p>
        </div>
    );
}
