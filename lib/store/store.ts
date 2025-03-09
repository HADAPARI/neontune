import { create } from "zustand";
import { Track } from "../types";

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  isLoading: boolean;
  showPlayerBar: boolean;
  volume: number;
  playlist: Track[];
  setPlaylist: (playlist: Track[]) => void;
  setCurrentTrack: (track: Track | null) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setShowPlayerBar: (showPlayerBar: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  isLoading: false,
  showPlayerBar: false,
  volume: 50,
  playlist: [],

  setPlaylist: (playlist) => set({ playlist }),

  setCurrentTrack: (track) => set({ currentTrack: track }),

  setQueue: (tracks) => set({ queue: tracks }),

  addToQueue: (track) =>
    set((state) => ({
      queue: [...state.queue, track],
    })),

  removeFromQueue: (trackId) =>
    set((state) => ({
      queue: state.queue.filter((track) => track.id !== trackId),
    })),

  clearQueue: () => set({ queue: [] }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setVolume: (volume) => set({ volume }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setShowPlayerBar: (showPlayerBar) => set({ showPlayerBar }),

  playNext: () => {
    // const { currentTrack, queue } = get();
    // if (!currentTrack || queue.length === 0) return;

    // const currentIndex = queue.findIndex(
    //   (track) => track.id === currentTrack.id
    // );
    // if (currentIndex === -1 || currentIndex === queue.length - 1) {
    //   set({ currentTrack: queue[0] });
    // } else {
    //   set({ currentTrack: queue[currentIndex + 1] });
    // }

    const { currentTrack, playlist } = get();
    if (!currentTrack || playlist.length === 0) return;

    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );

    if (currentIndex === -1 || currentIndex === playlist.length - 1) {
      set({ currentTrack: playlist[0] });
    } else {
      set({ currentTrack: playlist[currentIndex + 1] });
    }
  },

  playPrevious: () => {
    // const { currentTrack, queue } = get();
    // if (!currentTrack || queue.length === 0) return;
    // const currentIndex = queue.findIndex(
    //   (track) => track.id === currentTrack.id
    // );
    // if (currentIndex === -1 || currentIndex === 0) {
    //   set({ currentTrack: queue[queue.length - 1] });
    // } else {
    //   set({ currentTrack: queue[currentIndex - 1] });
    // }

    const { currentTrack, playlist } = get();
    if (!currentTrack || playlist.length === 0) return;

    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );

    if (currentIndex === -1 || currentIndex === 0) {
      set({ currentTrack: playlist[playlist.length - 1] });
    } else {
      set({ currentTrack: playlist[currentIndex - 1] });
    }
  },
}));
