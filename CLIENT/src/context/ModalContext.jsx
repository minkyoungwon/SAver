import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState({
    barcode: '',
    type: '',
    name: '',
    deadline: '',
    usage_location: '',
    image: '',
    user_id: '',
    status: '',
    note: '',
    categories: [],
    id: ''
  });

  const openModal = (coupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, selectedCoupon, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext); 