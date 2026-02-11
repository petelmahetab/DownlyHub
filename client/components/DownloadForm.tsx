
import React, { useState } from 'react';
import { fetchVideoDetails } from '../services/geminiService';
import { VideoMetadata } from '../types';

interface DownloadFormProps {
  onResult: (result: VideoMetadata) => void;
  setLoading: (loading: boolean) => void;
}

const DownloadForm: React.FC<DownloadFormProps> = ({ onResult, setLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError('Please paste a valid video URL');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const data = await fetchVideoDetails(url);
      onResult(data);
    } catch (err) {
      setError('Failed to fetch video details. Please check the URL.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleFetch} className="glow-input relative flex flex-col md:flex-row gap-4 p-2 bg-slate-900/40 border border-white/10 rounded-xl backdrop-blur-xl transition-all">
        <div className="flex-grow flex items-center px-4">
          <span className="material-icons text-slate-500 mr-3">link</span>
          <input 
            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 py-4 font-medium" 
            placeholder="Paste your video link here (e.g., https://youtube.com/...)" 
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button 
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-all group shrink-0 shadow-lg shadow-primary/20"
        >
          <span>Fetch Video</span>
          <span className="material-icons group-hover:translate-y-0.5 transition-transform">download</span>
        </button>
      </form>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      <p className="mt-4 text-xs text-slate-500 flex items-center justify-center gap-2">
        <span className="material-icons text-xs">verified_user</span>
        No sign-up required. Your privacy is protected with end-to-end encryption.
      </p>
    </div>
  );
};

export default DownloadForm;
