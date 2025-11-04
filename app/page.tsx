import Header from "./components/Header";
import Hero from "./components/sections/Hero";
import Features from "./components/sections/Features";
import ProductShowcase from "./components/sections/ProductShowcase";
import Benefits from "./components/sections/Benefits";
import CustomerBenefits from "./components/sections/CustomerBenefits";
import TargetAudience from "./components/sections/TargetAudience";
import ProcessSteps from "./components/sections/ProcessSteps";
import Testimonials from "./components/sections/Testimonials";
import FAQ from "./components/sections/FAQ";
import CTA from "./components/sections/CTA";
import Footer from "./components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Header />
      <Hero />
      <Features />
      <ProductShowcase />
      <Benefits />
      <CustomerBenefits />
      <TargetAudience />
      <ProcessSteps />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
