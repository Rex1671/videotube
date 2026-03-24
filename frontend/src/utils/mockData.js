export const MOCK_VIDEOS = [
  {
    _id: "mock-1",
    title: "Welcome to VideoTube (Offline Mode)",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000",
    duration: 184,
    views: 1250,
    createdAt: new Date().toISOString(),
    owner: {
      username: "videotube_official",
      fullName: "VideoTube Official",
      avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    }
  },
  {
    _id: "mock-2",
    title: "How to Deploy to Vercel",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000",
    duration: 320,
    views: 850,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    owner: {
      username: "vercel_tips",
      fullName: "Vercel Tips & Tricks",
      avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    }
  },
  {
    _id: "mock-3",
    title: "Mastering React 19",
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&q=80&w=1000",
    duration: 645,
    views: 3200,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    owner: {
      username: "react_pro",
      fullName: "React Professional",
      avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    }
  },
  {
    _id: "mock-4",
    title: "Backend Offline? No Problem!",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
    duration: 156,
    views: 520,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    owner: {
      username: "dev_logic",
      fullName: "Dev Logic",
      avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    }
  }
];
