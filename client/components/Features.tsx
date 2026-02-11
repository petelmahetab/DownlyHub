
import React from 'react';

const features = [
  {
    icon: 'high_quality',
    title: 'Ultra HD Quality',
    desc: 'Download videos in 1080p, 4K, and even 8K resolution where available with zero loss in quality.'
  },
  {
    icon: 'bolt',
    title: 'Instant Processing',
    desc: 'Our cloud-based engine processes links instantly, so you don\'t have to wait to start your download.'
  },
  {
    icon: 'block',
    title: 'Ad-Free Experience',
    desc: 'Clean interface with absolutely no intrusive pop-ups or hidden malware. Just the content you want.'
  }
];

const Features: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-32">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/[0.07] transition-all group">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-icons text-primary">{f.icon}</span>
            </div>
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
