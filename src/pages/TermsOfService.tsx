import { Layout } from '@/components/layout/Layout';

export default function TermsOfService() {
  return (
    <Layout>
      <div className="container max-w-3xl py-12">
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-8">Last updated: March 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using LocalPro ("the Platform"), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our services. These terms apply to all users,
              including clients, service providers, and administrators.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              LocalPro is a marketplace platform that connects clients seeking local services with qualified
              service providers. We facilitate the discovery, communication, and booking of services but are
              not a party to the service agreements between clients and providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must register for an account to use most features of the Platform. You agree to provide
              accurate and complete information during registration and to keep your account information
              up to date. You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">4. Client Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">
              As a client, you agree to: provide accurate descriptions of the services you need; communicate
              respectfully with service providers; honor confirmed bookings or cancel within a reasonable
              timeframe; and provide honest reviews based on your actual experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">5. Provider Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">
              As a service provider, you agree to: maintain accurate and up-to-date profile information;
              hold any required licenses or certifications for your services; respond to service requests
              in a timely manner; deliver services professionally and as described; and comply with all
              applicable local laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">6. Payments and Fees</h2>
            <p className="text-muted-foreground leading-relaxed">
              Payment terms between clients and providers are arranged through the Platform. LocalPro may
              charge service fees as disclosed at the time of transaction. All fees are non-refundable
              unless otherwise stated or required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">7. Disputes</h2>
            <p className="text-muted-foreground leading-relaxed">
              In the event of a dispute between a client and a provider, both parties may use the Platform's
              dispute resolution system. LocalPro will review disputes and may make decisions regarding
              refunds or other remedies at its discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">8. Prohibited Conduct</h2>
            <p className="text-muted-foreground leading-relaxed">
              Users may not: use the Platform for any unlawful purpose; harass, abuse, or threaten other
              users; post false, misleading, or defamatory content; attempt to circumvent the Platform to
              avoid fees; create multiple accounts for fraudulent purposes; or interfere with the proper
              functioning of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">9. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              LocalPro provides the Platform "as is" and makes no warranties regarding the quality, safety,
              or legality of services provided by service providers. We are not liable for any damages
              arising from the use of our Platform or from transactions between users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">10. Account Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violations of these
              terms. You may also delete your account at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">11. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms of Service from time to time. We will notify users of significant
              changes via email or through the Platform. Continued use of the Platform after changes
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">12. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:support@localpro.com" className="text-primary hover:underline">
                support@localpro.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
