import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Download,
  LogOut,
  Search,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  Trophy,
  Save,
  Settings,
  ChevronDown,
  ChevronUp,
  Image,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllBookings, togglePaidStatus as apiTogglePaidStatus, Booking } from '@/api/bookings';
import { 
  getBanner, 
  updateBanner, 
  getWorkshopBanner, 
  updateWorkshopBanner,
  getWorkshopContent,
  updateWorkshopContent,
  WorkshopContent 
} from '@/api/siteConfig';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Admin = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentBanner, setCurrentBanner] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Workshop banner state
  const [workshopBanner, setWorkshopBanner] = useState<string | null>(null);
  const [isUploadingWorkshop, setIsUploadingWorkshop] = useState(false);
  const [workshopContent, setWorkshopContent] = useState<WorkshopContent>({
    title: '7-Day Gen AI & Vibe Coding Workshop',
    subtitle: 'Master the future of coding with AI. Learn, Build, and Win!',
    prizeAmount: '50000',
    isFree: true,
    whatsappGroupLink: 'https://chat.whatsapp.com/Eu63xdXtVaj8sFBCyLDfZa',
  });
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [showWebsiteSettings, setShowWebsiteSettings] = useState(false);
  
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate('/admin-login');
      return;
    }
    loadBookings();
    loadBanner();
    loadWorkshopBanner();
    loadWorkshopContent();
  }, [isAuthenticated, authLoading, navigate]);

  const loadBanner = async () => {
    try {
      const data = await getBanner();
      setCurrentBanner(data.bannerUrl);
    } catch (error) {
      console.error("Failed to load banner", error);
    }
  };

  const handleBannerUpload = async (file: File) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      setIsUploading(true);
      const data = await updateBanner(file, token);
      setCurrentBanner(data.bannerUrl);
      toast({
        title: "Success",
        description: "Banner updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update banner",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Workshop Banner Functions
  const loadWorkshopBanner = async () => {
    try {
      const data = await getWorkshopBanner();
      setWorkshopBanner(data.bannerUrl);
    } catch (error) {
      console.error("Failed to load workshop banner", error);
    }
  };

  const handleWorkshopBannerUpload = async (file: File) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      setIsUploadingWorkshop(true);
      const data = await updateWorkshopBanner(file, token);
      setWorkshopBanner(data.bannerUrl);
      toast({
        title: "Success",
        description: "Workshop banner updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update workshop banner",
        variant: "destructive",
      });
    } finally {
      setIsUploadingWorkshop(false);
    }
  };

  const loadWorkshopContent = async () => {
    try {
      const data = await getWorkshopContent();
      setWorkshopContent(data);
    } catch (error) {
      console.error("Failed to load workshop content", error);
    }
  };

  const handleSaveWorkshopContent = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      setIsSavingContent(true);
      await updateWorkshopContent(workshopContent, token);
      toast({
        title: "Success",
        description: "Workshop content saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save workshop content",
        variant: "destructive",
      });
    } finally {
      setIsSavingContent(false);
    }
  };

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

  // Filtered bookings based on search and filters
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        booking.name.toLowerCase().includes(searchLower) ||
        booking.token.toLowerCase().includes(searchLower) ||
        booking.number.includes(searchQuery) ||
        booking.address.toLowerCase().includes(searchLower);

      // Payment mode filter
      const matchesPayment =
        paymentFilter === 'all' || booking.paymentMode === paymentFilter;

      // Package filter
      const matchesPackage =
        packageFilter === 'all' || booking.package === packageFilter;

      // Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'paid' && booking.isPaid) ||
        (statusFilter === 'pending' && !booking.isPaid);

      return matchesSearch && matchesPayment && matchesPackage && matchesStatus;
    });
  }, [bookings, searchQuery, paymentFilter, packageFilter, statusFilter]);

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

  const exportCSV = () => {
    const headers = ['Token', 'Name', 'Phone', 'Address', 'Package', 'Payment Mode', 'Status', 'Date'];
    const csvData = filteredBookings.map((b) => [
      b.token,
      b.name,
      b.number,
      `"${b.address.replace(/"/g, '""')}"`,
      `₹${b.package}`,
      b.paymentMode,
      b.isPaid ? 'Paid' : 'Pending',
      new Date(b.createdAt).toLocaleString(),
    ]);

    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `car-kumbh-bookings-${Date.now()}.csv`;
    link.click();

    toast({
      title: "Exported",
      description: `${filteredBookings.length} bookings exported as CSV`,
    });
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text('Car Kumbh - Bookings Report', 14, 22);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Bookings: ${filteredBookings.length}`, 14, 36);

    // Table data
    const tableData = filteredBookings.map((b) => [
      b.token,
      b.name,
      b.number,
      `₹${b.package}`,
      b.paymentMode,
      b.isPaid ? 'Paid' : 'Pending',
      new Date(b.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [['Token', 'Name', 'Phone', 'Package', 'Mode', 'Status', 'Date']],
      body: tableData,
      startY: 42,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [249, 115, 22] },
    });

    doc.save(`car-kumbh-bookings-${Date.now()}.pdf`);

    toast({
      title: "Exported",
      description: `${filteredBookings.length} bookings exported as PDF`,
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPaymentFilter('all');
    setPackageFilter('all');
    setStatusFilter('all');
  };

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

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Total Bookings: {bookings.length}
              {filteredBookings.length !== bookings.length && (
                <span className="ml-2 text-primary">
                  (Showing: {filteredBookings.length})
                </span>
              )}
            </p>
          </div>

          {/* Action Buttons - Stacked */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={exportCSV} variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={exportPDF} variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">Search & Filters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search Input */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, token, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Payment Mode Filter */}
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>

              {/* Package Filter */}
              <Select value={packageFilter} onValueChange={setPackageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Packages</SelectItem>
                  <SelectItem value="499">₹499</SelectItem>
                  <SelectItem value="999">₹999</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || paymentFilter !== 'all' || packageFilter !== 'all' || statusFilter !== 'all') && (
              <div className="mt-4">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Website Settings Toggle Button */}
        <Card className="p-4 mb-4">
          <button
            onClick={() => setShowWebsiteSettings(!showWebsiteSettings)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Website Settings</h2>
                <p className="text-sm text-muted-foreground">Manage banners and workshop content</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{showWebsiteSettings ? 'Expanded' : 'Collapsed'}</Badge>
              {showWebsiteSettings ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </button>
        </Card>

        {/* Website Settings Content - Collapsible */}
        {showWebsiteSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 mb-8"
          >
            {/* Banner Management */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Image className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Website Banner</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium mb-2">Upload New Banner</label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleBannerUpload(file);
                      }}
                      disabled={isUploading}
                    />
                    {isUploading && <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended size: 1920x1080px. Max size: 5MB.
                  </p>
                </div>
                {currentBanner && (
                  <div className="w-full md:w-1/2">
                    <p className="text-sm font-medium mb-2">Current Banner</p>
                    <img
                      src={currentBanner}
                      alt="Current Banner"
                      className="w-full h-48 object-cover rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Workshop Banner Management */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Workshop Page Settings</h2>
              </div>
              
              {/* Workshop Banner Upload */}
              <div className="mb-6 pb-6 border-b border-border">
                <h3 className="text-lg font-semibold mb-4">Hero Banner</h3>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium mb-2">Upload Workshop Banner</label>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleWorkshopBannerUpload(file);
                        }}
                        disabled={isUploadingWorkshop}
                      />
                      {isUploadingWorkshop && <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      This banner appears on the certification/workshop registration page.
                    </p>
                  </div>
                  {workshopBanner && (
                    <div className="w-full md:w-1/2">
                      <p className="text-sm font-medium mb-2">Current Workshop Banner</p>
                      <img
                        src={workshopBanner}
                        alt="Workshop Banner"
                        className="w-full h-48 object-cover rounded-lg border border-border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Workshop Content */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Workshop Content</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Workshop Title</label>
                    <Input
                      value={workshopContent.title}
                      onChange={(e) => setWorkshopContent({...workshopContent, title: e.target.value})}
                      placeholder="7-Day Gen AI & Vibe Coding Workshop"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Prize Amount (₹)</label>
                    <Input
                      value={workshopContent.prizeAmount}
                      onChange={(e) => setWorkshopContent({...workshopContent, prizeAmount: e.target.value})}
                      placeholder="50000"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <Textarea
                    value={workshopContent.subtitle}
                    onChange={(e) => setWorkshopContent({...workshopContent, subtitle: e.target.value})}
                    placeholder="Master the future of coding with AI..."
                    rows={2}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">WhatsApp Group Link</label>
                  <Input
                    value={workshopContent.whatsappGroupLink}
                    onChange={(e) => setWorkshopContent({...workshopContent, whatsappGroupLink: e.target.value})}
                    placeholder="https://chat.whatsapp.com/..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={workshopContent.isFree}
                      onCheckedChange={(checked) => setWorkshopContent({...workshopContent, isFree: checked})}
                    />
                    <span className="text-sm font-medium">Workshop is FREE</span>
                  </div>
                  
                  <Button onClick={handleSaveWorkshopContent} disabled={isSavingContent}>
                    {isSavingContent ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Saving...</>
                    ) : (
                      <><Save className="h-4 w-4 mr-2" /> Save Content</>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Bookings List */}
        <div className="grid gap-4">
          {isLoading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading bookings...</p>
            </Card>
          ) : filteredBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {bookings.length === 0 ? 'No bookings yet' : 'No bookings match your filters'}
              </p>
            </Card>
          ) : (
            filteredBookings.map((booking, index) => (
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
