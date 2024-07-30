import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBoxArchive, faUser, faTags, faSquarePlus, faRankingStar } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logo_color.svg';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <img src={logo} alt="Logo" />
      <ul>
        <NavItem icon={faTags} link="/" text="Home" />
        <NavItem icon={faRankingStar} link="/ranking" text="Ranking" />
        <NavItem icon={faSquarePlus} link="/add_product" text="Add Product" />
        <NavItem icon={faBoxArchive} link="/warranties" text="Warranties" />
        <NavItem icon={faUser} link="/account" text="My account" />
        
        {/*
        <SearchNavItem />
        <NavItem icon={faHouse} link="warranties" text="Warranties" />
        <NavItem icon={faTags} link="products" text="Products" />
        
        */}
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

const SearchNavItem = () => {
  return (
    <li id="search_block">
      <a href="#" className="button" id="search_button">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="steady" />
      <FontAwesomeIcon icon={faMagnifyingGlass} bounce className="animated" />
      <span className="nav-text">Search</span>
      <input id="searchbar" type="text" placeholder="search" style={{ display: 'none' }} />
      </a>
    </li>
  );
};

export default Navbar;
