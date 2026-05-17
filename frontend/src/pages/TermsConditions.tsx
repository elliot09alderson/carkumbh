import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsConditions = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Terms & Conditions
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground text-lg mb-6">
              By registering for our training seminar, you agree to the following:
            </p>

            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  <span className="font-semibold">1.</span> The registration fee (Rs.500 / Rs.1000) is for training participation only.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  <span className="font-semibold">2.</span> A unique coupon code / entry pass will be provided after successful payment.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  <span className="font-semibold">3.</span> The coupon/pass allows entry for one participant only and cannot be transferred.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  <span className="font-semibold">4.</span> The training is for educational and self-development purposes only.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  <span className="font-semibold">5.</span> We do not guarantee financial income, job placement or business results.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  <span className="font-semibold">6.</span> Participants must maintain respectful behaviour throughout the seminar.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  <span className="font-semibold">7.</span> The organizer has the right to remove any participant for misconduct without refund.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  <span className="font-semibold">8.</span> Photography or videography inside the seminar without permission is strictly prohibited.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  <span className="font-semibold">9.</span> By participating, you agree that any photos/videos taken during the event may be used for promotional purposes.
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
              <p className="font-semibold mb-4">For questions:</p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: torankumar100@gmail.com</p>
                <p>Phone: +91 6264824626</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsConditions;
