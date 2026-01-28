import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Sparkles, CreditCard } from "lucide-react";
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
    paymentMode: "online",
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

      console.log("Order created:", orderData);
      console.log("Order ID:", orderData.orderId);
      console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);

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
            
            {/* WhatsApp Group Join Button */}
            {(() => {
              const selectedPkg = packages.find(p => p.price === formData.package);
              if (selectedPkg?.whatsappLink) {
                return (
                  <div className="mb-6">
                    <a
                      href={selectedPkg.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-green-500/30"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Join WhatsApp Group
                    </a>
                    <p className="text-sm text-muted-foreground mt-2">
                      Join your package's exclusive group for updates!
                    </p>
                  </div>
                );
              }
              return null;
            })()}
            
            <div>
              <Button
                onClick={() => {
                  setToken("");
                  setFormData({
                    name: "",
                    number: "",
                    address: "",
                    package: packages.length > 0 ? packages[0].price : "500",
                    paymentMode: "online",
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
