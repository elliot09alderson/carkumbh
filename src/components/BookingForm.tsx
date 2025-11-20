import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Upload, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import upiQrCode from '@/assets/upi-qr.jpeg';
import { createBooking } from '@/api/bookings';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    address: '',
    package: '499',
    paymentMode: 'cash',
    screenshot: null as File | null,
  });
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.number || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number - must be exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.number)) {
      toast({
        title: "Error",
        description: "Phone number must be exactly 10 digits",
        variant: "destructive",
      });
      return;
    }

    if (formData.paymentMode === 'online' && !formData.screenshot) {
      toast({
        title: "Error",
        description: "Please upload payment verification screenshot",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const booking = await createBooking(formData);
      setToken(booking.token);

      toast({
        title: "Booking Confirmed!",
        description: `Your token: ${booking.token}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, screenshot: e.target.files[0] });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full max-w-2xl mx-auto"
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
            <p className="text-muted-foreground mb-4">Your confirmation token:</p>
            <div className="bg-secondary/50 px-8 py-4 rounded-lg border-2 border-primary shadow-glow inline-block mb-6">
              <span className="text-4xl font-mono font-bold tracking-wider text-primary">{token}</span>
            </div>
            <div>
              <Button
                onClick={() => {
                  setToken('');
                  setFormData({
                    name: '',
                    number: '',
                    address: '',
                    package: '499',
                    paymentMode: 'cash',
                    screenshot: null,
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
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2 bg-secondary/50 border-border/50 focus:border-primary"
                placeholder="Enter your name"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Label htmlFor="number" className="text-foreground">Phone Number</Label>
              <Input
                id="number"
                type="tel"
                value={formData.number}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
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
              <Label htmlFor="address" className="text-foreground">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-2 bg-secondary/50 border-border/50 focus:border-primary"
                placeholder="Enter your address"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Label className="text-foreground mb-3 block">Select Package</Label>
              <RadioGroup
                value={formData.package}
                onValueChange={(value) => setFormData({ ...formData, package: value })}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="package-499"
                  className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.package === '499'
                      ? 'border-primary bg-primary/10 shadow-glow'
                      : 'border-border/50 bg-secondary/30 hover:border-border'
                  }`}
                >
                  <RadioGroupItem value="499" id="package-499" className="sr-only" />
                  <div className="text-center">
                    <span className="text-2xl font-bold block">₹499</span>
                    <span className="text-sm text-muted-foreground">Premium</span>
                  </div>
                </Label>
                <Label
                  htmlFor="package-999"
                  className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.package === '999'
                      ? 'border-primary bg-primary/10 shadow-glow'
                      : 'border-border/50 bg-secondary/30 hover:border-border'
                  }`}
                >
                  <RadioGroupItem value="999" id="package-999" className="sr-only" />
                  <div className="text-center">
                    <span className="text-2xl font-bold block">₹999</span>
                    <span className="text-sm text-muted-foreground">Standard</span>
                  </div>
                </Label>
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
                onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="payment-cash"
                  className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.paymentMode === 'cash'
                      ? 'border-primary bg-primary/10 shadow-glow'
                      : 'border-border/50 bg-secondary/30 hover:border-border'
                  }`}
                >
                  <RadioGroupItem value="cash" id="payment-cash" className="sr-only" />
                  <span className="font-semibold">Cash</span>
                </Label>
                <Label
                  htmlFor="payment-online"
                  className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.paymentMode === 'online'
                      ? 'border-primary bg-primary/10 shadow-glow'
                      : 'border-border/50 bg-secondary/30 hover:border-border'
                  }`}
                >
                  <RadioGroupItem value="online" id="payment-online" className="sr-only" />
                  <span className="font-semibold">Online</span>
                </Label>
              </RadioGroup>
            </motion.div>

            {formData.paymentMode === 'online' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <Label className="text-foreground mb-3 block">Scan to Pay</Label>
                  <div className="bg-white p-4 rounded-lg max-w-sm mx-auto">
                    <img 
                      src={upiQrCode} 
                      alt="UPI Payment QR Code" 
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-foreground mb-2 block">Upload Payment Screenshot</Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="screenshot"
                    />
                    <Label
                      htmlFor="screenshot"
                      className="flex items-center justify-center p-6 border-2 border-dashed border-border/50 rounded-lg cursor-pointer hover:border-primary transition-all bg-secondary/30"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {formData.screenshot ? formData.screenshot.name : 'Upload Payment Screenshot'}
                        </span>
                      </div>
                    </Label>
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
                {isLoading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </motion.div>
          </form>
        )}
      </Card>
    </motion.div>
  );
};

export default BookingForm;
