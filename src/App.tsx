import { useReveal } from './hooks/useReveal';
import { GiftsSection } from './components/GiftsSection';
import { HeroSection } from './components/HeroSection';
import { InvitationSection } from './components/InvitationSection';
import { LocationSection } from './components/LocationSection';
import { RsvpSection } from './components/RsvpSection';
import { SiteFooter } from './components/SiteFooter';

export default function App() {
  useReveal();

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="overflow-x-hidden">
      <HeroSection onDiscover={() => scrollTo('#convite')} />
      <InvitationSection />
      <GiftsSection />
      <RsvpSection onLocation={() => scrollTo('#localizacao')} />
      <LocationSection />
      <SiteFooter />
    </main>
  );
}
