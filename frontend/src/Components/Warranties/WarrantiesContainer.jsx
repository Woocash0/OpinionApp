import React, { useState } from 'react';
import Warranties from './Warranties'
import WarrantyPanel from './WarrantyPanel';


const WarrantiesContainer = () => {
  const [selectedWarranty, setSelectedWarranty] = useState(null);

  const handleWarrantySelect = (warranty) => {
    console.log(warranty);
    setSelectedWarranty(warranty);
  };

  return (
    <>
      <Warranties onSelectWarranty={handleWarrantySelect} />
      <WarrantyPanel selectedWarranty={selectedWarranty} onClose={() => setSelectedWarranty(null)}/>
    </>
  );
};

export default WarrantiesContainer;
