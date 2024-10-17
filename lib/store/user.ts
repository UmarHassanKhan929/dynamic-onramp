/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface StoreState {
  wallet: any;
  user: any;
  setUser: (user: any) => void;
  setWallet: (wallet: any) => void;
}

const useUserStore = create<StoreState>((set) => ({
  wallet: undefined,
  user: undefined,
  setWallet: (wallet) => set({ wallet }),
  setUser: (user) => set({ user }),
}));

export default useUserStore;
