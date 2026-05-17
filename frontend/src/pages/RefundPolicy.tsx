import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RefundPolicy = () => {
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
            Refund / Cancellation Policy
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground text-lg">
              Thank you for registering for our Life Coaching & Marketing Training Seminar.
            </p>

            <div className="bg-muted/50 p-6 rounded-lg border border-border">
              <p className="text-muted-foreground mb-4">
                Once a participant completes the online registration and receives the coupon code / entry pass, the seat is reserved exclusively for that participant.
              </p>

              <p className="font-semibold mb-2">Therefore:</p>

              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>All registration fees are <strong>non-refundable</strong>.</li>
                <li>Cancellation or no-show is not eligible for refund or transfer to another event.</li>
                <li>
                  In case the event is rescheduled or cancelled by the organizer, participants will be allowed to attend the next event without additional charges.
                </li>
              </ul>
            </div>

            <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
              <p className="font-semibold mb-4">
                If you face any issues during payment or do not receive the coupon/pass:
              </p>
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

export default RefundPolicy;
