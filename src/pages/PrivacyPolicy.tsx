import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="container max-w-3xl py-10 md:py-14">
        <div className="mb-8 space-y-2">
          <p className="section-label">Legal</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">Last updated: March 2026</p>
        </div>

        <Card className="border-border/70 shadow-soft">
          <CardContent className="p-6 md:p-10">
        <div className="prose prose-slate max-w-none space-y-6 dark:prose-invert">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide directly to us, including: your name, email address,
              phone number, and location when you create an account; profile information such as bio,
              skills, and certifications for service providers; messages and communications between users;
              and service request details and reviews.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to: provide, maintain, and improve our Platform;
              facilitate connections between clients and service providers; process transactions and
              send related notifications; send you technical notices, updates, and support messages;
              respond to your comments, questions, and customer service requests; and monitor and
              analyze trends, usage, and activities on the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">3. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We share your information only in the following circumstances: with other users as necessary
              to facilitate service requests (e.g., your name and contact information with your matched
              provider or client); with service providers who help us operate the Platform (e.g., cloud
              hosting, email delivery); when required by law or to protect our rights; and with your
              consent or at your direction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We take reasonable measures to help protect your personal information from loss, theft,
              misuse, and unauthorized access. This includes encryption of passwords, secure transmission
              of data via HTTPS, and regular security audits. However, no method of transmission over
              the Internet is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">5. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as your account is active or as needed
              to provide you services. If you delete your account, we will delete or anonymize your
              personal information within 30 days, except where we are required to retain it by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to: access and receive a copy of your personal data; correct inaccurate
              personal data; request deletion of your personal data; object to processing of your
              personal data; and data portability. You can exercise many of these rights through your
              account settings or by contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">7. Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use localStorage to maintain your authentication session. We do not currently use
              third-party tracking cookies. We may use analytics services to understand how users
              interact with our Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">8. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Platform may integrate with third-party services such as Cloudinary for image hosting
              and AI services for recommendations. These services have their own privacy policies, and
              we encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Platform is not intended for children under 16 years of age. We do not knowingly collect
              personal information from children under 16.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">10. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-3">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@localpro.com" className="text-primary hover:underline">
                privacy@localpro.com
              </a>.
            </p>
          </section>
        </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
