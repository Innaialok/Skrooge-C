export const metadata = {
    title: 'Terms of Service - Skrooge',
    description: 'Terms and Conditions for using Skrooge.'
}

export default function TermsPage() {
    return (
        <div className="min-h-screen p-6 sm:p-12 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-[var(--text-secondary)]">
                <p className="text-sm text-[var(--text-muted)]">Last Updated: February 6, 2026</p>

                <section>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">1. Agreement to Terms</h2>
                    <p>
                        By accessing or using Skrooge, you agree to be bound by these Terms of Service and our Privacy Policy.
                        If you do not agree to these terms, accessing our site is strictly prohibited.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">2. Description of Service</h2>
                    <p>
                        Skrooge provides a deal aggregation service that allows users to find, view, and vote on deals from various
                        retailers. We are not a retailer and do not sell products directly. We simply provide links to third-party
                        retailers where purchases can be made.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">3. Disclaimer of Warranties</h2>
                    <p>
                        The service is provided on an "AS IS" and "AS AVAILABLE" basis. Skrooge makes no representations or
                        warranties of any kind, express or implied, as to the operation of their services, or the information,
                        content, or materials included therein. We do not guarantee the accuracy of deal prices or availability,
                        as these can change rapidly on retailer sites.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">4. Affiliate Disclosure</h2>
                    <p>
                        Skrooge may earn a commission when you click on links to our partner retailers and make a purchase.
                        This does not affect the price you pay and helps support our platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">5. User Conduct</h2>
                    <p>
                        You agree not to use the service for any unlawful purpose or in any way that interrupts, damages,
                        or impairs the service. You may not solicit others or spam the discussion boards.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">6. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these terms at any time. We will always post the most current version
                        on our website. By continuing to use the service after changes become effective, you agree to be bound
                        by the revised terms.
                    </p>
                </section>
            </div>
        </div>
    )
}
