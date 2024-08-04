import { Link } from "react-router-dom";
const Footer = () => {
    return (
      <footer className="bg-blue-500 dark:bg-gray-950 text-white py-10">
        <div className="container mx-auto text-center">
          <div className="mb-4">
            <a href="#" className="mx-2">Contact Us</a>
            <Link to='/privacypolicy' className="mx-2">Privacy Policy</Link>
            <Link to='/termsofservice' className="mx-2">Terms of Service</Link>
          </div>
          <div>
            <a href="#" className="mx-2"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="mx-2"><i className="fab fa-twitter"></i></a>
            <a href="#" className="mx-2"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <p className="mt-4">&copy; 2024 WishMe. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  