const API_BASE_URL = 'http://localhost:5000/api';

export interface VideoFormat {
  quality: string;
  resolution: string;
  format: string;
  size: string;
  formatId: string;
  fps?: number;
  type: string;
  mediaType: string;
  note: string;
  hasAudio: boolean;
}

export interface VideoData {
  platform: string;
  title: string;
  videoId: string;
  duration?: number;
  thumbnail: string;
  uploader: string;
  views: string;
  uploadDate?: string;
  description: string;
  url: string;
  formats: VideoFormat[];
  totalFormatsAvailable: number;
  fetchedWith?: string;
}

export interface VideoMetadata {
  success: boolean;
  data: VideoData;
}


export const fetchVideoInfo = async (url: string): Promise<VideoMetadata> => {
  try {
    const response = await fetch(`${API_BASE_URL}/video-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch video information');
    }

    const data: VideoMetadata = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw error;
  }
};


export const downloadVideo = async (formatId: string, videoUrl: string, fileName: string) => {
  try {
    // Encode the video URL
    const encodedUrl = encodeURIComponent(videoUrl);
    
    // Create download URL
    const downloadUrl = `${API_BASE_URL}/download/${formatId}?url=${encodedUrl}`;
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName; // Suggest filename
    // REMOVED: link.target = '_blank'; // This was causing blank tab to open
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    
    return { success: true };
  } catch (error) {
    console.error('Error downloading video:', error);
    throw error;
  }
};


export const formatDuration = (seconds?: number): string => {
  if (!seconds) return 'N/A';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};


export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/test`);
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};