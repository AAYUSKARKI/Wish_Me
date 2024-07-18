import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const HeroSection = () => {

   const { user } = useSelector((state: any) => state.user);

    return (
      <section className="bg-blue-500 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to WishMe</h1>
          <p className="text-lg mb-8">Bridge the gap between buyers and sellers effortlessly.</p>
          {!user && <Link to="/register" className="bg-white text-blue-500 px-6 py-2 rounded-full font-semibold">Sign Up Now</Link>}
          {
            user && <Link to="/post-request" className="bg-white text-blue-500 px-6 py-2 rounded-full font-semibold">Make A Wish</Link>
          }
        </div>
      </section>
    );
  };
  
  export default HeroSection;
  