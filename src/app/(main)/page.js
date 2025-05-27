import BestSellers from "@/components/BestSellers";
import DiscountModal from "@/components/DiscountModal";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import InfoSection from "@/components/InfoSection";
import TestimonialSection from "@/components/Testimonial";
import TrustPilotWidget from "@/components/TrustPilotWidget";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <BestSellers />
      <InfoSection />
      {/* <TrustPilotWidget /> */}
      <DiscountModal />
      <div>
        <TestimonialSection />
      </div>
    </main>
  );
}
