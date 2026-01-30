import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  deactivateOpen: boolean;
  openDeactivateModal: () => void;
  closeDeactivateModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const openDeactivateModal = () => setDeactivateOpen(true);
  const closeDeactivateModal = () => setDeactivateOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, deactivateOpen,
        openDeactivateModal,
        closeDeactivateModal, }}>
      {children}
    </ModalContext.Provider>
  );
};
