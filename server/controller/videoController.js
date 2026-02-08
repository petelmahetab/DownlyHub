import ytDlpWrap from 'yt-dlp-exec';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create temp directory
const TEMP_DIR = path.join(__dirname, '../temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Helper: Detect platform from URL
const detectPlatform = (url) => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
  if (url.includes('vimeo.com')) return 'Vimeo';
  if (url.includes('dailymotion.com')) return 'Dailymotion';
  if (url.includes('reddit.com')) return 'Reddit';
  return 'Unknown';
};

// Test API
export const testApi = (req, res) => {
  res.json({
    success: true,
    message: 'Multi-Platform Video Downloader API',
    engine: 'yt-dlp',
    supported: 'YouTube, Instagram, Facebook, TikTok, Twitter, and 1000+ more',
    timestamp: new Date().toISOString()
  });
};

// Get video information with all available formats
export const getVideoInfo = async (req, res) => {
  try {
    const { url } = req.body;

    console.log('\n' + '='.repeat(50));
    console.log('📥 Received request for:', url);
    console.log('='.repeat(50));

    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: 'URL is required' 
      });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL. URL must start with http:// or https://'
      });
    }

    const platform = detectPlatform(url);
    console.log('🌐 Platform detected:', platform);
    console.log('🔄 Fetching video info with yt-dlp...');

    const info = await ytDlpWrap(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      ]
    });

    console.log('✅ Video info fetched successfully!');
    console.log('Title:', info.title);
    console.log('Available formats:', info.formats?.length || 0);

    let allFormats = [];

    // ============================================
    // PLATFORM-SPECIFIC FORMAT HANDLING
    // ============================================

    if (platform === 'YouTube') {
      // YouTube: Has separate video and audio streams
      
      // Get formats with video AND audio (merged, ready to download)
      const videoFormatsWithAudio = (info.formats || [])
        .filter(f => 
          f.vcodec && f.vcodec !== 'none' && 
          f.acodec && f.acodec !== 'none' &&
          (f.ext === 'mp4' || f.ext === 'webm')
        )
        .map(format => ({
          quality: format.format_note || `${format.height}p`,
          resolution: `${format.width}x${format.height}`,
          format: format.ext,
          size: format.filesize 
            ? `${(format.filesize / 1024 / 1024).toFixed(2)} MB`
            : format.filesize_approx
            ? `~${(format.filesize_approx / 1024 / 1024).toFixed(2)} MB`
            : 'Unknown',
          formatId: format.format_id,
          fps: format.fps,
          type: 'video-audio-merged',
          mediaType: 'video',
          note: 'Ready to download'
        }))
        .sort((a, b) => {
          const qualityA = parseInt(a.quality) || 0;
          const qualityB = parseInt(b.quality) || 0;
          return qualityB - qualityA;
        });

      // Get video-only formats (high quality, needs audio merge)
      const bestAudio = info.formats
        .filter(af => af.acodec && af.acodec !== 'none' && (!af.vcodec || af.vcodec === 'none'))
        .sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];
      
      const audioFormatId = bestAudio?.format_id || '140';

      const videoOnlyFormats = (info.formats || [])
        .filter(f => 
          f.vcodec && f.vcodec !== 'none' && 
          (!f.acodec || f.acodec === 'none') &&
          f.height && f.height >= 720 &&
          f.ext === 'mp4'
        )
        .map(format => ({
          quality: `${format.height}p HD`,
          resolution: `${format.width}x${format.height}`,
          format: 'mp4',
          size: format.filesize 
            ? `${(format.filesize / 1024 / 1024).toFixed(2)} MB`
            : 'Unknown',
          formatId: `${format.format_id}+${audioFormatId}`,
          fps: format.fps,
          type: 'video-needs-merge',
          mediaType: 'video',
          note: 'High quality (will merge with audio)'
        }))
        .sort((a, b) => {
          const qualityA = parseInt(a.quality) || 0;
          const qualityB = parseInt(b.quality) || 0;
          return qualityB - qualityA;
        })
        .slice(0, 3);

      // Combine formats
      allFormats = [...videoOnlyFormats, ...videoFormatsWithAudio].slice(0, 6);

      // Audio formats
      const audioFormats = (info.formats || [])
        .filter(f => 
          f.acodec && f.acodec !== 'none' && 
          (!f.vcodec || f.vcodec === 'none')
        )
        .map(format => ({
          quality: format.abr ? `${format.abr}kbps` : 'Audio',
          format: format.ext,
          size: format.filesize 
            ? `${(format.filesize / 1024 / 1024).toFixed(2)} MB`
            : 'Unknown',
          formatId: format.format_id,
          type: 'audio',
          mediaType: 'audio'
        }))
        .slice(0, 2);

      allFormats = [...allFormats, ...audioFormats];
    } 
    else {
      // ============================================
      // OTHER PLATFORMS (Instagram, Twitter, TikTok, Facebook, etc.)
      // ============================================
      
      // For non-YouTube platforms, get all available video formats
      const videoFormats = (info.formats || [])
        .filter(f => f.vcodec && f.vcodec !== 'none')
        .map(format => ({
          quality: format.height ? `${format.height}p` : 'Video',
          resolution: format.width && format.height ? `${format.width}x${format.height}` : 'Unknown',
          format: format.ext || 'mp4',
          size: format.filesize 
            ? `${(format.filesize / 1024 / 1024).toFixed(2)} MB`
            : format.filesize_approx
            ? `~${(format.filesize_approx / 1024 / 1024).toFixed(2)} MB`
            : 'Unknown',
          formatId: format.format_id,
          fps: format.fps,
          type: (format.acodec && format.acodec !== 'none') ? 'video-audio-merged' : 'video-only',
          mediaType: 'video',
          note: (format.acodec && format.acodec !== 'none') ? 'Ready to download' : 'Video only',
          hasAudio: format.acodec && format.acodec !== 'none'
        }))
        .sort((a, b) => {
          const qualityA = parseInt(a.quality) || 0;
          const qualityB = parseInt(b.quality) || 0;
          return qualityB - qualityA;
        });

      // Get audio formats
      const audioFormats = (info.formats || [])
        .filter(f => 
          f.acodec && f.acodec !== 'none' && 
          (!f.vcodec || f.vcodec === 'none')
        )
        .map(format => ({
          quality: format.abr ? `${format.abr}kbps` : 'Audio',
          format: format.ext,
          size: format.filesize 
            ? `${(format.filesize / 1024 / 1024).toFixed(2)} MB`
            : 'Unknown',
          formatId: format.format_id,
          type: 'audio',
          mediaType: 'audio'
        }));

      allFormats = [...videoFormats, ...audioFormats];
    }

    // Add MP3 conversion option
    const mp3Option = {
      quality: 'MP3 Audio',
      format: 'mp3',
      size: 'Varies',
      formatId: 'mp3-best',
      type: 'audio',
      mediaType: 'audio-converted',
      note: 'Best audio converted to MP3'
    };

    allFormats = [...allFormats, mp3Option];

    console.log('📦 Prepared', allFormats.length, 'download options');
    console.log('='.repeat(50) + '\n');

    res.json({
      success: true,
      data: {
        platform: platform,
        title: info.title,
        videoId: info.id,
        duration: info.duration,
        thumbnail: info.thumbnail,
        uploader: info.uploader || info.channel || 'Unknown',
        views: info.view_count?.toLocaleString() || 'N/A',
        uploadDate: info.upload_date,
        description: info.description?.substring(0, 200) + '...' || '',
        url: info.webpage_url || url,
        formats: allFormats,
        totalFormatsAvailable: info.formats?.length || 0
      }
    });

  } catch (error) {
    console.error('\n' + '❌'.repeat(25));
    console.error('ERROR:', error.message);
    console.error('Stack:', error.stack);
    console.error('❌'.repeat(25) + '\n');

    // Handle specific errors
    if (error.message.includes('Unsupported URL')) {
      return res.status(400).json({
        success: false,
        error: 'This platform is not supported',
        message: 'Please use a supported platform like YouTube, Instagram, Facebook, TikTok, etc.'
      });
    }

    if (error.message.includes('Video unavailable') || error.message.includes('Private video')) {
      return res.status(404).json({
        success: false,
        error: 'Video not found or is private'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch video information',
      message: error.message
    });
  }
};

// Download video/audio - UNIVERSAL VERSION
export const downloadVideo = async (req, res) => {
  let tempFilePath = null;
  
  try {
    const { formatId } = req.params;
    const { url } = req.query;

    console.log('\n' + '='.repeat(50));
    console.log('📥 Download request');
    console.log('URL:', url);
    console.log('Format ID:', formatId);
    console.log('='.repeat(50));

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL parameter is required'
      });
    }

    const platform = detectPlatform(url);
    console.log('🌐 Platform:', platform);
    console.log('🔄 Getting video info...');

    const info = await ytDlpWrap(url, {
      dumpSingleJson: true,
    });

    console.log('🎬 Title:', info.title);

    // Sanitize filename
    const sanitizedTitle = info.title
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 100);

    // Generate unique temp filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    
    let filename, downloadOptions;

    // Handle MP3 conversion
    if (formatId === 'mp3-best') {
      filename = `${sanitizedTitle}.mp3`;
      tempFilePath = path.join(TEMP_DIR, `${timestamp}_${randomId}.mp3`);
      
      console.log('🎵 Converting to MP3...');
      
      downloadOptions = {
        format: 'bestaudio',
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: 0,
        output: tempFilePath,
        noPlaylist: true,
      };
      
      res.setHeader('Content-Type', 'audio/mpeg');
    } 
    // Handle format selection (video)
    else {
      filename = `${sanitizedTitle}.mp4`;
      tempFilePath = path.join(TEMP_DIR, `${timestamp}_${randomId}.mp4`);
      
      // Check if format exists
      const requestedFormat = info.formats?.find(f => f.format_id === formatId);
      const formatExists = requestedFormat !== undefined;
      
      let finalFormat;
      
      if (formatId.includes('+')) {
        // Format merge requested
        const [videoId, audioId] = formatId.split('+');
        const videoExists = info.formats?.some(f => f.format_id === videoId);
        const audioExists = info.formats?.some(f => f.format_id === audioId);
        
        if (videoExists && audioExists) {
          finalFormat = formatId;
          console.log('🔄 Merging video and audio...');
          console.log('   Format string:', formatId);
        } else {
          finalFormat = 'bestvideo+bestaudio/best';
          console.log('⚠️  Requested format not available');
          console.log('   Using best available quality instead');
        }
        
        downloadOptions = {
          format: finalFormat,
          mergeOutputFormat: 'mp4',
          output: tempFilePath,
          noPlaylist: true,
        };
      } 
      else if (formatExists) {
        // Specific format exists
        console.log('📹 Downloading format:', formatId);
        downloadOptions = {
          format: formatId,
          output: tempFilePath,
          noPlaylist: true,
        };
      } 
      else {
        // Format doesn't exist, use best
        console.log('⚠️  Format not found, using best available');
        downloadOptions = {
          format: 'best',
          output: tempFilePath,
          noPlaylist: true,
        };
      }
      
      res.setHeader('Content-Type', 'video/mp4');
    }

    console.log('📤 Starting download...');
    console.log('   Filename:', filename);
    console.log('   Temp file:', tempFilePath);

    // Download to temp file
    await ytDlpWrap(url, downloadOptions);

    console.log('✅ Download completed!');
    console.log('📦 Sending file to client...');

    // Check if file exists
    if (!fs.existsSync(tempFilePath)) {
      throw new Error('Downloaded file not found');
    }

    // Set headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Get file size
    const stat = fs.statSync(tempFilePath);
    res.setHeader('Content-Length', stat.size);

    console.log('   File size:', (stat.size / 1024 / 1024).toFixed(2), 'MB');

    // Stream the completed file
    const fileStream = fs.createReadStream(tempFilePath);
    
    fileStream.pipe(res);

    // Clean up temp file after sending
    fileStream.on('end', () => {
      console.log('✅ File sent successfully!');
      setTimeout(() => {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
          console.log('🗑️ Temp file deleted');
        }
      }, 5000);
    });

    fileStream.on('error', (error) => {
      console.error('❌ Stream error:', error);
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    });

    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n' + '❌'.repeat(25));
    console.error('ERROR:', error.message);
    console.error('❌'.repeat(25) + '\n');
    
    // Clean up temp file on error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false,
        error: 'Download failed',
        message: error.message
      });
    }
  }
};