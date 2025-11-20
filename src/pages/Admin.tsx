import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllBookings, togglePaidStatus as apiTogglePaidStatus, Booking } from '@/api/bookings';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Wait for auth state to be initialized before redirecting
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate('/admin-login');
      return;
    }
    loadBookings();
  }, [isAuthenticated, authLoading, navigate]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await getAllBookings();
      setBookings(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePaidStatus = async (id: string) => {
    try {
      const updatedBooking = await apiTogglePaidStatus(id);
      setBookings(bookings.map(booking =>
        booking._id === id ? updatedBooking : booking
      ));
      toast({
        title: "Success",
        description: "Payment status updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const exportData = () => {
    const dataStr = JSON.stringify(bookings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `car-kumbh-bookings-${Date.now()}.json`;
    link.click();
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Total Bookings: {bookings.length}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportData} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4">
          {isLoading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading bookings...</p>
            </Card>
          ) : bookings.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No bookings yet</p>
            </Card>
          ) : (
            bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:border-primary transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Token</p>
                      <p className="font-bold text-primary text-lg">{booking.token}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Name</p>
                      <p className="font-semibold text-foreground">{booking.name}</p>
                      <p className="text-sm text-muted-foreground">{booking.number}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Package</p>
                      <Badge variant="secondary" className="mb-2">
                        ₹{booking.package}
                      </Badge>
                      <p className="text-sm text-muted-foreground capitalize">
                        {booking.paymentMode} Payment
                      </p>
                      {booking.screenshotUrl && (
                        <a
                          href={booking.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline mt-1 block"
                        >
                          View Screenshot
                        </a>
                      )}
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={booking.isPaid}
                            onCheckedChange={() => togglePaidStatus(booking._id)}
                          />
                          <span className={`text-sm font-medium ${booking.isPaid ? 'text-green-500' : 'text-orange-500'}`}>
                            {booking.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(booking.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Address</p>
                    <p className="text-sm text-foreground">{booking.address}</p>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
