

import React, { useState } from 'react';
import { fetchVideoInfo, VideoMetadata } from '../services/api';

interface DownloadFormProps {
  onResult: (result: VideoMetadata) => void;
  setLoading: (loading: boolean) => void;
}

const DownloadForm: React.FC<DownloadFormProps> = ({ onResult, setLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please paste a valid video URL');
      return;
    }
    
    // Basic URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      console.log('Fetching video info for:', url);
      const data = await fetchVideoInfo(url);
      
      console.log('Video info received:', data);
      onResult(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch video details. Please check the URL and try again.';
      setError(errorMessage);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form 
        onSubmit={handleFetch} 
        className="glow-input relative flex flex-col md:flex-row gap-4 p-2 bg-slate-900/40 border border-white/10 rounded-xl backdrop-blur-xl transition-all"
      >
        <div className="flex-grow flex items-center px-4">
          <span className="material-icons text-slate-500 mr-3">link</span>
          <input 
            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 py-4 font-medium outline-none" 
            placeholder="Paste your video link here (e.g., https://youtube.com/...)" 
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(''); // Clear error when user types
            }}
          />
        </div>
        <button 
          type="submit"
          disabled={!url.trim()}
          className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-all group shrink-0 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Fetch Video</span>
          <span className="material-icons group-hover:translate-y-0.5 transition-transform">download</span>
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <span className="material-icons text-sm">error</span>
            {error}
          </p>
        </div>
      )}
      
      <p className="mt-4 text-xs text-slate-500 flex items-center justify-center gap-2">
        <span className="material-icons text-xs">verified_user</span>
        No sign-up required. Your privacy is protected with end-to-end encryption.
      </p>
    </div>
  );
};

export default DownloadForm;