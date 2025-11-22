import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground text-lg">
              We value your privacy. This policy describes how we collect and use participant information.
            </p>

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              <div className="bg-muted/50 p-6 rounded-lg border border-border">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Name</li>
                  <li>Mobile number</li>
                  <li>Email address</li>
                  <li>City</li>
                  <li>Payment details (processed securely through Razorpay)</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <div className="bg-muted/50 p-6 rounded-lg border border-border">
                <p className="text-muted-foreground mb-2">We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Confirm registration</li>
                  <li>Generate and send your coupon/entry pass</li>
                  <li>Send seminar updates and reminders</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">3. Payment Information Safety</h2>
              <div className="bg-muted/50 p-6 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  We do not store card details / UPI IDs on our website. All payments are processed securely by Razorpay PCI-DSS compliant systems.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">4. Sharing of Information</h2>
              <div className="bg-muted/50 p-6 rounded-lg border border-border">
                <p className="text-muted-foreground mb-2">
                  We do not sell or share your information with any third party except:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Razorpay (for payment processing)</li>
                  <li>Venue/event management team (only for entry verification)</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
              <div className="bg-muted/50 p-6 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  Participant data is stored securely and used only for seminar-related purposes.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">6. Contact for Privacy Issues</h2>
              <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
                <div className="space-y-2 text-muted-foreground">
                  <p>Email: torankumar100@gmail.com</p>
                  <p>Phone: +91 6264824626</p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
