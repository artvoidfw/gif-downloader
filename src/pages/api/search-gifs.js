// Curated and live GIF search API with category support

const CURATED_GIFS = [
  // Trending / Reactions
  {
    id: 'tr-1',
    title: 'Happy Dance Cat',
    category: 'reactions',
    tags: ['happy', 'cat', 'dance', 'cute', 'celebration'],
    url: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    mp4: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.mp4',
    width: 480,
    height: 360,
    size: '1.4 MB',
  },
  {
    id: 'tr-2',
    title: 'Mind Blown Reaction',
    category: 'reactions',
    tags: ['mind blown', 'wow', 'shocked', 'explosion', 'reaction'],
    url: 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif',
    mp4: 'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.mp4',
    width: 480,
    height: 270,
    size: '2.1 MB',
  },
  {
    id: 'tr-3',
    title: 'Thumbs Up Approval',
    category: 'reactions',
    tags: ['thumbs up', 'yes', 'good', 'approved', 'like'],
    url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif',
    mp4: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.mp4',
    width: 400,
    height: 300,
    size: '1.2 MB',
  },
  {
    id: 'tr-4',
    title: 'Popcorn Eating Drama',
    category: 'reactions',
    tags: ['popcorn', 'watching', 'drama', 'movie', 'reaction'],
    url: 'https://media.giphy.com/media/gl0mkIZOW6Nwc/giphy.gif',
    mp4: 'https://media.giphy.com/media/gl0mkIZOW6Nwc/giphy.mp4',
    width: 500,
    height: 281,
    size: '1.8 MB',
  },
  {
    id: 'an-1',
    title: 'Anime Lofi Chill Beats',
    category: 'anime',
    tags: ['anime', 'lofi', 'chill', 'aesthetic', 'study'],
    url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW53bHlyajFnOW85YWdrZzQza3RocW81OWlrdHRjcDNzN2xid2E3aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufdipQqU2lhNA4g/giphy.gif',
    mp4: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.mp4',
    width: 480,
    height: 270,
    size: '2.4 MB',
  },
  {
    id: 'an-2',
    title: 'Anime Wow Sparkles',
    category: 'anime',
    tags: ['anime', 'sparkle', 'eyes', 'cute', 'excited'],
    url: 'https://media.giphy.com/media/aWPGuTlDqq2yc/giphy.gif',
    mp4: 'https://media.giphy.com/media/aWPGuTlDqq2yc/giphy.mp4',
    width: 500,
    height: 281,
    size: '1.9 MB',
  },
  {
    id: 'gm-1',
    title: 'Retro 8-Bit Pixel Runner',
    category: 'gaming',
    tags: ['gaming', 'pixel', '8bit', 'arcade', 'retro'],
    url: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif',
    mp4: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.mp4',
    width: 500,
    height: 375,
    size: '1.1 MB',
  },
  {
    id: 'gm-2',
    title: 'Victory Royale Celebration',
    category: 'gaming',
    tags: ['gaming', 'victory', 'winner', 'dance', 'gamer'],
    url: 'https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif',
    mp4: 'https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.mp4',
    width: 480,
    height: 270,
    size: '2.5 MB',
  },
  {
    id: 'mm-1',
    title: 'Confused Travolta',
    category: 'memes',
    tags: ['meme', 'confused', 'where', 'travolta', 'lost'],
    url: 'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif',
    mp4: 'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.mp4',
    width: 480,
    height: 320,
    size: '1.9 MB',
  },
  {
    id: 'mm-2',
    title: 'This Is Fine Dog Fire',
    category: 'memes',
    tags: ['meme', 'this is fine', 'fire', 'dog', 'okay'],
    url: 'https://media.giphy.com/media/NTur7XlVDUdqM/giphy.gif',
    mp4: 'https://media.giphy.com/media/NTur7XlVDUdqM/giphy.mp4',
    width: 480,
    height: 270,
    size: '1.6 MB',
  },
  {
    id: 'am-1',
    title: 'Excited Golden Retriever Puppy',
    category: 'animals',
    tags: ['dog', 'puppy', 'cute', 'excited', 'animal'],
    url: 'https://media.giphy.com/media/bbshzgyFQDqPHXBo4c/giphy.gif',
    mp4: 'https://media.giphy.com/media/bbshzgyFQDqPHXBo4c/giphy.mp4',
    width: 480,
    height: 480,
    size: '2.8 MB',
  },
  {
    id: 'am-2',
    title: 'Red Panda Surprise Stand',
    category: 'animals',
    tags: ['animal', 'red panda', 'surprise', 'funny', 'cute'],
    url: 'https://media.giphy.com/media/f9eYHQ8RZ4ztx4unFg/giphy.gif',
    mp4: 'https://media.giphy.com/media/f9eYHQ8RZ4ztx4unFg/giphy.mp4',
    width: 480,
    height: 270,
    size: '1.7 MB',
  },
  {
    id: 'mv-1',
    title: 'Neo Matrix Bullet Dodge',
    category: 'movies',
    tags: ['matrix', 'neo', 'bullet time', 'movie', 'action', 'sci-fi'],
    url: 'https://media.giphy.com/media/eIm624c8nnNbiG0V3g/giphy.gif',
    mp4: 'https://media.giphy.com/media/eIm624c8nnNbiG0V3g/giphy.mp4',
    width: 480,
    height: 270,
    size: '2.2 MB',
  },
  {
    id: 'sp-1',
    title: 'Incredible Basketball Slam Dunk',
    category: 'sports',
    tags: ['sports', 'basketball', 'dunk', 'nba', 'jump'],
    url: 'https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif',
    mp4: 'https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.mp4',
    width: 480,
    height: 270,
    size: '2.6 MB',
  },
];

export default function handler(req, res) {
  const { q = '', category = 'trending', limit = 20 } = req.query;

  let results = [...CURATED_GIFS];

  if (category && category !== 'trending') {
    results = results.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  }

  if (q.trim()) {
    const query = q.toLowerCase().trim();
    results = CURATED_GIFS.filter(
      (g) =>
        g.title.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query) ||
        g.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  return res.status(200).json({
    total: results.length,
    results: results.slice(0, Number(limit)),
  });
}

