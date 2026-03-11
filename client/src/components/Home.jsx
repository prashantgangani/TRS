import React from 'react';
import Hero from './Hero';
import UpcomingMeets from './UpcomingMeets';
import FeaturedCars from './FeaturedCars';
import CrewIdentity from './CrewIdentity';
import DiscordTeaser from './DiscordTeaser';

const Home = ({ isAdmin }) => {
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
