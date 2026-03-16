import React, { useEffect, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import CountdownTimer from './CountdownTimer';
import UpcomingMeets from './UpcomingMeets';

// Lazy load below-the-fold components
const FeaturedCars = lazy(() => import('./FeaturedCars'));
const CrewIdentity = lazy(() => import('./CrewIdentity'));
const DiscordTeaser = lazy(() => import('./DiscordTeaser'));

const FallbackLoader = () => (
    <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-white/10 border-t-electric-blue rounded-full animate-spin"></div>
    </div>
);

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
            <Suspense fallback={<FallbackLoader />}>
                <FeaturedCars />
                <CrewIdentity />
                <DiscordTeaser />
            </Suspense>
        </main>
    );
};

export default Home;
