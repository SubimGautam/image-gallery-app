import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import HeroImg1 from '../../assets/hero-1.jpg';
import HeroImg2 from '../../assets/hero-2.jpg';
import HeroImg3 from '../../assets/hero-3.jpg';
import HeroImg4 from '../../assets/hero-4.jpg';
import HeroImg5 from '../../assets/hero-5.jpg';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className='landing-page'>
            <header className='landing-navbar'>
                <img src={Logo} alt="Logo" className='landing-logo' />
                <div className='landing-navbar-actions'>
                    <button className='landing-login-btn' onClick={() => navigate('/login')}>Login</button>
                    <button className='landing-signup-btn' onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            </header>

            <section className='landing-hero'>
                <div className='landing-hero-text'>
                    <h1>Every photo tells a story. <span>Share yours.</span></h1>
                    <p>Upload, organize, and discover beautiful images from creators around the world — all in one gallery built for you.</p>
                    <div className='landing-hero-actions'>
                        <button className='landing-cta-primary' onClick={() => navigate('/signup')}>Get Started</button>
                        <button className='landing-cta-secondary' onClick={() => navigate('/login')}>Login</button>
                    </div>
                </div>

                <div className='landing-hero-collage'>
                    <img src={HeroImg1} alt="" className='collage-img img-1' />
                    <img src={HeroImg2} alt="" className='collage-img img-2' />
                    <img src={HeroImg3} alt="" className='collage-img img-3' />
                    <img src={HeroImg4} alt="" className='collage-img img-4' />
                    <img src={HeroImg5} alt="" className='collage-img img-5' />
                </div>
            </section>

            <section className='landing-features'>
                <div className='feature-card'>
                    <span className='feature-icon'>&#9733;</span>
                    <h3>Upload &amp; Organize</h3>
                    <p>Keep your photos organized by category, and choose what stays private and what goes public.</p>
                </div>
                <div className='feature-card'>
                    <span className='feature-icon'>&#128269;</span>
                    <h3>Discover</h3>
                    <p>Explore public galleries from other creators and save the images that inspire you.</p>
                </div>
                <div className='feature-card'>
                    <span className='feature-icon'>&#128172;</span>
                    <h3>Connect</h3>
                    <p>Follow creators you love and message them directly, right from their profile.</p>
                </div>
            </section>

            <footer className='landing-footer'>
                <p>&copy; {new Date().getFullYear()} PIX. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;