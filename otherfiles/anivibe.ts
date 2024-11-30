import * as cheerio from 'cheerio';
import { LRUCache } from 'lru-cache';

const sourcesCache = new LRUCache<string, any>({
    max: 100,
    ttl: 1000 * 60 * 15,
});

const fetchAniVibeSources = async (animeId: string, dub: boolean) => {
    const cacheKey = `anivibe-${animeId}`;

    const cachedSources = sourcesCache.get(cacheKey);
    if (cachedSources) {
        const filteredCachedSources = cachedSources?.sources?.filter(source => (dub ? source?.type === 'dub' : source?.type === 'sub'));
        return filteredCachedSources?.length > 0 ? { sources: filteredCachedSources } : null;
    }
    
    try {
        const response = await fetch(`https://anivibe.net/${animeId}`);
        const html = await response.text();
        const $ = cheerio.load(html);
        const scriptTag = $('script').filter((_, el) => $(el).html()?.includes("loadIframePlayer")).first();

        if (scriptTag.length) {
            const scriptContent = scriptTag.html();
            const match = /loadIframePlayer\((.*?)\);/.exec(scriptContent);
            if (match) {
                let loadIframeCall = match[1].trim().replace(/^['"]|['"]$/g, '');
                loadIframeCall = loadIframeCall.split("'")[0];

                try {
                    const videoData = JSON.parse(loadIframeCall);

                    let subUrl: string | null = null;
                    let dubUrl: string | null = null;
                    for (const video of videoData) {
                        if (video.type === 'SUB') {
                            subUrl = video.url.replace(/\\\//g, "/");
                        } else if (video.type === 'DUB') {
                            dubUrl = video.url.replace(/\\\//g, "/");
                        }
                    }

                    const result = {
                        sources: [
                            { url: subUrl, quality: "default", type: "sub" },
                            { url: dubUrl, quality: "default", type: "dub" },
                        ].filter(source => source?.url !== null)
                    };

                    if (result?.sources?.length > 0) {
                        sourcesCache.set(cacheKey, result);
                    }
                    console.log(result)
                    const filteredSources = result?.sources?.filter(source => (dub ? source?.type === 'dub' : source?.type === 'sub'));
                    return filteredSources?.length > 0 ? { sources: filteredSources } : null;
                } catch (error) {
                    console.error("Failed to decode JSON data:", error);
                    return null;
                }
            } else {
                console.log("loadIframePlayer function call not found.");
            }
        } else {
            console.log("Script tag containing loadIframePlayer not found.");
        }
    } catch (error) {
        console.error("Error fetching the page:", error);
        return null;
    }
    return null;
};

export { fetchAniVibeSources };
