// API to extract direct GIF and MP4 media links from web pages (Tenor, Giphy, Imgur, Reddit, etc.)

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, error: 'Missing url parameter' });
  }

  try {
    const rawUrl = decodeURIComponent(url).trim();
    const parsed = new URL(rawUrl);

    // 1. Direct media URL check
    const isDirectGif = /\.(gif)(?:\?.*)?$/i.test(parsed.pathname);
    const isDirectVideo = /\.(mp4|webm|mov)(?:\?.*)?$/i.test(parsed.pathname);

    if (isDirectGif || isDirectVideo) {
      return res.status(200).json({
        success: true,
        source: 'direct',
        title: parsed.pathname.split('/').pop() || 'media_file',
        gifUrl: isDirectGif ? rawUrl : null,
        mp4Url: isDirectVideo ? rawUrl : null,
        mediaUrl: rawUrl,
        type: isDirectVideo ? 'video' : 'gif',
      });
    }

    // 2. Tenor Handler (e.g., https://tenor.com/view/...)
    if (parsed.hostname.includes('tenor.com')) {
      const pageRes = await fetch(rawUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
      });

      if (pageRes.ok) {
        const html = await pageRes.text();

        // Extract og:image (GIF) and og:video (MP4)
        const ogImageMatch =
          html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
          html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i) ||
          html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);

        const ogVideoMatch =
          html.match(/<meta[^>]+property=["']og:video(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
          html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:video(?::secure_url)?["']/i);

        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);

        let gifUrl = ogImageMatch ? ogImageMatch[1] : null;
        let mp4Url = ogVideoMatch ? ogVideoMatch[1] : null;

        // Fallback regex scan for tenor media domains
        if (!gifUrl) {
          const tenorGifRegex = /https:\/\/media[0-9]*\.tenor\.com\/[a-zA-Z0-9_\-\/]+\.gif/i;
          const m = html.match(tenorGifRegex);
          if (m) gifUrl = m[0];
        }

        if (!mp4Url) {
          const tenorMp4Regex = /https:\/\/media[0-9]*\.tenor\.com\/[a-zA-Z0-9_\-\/]+\.mp4/i;
          const m = html.match(tenorMp4Regex);
          if (m) mp4Url = m[0];
        }

        if (gifUrl || mp4Url) {
          return res.status(200).json({
            success: true,
            source: 'tenor',
            title: titleMatch ? titleMatch[1].replace(/ - Tenor.*/i, '').trim() : 'tenor_gif',
            gifUrl: gifUrl || mp4Url,
            mp4Url: mp4Url || gifUrl,
            mediaUrl: gifUrl || mp4Url,
            type: 'gif',
          });
        }
      }
    }

    // 3. Giphy Handler (e.g., https://giphy.com/gifs/...)
    if (parsed.hostname.includes('giphy.com')) {
      // Extract ID from pathname, e.g. /gifs/cat-dance-JIX9t2j0ZTN9S or /gifs/JIX9t2j0ZTN9S
      const parts = parsed.pathname.split('/').filter(Boolean);
      let giphyId = parts[parts.length - 1] || '';
      if (giphyId.includes('-')) {
        giphyId = giphyId.split('-').pop();
      }

      if (giphyId) {
        const directGif = `https://media.giphy.com/media/${giphyId}/giphy.gif`;
        const directMp4 = `https://media.giphy.com/media/${giphyId}/giphy.mp4`;

        return res.status(200).json({
          success: true,
          source: 'giphy',
          title: `giphy_${giphyId}`,
          gifUrl: directGif,
          mp4Url: directMp4,
          mediaUrl: directGif,
          type: 'gif',
        });
      }
    }

    // 4. Imgur Handler (e.g., https://imgur.com/...)
    if (parsed.hostname.includes('imgur.com')) {
      const parts = parsed.pathname.split('/').filter(Boolean);
      const imgId = parts[parts.length - 1]?.replace(/\.[a-z0-9]+$/i, '');
      if (imgId) {
        const gifUrl = `https://i.imgur.com/${imgId}.gif`;
        const mp4Url = `https://i.imgur.com/${imgId}.mp4`;
        return res.status(200).json({
          success: true,
          source: 'imgur',
          title: `imgur_${imgId}`,
          gifUrl,
          mp4Url,
          mediaUrl: gifUrl,
          type: 'gif',
        });
      }
    }

    // 5. Generic Web Page Scraper (Reddit, Pinterest, X, blogs, forums)
    const pageRes = await fetch(rawUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    });

    if (pageRes.ok) {
      const contentType = pageRes.headers.get('content-type') || '';
      if (contentType.includes('image/') || contentType.includes('video/')) {
        return res.status(200).json({
          success: true,
          source: 'direct',
          title: 'media_file',
          gifUrl: contentType.includes('gif') ? rawUrl : null,
          mp4Url: contentType.includes('video') ? rawUrl : null,
          mediaUrl: rawUrl,
          type: contentType.includes('video') ? 'video' : 'gif',
        });
      }

      const html = await pageRes.text();

      // Look for og:video, og:image, twitter:image
      const ogVideo =
        html.match(/<meta[^>]+property=["']og:video(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:video(?::secure_url)?["']/i);

      const ogImage =
        html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i) ||
        html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);

      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);

      let foundGif = null;
      let foundVideo = ogVideo ? ogVideo[1] : null;

      if (ogImage && ogImage[1]) {
        foundGif = ogImage[1];
      }

      // Regex scan for embedded .gif links in page
      if (!foundGif) {
        const gifMatch = html.match(/https?:\/\/[^"'\s<>]+\.gif(?:\?[^"'\s<>]*)?/i);
        if (gifMatch) foundGif = gifMatch[0];
      }

      if (foundGif || foundVideo) {
        return res.status(200).json({
          success: true,
          source: 'scraped',
          title: titleMatch ? titleMatch[1].trim() : 'web_gif',
          gifUrl: foundGif || foundVideo,
          mp4Url: foundVideo || foundGif,
          mediaUrl: foundGif || foundVideo,
          type: foundVideo && !foundGif ? 'video' : 'gif',
        });
      }
    }

    return res.status(404).json({
      success: false,
      error: 'Could not extract direct media stream from this URL. Please verify the link.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Extraction error: ' + err.message,
    });
  }
}

