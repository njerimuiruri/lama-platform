import LamaNavbar from "@/components/Navbar/navbar";
import HeroSection from "./Herosection/page";
import AboutSection from "./Aboutsection/page";
import ImpactsPage from "./ImpactsPage/page";
import BlogsPage from "./blogssection/page";
import LamaFooter from "@/components/Footer/footer";
import ResearchQuestionsSection from "./researchquestions/page";
import LockedSection from "@/components/ContentGate/LockedSection";

export default function Home() {
  return (
    <>
      <LamaNavbar />

      {/* Always visible — HeroSection + Introducing LAMA + Why LAMA Matters */}
      <HeroSection />
      <AboutSection mode="intro-only" />

      {/* Locked: blurred teaser starts with the map snippet */}
      <LockedSection>
        <AboutSection mode="map-only" />
        <ResearchQuestionsSection />
        <ImpactsPage />
        <BlogsPage />
      </LockedSection>

      <LamaFooter />
    </>
  );
}
