// import Header from "../components/Header/Header"
import Navbar from "../components/Navbar/Navbar"
import HeroSection from "../components/Herosection/Herosection"
import FeaturesSection from "../components/Features/Features"
import TestimonialsSection from "../components/Testinomials/Testinomials"
import Footer from "../components/Footer/Footer"
function Landingpage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Header /> */}
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  )
}

export default Landingpage