import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Sparkles, CreditCard, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createBooking } from "@/api/bookings";
import { createOrder, verifyPayment } from "@/api/payments";
import { getEventPackages, EventPackage } from "@/api/siteConfig";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Calculate GST (18% on base amount)
const calculateGST = (baseAmount: number): number => {
  const gst = baseAmount * 0.18; // 18% GST
  return Math.round(gst);
};

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    address: "",
    package: "500", // Default to lowest package
    paymentMode: "cash",
  });
  const [packages, setPackages] = useState<EventPackage[]>([]);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const { toast } = useToast();

  // Load packages
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const data = await getEventPackages();
        setPackages(data);
        if (data.length > 0) {
          // Set standard package (usually the middle one) or first one as default
          const defaultPkg = data.find((p: any) => p.price === '10000') || data[0];
          setFormData(prev => ({ ...prev, package: defaultPkg.price }));
        }
      } catch (error) {
        console.error("Failed to load packages", error);
      }
    };
    loadPackages();
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const baseAmount = parseInt(formData.package);
  const gstAmount = calculateGST(baseAmount);
  const totalAmount = baseAmount + gstAmount;

  const validateForm = (): boolean => {
    if (!formData.name || !formData.number || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.number)) {
      toast({
        title: "Error",
        description: "Phone number must be exactly 10 digits",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCashBooking = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const booking = await createBooking({
        ...formData,
        screenshot: null,
      });
      setToken(booking.token);
      toast({
        title: "Booking Confirmed!",
        description: `Your token: ${booking.token}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!validateForm()) return;

    if (!razorpayLoaded) {
      toast({
        title: "Error",
        description: "Payment gateway is loading. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create order
      const orderData = await createOrder({
        name: formData.name,
        number: formData.number,
        address: formData.address,
        package: formData.package,
      });

      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Car Kumbh",
        description: `Package ₹${formData.package} + GST`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyData = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              name: formData.name,
              number: formData.number,
              address: formData.address,
              package: formData.package,
            });

            setToken(verifyData.token);
            toast({
              title: "Payment Successful!",
              description: `Your token: ${verifyData.token}`,
            });
          } catch (error: any) {
            toast({
              title: "Payment Verification Failed",
              description:
                error.response?.data?.message ||
                "Please contact support with your payment details.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.number,
        },
        theme: {
          color: "#f97316",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        toast({
          title: "Payment Failed",
          description: response.error.description || "Payment was not completed",
          variant: "destructive",
        });
        setIsLoading(false);
      });
      razorpay.open();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.paymentMode === "cash") {
      await handleCashBooking();
    } else {
      await handleOnlinePayment();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full max-w-2xl mx-auto lg:mx-auto"
    >
      <Card className="p-8 bg-gradient-card border-border/50 backdrop-blur-sm shadow-elevated">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        >
          Book Your Spot
        </motion.h2>

        {token ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
            <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground mb-4">
              Your confirmation token:
            </p>
            <div className="bg-secondary/50 px-8 py-4 rounded-lg border-2 border-primary shadow-glow inline-block mb-6">
              <span className="text-4xl font-mono font-bold tracking-wider text-primary">
                {token}
              </span>
            </div>
            <div>
              <Button
                onClick={() => {
                  setToken("");
                  setFormData({
                    name: "",
                    number: "",
                    address: "",
                    package: packages.length > 0 ? packages[0].price : "500",
                    paymentMode: "cash",
                  });
                }}
                className="bg-primary hover:bg-primary/90"
              >
                New Booking
              </Button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-2 bg-secondary/50 border-border/50 focus:border-primary"
                placeholder="Enter your name"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Label htmlFor="number" className="text-foreground">
                Phone Number
              </Label>
              <Input
                id="number"
                type="tel"
                value={formData.number}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    setFormData({ ...formData, number: value });
                  }
                }}
                className="mt-2 bg-secondary/50 border-border/50 focus:border-primary"
                placeholder="Enter 10 digit phone number"
                maxLength={10}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Label htmlFor="address" className="text-foreground">
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="mt-2 bg-secondary/50 border-border/50 focus:border-primary"
                placeholder="Enter your address"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Label className="text-foreground mb-3 block">
                Select Package
              </Label>
              <RadioGroup
                value={formData.package}
                onValueChange={(value) =>
                  setFormData({ ...formData, package: value })
                }
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {packages.map((pkg) => (
                  <Label
                    key={pkg.id}
                    htmlFor={`package-${pkg.price}`}
                    className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.package === pkg.price
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-border/50 bg-secondary/30 hover:border-border"
                    }`}
                  >
                    <RadioGroupItem
                      value={pkg.price}
                      id={`package-${pkg.price}`}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <span className="text-2xl font-bold block">₹{pkg.price}</span>
                      <span className="text-sm text-primary font-bold block">{pkg.name}</span>
                      <div className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
                        <p className="font-bold text-foreground/70">{pkg.duration}</p>
                        <p>{pkg.onlineSessions} Online Classes</p>
                        <p>{pkg.liveSessions} Live Classes</p>
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Label className="text-foreground mb-3 block">Payment Mode</Label>
              <RadioGroup
                value={formData.paymentMode}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMode: value })
                }
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="payment-cash"
                  className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.paymentMode === "cash"
                      ? "border-primary bg-primary/10 shadow-glow"
                      : "border-border/50 bg-secondary/30 hover:border-border"
                  }`}
                >
                  <RadioGroupItem
                    value="cash"
                    id="payment-cash"
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    <span className="font-semibold">Cash</span>
                  </div>
                </Label>
                <Label
                  htmlFor="payment-online"
                  className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.paymentMode === "online"
                      ? "border-primary bg-primary/10 shadow-glow"
                      : "border-border/50 bg-secondary/30 hover:border-border"
                  }`}
                >
                  <RadioGroupItem
                    value="online"
                    id="payment-online"
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-semibold">Online</span>
                  </div>
                </Label>
              </RadioGroup>
            </motion.div>

            {formData.paymentMode === "online" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-secondary/30 rounded-lg p-4 border border-border/50"
              >
                <h4 className="font-semibold mb-3 text-foreground">
                  Payment Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Package Amount</span>
                    <span className="font-medium">₹{baseAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      GST (18%)
                    </span>
                    <span className="font-medium">₹{gstAmount}</span>
                  </div>
                  <div className="border-t border-border/50 pt-2 mt-2">
                    <div className="flex justify-between text-base">
                      <span className="font-semibold text-foreground">
                        Total Payable
                      </span>
                      <span className="font-bold text-primary">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-6 text-lg shadow-glow"
              >
                {isLoading
                  ? "Processing..."
                  : formData.paymentMode === "online"
                  ? `Pay ₹${totalAmount}`
                  : "Confirm Booking"}
              </Button>
            </motion.div>
          </form>
        )}
      </Card>
    </motion.div>
  );
};

export default BookingForm;
