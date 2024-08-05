import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive, faUser, faTags, faRankingStar } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logo_color.svg';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <img src={logo} alt="Logo" />
      <ul>
        <NavItem icon={faTags} link="/" text="Products" />
        <NavItem icon={faRankingStar} link="/ranking" text="Ranking" />
        <NavItem icon={faBoxArchive} link="/warranties" text="My warranties" />
        <NavItem icon={faUser} link="/account" text="My account" />
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
