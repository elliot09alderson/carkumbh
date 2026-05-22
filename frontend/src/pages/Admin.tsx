import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  LayoutDashboard,
  Users,
  Plus,
  Trash2,
  Menu,
  X,
  QrCode,
  Loader2,
  ScanLine,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllBookings, togglePaidStatus as apiTogglePaidStatus, Booking, deleteAllBookings as apiDeleteAllBookings, deleteBookingsByPackage as apiDeleteBookingsByPackage, deleteBooking as apiDeleteBooking, bulkCreateBookings, getBulkBookings, deleteBulkBookings } from '@/api/bookings';
import { getAllStudents, Student } from '@/api/students';
import {
  getBanner,
  updateBanner,
  getWorkshopBanner,
  updateWorkshopBanner,
  getWorkshopContent,
  updateWorkshopContent,
  getEventPackages,
  updateEventPackages,
  getAdSlides,
  addAdSlide,
  deleteAdSlide,
  updateAdSlide,
  getEventContent,
  updateEventContent,
  WorkshopContent,
  EventPackage,
  AdSlide,
} from '@/api/siteConfig';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import TicketScanner from '@/components/TicketScanner';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'site-settings' | 'students' | 'packages' | 'bulk-qr' | 'ad-banners' | 'ticket-scanner'>('dashboard');

  // Bulk QR state
  const [bulkQrCount, setBulkQrCount] = useState<string>('10');
  const [bulkQrTickets, setBulkQrTickets] = useState<{ id: string; token: string; package: string; qrUrl: string }[]>([]);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [selectedBulkIds, setSelectedBulkIds] = useState<Set<string>>(new Set());
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  // Ad Banners state
  const [adSlides, setAdSlides] = useState<AdSlide[]>([]);
  const [isAdSlidesLoading, setIsAdSlidesLoading] = useState(false);
  const [newSlideImageUrl, setNewSlideImageUrl] = useState('');
  const [newSlideNavUrl, setNewSlideNavUrl] = useState('/');
  const [newSlideFile, setNewSlideFile] = useState<File | null>(null);
  const [newSlidePreview, setNewSlidePreview] = useState<string>('');
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [editNavUrls, setEditNavUrls] = useState<Record<string, string>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Booking filters
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Student filters
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [qualificationFilter, setQualificationFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');

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
  const [eventPackages, setEventPackages] = useState<EventPackage[]>([]);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [isSavingPackages, setIsSavingPackages] = useState(false);

  // Event page content state
  const [eventPageTitle, setEventPageTitle] = useState('Upcoming Event');
  const [eventPageDescription, setEventPageDescription] = useState('');
  const [isSavingEventContent, setIsSavingEventContent] = useState(false);
  
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
    loadStudents();
    loadBanner();
    loadWorkshopBanner();
    loadWorkshopContent();
    loadEventPackages();
    loadAdSlides();
    loadEventPageContent();
    loadBulkTickets();
  }, [isAuthenticated, authLoading, navigate]);

  const loadEventPackages = async () => {
    try {
      const data = await getEventPackages();
      setEventPackages(data);
    } catch (error) {
      console.error("Failed to load event packages", error);
    }
  };

  const handleSaveEventPackages = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      setIsSavingPackages(true);
      await updateEventPackages(eventPackages, token);
      toast({
        title: "Success",
        description: "Event packages updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update packages",
        variant: "destructive",
      });
    } finally {
      setIsSavingPackages(false);
    }
  };

  const loadStudents = async () => {
    try {
      setIsStudentsLoading(true);
      const data = await getAllStudents();
      setStudents(data);
    } catch (error: any) {
      console.error("Failed to load students", error);
    } finally {
      setIsStudentsLoading(false);
    }
  };

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

  // Filtered students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchLower = studentSearchQuery.toLowerCase();
      const matchesSearch = 
        !studentSearchQuery ||
        student.studentName.toLowerCase().includes(searchLower) ||
        student.whatsappNumber.includes(studentSearchQuery);
      
      const matchesQualification =
        qualificationFilter === 'all' || student.highestQualification === qualificationFilter;
      
      const matchesIndustry =
        industryFilter === 'all' || student.workingInIT === industryFilter;
      
      return matchesSearch && matchesQualification && matchesIndustry;
    });
  }, [students, studentSearchQuery, qualificationFilter, industryFilter]);

  const exportStudentsCSV = () => {
    const headers = ['Name', 'WhatsApp Number', 'Qualification', 'In IT Industry', 'Registered At'];
    const csvData = filteredStudents.map((s) => [
      s.studentName,
      s.whatsappNumber,
      s.highestQualification,
      s.workingInIT === 'yes' ? 'Yes' : 'No',
      new Date(s.createdAt).toLocaleString(),
    ]);

    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registered-students-${Date.now()}.csv`;
    link.click();

    toast({
      title: "Exported",
      description: `${filteredStudents.length} students exported as CSV`,
    });
  };

  const exportStudentsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Registered Students Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Students: ${filteredStudents.length}`, 14, 36);

    const tableData = filteredStudents.map((s) => [
      s.studentName,
      s.whatsappNumber,
      s.highestQualification,
      s.workingInIT === 'yes' ? 'Yes' : 'No',
      new Date(s.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [['Name', 'WhatsApp', 'Qualification', 'In IT', 'Date']],
      body: tableData,
      startY: 42,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [147, 51, 234] }, // Purple color for students
    });

    doc.save(`registered-students-${Date.now()}.pdf`);

    toast({
      title: "Exported",
      description: `${filteredStudents.length} students exported as PDF`,
    });
  };

  const clearStudentFilters = () => {
    setStudentSearchQuery('');
    setQualificationFilter('all');
    setIndustryFilter('all');
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

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await apiDeleteBooking(id);
      setBookings(bookings.filter(b => b._id !== id));
      toast({
        title: "Success",
        description: "Booking deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAllBookings = async () => {
    if (!window.confirm(`Are you sure you want to delete ALL ${bookings.length} bookings? This action cannot be undone!`)) return;
    if (!window.confirm('This is your final warning. ALL bookings will be permanently deleted. Continue?')) return;
    
    try {
      const result = await apiDeleteAllBookings();
      setBookings([]);
      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete bookings",
        variant: "destructive",
      });
    }
  };

  const handleDeleteByPackage = async () => {
    if (packageFilter === 'all') {
      toast({
        title: "Select a Package",
        description: "Please select a specific package to delete",
        variant: "destructive",
      });
      return;
    }
    
    const count = filteredBookings.length;
    if (!window.confirm(`Are you sure you want to delete ${count} bookings with package ₹${packageFilter}?`)) return;
    
    try {
      const result = await apiDeleteBookingsByPackage(packageFilter);
      setBookings(bookings.filter(b => b.package !== packageFilter));
      setPackageFilter('all');
      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete bookings",
        variant: "destructive",
      });
    }
  };

  // Combine configured packages with packages from existing bookings for the filter
  const allPackagesForFilter = useMemo(() => {
    // Get configured package prices
    const configuredPrices = eventPackages.map(pkg => pkg.price);
    // Get unique prices from existing bookings
    const bookingPrices = [...new Set(bookings.map(b => b.package))];
    // Combine and deduplicate
    const allPrices = [...new Set([...configuredPrices, ...bookingPrices])];
    // Sort by price
    return allPrices.sort((a, b) => parseInt(a) - parseInt(b));
  }, [eventPackages, bookings]);


  const loadEventPageContent = async () => {
    try {
      const data = await getEventContent();
      setEventPageTitle(data.title || '');
      setEventPageDescription(data.description || '');
    } catch (e) {
      console.error('Failed to load event content', e);
    }
  };

  const handleSaveEventPageContent = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    setIsSavingEventContent(true);
    try {
      await updateEventContent({ title: eventPageTitle, description: eventPageDescription, razorpayName: 'Toran Sir' }, token);
      toast({ title: 'Saved', description: 'Event page content updated' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.response?.data?.message || 'Failed to save', variant: 'destructive' });
    } finally {
      setIsSavingEventContent(false);
    }
  };

  const loadAdSlides = async () => {
    setIsAdSlidesLoading(true);
    try {
      const data = await getAdSlides();
      setAdSlides(data);
      const navMap: Record<string, string> = {};
      data.forEach((s) => { navMap[s.id] = s.navigationUrl; });
      setEditNavUrls(navMap);
    } catch (e) {
      console.error('Failed to load ad slides', e);
    } finally {
      setIsAdSlidesLoading(false);
    }
  };

  const handleAddSlide = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    if (!newSlideFile && !newSlideImageUrl) {
      toast({ title: 'Error', description: 'Provide an image file or URL', variant: 'destructive' });
      return;
    }
    setIsAddingSlide(true);
    try {
      await addAdSlide({ image: newSlideFile || undefined, imageUrl: newSlideImageUrl || undefined, navigationUrl: newSlideNavUrl }, token);
      toast({ title: 'Success', description: 'Slide added' });
      setNewSlideImageUrl('');
      setNewSlideNavUrl('/');
      setNewSlideFile(null);
      setNewSlidePreview('');
      await loadAdSlides();
    } catch (e: any) {
      toast({ title: 'Error', description: e.response?.data?.message || 'Failed to add slide', variant: 'destructive' });
    } finally {
      setIsAddingSlide(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      await deleteAdSlide(id, token);
      toast({ title: 'Deleted', description: 'Slide removed' });
      await loadAdSlides();
    } catch (e: any) {
      toast({ title: 'Error', description: 'Failed to delete slide', variant: 'destructive' });
    }
  };

  const handleUpdateSlideNav = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      await updateAdSlide(id, { navigationUrl: editNavUrls[id] }, token);
      toast({ title: 'Saved', description: 'Navigation URL updated' });
      await loadAdSlides();
    } catch (e: any) {
      toast({ title: 'Error', description: 'Failed to update slide', variant: 'destructive' });
    }
  };

  const drawTicketCanvas = (token: string, qrDataUrl: string, packageName: string = ''): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const W = 600, H = 820;
      canvas.width = W;
      canvas.height = H;

      ctx.fillStyle = '#0f0f0f';
      ctx.fillRect(0, 0, W, H);

      const grad = ctx.createLinearGradient(0, 0, W, 160);
      grad.addColorStop(0, '#f97316');
      grad.addColorStop(1, '#ea580c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, 160);

      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = 'bold 22px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('EVENT TICKET', W / 2, 52);
      ctx.font = '13px Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('toransir.com', W / 2, 76);

      if (packageName) {
        const label = packageName.toUpperCase();
        ctx.font = 'bold 13px Arial';
        const tw = ctx.measureText(label).width;
        const bw = tw + 28, bh = 26, bx = W / 2 - bw / 2, by = 96;
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        (ctx as any).roundRect(bx, by, bw, bh, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        (ctx as any).roundRect(bx, by, bw, bh, 6);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, W / 2, by + 17);
      }

      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(30, 178);
      ctx.lineTo(W - 30, 178);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TOKEN', W / 2, 210);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 52px monospace';
      ctx.fillText(token, W / 2, 270);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '13px Arial';
      ctx.fillText('Scan the QR code at the event entrance', W / 2, 310);

      const qrImg = new window.Image();
      qrImg.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        (ctx as any).roundRect(W / 2 - 150, 335, 300, 300, 16);
        ctx.fill();
        ctx.drawImage(qrImg, W / 2 - 140, 345, 280, 280);

        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('This ticket is non-transferable. Valid for one-time entry only.', W / 2, 670);

        ctx.fillStyle = '#1f1f1f';
        ctx.fillRect(0, H - 80, W, 80);
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.fillText('Generated on ' + new Date().toLocaleDateString('en-IN'), W / 2, H - 30);

        resolve(canvas.toDataURL('image/png'));
      };
      qrImg.src = qrDataUrl;
    });
  };

  const loadBulkTickets = async () => {
    setIsBulkLoading(true);
    try {
      const bookings = await getBulkBookings();
      const tickets = await Promise.all(
        bookings.map(async (b) => {
          const qrUrl = await QRCode.toDataURL(b.token, {
            width: 200, margin: 2,
            color: { dark: '#000000', light: '#ffffff' },
            errorCorrectionLevel: 'H',
          });
          return { id: b._id, token: b.token, package: b.package, qrUrl };
        })
      );
      setBulkQrTickets(tickets);
    } catch (e) {
      console.error('Failed to load bulk tickets', e);
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleBulkGenerate = async () => {
    const count = parseInt(bulkQrCount);
    if (!count || count < 1 || count > 500) return;
    setIsBulkGenerating(true);
    try {
      const { tokens } = await bulkCreateBookings(count, 'Bulk Ticket', 'General');
      toast({ title: 'Success', description: `${tokens.length} tickets created` });
      await loadBulkTickets();
    } catch (e: any) {
      toast({ title: 'Error', description: e.response?.data?.message || 'Failed to generate tickets', variant: 'destructive' });
    } finally {
      setIsBulkGenerating(false);
    }
  };

  const toggleSelectBulk = (id: string) => {
    setSelectedBulkIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedBulkIds.size === bulkQrTickets.length) {
      setSelectedBulkIds(new Set());
    } else {
      setSelectedBulkIds(new Set(bulkQrTickets.map((t) => t.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBulkIds.size === 0) return;
    setIsDeletingBulk(true);
    try {
      await deleteBulkBookings(Array.from(selectedBulkIds));
      toast({ title: 'Deleted', description: `${selectedBulkIds.size} ticket(s) deleted` });
      setSelectedBulkIds(new Set());
      await loadBulkTickets();
    } catch (e: any) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const handleDeleteAllBulk = async () => {
    setIsDeletingBulk(true);
    try {
      const result = await deleteBulkBookings();
      toast({ title: 'Deleted', description: result.message });
      setBulkQrTickets([]);
      setSelectedBulkIds(new Set());
    } catch (e: any) {
      toast({ title: 'Error', description: 'Failed to delete all', variant: 'destructive' });
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const downloadBookingTicket = async (booking: Booking) => {
    const qrUrl = await QRCode.toDataURL(booking.token, {
      width: 300, margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    });
    const pkg = eventPackages.find(p => p.price === booking.package);
    const packageLabel = pkg ? `${pkg.name} — ₹${booking.package}` : `₹${booking.package}`;
    const dataUrl = await drawTicketCanvas(booking.token, qrUrl, packageLabel);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && navigator.share) {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `ticket-${booking.token}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Ticket — ${booking.token}` });
        return;
      }
    }
    const link = document.createElement('a');
    link.download = `ticket-${booking.token}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleBulkDownload = async () => {
    if (bulkQrTickets.length === 0) return;
    setIsBulkDownloading(true);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // On mobile share individual PNGs via the native share sheet (ZIP is unsupported on iOS)
    if (isMobile && navigator.share) {
      const files: File[] = [];
      for (const ticket of bulkQrTickets) {
        const dataUrl = await drawTicketCanvas(ticket.token, ticket.qrUrl, ticket.package);
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        files.push(new File([blob], `ticket-${ticket.token}.png`, { type: 'image/png' }));
      }
      try {
        if (navigator.canShare?.({ files })) {
          await navigator.share({ files, title: `Event Tickets (${files.length})` });
        } else {
          // Share one at a time if batch share isn't supported
          for (const file of files) {
            await navigator.share({ files: [file], title: file.name });
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast({ title: 'Download unavailable', description: 'Please use a desktop browser to download tickets as a ZIP.', variant: 'destructive' });
        }
      }
      setIsBulkDownloading(false);
      return;
    }

    const zip = new JSZip();
    for (const ticket of bulkQrTickets) {
      const dataUrl = await drawTicketCanvas(ticket.token, ticket.qrUrl, ticket.package);
      const base64 = dataUrl.split(',')[1];
      zip.file(`ticket-${ticket.token}.png`, base64, { base64: true });
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tickets-${bulkQrTickets.length}-${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
    setIsBulkDownloading(false);
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
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Admin</h1>
        </div>
        <Button onClick={handleLogout} variant="ghost" size="sm">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap className="h-8 w-8" />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold font-heading line-height-tight">Admin Panel</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Car Kumbh</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-1.5 flex-grow">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'site-settings', icon: Settings, label: 'Site Settings' },
              { id: 'students', icon: Users, label: 'Registered Students' },
              { id: 'packages', icon: Trophy, label: 'Manage Packages' },
              { id: 'ad-banners', icon: Image, label: 'Ad Banners' },
              { id: 'ticket-scanner', icon: ScanLine, label: 'Ticket Scanner' },
              { id: 'bulk-qr', icon: QrCode, label: 'Bulk QR Tickets' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
                  activeTab === item.id 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-border space-y-2">
            <Link to="/" onClick={() => setIsSidebarOpen(false)}>
              <Button variant="outline" className="w-full justify-start gap-2 border-primary/20 hover:bg-primary/5 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl">
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 relative z-10 overflow-y-auto max-h-screen">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Booking Dashboard</h2>
                  <p className="text-muted-foreground">
                    Showing {filteredBookings.length} of {bookings.length} bookings
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={exportCSV} variant="outline" className="bg-card">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                  <Button onClick={exportPDF} variant="outline" className="bg-card">
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button 
                    onClick={handleDeleteByPackage} 
                    variant="outline" 
                    className="bg-card border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                    disabled={packageFilter === 'all'}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete by Package
                  </Button>
                  <Button 
                    onClick={handleDeleteAllBookings} 
                    variant="destructive" 
                    disabled={bookings.length === 0}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete All
                  </Button>
                </div>
              </div>

              {/* Booking Filters */}
              <Card className="p-4 mb-8 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative col-span-1 md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bookings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={packageFilter} onValueChange={setPackageFilter}>
                    <SelectTrigger><SelectValue placeholder="Package" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Packages</SelectItem>
                      {allPackagesForFilter.map((price) => (
                        <SelectItem key={price} value={price}>₹{price}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger><SelectValue placeholder="Mode" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modes</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(searchQuery || packageFilter !== 'all' || paymentFilter !== 'all' || statusFilter !== 'all') && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      <Filter className="inline h-4 w-4 mr-1" />
                      Filters active
                    </p>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </Card>

              {/* Bookings List */}
              <div className="grid gap-4">
                {isLoading ? (
                  <Card className="p-12 text-center bg-card/50"><p className="animate-pulse">Loading bookings...</p></Card>
                ) : filteredBookings.length === 0 ? (
                  <Card className="p-12 text-center bg-card/50"><p className="text-muted-foreground">No bookings found</p></Card>
                ) : (
                  filteredBookings.map((booking) => (
                    <Card key={booking._id} className="p-6 hover:border-primary/50 transition-all bg-card/50">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div>
                          <p className="text-xs font-bold text-primary uppercase mb-1">Token</p>
                          <p className="text-xl font-black">{booking.token}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Customer</p>
                          <p className="font-bold">{booking.name}</p>
                          <p className="text-sm text-muted-foreground">{booking.number}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Package</p>
                          <Badge variant="secondary" className="mb-1">₹{booking.package}</Badge>
                          <p className="text-xs capitalize">{booking.paymentMode} Payment</p>
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="flex items-center gap-3">
                            <Switch checked={booking.isPaid} onCheckedChange={() => togglePaidStatus(booking._id)} />
                            <span className={`text-sm font-bold ${booking.isPaid ? 'text-green-500' : 'text-orange-500'}`}>
                              {booking.isPaid ? 'PAID' : 'PENDING'}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-2">
                            {new Date(booking.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary hover:text-primary hover:bg-primary/10"
                            title="Download Ticket"
                            onClick={() => downloadBookingTicket(booking)}
                          >
                            <Download className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteBooking(booking._id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                        <p className="text-sm text-muted-foreground italic truncate mr-4">{booking.address}</p>
                        {booking.screenshotUrl && (
                          <a href={booking.screenshotUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline shrink-0">
                            VIEW SCREENSHOT →
                          </a>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'site-settings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold">Site Settings</h2>
                <p className="text-muted-foreground">Manage global banners and workshop content</p>
              </div>

              {/* Website Banner */}
              <Card className="p-8 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-primary/10 rounded-lg"><Image className="h-6 w-6 text-primary" /></div>
                  <h3 className="text-xl font-bold">Main Banner</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold">Upload New Banner</label>
                    <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleBannerUpload(e.target.files[0])} disabled={isUploading} />
                    {isUploading && <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden"><div className="h-full bg-primary animate-progress w-full" /></div>}
                  </div>
                  {currentBanner && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Current Active Banner</p>
                      <img src={currentBanner} alt="Banner" className="w-full h-40 object-cover rounded-xl border border-border" />
                    </div>
                  )}
                </div>
              </Card>

              {/* Event Page Content */}
              <Card className="p-8 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg"><Settings className="h-6 w-6 text-primary" /></div>
                  <div>
                    <h3 className="text-xl font-bold">Event Page Content</h3>
                    <p className="text-sm text-muted-foreground">Edit the title and description shown on the booking page</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Page Title</label>
                    <Input
                      value={eventPageTitle}
                      onChange={(e) => setEventPageTitle(e.target.value)}
                      placeholder="e.g. Secure Your Entry"
                      className="bg-card/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Description</label>
                    <Textarea
                      value={eventPageDescription}
                      onChange={(e) => setEventPageDescription(e.target.value)}
                      placeholder="e.g. Join us for an exclusive session..."
                      rows={3}
                      className="bg-card/50 resize-none"
                    />
                  </div>
                  <Button onClick={handleSaveEventPageContent} disabled={isSavingEventContent} className="gap-2">
                    {isSavingEventContent ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Content</>}
                  </Button>
                </div>
              </Card>

              {/* Workshop Content Management */}
              <Card className="p-8 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-primary/10 rounded-lg"><GraduationCap className="h-6 w-6 text-primary" /></div>
                  <h3 className="text-xl font-bold">Workshop Page Config</h3>
                </div>

                <div className="space-y-8">
                  {/* Workshop Banner */}
                  <div className="grid md:grid-cols-2 gap-8 pb-8 border-b border-border">
                    <div className="space-y-4">
                      <label className="text-sm font-semibold">Workshop Hero Image</label>
                      <Input type="file" onChange={(e) => e.target.files?.[0] && handleWorkshopBannerUpload(e.target.files[0])} disabled={isUploadingWorkshop} />
                    </div>
                    {workshopBanner && (
                      <img src={workshopBanner} alt="Workshop" className="w-full h-40 object-cover rounded-xl border border-border" />
                    )}
                  </div>

                  {/* Workshop Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Workshop Title</label>
                      <Input value={workshopContent.title} onChange={(e) => setWorkshopContent({...workshopContent, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Prize Amount (₹)</label>
                      <Input value={workshopContent.prizeAmount} onChange={(e) => setWorkshopContent({...workshopContent, prizeAmount: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold">Subtitle / Description</label>
                      <Textarea value={workshopContent.subtitle} onChange={(e) => setWorkshopContent({...workshopContent, subtitle: e.target.value})} rows={3} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold">WhatsApp Group Link</label>
                      <Input value={workshopContent.whatsappGroupLink} onChange={(e) => setWorkshopContent({...workshopContent, whatsappGroupLink: e.target.value})} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-3">
                      <Switch checked={workshopContent.isFree} onCheckedChange={(checked) => setWorkshopContent({...workshopContent, isFree: checked})} />
                      <span className="font-bold text-sm">Workshop is FREE</span>
                    </div>
                    <Button onClick={handleSaveWorkshopContent} disabled={isSavingContent}>
                      {isSavingContent ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Event Packages Management */}
              <Card className="p-8 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-primary/10 rounded-lg"><Trophy className="h-6 w-6 text-primary" /></div>
                  <h3 className="text-xl font-bold">Upcoming Event Packages</h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {eventPackages.map((pkg, index) => (
                      <div key={pkg.id} className="p-6 rounded-xl border border-border bg-card/50 space-y-4">
                        <div className="flex justify-between items-center bg-primary/10 -mx-6 -mt-6 p-4 rounded-t-xl border-b border-primary/20">
                          <h4 className="font-bold text-primary">Package {index + 1}</h4>
                          <Badge variant="outline" className="border-primary text-primary font-bold">₹{pkg.price}</Badge>
                        </div>
                        
                        <div className="space-y-3 pt-2">
                          <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase">Package Name</label>
                            <Input 
                              value={pkg.name} 
                              onChange={(e) => {
                                const newPkgs = [...eventPackages];
                                newPkgs[index].name = e.target.value;
                                setEventPackages(newPkgs);
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase">Price (₹)</label>
                            <Input 
                              type="number"
                              value={pkg.price} 
                              onChange={(e) => {
                                const newPkgs = [...eventPackages];
                                newPkgs[index].price = e.target.value;
                                setEventPackages(newPkgs);
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase">Online Sessions</label>
                            <Input 
                              type="number"
                              value={pkg.onlineSessions} 
                              onChange={(e) => {
                                const newPkgs = [...eventPackages];
                                newPkgs[index].onlineSessions = e.target.value;
                                setEventPackages(newPkgs);
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase">Live Sessions</label>
                            <Input 
                              type="number"
                              value={pkg.liveSessions} 
                              onChange={(e) => {
                                const newPkgs = [...eventPackages];
                                newPkgs[index].liveSessions = e.target.value;
                                setEventPackages(newPkgs);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button onClick={handleSaveEventPackages} disabled={isSavingPackages} className="bg-primary shadow-lg shadow-primary/20">
                      {isSavingPackages ? (
                        <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Saving...</>
                      ) : (
                        <><Save className="h-4 w-4 mr-2" /> Save All Packages</>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Registered Students</h2>
                  <p className="text-muted-foreground">Gen AI & Vibe Coding Workshop Participants</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={exportStudentsCSV} variant="outline" className="bg-card">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                  <Button onClick={exportStudentsPDF} variant="outline" className="bg-card">
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>

              {/* Student Filters */}
              <Card className="p-4 mb-8 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative col-span-1 md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students by name or phone..."
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={qualificationFilter} onValueChange={setQualificationFilter}>
                    <SelectTrigger><SelectValue placeholder="Qualification" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Qualifications</SelectItem>
                      <SelectItem value="10th Pass">10th Pass</SelectItem>
                      <SelectItem value="12th Pass">12th Pass</SelectItem>
                      <SelectItem value="Diploma">Diploma</SelectItem>
                      <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                      <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger><SelectValue placeholder="In IT?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Status</SelectItem>
                      <SelectItem value="yes">Working in IT</SelectItem>
                      <SelectItem value="no">Not in IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Students List */}
              <div className="grid gap-4">
                {isStudentsLoading ? (
                  <Card className="p-12 text-center bg-card/50"><p className="animate-pulse">Loading students...</p></Card>
                ) : filteredStudents.length === 0 ? (
                  <Card className="p-12 text-center bg-card/50"><p className="text-muted-foreground">No students found</p></Card>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border bg-card/30">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-card/50">
                        <tr>
                          <th className="p-4 text-xs font-bold text-muted-foreground uppercase border-b border-border">Name</th>
                          <th className="p-4 text-xs font-bold text-muted-foreground uppercase border-b border-border">WhatsApp</th>
                          <th className="p-4 text-xs font-bold text-muted-foreground uppercase border-b border-border">Qualification</th>
                          <th className="p-4 text-xs font-bold text-muted-foreground uppercase border-b border-border">Working in IT</th>
                          <th className="p-4 text-xs font-bold text-muted-foreground uppercase border-b border-border">Registered Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student) => (
                          <tr key={student._id} className="hover:bg-primary/5 transition-colors border-b border-border last:border-0 text-sm">
                            <td className="p-4 font-bold">{student.studentName}</td>
                            <td className="p-4 font-medium">{student.whatsappNumber}</td>
                            <td className="p-4">{student.highestQualification}</td>
                            <td className="p-4">
                              <Badge variant={student.workingInIT === 'yes' ? 'default' : 'secondary'}>
                                {student.workingInIT === 'yes' ? 'YES' : 'NO'}
                              </Badge>
                            </td>
                            <td className="p-4 text-muted-foreground">
                              {new Date(student.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'packages' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold">Manage Event Packages</h2>
                  <p className="text-muted-foreground">Add or edit registration packages for upcoming events</p>
                </div>
                <div className="flex gap-4">
                  <Button 
                    onClick={() => {
                      const newPkg = {
                        id: Date.now().toString(),
                        name: 'New Package',
                        price: '1000',
                        duration: '1 Month',
                        onlineSessions: '4',
                        liveSessions: '1',
                        whatsappLink: ''
                      };
                      setEventPackages([...eventPackages, newPkg]);
                    }}
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/5"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Package
                  </Button>
                  <Button onClick={handleSaveEventPackages} disabled={isSavingPackages} className="shadow-lg shadow-primary/20">
                    {isSavingPackages ? 'Saving...' : 'Save All Changes'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm space-y-4 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex justify-between items-center bg-primary/10 -mx-6 -mt-6 p-5 rounded-t-2xl border-b border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <h4 className="font-bold text-primary">{pkg.name}</h4>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          const newPkgs = eventPackages.filter((_, i) => i !== index);
                          setEventPackages(newPkgs);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Package Name</label>
                          <Input 
                            value={pkg.name} 
                            placeholder="e.g. VIP"
                            onChange={(e) => {
                              const newPkgs = [...eventPackages];
                              newPkgs[index].name = e.target.value;
                              setEventPackages(newPkgs);
                            }}
                            className="bg-card/50 focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Price (₹)</label>
                          <Input 
                            type="number"
                            value={pkg.price} 
                            placeholder="10000"
                            onChange={(e) => {
                              const newPkgs = [...eventPackages];
                              newPkgs[index].price = e.target.value;
                              setEventPackages(newPkgs);
                            }}
                            className="bg-card/50 focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Duration</label>
                          <Input 
                            value={pkg.duration} 
                            placeholder="e.g. 1 Year"
                            onChange={(e) => {
                              const newPkgs = [...eventPackages];
                              newPkgs[index].duration = e.target.value;
                              setEventPackages(newPkgs);
                            }}
                            className="bg-card/50 focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live Sessions</label>
                          <Input 
                            type="number"
                            value={pkg.liveSessions} 
                            placeholder="1"
                            onChange={(e) => {
                              const newPkgs = [...eventPackages];
                              newPkgs[index].liveSessions = e.target.value;
                              setEventPackages(newPkgs);
                            }}
                            className="bg-card/50 focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Online Classes / Sessions</label>
                        <Input 
                          type="number"
                          value={pkg.onlineSessions} 
                          placeholder="48"
                          onChange={(e) => {
                            const newPkgs = [...eventPackages];
                            newPkgs[index].onlineSessions = e.target.value;
                            setEventPackages(newPkgs);
                          }}
                          className="bg-card/50 focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">WhatsApp Group Link</label>
                        <Input 
                          type="url"
                          value={pkg.whatsappLink || ''} 
                          placeholder="https://chat.whatsapp.com/..."
                          onChange={(e) => {
                            const newPkgs = [...eventPackages];
                            newPkgs[index].whatsappLink = e.target.value;
                            setEventPackages(newPkgs);
                          }}
                          className="bg-card/50 focus:ring-1 focus:ring-primary"
                        />
                        <p className="text-[10px] text-muted-foreground">Users will see "Join WhatsApp Group" after registration</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {eventPackages.length === 0 && (
                  <Card className="col-span-full p-12 text-center bg-card/50 border-dashed border-2">
                    <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No packages defined. Click "Add Package" to get started.</p>
                  </Card>
                )}
              </div>
            </motion.div>
          )}

          {/* Ad Banners */}
          {activeTab === 'ad-banners' && (
            <motion.div
              key="ad-banners"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold">Ad Banners</h2>
                <p className="text-muted-foreground text-sm mt-1">Manage auto-rotating ad slides shown on the homepage. Each slide links to a URL when clicked.</p>
              </div>

              {/* Add new slide */}
              <Card className="p-6 bg-card/60 border-border/50 space-y-4">
                <h3 className="font-semibold text-base">Add New Slide</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setNewSlideFile(f);
                        if (f) {
                          setNewSlidePreview(URL.createObjectURL(f));
                          setNewSlideImageUrl('');
                        }
                      }}
                      className="block w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">Or paste an image URL below</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Image URL (optional)</label>
                    <Input
                      value={newSlideImageUrl}
                      onChange={(e) => { setNewSlideImageUrl(e.target.value); setNewSlideFile(null); setNewSlidePreview(''); }}
                      placeholder="https://example.com/banner.png"
                      className="bg-card/50"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Navigation URL (where it links)</label>
                  <Input
                    value={newSlideNavUrl}
                    onChange={(e) => setNewSlideNavUrl(e.target.value)}
                    placeholder="/upcoming-event or https://..."
                    className="bg-card/50"
                  />
                </div>
                {newSlidePreview && (
                  <img src={newSlidePreview} alt="Preview" className="w-full max-h-40 object-cover rounded-xl border border-border/50" />
                )}
                <Button onClick={handleAddSlide} disabled={isAddingSlide} className="gap-2">
                  {isAddingSlide ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Plus className="h-4 w-4" /> Add Slide</>}
                </Button>
              </Card>

              {/* Current slides */}
              {isAdSlidesLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : adSlides.length === 0 ? (
                <Card className="p-12 text-center bg-card/30 border-dashed border-2">
                  <Image className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No slides yet. Add your first banner above.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{adSlides.length} slide{adSlides.length !== 1 ? 's' : ''} — auto-rotates every 4 seconds on homepage</p>
                  {adSlides.map((slide, index) => (
                    <Card key={slide.id} className="p-4 bg-card/60 border-border/50">
                      <div className="flex gap-4 items-start">
                        <div className="shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-muted border border-border/50">
                          <img src={slide.imageUrl} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-2 min-w-0">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Slide {index + 1}</p>
                          <div className="flex gap-2">
                            <Input
                              value={editNavUrls[slide.id] ?? slide.navigationUrl}
                              onChange={(e) => setEditNavUrls((prev) => ({ ...prev, [slide.id]: e.target.value }))}
                              placeholder="Navigation URL"
                              className="bg-card/50 text-sm h-8"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 shrink-0"
                              onClick={() => handleUpdateSlideNav(slide.id)}
                            >
                              <Save className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{slide.imageUrl}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteSlide(slide.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Ticket Scanner */}
          {activeTab === 'ticket-scanner' && (
            <motion.div
              key="ticket-scanner"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <TicketScanner />
            </motion.div>
          )}

          {/* Bulk QR Tickets */}
          {activeTab === 'bulk-qr' && (
            <motion.div
              key="bulk-qr"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold">Bulk QR Ticket Generator</h2>
                <p className="text-muted-foreground text-sm mt-1">Generate and download multiple event tickets. All tickets are saved to the database and scannable.</p>
              </div>

              {/* Generate + Download controls */}
              <Card className="p-6 bg-card/60 border-border/50">
                <div className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">
                  <div className="flex-1 min-w-[180px] space-y-1.5">
                    <label className="text-sm font-semibold">Number of Tickets</label>
                    <Input
                      type="number"
                      min={1}
                      max={500}
                      value={bulkQrCount}
                      onChange={(e) => setBulkQrCount(e.target.value)}
                      placeholder="e.g. 50"
                      className="bg-card/50 text-lg h-11"
                    />
                    <p className="text-xs text-muted-foreground">Max 500 per batch</p>
                  </div>
                  <Button
                    onClick={handleBulkGenerate}
                    disabled={isBulkGenerating || !bulkQrCount || parseInt(bulkQrCount) < 1 || parseInt(bulkQrCount) > 500}
                    className="h-11 px-8 gap-2"
                  >
                    {isBulkGenerating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><QrCode className="h-4 w-4" /> Generate</>}
                  </Button>
                  {bulkQrTickets.length > 0 && (
                    <Button onClick={handleBulkDownload} disabled={isBulkDownloading} variant="outline" className="h-11 px-6 gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      {isBulkDownloading ? <><Loader2 className="h-4 w-4 animate-spin" /> Zipping...</> : <><Download className="h-4 w-4" /> Download All ({bulkQrTickets.length})</>}
                    </Button>
                  )}
                </div>
              </Card>

              {/* Tickets list with select + delete */}
              {isBulkLoading ? (
                <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : bulkQrTickets.length > 0 ? (
                <div className="space-y-4">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground font-medium">{bulkQrTickets.length} ticket{bulkQrTickets.length !== 1 ? 's' : ''} in database</span>
                      <Button size="sm" variant="ghost" onClick={toggleSelectAll} className="h-8 text-xs gap-1.5">
                        {selectedBulkIds.size === bulkQrTickets.length ? <><X className="h-3 w-3" /> Deselect All</> : <><CheckCircle2 className="h-3 w-3" /> Select All</>}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {selectedBulkIds.size > 0 && (
                        <Button size="sm" variant="destructive" onClick={handleDeleteSelected} disabled={isDeletingBulk} className="h-8 gap-1.5">
                          {isDeletingBulk ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          Delete Selected ({selectedBulkIds.size})
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={handleDeleteAllBulk} disabled={isDeletingBulk} className="h-8 gap-1.5 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                        {isDeletingBulk ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        Delete All
                      </Button>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {bulkQrTickets.map((ticket) => {
                      const isSelected = selectedBulkIds.has(ticket.id);
                      return (
                        <Card
                          key={ticket.id}
                          onClick={() => toggleSelectBulk(ticket.id)}
                          className={`p-3 cursor-pointer flex flex-col items-center gap-2 text-center transition-all border-2 ${
                            isSelected ? 'border-primary bg-primary/10' : 'border-border/50 bg-card/60 hover:border-primary/40'
                          }`}
                        >
                          <div className="relative w-full flex justify-center">
                            <img src={ticket.qrUrl} alt={ticket.token} className="w-20 h-20" />
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-mono font-bold text-primary tracking-widest">{ticket.token}</span>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Card className="p-16 text-center bg-card/30 border-dashed border-2">
                  <QrCode className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No bulk tickets yet. Enter a number above and click Generate.</p>
                </Card>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
