import { create } from "zustand";

type State = {
  postId: string | null;
  isDialogOpen: boolean;
  setPostId: (_id: string | null) => void;
  setisDialogOpen: (open: boolean) => void;
};

const useStore = create<State>()((set) => ({
  postId: null,
  isDialogOpen: false,
  setPostId: (_id) => set({ postId: _id }),
  setisDialogOpen: (open) => set({ isDialogOpen: open }),
}));

export default useStore;
