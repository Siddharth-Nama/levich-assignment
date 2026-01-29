import React, { createContext, useState, useContext } from 'react';

const AuctionContext = createContext();

export const useAuction = () => useContext(AuctionContext);

export const AuctionProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateItem = (updatedItem) => {
    setItems((prevItems) => {
      const index = prevItems.findIndex((item) => item._id === updatedItem._id);
      if (index !== -1) {
        const newItems = [...prevItems];
        newItems[index] = updatedItem;
        return newItems;
      }
      return prevItems;
    });
  };

  return (
    <AuctionContext.Provider value={{ items, setItems, updateItem, loading, setLoading }}>
      {children}
    </AuctionContext.Provider>
  );
};
