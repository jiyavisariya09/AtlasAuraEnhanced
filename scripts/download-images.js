const fs = require('fs');
const path = require('path');
const https = require('https');

const downloads = [
  // Hero Background
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85&auto=format&fit=crop',
    dest: 'public/hero-bg.jpg'
  },

  // Avatars
  {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    dest: 'public/avatars/avatar-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    dest: 'public/avatars/avatar-2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    dest: 'public/avatars/avatar-3.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    dest: 'public/avatars/avatar-4.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    dest: 'public/avatars/avatar-5.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    dest: 'public/avatars/avatar-6.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    dest: 'public/avatars/avatar-7.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    dest: 'public/avatars/avatar-sarah.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    dest: 'public/avatars/avatar-marco.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    dest: 'public/avatars/avatar-lisa.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    dest: 'public/avatars/avatar-default.jpg'
  },

  // Memory locations
  {
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
    dest: 'public/memories/japan.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1600&auto=format&fit=crop&q=85',
    dest: 'public/memories/morocco.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1600&auto=format&fit=crop&q=85',
    dest: 'public/memories/morocco-night.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&auto=format&fit=crop&q=80',
    dest: 'public/memories/norway.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
    dest: 'public/memories/indonesia.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&auto=format&fit=crop&q=80',
    dest: 'public/memories/greece.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&auto=format&fit=crop&q=80',
    dest: 'public/memories/iceland.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&auto=format&fit=crop&q=80',
    dest: 'public/memories/peru.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&auto=format&fit=crop&q=80',
    dest: 'public/memories/switzerland.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80',
    dest: 'public/memories/default.jpg'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullDest = path.resolve(__dirname, '..', destPath);
    const dir = path.dirname(fullDest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const file = fs.createWriteStream(fullDest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(fullDest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading images locally to public/ folder...');
  for (const item of downloads) {
    try {
      await downloadFile(item.url, item.dest);
      console.log(`Saved: ${item.dest}`);
    } catch (err) {
      console.error(`Failed to download ${item.url}:`, err.message);
    }
  }
  console.log('All downloads completed!');
}

run();
