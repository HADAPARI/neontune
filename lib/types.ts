export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
  url?: string;
}

export interface SearchResponse {
  items: Track[];
  nextPageToken?: string;
  totalResults: number;
}

export interface ContactFormData {
  email: string;
  subject: string;
  message: string;
  type: "bug" | "suggestion";
}

export interface YouTubeSearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
  contentDetails?: {
    duration: string;
  };
} 