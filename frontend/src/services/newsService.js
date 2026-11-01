// GNews v4 officially supported categories:
// 'general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'
const GNEWS_TOPICS = {
  "All": "general",
  "Science & Tech": "technology",
  "Business & Economy": "business",
  "Politics & Policy": "nation",
  "Health & Medicine": "health",
  "Sports": "sports",
  "Environment & Climate": "science"
};

// In-memory cache to conserve your 100 requests/day quota
const newsCache = {};

/**
 * Fetch real-time live news with full articles and unique photos
 */
export async function fetchLiveNews(category = "All") {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;

  // 1. Check cache first to avoid burning API requests
if (newsCache[category] && (Date.now() - newsCache[category].timestamp < 5 * 60 * 1000)) {    return newsCache[category].data;
  }

  // If no API key configured, return null to use fallback
  if (!apiKey || apiKey === "YOUR_ACTUAL_KEY_HERE") {
    console.warn("GNews API key not configured in .env");
    return null;
  }

  const categoryParam = GNEWS_TOPICS[category] || "general";
  
  // Standard GNews v4 endpoint (category + lang=en)
const url = `https://gnews.io/api/v4/top-headlines?category=${categoryParam}&lang=en&apikey=${apiKey}&token=${apiKey}`;
  console.log("🔍 MY EXACT FETCH URL IS:", url);
try {
        const response = await fetch(url);
    const data = await response.json();

    console.log("👉 GNEWS SERVER RESPONSE:", data);

    if (!response.ok || !data.articles || data.articles.length === 0) {
      console.error("❌ GNEWS ERROR DETAILS:", data.errors || data.message || data);
      throw new Error(data.message || "Failed to fetch from GNews");
    }

    const formattedArticles = data.articles.map((item, index) => {
      // Clean content snippet
      const fullText = item.content || item.description || "";
      // Strip "[+1234 chars]" from the end of GNews previews
      const cleanContent = fullText.replace(/\[\+\d+\s+chars\]$/, "").trim();

      return {
        id: btoa(item.url || item.title).slice(0, 30),
        title: item.title,
        category: category === "All" ? "National & World" : category,
        source: item.source?.name || "News Wire",
        date: new Date(item.publishedAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        timestamp: new Date(item.publishedAt).getTime(),
        readTime: "4 min read",
        originalUrl: item.url,
        // Real unique photo directly from the news publisher
        imageUrl: item.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
        summary: item.description || cleanContent.slice(0, 150) + "...",
        content: cleanContent || item.description,

        // 3-Level Adaptive Explanations
        knowledgeLevels: {
          beginner: `In simple terms: ${item.title}. The core update reported by ${item.source?.name || 'journalists'} is: ${item.description || cleanContent.slice(0, 180)}. This matters to everyday citizens because of how it shapes policy, economy, and public awareness.`,
          intermediate: `Conceptual breakdown: ${item.title}. According to detailed reporting from ${item.source?.name || 'news sources'}, key developments include: ${cleanContent || item.description}. Observers and sector analysts consider this a significant benchmark in ongoing discussions.`,
          advanced: `Detailed analysis: Systematic review of ${item.title}. Dispatches from ${item.source?.name || 'official sources'} emphasize: ${cleanContent || item.description}. The findings indicate strategic regulatory, institutional, and long-term socioeconomic considerations across the domain.`
        },

        // Visual diagram breakdown
        visualExplanation: {
          title: `Visual Concept Flow: ${item.title.slice(0, 45)}...`,
          steps: [
            { phase: "1. The Breaking Event", description: `Reported by ${item.source?.name || 'accredited press'} on ${new Date(item.publishedAt).toLocaleDateString()}.` },
            { phase: "2. The Key Facts", description: item.description || cleanContent.slice(0, 100) },
            { phase: "3. Direct Implications", description: "Impact on regulatory standards, industry practice, and consumer awareness." }
          ]
        },

        // Technical terminology in context
        jargons: [
          {
            term: "Primary Source",
            definition: "The initial agency, spokesperson, or eyewitness providing the direct facts of this report.",
            context: `Attributed directly to ${item.source?.name || 'the publisher'}.`
          },
          {
            term: "Public Stakeholder",
            definition: "Any individual, group, or institution directly affected by the outcome of this development.",
            context: "Relevant to citizens, policymakers, and industry observers."
          }
        ]
      };
    });

    // Save to in-memory cache
    newsCache[category] = {
      timestamp: Date.now(),
      data: formattedArticles
    };

    return formattedArticles;
  } catch (error) {
    console.error("GNews fetch failed, falling back to backup feed:", error);
    return null;
  }
}

/**
 * Fetches the entire, full-length article content from the original publisher URL
 * using Jina Reader's clean markdown/text extractor.
 */
/**
 * Fetches the entire article and extracts ONLY pure, clean story paragraphs,
 * discarding navigation bars, social media buttons, share links, and footers.
 */
export async function fetchFullArticleText(url) {
  if (!url) return null;

  try {
    const readerUrl = `https://r.jina.ai/${url}`;
    const response = await fetch(readerUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to extract full text: ${response.status}`);
    }

    const fullMarkdown = await response.text();

    // Smart filtering: Keep ONLY genuine body paragraphs
    const genuineParagraphs = fullMarkdown
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => {
        // Discard short lines, titles, and headers
        if (p.length < 60) return false;
        // Discard markdown links, images, navigation menus
        if (p.startsWith('#') || p.startsWith('![') || p.startsWith('* [') || p.startsWith('[')) return false;
        if (p.includes('http://') || p.includes('https://')) return false;
        // Discard social share junk & footers
        const lower = p.toLowerCase();
        if (lower.includes('share on') || lower.includes('facebook') || lower.includes('twitter')) return false;
        if (lower.includes('all rights reserved') || lower.includes('cookie policy') || lower.includes('copyright')) return false;
        if (lower.includes('skip to') || lower.includes('subscribe')) return false;
        return true;
      });

    return genuineParagraphs.length > 0 ? genuineParagraphs : null;
  } catch (error) {
    console.error("Error extracting full article text:", error);
    return null;
  }
}