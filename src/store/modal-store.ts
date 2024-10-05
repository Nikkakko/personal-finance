import { create } from "zustand";
type modalType =
  | "budget"
  | "transaction"
  | "pots"
  | "recurring-bills"
  | "balance";

interface ModalData {
  isEdit?: boolean;
  balance?: {
    current: number;
    income: number;
    id: string;
    userEmail: string;
  };
}

interface ModalStore {
  modal: modalType | null;
  modalData: ModalData;

  openModal: (modal: modalType, data?: ModalData) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>(set => ({
  modal: null,
  modalData: {},

  openModal: (modal, data) => set({ modal, modalData: data }),
  closeModal: () => set({ modal: null, modalData: {} }),
}));
