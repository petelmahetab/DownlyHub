// client/src/App.tsx

import React, { useState } from 'react';
import Header from './components/Header';
import DownloadForm from './components/DownloadForm';
import SupportedPlatforms from './components/SupportedPlatforms';
import Features from './components/Features';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import { VideoMetadata, downloadVideo, formatDuration } from './services/api';

const App: React.FC = () => {
  const [result, setResult] = useState<VideoMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const handleDownload = async (formatId: string, quality: string) => {
    if (!result?.data) return;

    try {
      setDownloadingFormat(formatId);
      console.log('Starting download:', formatId, result.data.url);

      // Create filename
      const sanitizedTitle = result.data.title
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 100);
      
      const extension = formatId === 'mp3-best' ? 'mp3' : 'mp4';
      const fileName = `${sanitizedTitle}_${quality}.${extension}`;

      await downloadVideo(formatId, result.data.url, fileName);

      console.log('Download initiated successfully');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden mesh-gradient">
      <Header />
      <AnimatedBackground />

      <main className="relative z-10 flex-grow">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-4 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New: Multi-Platform Support
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Download Any Video, <br />From Anywhere.
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            The fastest, most secure way to save content from your favorite social media platforms in high definition.
          </p>

          <SupportedPlatforms />

          <DownloadForm onResult={setResult} setLoading={setLoading} />

          {/* Loading State */}
          {loading && (
            <div className="mt-12 animate-pulse">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-primary font-bold tracking-widest uppercase text-sm">
                  Analyzing Video Link...
                </span>
              </div>
            </div>
          )}

          {/* Result Card */}
          {result && !loading && (
            <div className="max-w-4xl mx-auto mt-12 p-6 bg-slate-900/60 border border-primary/20 rounded-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Thumbnail - Updated with better sizing and centering */}
                <div className="md:w-80 shrink-0 flex items-center justify-center">
                  <div className="relative group overflow-hidden rounded-xl w-full">
                    <img
                      src={result.data.thumbnail || 'https://via.placeholder.com/400x225'}
                      alt={result.data.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=No+Image';
                      }}
                    />
                    {result.data.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-xs font-bold">
                        {formatDuration(result.data.duration)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Info & Formats */}
                <div className="flex-grow text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {result.data.platform}
                    </span>
                    {result.data.views && result.data.views !== 'N/A' && (
                      <span className="text-slate-500 text-[10px]">
                        {result.data.views} views
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold line-clamp-2 mb-2 text-white">
                    {result.data.title}
                  </h3>

                  {result.data.uploader && result.data.uploader !== 'Unknown' && (
                    <p className="text-sm text-slate-400 mb-4">
                      by {result.data.uploader}
                    </p>
                  )}

                  {/* Download Formats */}
                  <div className="space-y-2 mt-4">
                    <p className="text-xs text-slate-500 font-medium mb-2">
                      Available Formats ({result.data.formats.length})
                    </p>
                    {result.data.formats.map((format, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-all"
                      >
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-100">
                              {format.quality}
                            </span>
                            {format.resolution !== 'Unknown' && format.resolution !== 'Audio Only' && (
                              <span className="text-xs text-slate-500">
                                {format.resolution}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="uppercase">{format.format}</span>
                            <span>•</span>
                            <span>{format.size}</span>
                            {format.note && (
                              <>
                                <span>•</span>
                                <span className="text-slate-600">{format.note}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <button 
                          onClick={() => handleDownload(format.formatId, format.quality)}
                          disabled={downloadingFormat === format.formatId}
                          className="ml-4 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                        >
                          {downloadingFormat === format.formatId ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-xs">Downloading...</span>
                            </>
                          ) : (
                            <>
                              <span className="material-icons text-sm">download</span>
                              <span className="text-xs font-medium">Download</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Fetched With Info */}
                  {result.data.fetchedWith && (
                    <p className="mt-4 text-xs text-slate-600 italic">
                      Fetched using: {result.data.fetchedWith} strategy
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        <Features />

        {/* Video Preview / Mockup Section */}
        <section className="max-w-7xl mx-auto px-4 pb-32">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
            <div className="aspect-video w-full bg-slate-950 flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 scale-105 group-hover:scale-110"
              >
                <source
                  src="https://www.pexels.com/download/video/5201209/" 
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              <div className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/80 backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-2xl shadow-primary/40 group-hover:bg-primary">
                  <span className="material-icons text-white text-4xl ml-1">play_arrow</span>
                </div>
                <p className="mt-6 font-bold text-white uppercase tracking-[0.2em] text-sm">
                  See how it works
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;