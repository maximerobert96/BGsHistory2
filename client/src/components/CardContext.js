import React, { createContext, useContext, useState } from 'react';

const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCloseCardInfo = () => {
    setSelectedCard(null);
  };

  return (
    <CardContext.Provider value={{ selectedCard, handleCardClick, handleCloseCardInfo }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => useContext(CardContext);
