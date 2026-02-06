

async function resolveLink() {
    // Example /goto/ link from previous debug output
    const url = 'https://www.ozbargain.com.au/goto/947148';

    try {
        console.log(`Attempting to resolve: ${url}`);
        const response = await fetch(url, {
            redirect: 'manual', // Don't follow automatically, just get the header
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        console.log(`Status: ${response.status}`);
        console.log(`Location: ${response.headers.get('location')}`);

        if (response.status >= 300 && response.status < 400) {
            console.log('Success! Redirect found.');
        } else {
            console.log('No redirect? response body preview:');
            const text = await response.text();
            console.log(text.substring(0, 200));
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

resolveLink();
