import LamaNavbar from "@/components/Navbar/navbar";
import HeroSection from "./Herosection/page";
import AboutSection from "./Aboutsection/page";
import LamaFooter from "@/components/Footer/footer";
import LockedSection from "@/components/ContentGate/LockedSection";
import ImpactStoriesTeaser from "@/components/ImpactStories/ImpactStoriesTeaser";
import MerlSpotlightBanner from "@/components/MerlSpotlightSection/MerlSpotlightBanner";

export default function Home() {
  return (
    <>
      <LamaNavbar />

      {/* Always visible — HeroSection + What is LAMA? */}
      <HeroSection />
      <AboutSection mode="intro-only" />

      {/* Locked: blurred teaser starts with the map snippet */}
      <LockedSection>
        <AboutSection mode="map-only" />
      </LockedSection>

      {/* Short previews — full content lives on /impact-stories and /AboutPage */}
      <ImpactStoriesTeaser />
      <MerlSpotlightBanner />

      <LamaFooter />
    </>
  );
}
