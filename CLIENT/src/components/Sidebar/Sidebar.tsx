import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaHome, FaComments, FaBell, FaUser, FaCog, FaSignOutAlt, FaPlus, FaEllipsisV } from 'react-icons/fa';
import { setuser } from '../Redux/Userslice';

const Sidebar = () => {
  const [isBottom, setIsBottom] = useState(false); // Toggle top/bottom position
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menus = [
    {
      title: user.role === 'buyer' ? 'My Requests' : 'Browse Requests',
      link: user.role === 'buyer' ? '/my-requests' : '/browse-requests',
      icon: FaHome,
    },
    {
      title: 'Conversations',
      link: '/my-conversations',
      icon: FaComments,
    },
    {
      title: user.role === 'buyer' ? 'Post a Request' : '',
      link: user.role === 'buyer' ? '/post-request' : '',
      icon: user.role === 'buyer' ? FaPlus : null,
    },
    {
      title: 'Notifications',
      link: '/notifications',
      icon: FaBell,
    },
    {
      title: 'Profile',
      link: '/profile',
      icon: FaUser,
    },
    {
      title: 'Settings',
      link: '/settings',
      icon: FaCog,
    },
    {
      title: 'Logout',
      link: '',
      icon: FaSignOutAlt,
      action: () => dispatch(setuser(null)),
    },
  ];

  const handleMenuClick = (action?: () => void, link?: string) => {
    if (action) {
      action();
    }
    if (link) {
      navigate(link); // Programmatic navigation
    }
  };

  return (
    <div className="relative z-50">
      <aside
        className={`fixed ${isBottom ? 'bottom-0' : 'top-0'} left-0 right-0 bg-gray-100 dark:bg-gray-950 text-black dark:text-white p-4 shadow-lg`}
      >
        <ul className="flex flex-row justify-around items-center space-x-4 md:space-x-6 w-full">
          {menus.map((menu, index) => (
            menu.icon && (
              <li key={index} className="group flex flex-col items-center">
                <menu.icon
                  className="text-xl cursor-pointer"
                  onClick={() => handleMenuClick(menu.action, menu.link)}
                />
                {menu.title && (
                  <span className="hidden md:block mt-2 text-sm md:text-base">
                    {menu.title}
                  </span>
                )}
              </li>
            )
          ))}
          <li className="group flex flex-col items-center">
            <FaEllipsisV
              className="text-xl cursor-pointer"
              onClick={() => setIsBottom(!isBottom)}
            />
            <span className="hidden md:block mt-2 text-sm md:text-base">
              Toggle Position
            </span>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
