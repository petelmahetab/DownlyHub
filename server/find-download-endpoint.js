import 'dotenv/config';
import axios from 'axios';

const API_KEY = process.env.FALLEN_API_KEY;
const BASE_URL = 'https://beta.fallenapi.fun';
const TEST_URL = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';

// All possible download-related endpoints
const endpoints = [
  '/api/download',
  '/api/ytdl',
  '/api/youtube/download',
  '/api/music/download',
  '/tools/download',
  '/download/youtube'
];

async function testEndpoint(endpoint) {
  try {
    console.log(`\nTesting: ${endpoint}`);
    
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params: { url: TEST_URL },
      headers: {
        'X-API-Key': API_KEY,
        'User-Agent': 'Mozilla/5.0'
      },
      timeout: 30000
    });

    // Check if response has download links
    const hasDownloadLinks = 
      response.data?.download_url || 
      response.data?.download || 
      response.data?.links ||
      response.data?.formats ||
      (response.data?.results && response.data.results[0]?.download_url);

    if (hasDownloadLinks) {
      console.log('✅ FOUND DOWNLOAD ENDPOINT!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return true;
    } else {
      console.log('⚠️  No download links in response');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('❌ 404 Not Found');
    } else if (error.response?.status === 400) {
      console.log('⚠️  400:', error.response.data?.message);
    } else {
      console.log('❌', error.response?.status || error.code);
    }
  }
  return false;
}

async function findDownloadEndpoint() {
  console.log('🔍 Searching for YouTube download endpoint...\n');
  console.log('Testing URL:', TEST_URL);
  console.log('='.repeat(60));

  for (const endpoint of endpoints) {
    const found = await testEndpoint(endpoint);
    if (found) break;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('Search complete!');
}

findDownloadEndpoint();