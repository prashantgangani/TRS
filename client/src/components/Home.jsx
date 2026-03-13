import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import CountdownTimer from './CountdownTimer';
import UpcomingMeets from './UpcomingMeets';
import FeaturedCars from './FeaturedCars';
import CrewIdentity from './CrewIdentity';
import DiscordTeaser from './DiscordTeaser';

const Home = ({ canEditHero, canPublishMeet }) => {
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
            <Hero isAdmin={canEditHero} />
            <CountdownTimer />
            <UpcomingMeets isAdmin={canPublishMeet} />
            <FeaturedCars />
            <CrewIdentity />
            <DiscordTeaser />
        </main>
    );
};

export default Home;
