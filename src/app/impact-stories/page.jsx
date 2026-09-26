import LamaNavbar from "@/components/Navbar/navbar";
import LamaFooter from "@/components/Footer/footer";
import ImpactsPage from "../ImpactsPage/page";

export const metadata = {
  title: "Impact Stories | LAMA",
  description:
    "Community videos showing locally led climate adaptation in action across Africa.",
};

export default function ImpactStoriesPage() {
  return (
    <>
      <LamaNavbar />
      <ImpactsPage />
      <LamaFooter />
    </>
  );
}
