import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaHome, FaComments, FaBell, FaUser, FaCog, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import { setuser } from '../Redux/Userslice'; // Make sure to adjust the import path

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const Menus = [
    { title: user.role === 'buyer' ? 'My Requests' : 'Browse Requests', link: user.role === 'buyer' ? '/my-requests' : '/browse-requests', icon: FaHome },
    { title: 'Conversations', link: '/my-conversations', icon: FaComments },
    { title: user.role === 'buyer' ? 'Post a Request' : '', link: user.role === 'buyer' ? '/post-request' : '', icon: FaPlus },
    { title: 'Notifications', link: '/notifications', icon: FaBell },
    { title: 'Profile', link: '/profile', icon: FaUser },
    { title: 'Settings', link: '/settings', icon: FaCog },
    { title: 'Logout', link: '', icon: FaSignOutAlt, action: () => dispatch(setuser(null)) },
  ];

  const handleMenuClick = (action: Function | undefined, link: string | undefined) => {
    if (action) {
      action();
    }
    if (link) {
      // Navigate to the link
      window.location.href = link;
    }
  };

  return (
    <aside className={` ${open ? 'w-72' : 'w-70 '} bg-gray-100 dark:bg-gray-950 dark:text-white text-black h-screen p-4 relative duration-300`}>
      <button
        className="absolute top-8 -right-3 w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {open ? '<' : '>'}
      </button>
      <ul>
        {Menus.map((Menu, index) => (
          <li key={index} className="mb-2 flex items-center">
            <Menu.icon className="mr-3 cursor-pointer" onClick={() => handleMenuClick(Menu.action, Menu.link)} />
            {Menu.link ? (
              <Link to={Menu.link} className={`text-blue-500 ${!open && 'hidden md:block sm:block'}`}>
                <span className={`${open ? 'block' : 'hidden'} sm:inline`}>{Menu.title}</span>
              </Link>
            ) : (
              Menu.title && (
                <button className={`text-blue-500 ${!open && 'hidden md:block sm:block'}`} onClick={() => handleMenuClick(Menu.action, Menu.link)}>
                  <span className={`${open ? 'block' : 'hidden'} sm:inline`}>{Menu.title}</span>
                </button>
              )
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
