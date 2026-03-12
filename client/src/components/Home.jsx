import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import UpcomingMeets from './UpcomingMeets';
import FeaturedCars from './FeaturedCars';
import CrewIdentity from './CrewIdentity';
import DiscordTeaser from './DiscordTeaser';

const Home = ({ isAdmin }) => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const elementId = location.hash.replace('#', '');
            setTimeout(() => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location]);

    return (
        <main>
            <Hero isAdmin={isAdmin} />
            <UpcomingMeets isAdmin={isAdmin} />
            <FeaturedCars />
            <CrewIdentity />
            <DiscordTeaser />
        </main>
    );
};

export default Home;
