export const metadata = {
    title: 'Privacy Policy - Skrooge',
    description: 'Privacy Policy for Skrooge. Learn how we handle your data.'
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen p-6 sm:p-12 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-[var(--text-secondary)]">
                <p className="text-sm text-[var(--text-muted)]">Last Updated: February 6, 2026</p>

                <section>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">1. Introduction</h2>
                    <p>
                        Welcome to Skrooge ("we," "our," or "us"). We respect your privacy and are committed to protecting
                        your personal data. This privacy policy will inform you as to how we look after your personal data
                        when you visit our website and tell you about your privacy rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">2. Data We Collect</h2>
                    <p>We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together follows:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Identity Data:</strong> includes name, username, or similar identifier.</li>
                        <li><strong>Contact Data:</strong> includes email address.</li>
                        <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                        <li><strong>Usage Data:</strong> includes information about how you use our website, products, and services (e.g. products you view, vote on, or favorite).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">3. How We Use Your Data</h2>
                    <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>To register you as a new customer.</li>
                        <li>To provide personalized deal recommendations.</li>
                        <li>To manage our relationship with you including notifying you about changes to our terms or privacy policy.</li>
                        <li>To administer and protect our business and this website.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">4. Third-Party Links</h2>
                    <p>
                        This website includes links to third-party websites (retailers), plug-ins, and applications.
                        Clicking on those links or enabling those connections may allow third parties to collect or share data about you.
                        We do not control these third-party websites and are not responsible for their privacy statements.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">5. Google Authentication</h2>
                    <p>
                        Skrooge uses Google Sign-In for authentication. When you sign in with Google, we access your basic profile information
                        (name, email, profile picture) solely for the purpose of creating your account and improving your user experience.
                        We do not share this data with third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">6. Contact Details</h2>
                    <p>
                        If you have any questions about this privacy policy or our privacy practices, please contact us at:
                        <a href="mailto:privacy@skrooge.com.au" className="text-[var(--accent)] hover:underline ml-1">privacy@skrooge.com.au</a>
                    </p>
                </section>
            </div>
        </div>
    )
}
