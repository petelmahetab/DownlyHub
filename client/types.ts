
export interface VideoMetadata {
  title: string;
  duration: string;
  platform: string;
  thumbnail: string;
  formats: {
    quality: string;
    size: string;
    type: string;
  }[];
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  hoverColor: string;
}
