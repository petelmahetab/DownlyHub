import ytDlpWrap from 'yt-dlp-exec';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMP_DIR = path.join(__dirname, '../temp');
const COOKIES_FILE = path.join(process.cwd(), 'cookies', 'youtube_cookies.txt');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const detectPlatform = (url) => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
  if (url.includes('snapchat.com')) return 'Snapchat';
  if (url.includes('linkedin.com')) return 'Linkdin';
  return 'Unknown';
};

const hasAudioTrack = (format) => {
  if (format.acodec && format.acodec !== 'none') return true;
  if ((format.acodec === undefined || format.acodec === null) &&
    ['mp4', 'webm', 'mov'].includes(format.ext) &&
    (format.vcodec !== 'none' || format.vcodec === undefined || format.vcodec === null)) {
    return true;
  }
  return false;
};

// NUCLEAR OPTION - ALL POSSIBLE STRATEGIES
const getYtDlpStrategies = (platform) => {
  if (platform !== 'YouTube') {
    return [{
      name: 'Standard',
      options: {
        dumpSingleJson: true,
        noWarnings: true,
        noCheckCertificate: true,
        noPlaylist: true,
        preferFreeFormats: true,
      }
    }];
  }

  const strategies = [];
  const hasCookieFile = fs.existsSync(COOKIES_FILE);

  if (hasCookieFile) {
    console.log('✅ Found cookie file');
    try {
      const cookieContent = fs.readFileSync(COOKIES_FILE, 'utf8');
      const cookieLines = cookieContent.split('\n').filter(line => !line.startsWith('#') && line.trim());
      console.log(`📊 Cookie file has ${cookieLines.length} valid entries`);
    } catch (err) {
      console.log('⚠️ Could not read cookie file:', err.message);
    }
  }

  // Strategy 1: iOS with cookies (if available)
  if (hasCookieFile) {
    strategies.push({
      name: 'iOS + Cookies',
      options: {
        dumpSingleJson: true,
        noWarnings: true,
        noCheckCertificate: true,
        noPlaylist: true,
        cookies: COOKIES_FILE,
        extractorArgs: 'youtube:player_client=ios',
        userAgent: 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
      }
    });
  }

  // Strategy 2: iOS without cookies (OFTEN WORKS BEST)
  strategies.push({
    name: 'iOS Pure',
    options: {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      noPlaylist: true,
      extractorArgs: 'youtube:player_client=ios',
      userAgent: 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
    }
  });

  // Strategy 3: Android Music
  strategies.push({
    name: 'Android Music',
    options: {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      noPlaylist: true,
      extractorArgs: 'youtube:player_client=android_music',
    }
  });

  // Strategy 4: Media Connect
  strategies.push({
    name: 'Media Connect',
    options: {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      noPlaylist: true,
      extractorArgs: 'youtube:player_client=mediaconnect',
    }
  });

  // Strategy 5: TV Embedded
  strategies.push({
    name: 'TV Embedded',
    options: {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      noPlaylist: true,
      extractorArgs: 'youtube:player_client=tv_embedded',
    }
  });

  // Strategy 6: Android VR
  strategies.push({
    name: 'Android VR',
    options: {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      noPlaylist: true,
      extractorArgs: 'youtube:player_client=android_vr',
    }
  });

  // Strategy 7: mWeb (mobile web)
  strategies.push({
    name: 'Mobile Web',
    options: {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      noPlaylist: true,
      extractorArgs: 'youtube:player_client=mweb',
      userAgent: 'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    }
  });

  // Strategy 8: Web with skip
  strategies.push({
    name: 'Web Skip',
    options: {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      noPlaylist: true,
      extractorArgs: 'youtube:player_skip=webpage,configs',
    }
  });

  return strategies;
};

const deduplicateFormats = (formats) => {
  const seen = new Map();
  const uniqueFormats = [];

  for (const format of formats) {
    const key = `${format.quality}-${format.mediaType}`;
    
    if (!seen.has(key)) {
      seen.set(key, true);
      uniqueFormats.push(format);
    } else {
      const existingIndex = uniqueFormats.findIndex(f => 
        f.quality === format.quality && f.mediaType === format.mediaType
      );
      
      if (existingIndex !== -1) {
        const existing = uniqueFormats[existingIndex];
        if (format.hasAudio && !existing.hasAudio) {
          uniqueFormats[existingIndex] = format;
        }
      }
    }
  }

  return uniqueFormats;
};

export const testApi = (req, res) => {
  const hasCookieFile = fs.existsSync(COOKIES_FILE);
  
  res.json({
    success: true,
    message: 'Multi-Platform Video Downloader API - NUCLEAR MODE',
    cookieFile: hasCookieFile ? 'Found' : 'Not Found',
    strategies: 8,
    mode: 'Maximum Compatibility',
    supported: 'YouTube, Instagram, Facebook, TikTok, Twitter, Snapchat, and 1000+ more',
    timestamp: new Date().toISOString(),
  });
};

export const getVideoInfo = async (req, res) => {
  try {
    const { url } = req.body;

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
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📥 FETCH REQUEST: ${platform}`);
    console.log(`🔗 URL: ${url.substring(0, 80)}...`);
    console.log(`${'='.repeat(60)}\n`);

    const strategies = getYtDlpStrategies(platform);
    let info = null;
    let successStrategy = null;
    let lastError = null;
    let attemptCount = 0;

    for (const strategy of strategies) {
      attemptCount++;
      try {
        console.log(`🔄 [${attemptCount}/${strategies.length}] Trying: ${strategy.name}`);
        
        const startTime = Date.now();
        info = await ytDlpWrap(url, strategy.options);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        successStrategy = strategy.name;
        console.log(`✅ SUCCESS in ${duration}s with ${strategy.name}`);
        console.log(`📹 Video: ${info.title?.substring(0, 60)}...`);
        console.log(`👤 Uploader: ${info.uploader || info.channel || 'Unknown'}`);
        console.log(`📊 Formats found: ${info.formats?.length || 0}`);
        break;
      } catch (error) {
        const errorMsg = error.message.substring(0, 120);
        console.log(`❌ [${attemptCount}/${strategies.length}] ${strategy.name} failed`);
        console.log(`   Error: ${errorMsg}...`);
        lastError = error;
        continue;
      }
    }

    if (!info) {
      console.log(`\n❌ ALL ${strategies.length} STRATEGIES FAILED`);
      console.log(`Last error: ${lastError?.message.substring(0, 200)}\n`);
      throw lastError || new Error('All download strategies failed');
    }

    let allFormats = [];

    if (platform === 'YouTube') {
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
          note: 'Ready to download',
          hasAudio: true
        }))
        .sort((a, b) => {
          const qualityA = parseInt(a.quality) || 0;
          const qualityB = parseInt(b.quality) || 0;
          return qualityB - qualityA;
        });

      const bestAudio = info.formats
        .filter(af => af.acodec && af.acodec !== 'none' && (!af.vcodec || af.vcodec === 'none'))
        .sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];

      const audioFormatId = bestAudio?.format_id || '140';

      const videoOnlyFormats = (info.formats || [])
        .filter(f =>
          f.vcodec && f.vcodec !== 'none' &&
          (!f.acodec || f.acodec === 'none') &&
          f.height && f.height >= 480 &&
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
          note: 'High quality (will merge with audio)',
          hasAudio: true
        }))
        .sort((a, b) => {
          const qualityA = parseInt(a.quality) || 0;
          const qualityB = parseInt(b.quality) || 0;
          return qualityB - qualityA;
        })
        .slice(0, 4);

      allFormats = [...videoOnlyFormats, ...videoFormatsWithAudio];

      const audioFormats = (info.formats || [])
        .filter(f =>
          f.acodec && f.acodec !== 'none' &&
          (!f.vcodec || f.vcodec === 'none')
        )
        .map(format => ({
          quality: format.abr ? `${format.abr}kbps` : 'Audio',
          resolution: 'Audio Only',
          format: format.ext,
          size: format.filesize
            ? `${(format.filesize / 1024 / 1024).toFixed(2)} MB`
            : 'Unknown',
          formatId: format.format_id,
          type: 'audio',
          mediaType: 'audio',
          note: 'Audio only',
          hasAudio: true
        }))
        .slice(0, 1);

      allFormats = [...allFormats, ...audioFormats];
    } else {
      const bestAudio = info.formats
        ?.filter(f => f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none'))
        .sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];

      const audioFormatId = bestAudio?.format_id;

      const videoFormats = (info.formats || [])
        .filter(f => {
          if (f.vcodec === 'none') return false;
          if (f.vcodec && f.vcodec !== 'none') return true;
          if (f.width && f.height && f.width > 0 && f.height > 0) {
            if (['mp4', 'webm', 'mov', 'm4v'].includes(f.ext)) return true;
          }
          if (['mp4', 'webm', 'mov', 'm4v'].includes(f.ext) && f.url) {
            if (!f.acodec || f.acodec === 'none' || f.acodec === undefined || f.acodec === null) {
              return true;
            }
            if ((f.vcodec === null || f.vcodec === undefined) &&
              (f.acodec === null || f.acodec === undefined)) {
              return true;
            }
          }
          if (f.format_id && f.format_id.includes('video')) return true;
          return false;
        })
        .map(format => {
          const hasAudio = hasAudioTrack(format);
          let finalFormatId = hasAudio ? format.format_id :
            (audioFormatId ? `${format.format_id}+${audioFormatId}` : format.format_id);

          return {
            quality: format.height ? `${format.height}p` : 'Video',
            resolution: format.width && format.height ? `${format.width}x${format.height}` : 'Unknown',
            format: format.ext || 'mp4',
            size: format.filesize
              ? `${(format.filesize / 1024 / 1024).toFixed(2)} MB`
              : format.filesize_approx
                ? `~${(format.filesize_approx / 1024 / 1024).toFixed(2)} MB`
                : 'Unknown',
            formatId: finalFormatId,
            fps: format.fps,
            type: hasAudio ? 'video-audio-merged' : 'video-needs-merge',
            mediaType: 'video',
            note: hasAudio ? 'Ready to download' : (audioFormatId ? 'Will merge with audio' : 'Video only'),
            hasAudio: hasAudio || !!audioFormatId
          };
        })
        .sort((a, b) => {
          const qualityA = parseInt(a.quality) || 0;
          const qualityB = parseInt(b.quality) || 0;
          return qualityB - qualityA;
        });

      allFormats = videoFormats;
    }

    allFormats = deduplicateFormats(allFormats);
    allFormats = allFormats.slice(0, 6);

    allFormats.push({
      quality: 'MP3 Audio',
      resolution: 'Audio Only',
      format: 'mp3',
      size: 'Varies',
      formatId: 'mp3-best',
      type: 'audio',
      mediaType: 'audio-converted',
      note: 'Best audio converted to MP3',
      hasAudio: true
    });

    console.log(`\n✅ COMPLETED: ${allFormats.length} formats prepared`);
    console.log(`📤 Sending response...\n`);

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
        totalFormatsAvailable: info.formats?.length || 0,
        fetchedWith: successStrategy
      }
    });

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message, '\n');

    if (error.message.includes('Sign in to confirm') || 
        error.message.includes('not a bot')) {
      return res.status(403).json({
        success: false,
        error: 'YouTube Bot Detection',
        message: 'All bypass methods failed. This video may be region-restricted or age-gated.',
        suggestions: [
          '1. Try updating yt-dlp: npm update yt-dlp-exec',
          '2. Try a different YouTube video',
          '3. Video might be region-locked or age-restricted',
          '4. Try again in a few minutes (rate limiting)'
        ]
      });
    }

    if (error.message.includes('Video unavailable') ||
      error.message.includes('Private video') ||
      error.message.includes('not available') ||
      error.message.includes('been deleted')) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
        message: 'This video is unavailable, deleted, or private.',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch video information',
      message: error.message,
    });
  }
};

export const downloadVideo = async (req, res) => {
  let tempFilePath = null;

  try {
    const { formatId } = req.params;
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL parameter is required'
      });
    }

    const platform = detectPlatform(url);
    console.log(`\n📥 DOWNLOAD REQUEST: ${platform}`);
    console.log(`Format: ${formatId}`);

    const strategies = getYtDlpStrategies(platform);
    let info = null;

    for (const strategy of strategies) {
      try {
        console.log(`🔄 Fetching with: ${strategy.name}`);
        info = await ytDlpWrap(url, strategy.options);
        console.log(`✅ Info fetched`);
        break;
      } catch (error) {
        continue;
      }
    }

    if (!info) {
      throw new Error('Could not fetch video info');
    }

    const sanitizedTitle = info.title
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 100);

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);

    let filename, downloadOptions;

    const baseOptions = {
      noWarnings: true,
      noPlaylist: true,
      noCheckCertificate: true,
      extractorArgs: 'youtube:player_client=ios',
    };

    if (platform === 'YouTube' && fs.existsSync(COOKIES_FILE)) {
      baseOptions.cookies = COOKIES_FILE;
    }

    if (formatId === 'mp3-best') {
      filename = `${sanitizedTitle}.mp3`;
      tempFilePath = path.join(TEMP_DIR, `${timestamp}_${randomId}.mp3`);

      downloadOptions = {
        ...baseOptions,
        format: 'bestaudio',
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: 0,
        output: tempFilePath,
      };

      res.setHeader('Content-Type', 'audio/mpeg');
    } else {
      filename = `${sanitizedTitle}.mp4`;
      tempFilePath = path.join(TEMP_DIR, `${timestamp}_${randomId}.mp4`);

      if (formatId.includes('+')) {
        downloadOptions = {
          ...baseOptions,
          format: formatId,
          mergeOutputFormat: 'mp4',
          output: tempFilePath,
        };
      } else {
        const requestedFormat = info.formats?.find(f => f.format_id === formatId);
        const hasAudio = requestedFormat && hasAudioTrack(requestedFormat);

        downloadOptions = {
          ...baseOptions,
          format: hasAudio ? formatId : `${formatId}+bestaudio/best`,
          mergeOutputFormat: hasAudio ? undefined : 'mp4',
          output: tempFilePath,
        };
      }

      res.setHeader('Content-Type', 'video/mp4');
    }

    console.log(`⬇️ Starting download: ${filename}`);

    await ytDlpWrap(url, downloadOptions);

    if (!fs.existsSync(tempFilePath)) {
      throw new Error('Downloaded file not found');
    }

    const fileSize = fs.statSync(tempFilePath).size;
    console.log(`✅ Downloaded: ${(fileSize / 1024 / 1024).toFixed(2)} MB\n`);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', fileSize);

    const fileStream = fs.createReadStream(tempFilePath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      setTimeout(() => {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
          console.log(`🗑️ Cleaned up temp file`);
        }
      }, 5000);
    });

    fileStream.on('error', (error) => {
      console.error('Stream error:', error.message);
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    });

  } catch (error) {
    console.error('❌ Download error:', error.message);

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