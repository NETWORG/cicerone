import Nav from './components/Nav';
import Hero from './sections/Hero';
import ConceptSection from './sections/ConceptSection';
import RouteSection from './sections/RouteSection';
import ItinerarySection from './sections/ItinerarySection';
import RulesSection from './sections/RulesSection';
import LastYearSection from './sections/LastYearSection';
import CrewsSection from './sections/CrewsSection';
import FollowSection from './sections/FollowSection';
import SignupSection from './sections/SignupSection';
import Footer from './sections/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <ConceptSection />
        <RouteSection />
        <ItinerarySection />
        <RulesSection />
        <LastYearSection />
        <CrewsSection />
        <FollowSection />
        <SignupSection />
      </main>
      <Footer />
    </div>
  );
}
