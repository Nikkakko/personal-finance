import { Budget } from "@prisma/client";
import { create } from "zustand";
type modalType =
  | "budget"
  | "transaction"
  | "pots"
  | "recurring-bills"
  | "balance";

interface ModalData {
  isEdit?: boolean;
  userEmail?: string;
  budget?: Budget;
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
