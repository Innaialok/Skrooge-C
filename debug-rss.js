
// debug-rss.js
async function debugRSS() {
    try {
        const response = await fetch('https://www.ozbargain.com.au/deals/feed');
        const text = await response.text();

        // Extract first item description
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match = itemRegex.exec(text);

        let count = 0;
        while (match && count < 3) {
            count++;
            const itemXml = match[1];

            console.log(`\n--- Item ${count} ---`);
            console.log(itemXml);

            match = itemRegex.exec(text);
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

debugRSS();
