import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTimes } from '@fortawesome/free-solid-svg-icons';
import debounce from 'lodash.debounce';

const SearchNavItem = ({ products, onSearchResults, onClearSearch }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchVisible) {
      searchInputRef.current.focus();
    }
  }, [searchVisible]);

  useEffect(() => {
    // Filtrowanie produktów na podstawie frazy wyszukiwania z debounce
    const debouncedSearch = debounce(() => {
      const searched = products.filter(product =>
        product.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      onSearchResults(searched);
    }, 1000); // 1 second debounce

    debouncedSearch();

    return () => debouncedSearch.cancel();
  }, [searchTerm, products, onSearchResults]);

  const handleSearchClick = (event) => {
    event.preventDefault();
    if (searchVisible) {
      setSearchTerm(''); // Clear search term when closing search
      onClearSearch();  // Clear search results when closing search
    }
    setSearchVisible(prev => !prev); // Toggle visibility
  };


  return (
    <div id="search_block">
      {searchVisible && (
        <input
          id="searchbar"
          type="text"
          placeholder="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
          ref={searchInputRef}
        />
      )}
      <a href="#" className="button" id="search_button" onClick={handleSearchClick}>
        <FontAwesomeIcon icon={searchVisible ? faTimes : faMagnifyingGlass} className="steady" />
        {searchVisible && <FontAwesomeIcon icon={faTimes} bounce className="animated" />}
        {!searchVisible && <FontAwesomeIcon icon={faMagnifyingGlass} bounce className="animated" />}
      </a>
    </div>
  );
};

export default SearchNavItem;
