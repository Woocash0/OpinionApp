import React from 'react';
import { faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SortOptions = ({ onSortChange }) => {
  const handleSortChange = (e) => {
    const [criterion, order] = e.target.value.split(':');
    onSortChange(criterion, order);
  };

  return (
    <div className="sort-options">
      <label>
        <FontAwesomeIcon icon={faArrowUpWideShort} className='opinion-icon' size='lg' style={{ color: 'white' }} />
        <select onChange={handleSortChange}>
          <option value="createdAt:desc">Date (Newest)</option>
          <option value="createdAt:asc">Date (Oldest)</option>
          <option value="totalReactions:desc">Total Reactions (Most)</option>
          <option value="totalReactions:asc">Total Reactions (Least)</option>
          <option value="rating:desc">Rating (Highest)</option>
          <option value="rating:asc">Rating (Lowest)</option>
          <option value="price_rating:desc">Price Rating (Highest)</option>
          <option value="price_rating:asc">Price Rating (Lowest)</option>
          <option value="durability_rating:desc">Durability Rating (Highest)</option>
          <option value="durability_rating:asc">Durability Rating (Lowest)</option>
          <option value="capabilities_rating:desc">Capabilities Rating (Highest)</option>
          <option value="capabilities_rating:asc">Capabilities Rating (Lowest)</option>
          <option value="design_rating:desc">Design Rating (Highest)</option>
          <option value="design_rating:asc">Design Rating (Lowest)</option>
        </select>
      </label>
    </div>
  );
};

export default SortOptions;
