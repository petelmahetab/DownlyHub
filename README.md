# DownlyHub

> A powerful, multi-platform media downloader supporting Instagram, X (Twitter), Facebook, TikTok, LinkedIn, and Snapchat.

<img width="1875" height="907" alt="image" src="https://github.com/user-attachments/assets/c8bc7d5d-1d2a-430e-a859-db3cfb2fc6ca" />

## 🚀 Features

- **Multi-Platform Support**: Download content from 6+ major social media platforms
- **High-Quality Downloads**: Fetch media in original quality
- **Simple API**: Clean, RESTful API endpoints for easy integration
- **Fast & Efficient**: Optimized for speed with async processing
- **Error Handling**: Robust error handling and retry mechanisms
- **Rate Limit Management**: Built-in rate limiting to prevent API abuse
- **Cookie-Based Authentication**: Support for authenticated requests

## 📋 Supported Platforms

| Platform | Status | Media Types |
|----------|--------|-------------|
| Instagram | ✅ Working | Photos, Videos, Reels, Stories |
| X (Twitter) | ✅ Working | Photos, Videos, GIFs |
| Facebook | ✅ Working | Videos, Photos |
| TikTok | ✅ Working | Videos |
| LinkedIn | ✅ Working | Videos, Images |
| Snapchat | ✅ Working | Stories, Highlights |
| YouTube | ⚠️ In Progress | Videos (experiencing API limitations) |

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **APIs**: Platform-specific APIs and scrapers
- **Authentication**: Cookie-based auth, API keys
- **Deployment**: Docker-ready, works with major cloud providers

## 📦 Installation

### Prerequisites

- Node.js >= 16.0.0
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/petelmahetab/DownlyHub.git
   cd DownlyHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   PORT=5000
   SCRAPPER_API_KEY=your_scrapper_api_key
   FRONTEND_URL=your_frontend_url
   NODE_ENV=devlopement/production
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   The app will be available at `https://downlyhub.onrender.com`

## 🎯 Usage

### API Endpoints

#### Download Media

**POST** `/api/download`

```json
{
  "url": "https://www.instagram.com/reel/ABC123/",
  "platform": "instagram"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Multi-Platform Video Downloader API",
  "cookieFile": "Found",
  "scraperAPI": "Enabled",
  "strategies": 6,
  "supported": "YouTube, Instagram, Facebook, TikTok, Twitter, Snapchat, LinkedIn, and 1000+ more",
  "timestamp": "2026-02-12T19:14:23.567Z"
}
```


### Example Usage

```javascript
const downloadMedia = async (url, platform) => {
  const response = await fetch('https://downlyhub.onrender.com/api/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, platform })
  });
  
  const data = await response.json();
  return data;
};

// Usage
downloadMedia('https://www.instagram.com/reel/ABC123/', 'instagram')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```


## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `SCRAPPER_API_KEY` | Scrapper API authentication | Yes |
| `INSTAGRAM_COOKIES` | Path to Instagram cookies file | Optional |
| `RATE_LIMIT_MAX` | Max requests per window | No (default: 100) |
| `RATE_LIMIT_WINDOW` | Time window in ms | No (default: 900000) |

## 🔧 Troubleshooting

### Common Issues

**1. Authentication Errors**
- Ensure your cookies file is up-to-date
- Verify API keys are correctly set in `.env`
- Check if the platform requires login for content access

**2. Rate Limiting**
- Implement exponential backoff
- Use authenticated requests to increase limits
- Consider rotating API keys

**3. YouTube Downloads**
- Currently experiencing API limitations due to aggressive bot detection
- Working on alternative solutions
- Other platforms are fully operational

## 🗺️ Roadmap

- [ ] Complete YouTube integration with improved anti-detection
- [ ] Add support for Reddit, Pinterest
- [ ] Implement bulk download feature
- [ ] Create browser extension
- [ ] Add WebSocket support for real-time progress
- [ ] Build admin dashboard for monitoring

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes 
4. Push to the branch 
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Platform APIs and their respective documentation
- Open-source community for various libraries used
- Contributors who help improve this project

## 📞 Contact

**Developer**: Mahetab Patel 
**Email**: mahetabpatel33@example.com  
**Project Link**: https://github.com/petelmahetab/DownlyHub

---

⭐ Star this repo if you find it helpful!
