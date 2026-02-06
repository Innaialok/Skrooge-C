// debug-rss-v2.js
const fs = require('fs');

async function debugRSS() {
    try {
        console.log("Fetching RSS feed...");
        const response = await fetch('https://www.ozbargain.com.au/deals/feed');
        const text = await response.text();
        console.log(`Feed fetched. Length: ${text.length}`);

        // Extract first item
        const itemRegex = /<item>([\s\S]*?)<\/item>/;
        const match = itemRegex.exec(text);

        let output = "";

        if (match) {
            const itemXml = match[1];
            output += "--- RAW ITEM XML START ---\n";
            output += itemXml + "\n";
            output += "--- RAW ITEM XML END ---\n";

            // Inspect description specifically
            const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
            if (descMatch) {
                output += "\n--- DESCRIPTION CONTENT START ---\n";
                // Decode partial entities for readability if needed, but keeping raw is better for regex debugging
                output += descMatch[1] + "\n";
                output += "--- DESCRIPTION CONTENT END ---\n";
            } else {
                output += "\nNO DESCRIPTION FOUND\n";
            }
        } else {
            output += "NO ITEM FOUND IN FEED\n";
        }

        fs.writeFileSync('rss_debug_output.txt', output);
        console.log("Debug output written to rss_debug_output.txt");

    } catch (e) {
        console.error('Error:', e);
    }
}

debugRSS();
