
export const detectPlatform = (url: string): string => {
  const lowercaseUrl = url.toLowerCase();
  if (lowercaseUrl.includes('youtube.com') || lowercaseUrl.includes('youtu.be')) return 'YouTube';
  if (lowercaseUrl.includes('instagram.com')) return 'Instagram';
  if (lowercaseUrl.includes('twitter.com') || lowercaseUrl.includes('x.com')) return 'X / Twitter';
  if (lowercaseUrl.includes('facebook.com') || lowercaseUrl.includes('fb.watch')) return 'Facebook';
  if (lowercaseUrl.includes('snapchat.com')) return 'Snapchat';
  if (lowercaseUrl.includes('tiktok.com')) return 'TikTok';
  return 'Unknown';
};
