import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMagnifyingGlass, faBoxArchive, faUser, faTags, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logo_color.svg';

const Navbar = () => {
  return (
    <nav>
      <img src={logo} alt="Logo" />
      <ul>
        <NavItem icon={faHouse} link="/" text="Home" />
        <NavItem icon={faHouse} link="warranties" text="Warranties" />
        <NavItem icon={faSquarePlus} link="add_product" text="Add Product" />
        <NavItem icon={faTags} link="products" text="Products" />
        <SearchNavItem />
        <NavItem icon={faBoxArchive} link="archive" text="Archive" />
        <NavItem icon={faUser} link="account" text="My account" />
      </ul>
    </nav>
  );
};

const NavItem = ({ icon, link, text }) => {
  return (
    <li>
      <a href={link} className="button">
        <FontAwesomeIcon icon={icon} className="steady" />
        <FontAwesomeIcon icon={icon} bounce className="animated" />
        <span className="nav-text">{text}</span>
      </a>
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
