
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="material-icons text-white text-[14px]">download_for_offline</span>
              </div>
              <span className="text-lg font-bold">StreamVault</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              The world's leading media extraction utility. Download from over 50+ platforms with one click.
            </p>
            <div className="flex gap-4">
              <a className="text-slate-500 hover:text-white transition-colors cursor-pointer"><span className="material-icons text-xl">public</span></a>
              <a className="text-slate-500 hover:text-white transition-colors cursor-pointer"><span className="material-icons text-xl">alternate_email</span></a>
              <a className="text-slate-500 hover:text-white transition-colors cursor-pointer"><span className="material-icons text-xl">hub</span></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-slate-300">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a className="hover:text-primary transition-colors cursor-pointer">Video Downloader</a></li>
              <li><a className="hover:text-primary transition-colors cursor-pointer">MP3 Converter</a></li>
              <li><a className="hover:text-primary transition-colors cursor-pointer">Playlist Downloader</a></li>
              <li><a className="hover:text-primary transition-colors cursor-pointer">Browser Extension</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-slate-300">Support</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a className="hover:text-primary transition-colors cursor-pointer">Help Center</a></li>
              <li><a className="hover:text-primary transition-colors cursor-pointer">Supported Sites</a></li>
              <li><a className="hover:text-primary transition-colors cursor-pointer">Terms of Service</a></li>
              <li><a className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-slate-300">
              Contact / Newsletter
            </h4>
            <p className="text-sm text-slate-500 mb-4">
              Have questions or want updates? Reach out directly.
            </p>

            <a
              href="mailto:yourname@example.com?subject=StreamVault%20Inquiry&body=Hi%20there,%0A%0AI%20have%20a%20question%20about..."
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-primary hover:text-white transition-all"
            >
              <span className="material-icons text-lg">alternate_email</span>
              <span>Contact us: downlyhub1@gamil.com</span>
            </a>
          </div>

        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <p>© 2024 StreamVault Media Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <span>Server Status: <span className="text-green-500 font-bold">Optimal</span></span>
            <span>Region: Global</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
