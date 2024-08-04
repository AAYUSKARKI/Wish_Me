import { useState, useEffect } from 'react';
import './Cookieinfo.css';
import { Link } from 'react-router-dom';

function Cookieinfo() {
  const [isCookieAccepted, setIsCookieAccepted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    if (cookieAccepted) {
      setIsCookieAccepted(true);
    } else {
      setIsVisible(true); // Make the component visible
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setIsCookieAccepted(true);
    setIsVisible(false); // Hide the component
  };

  const handleManagePreferences = () => {
    console.log('Manage preferences clicked');
  };

  if (isCookieAccepted) {
    return null;
  }

  return (
    <div className={`cookie-card ${isVisible ? 'show' : ''}`}>
      <span className="title">🍪 Cookie Notice</span>
      <p className="description">
        We use cookies to ensure that we give you the best experience on our website. 
        <Link to='/cookiepolicy'>Read cookies policies</Link>.
      </p>
      <div className="actions">
        <button className="pref" onClick={handleManagePreferences}>
          Manage your preferences
        </button>
        <button className="accept" onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  );
}

export default Cookieinfo;
