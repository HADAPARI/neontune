import { create } from "zustand";

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
  url?: string;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  setCurrentTrack: (track: Track | null) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 1,

  setCurrentTrack: (track) => set({ currentTrack: track }),
  
  setQueue: (tracks) => set({ queue: tracks }),
  
  addToQueue: (track) => set((state) => ({ 
    queue: [...state.queue, track] 
  })),
  
  removeFromQueue: (trackId) => set((state) => ({
    queue: state.queue.filter((track) => track.id !== trackId)
  })),
  
  clearQueue: () => set({ queue: [] }),
  
  togglePlay: () => set((state) => ({ 
    isPlaying: !state.isPlaying 
  })),
  
  setVolume: (volume) => set({ volume }),
  
  playNext: () => {
    const { currentTrack, queue } = get();
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex((track) => track.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === queue.length - 1) {
      set({ currentTrack: queue[0] });
    } else {
      set({ currentTrack: queue[currentIndex + 1] });
    }
  },
  
  playPrevious: () => {
    const { currentTrack, queue } = get();
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex((track) => track.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === 0) {
      set({ currentTrack: queue[queue.length - 1] });
    } else {
      set({ currentTrack: queue[currentIndex - 1] });
    }
  },
})); 