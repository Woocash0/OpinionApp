import React, { useState, useEffect } from 'react';

const WarrantyTimer = ({ purchaseDate, warrantyYears }) => {
  // Stan przechowujący pozostały czas
  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Funkcja do aktualizacji pozostałego czasu
  const updateRemainingTime = () => {
    const purchaseDateObj = new Date(purchaseDate);
    const currentDate = new Date();

    const warrantyEndDate = new Date(
      purchaseDateObj.getFullYear() + warrantyYears,
      purchaseDateObj.getMonth(),
      purchaseDateObj.getDate()
    );

    const timeDifference = warrantyEndDate.getTime() - currentDate.getTime();

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    setRemainingTime({
      days,
      hours,
      minutes,
      seconds
    });
  };

  // Efekt do uruchamiania i zatrzymywania interwału
  useEffect(() => {
    // Wywołujemy funkcję raz na starcie, aby zainicjować stan
    updateRemainingTime();

    // Uruchamiamy interwał co sekundę
    const interval = setInterval(updateRemainingTime, 1000);

    // Zatrzymujemy interwał po odmontowaniu komponentu
    return () => {
      clearInterval(interval);
    };
  }, [purchaseDate, warrantyYears]); // Zależności dla useEffect

  return (
    <>
      <div className="timebox"><b>{remainingTime.days}</b>&nbsp;dni</div>
      <div className="timebox"><b>{remainingTime.hours}</b>&nbsp;godzin</div>
      <div className="timebox"><b>{remainingTime.minutes}</b>&nbsp;minut</div>
      <div className="timebox"><b>{remainingTime.seconds}</b>&nbsp;sekund</div>
    </>
  );
};

export default WarrantyTimer;
