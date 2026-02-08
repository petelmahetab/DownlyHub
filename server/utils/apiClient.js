import axios from 'axios';

const fallenApiClient = axios.create({
  baseURL: process.env.FALLEN_API_BASE_URL || 'https://beta.fallenapi.fun',
  timeout: 30000,
  headers: {
    'X-API-Key': process.env.FALLEN_API_KEY,  
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
  }
});

// Request logging
fallenApiClient.interceptors.request.use(
  (config) => {
    console.log('📤 Calling FallenAPI:', config.method.toUpperCase(), config.url);
    console.log('   Params:', config.params);
    return config;
  },
  (error) => {
    console.error('❌ Request Setup Error:', error.message);
    return Promise.reject(error);
  }
);

// Response handling
fallenApiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status);
    return response;
  },
  (error) => {
 
    if (error.code === 'ECONNRESET') {
      console.error('🔴 ECONNRESET - Connection dropped by server');
      console.log('💡 Possible causes:');
      console.log('   - API rate limit exceeded');
      console.log('   - Server is restarting');
      console.log('   - Invalid API key');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('⏰ ETIMEDOUT - Request took too long');
    } else if (error.response) {
      console.error('❌ API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('❌ No Response Received');
      console.log('Request was made but no response:', error.message);
    } else {
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default fallenApiClient;