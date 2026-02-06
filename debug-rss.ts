
import fetch from 'node-fetch';

async function debugRSS() {
    try {
        const response = await fetch('https://www.ozbargain.com.au/deals/feed');
        const text = await response.text();

        // Extract first item description
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match = itemRegex.exec(text);

        if (match) {
            const itemXml = match[1];
            const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
            const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
            const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);

            console.log('--- Item 1 ---');
            console.log('Title:', titleMatch ? titleMatch[1] : 'No title');
            console.log('Link:', linkMatch ? linkMatch[1] : 'No link');
            console.log('Description Start:');
            console.log(descMatch ? descMatch[1].substring(0, 1000) : 'No description');
            console.log('--- End Item 1 ---');

            // Check second item too
            match = itemRegex.exec(text);
            if (match) {
                const itemXml2 = match[1];
                const descMatch2 = itemXml2.match(/<description>([\s\S]*?)<\/description>/);
                console.log('\n--- Item 2 ---');
                console.log('Description Start:');
                console.log(descMatch2 ? descMatch2[1].substring(0, 1000) : 'No description');
            }
        } else {
            console.log('No items found');
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

debugRSS();
