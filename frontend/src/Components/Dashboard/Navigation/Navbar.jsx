import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive, faUser, faTags, faRankingStar, faUserShield, faSignInAlt, faUserPlus, faEye, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logo_color.svg';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';

const Navbar = () => {
  const navigate = useNavigate();
  const auth = useAuthUser();
  const user = auth();
  const userRoles = user ? user.roles : [];

  const handleLogoClick = () => {
    navigate('/', { replace: true });
  };

  return (
    <nav>
      <img src={logo} alt="Logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }} />
      <ul>
      {user ? (
        <>
        {userRoles.includes('ROLE_USER') && (
          <>
            <NavItem icon={faTags} link="/" text="Products" />
            <NavItem icon={faRankingStar} link="/ranking" text="Ranking" />
            <NavItem icon={faBoxArchive} link="/warranties" text="My warranties" />
            <NavItem icon={faUser} link="/account" text="My account" />
          </>
        )}

        {userRoles.includes('ROLE_MODERATOR') && (
          <>
            <NavItem icon={faTags} link="/" text="Products" />
            <NavItem icon={faEye} link="/inspect_opinions" text="Inspect opinions" />
            <NavItem icon={faClipboardCheck} link="/approve_products" text="Product approval" />
            <NavItem icon={faUser} link="/account" text="My account" />
          </>
        )}
        </>
        ) : (
          <>
          {/* Ścieżki dla niezalogowanych użytkowników */}
          <NavItem icon={faTags} link="/" text="Products" />
          <NavItem icon={faRankingStar} link="/ranking" text="Ranking" />
          <NavItem icon={faSignInAlt} link="/loginform" text="Log in" />
          <NavItem icon={faUserPlus} link="/signinform" text="Sign up" />
        </>
        )}
      </ul>
    </nav>
  );
};

const NavItem = ({ icon, link, text }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link, { replace: true });
  };

  return (
    <li>
      <button onClick={handleClick} className="button">
        <FontAwesomeIcon icon={icon} className="steady" />
        <FontAwesomeIcon icon={icon} bounce className="animated" />
        <span className="nav-text">{text}</span>
      </button>
    </li>
  );
};

export default Navbar;
