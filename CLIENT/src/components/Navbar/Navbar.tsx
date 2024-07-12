const Navbar = () => {
    return (
      <nav className="bg-white shadow-md">
        <ul className="flex flex-col md:flex-row justify-center md:space-x-8 p-4">
          <li className="text-gray-700 hover:text-blue-500 transition duration-300 transform hover:-translate-y-1">
            <a href="#">How It Works</a>
          </li>
          <li className="text-gray-700 hover:text-blue-500 transition duration-300 transform hover:-translate-y-1">
            <a href="#">About</a>
          </li>
          <li className="text-gray-700 hover:text-blue-500 transition duration-300 transform hover:-translate-y-1">
            <a href="#">Service</a>
          </li>
          <li className="text-gray-700 hover:text-blue-500 transition duration-300 transform hover:-translate-y-1">
            <a href="#">Login</a>
          </li>
          <li className="text-gray-700 hover:text-blue-500 transition duration-300 transform hover:-translate-y-1">
            <a href="#">Signup</a>
          </li>
        </ul>
      </nav>
    );
  };
  
  export default Navbar;
  