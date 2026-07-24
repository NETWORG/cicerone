import Nav from './components/Nav';
import Hero from './sections/Hero';
import RouteSection from './sections/RouteSection';
import FollowSection from './sections/FollowSection';
import ItinerarySection from './sections/ItinerarySection';
import CrewsSection from './sections/CrewsSection';
import LastYearSection from './sections/LastYearSection';
import Footer from './sections/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <RouteSection />
        <FollowSection />
        <ItinerarySection />
        <CrewsSection />
        <LastYearSection />
      </main>
      <Footer />
    </div>
  );
}
