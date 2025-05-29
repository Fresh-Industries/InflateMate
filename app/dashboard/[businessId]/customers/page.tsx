"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Star,
  Users,
  Calendar,
  TrendingUp,
  Mail,
  Phone,
  MoreVertical,
  MapPin,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { utcToLocal } from "@/lib/utils";
import { format } from "date-fns";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  bookingCount: number;
  totalSpent: number;
  lastBooking: string | null;
  lastBookingTimeZone: string | null;
  status: "Active" | "Inactive";
  type: "Regular" | "VIP";
  bookings?: CustomerBooking[];
}

interface CustomerBooking {
  id: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventTimeZone: string;
  status: string;
  totalAmount: number;
  eventType: string;
  eventAddress: string;
  eventCity: string;
  eventState: string;
  eventZipCode: string;
  bounceHouse: {
    id: string;
    name: string;
  };
}

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  type: "Regular" | "VIP";
  status?: "Active" | "Inactive";
}

type DialogMode = "add" | "edit" | null;

export default function CustomersPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const { toast } = useToast();
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all-customers");

  // Dialog & Form
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    type: "Regular",
  });

  // New state variables
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [customerBookings, setCustomerBookings] = useState<CustomerBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/businesses/${businessId}/customers`);
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Opens the "Add Customer" dialog
  const openAddDialog = () => {
    setDialogMode("add");
    setSelectedCustomer(null);
    resetForm();
  };

  // Opens the "Edit Customer" dialog
  const openEditDialog = (customer: Customer) => {
    setDialogMode("edit");
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || "",
      city: customer.city || "",
      state: customer.state || "",
      zipCode: customer.zipCode || "",
      notes: customer.notes || "",
      type: customer.type,
      status: customer.status,
    });
  };


  
  // Unified handler for Add or Edit
  const handleSubmitDialog = async () => {
    if (!dialogMode) return;

    try {
      const method = dialogMode === "add" ? "POST" : "PATCH";
      const url =
        dialogMode === "add"
          ? `/api/businesses/${businessId}/customers`
          : `/api/businesses/${businessId}/customers/${selectedCustomer?.id}`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${dialogMode} customer`);
      }

      await fetchCustomers();
      toast({
        title: "Success",
        description:
          dialogMode === "add"
            ? "Customer added successfully"
            : "Customer updated successfully",
      });
      closeDialog();
    } catch (error) {
      console.error(`Error on ${dialogMode} customer:`, error);
      toast({
        title: "Error",
        description: `Failed to ${dialogMode} customer`,
        variant: "destructive",
      });
    }
  };

  // Delete
  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const response = await fetch(
        `/api/businesses/${businessId}/customers/${customerId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to delete customer",
          variant: "destructive",
        });
        return;
      }

      await fetchCustomers();
      toast({
        title: "Success",
        description: data.message || "Customer deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedCustomer(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      notes: "",
      type: "Regular",
      status: "Active",
    });
  };

  // Filter & search
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);

    switch (filterType) {
      case "all-customers":
        return matchesSearch;
      case "vip":
        return matchesSearch && customer.type === "VIP";
      case "regular":
        return matchesSearch && customer.type === "Regular";
      case "inactive":
        return matchesSearch && customer.status === "Inactive";
      default:
        return matchesSearch;
    }
  });

  // Fetch customer bookings
  const fetchCustomerBookings = async (customerId: string) => {
    try {
      setIsLoadingBookings(true);
      const response = await fetch(`/api/businesses/${businessId}/customers/${customerId}/bookings`);
      if (!response.ok) throw new Error("Failed to fetch customer bookings");
      const data = await response.json();
      setCustomerBookings(data);
    } catch (error) {
      console.error("Error fetching customer bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load customer bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Open customer details
  const openCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchCustomerBookings(customer.id);
    setIsDetailsOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Customers
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            Manage your customer relationships and bookings
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" variant="primary-gradient" onClick={openAddDialog}>
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              Total registered customers
            </p>
          </CardContent>
        </Card>

        <Card className="border border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter((c) => c.type === "VIP").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {customers.length > 0
                ? (
                    (customers.filter((c) => c.type === "VIP").length /
                      customers.length) *
                    100
                  ).toFixed(1)
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card className="border border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter((c) => c.status === "Active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${customers.length > 0 ? (customers.reduce((acc, c) => acc + c.totalSpent, 0) / customers.length).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Per customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-customers">All Customers</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] text-xs uppercase text-muted-foreground">Customer</TableHead>
                  <TableHead className="hidden md:table-cell w-[200px] text-xs uppercase text-muted-foreground">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell w-[200px] text-xs uppercase text-muted-foreground">Address</TableHead>
                  <TableHead className="hidden sm:table-cell w-[100px] text-xs uppercase text-muted-foreground">Bookings</TableHead>
                  <TableHead className="w-[100px] text-xs uppercase text-muted-foreground">Total Spent</TableHead>
                  <TableHead className="hidden md:table-cell w-[150px] text-xs uppercase text-muted-foreground">Last Booking</TableHead>
                  <TableHead className="w-[100px] text-xs uppercase text-muted-foreground">Status</TableHead>
                  <TableHead className="hidden sm:table-cell w-[100px] text-xs uppercase text-muted-foreground">Type</TableHead>
                  <TableHead className="text-right w-[80px] text-xs uppercase text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center h-24">
                      Loading customers...
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center h-24">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="max-w-[180px]">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
                            <AvatarFallback className="text-sm sm:text-base">
                              {customer.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-medium text-sm sm:text-base truncate">{customer.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              ID: {customer.id.slice(0, 8)}
                              {customer.notes && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="ml-2 cursor-help">📝</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">{customer.notes}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            <div className="block md:hidden text-xs mt-1">
                              <div className="flex items-center gap-1 truncate">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{customer.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px]">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span className="text-sm truncate">{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span className="text-sm truncate">{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {customer.address ? (
                          <div className="text-sm">
                            {customer.address}
                            {customer.city && customer.state ? (
                              <div>{customer.city}, {customer.state} {customer.zipCode}</div>
                            ) : (
                              <div>{customer.city || ""} {customer.state || ""} {customer.zipCode || ""}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No address</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{customer.bookingCount}</TableCell>
                      <TableCell>${customer.totalSpent}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {customer.lastBooking
                          ? format(new Date(customer.lastBooking.split('T')[0] + 'T12:00:00'), 'MMM d, yyyy')
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={customer.status === "Active" ? "default" : "secondary"}
                          className="whitespace-nowrap"
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={customer.type === "VIP" ? "success" : "secondary"}>
                          {customer.type}
                          {customer.type === "VIP" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-1 cursor-help">⭐</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>More than one booking</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(customer)}>
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openCustomerDetails(customer)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                                  Delete Customer
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription className="space-y-2">
                                    This action cannot be undone. This will permanently delete the customer and all associated data.
                                    <div className="mt-2 text-sm bg-amber-50 border border-amber-200 p-3 rounded-md">
                                      <div className="font-medium text-amber-800">Important:</div>
                                      <ul className="list-disc pl-5 mt-1 text-amber-700">
                                        <li>Customers with upcoming bookings cannot be deleted</li>
                                        <li>Customers with past bookings will be marked inactive instead</li>
                                        <li>Only customers with no booking history will be permanently deleted</li>
                                      </ul>
                                    </div>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteCustomer(customer.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Customer Dialog */}
      <Dialog open={dialogMode !== null} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
        <DialogContent className="sm:max-w-md md:max-w-lg max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Add New Customer" : "Edit Customer"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "add"
                ? "Add a new customer to your database"
                : "Edit customer information"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-1 pr-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm">Phone *</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input id="zipCode" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm">Customer Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as "Regular" | "VIP" })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {dialogMode === "edit" && (
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as "Active" | "Inactive" })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Fields marked with * are required
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-4">
            <Button variant="secondary" onClick={closeDialog} className="sm:mr-2 w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSubmitDialog} variant="primary-gradient" className="w-full sm:w-auto">
              {dialogMode === "add" ? "Add Customer" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View detailed information for {selectedCustomer?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedCustomer && (
              <div className="space-y-6">
                {/* Customer Information Card */}
                <Card className="border border-blue-200">
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-lg">
                            {selectedCustomer.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                          <Badge variant={selectedCustomer.type === "VIP" ? "success" : "secondary"}>
                            {selectedCustomer.type}
                          </Badge>
                          <Badge variant={selectedCustomer.status === "Active" ? "default" : "secondary"} className="ml-2">
                            {selectedCustomer.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{selectedCustomer.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Address</h4>
                        {selectedCustomer.address ? (
                          <div>
                            <p>{selectedCustomer.address}</p>
                            <p>
                              {selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.zipCode}
                            </p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No address provided</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-1">Total Bookings</h4>
                          <p className="text-2xl font-bold">{selectedCustomer.bookingCount}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Total Spent</h4>
                          <p className="text-2xl font-bold">${selectedCustomer.totalSpent}</p>
                        </div>
                      </div>
                      
                      {selectedCustomer.notes && (
                        <div>
                          <h4 className="font-medium mb-1">Notes</h4>
                          <p>{selectedCustomer.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Customer Bookings Card */}
                <Card className="border border-blue-200">
                  <CardHeader>
                    <CardTitle>Booking History</CardTitle>
                    <CardDescription>View all bookings for this customer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingBookings ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent"></div>
                        <p className="mt-2 text-muted-foreground">Loading bookings...</p>
                      </div>
                    ) : customerBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="rounded-full bg-muted p-3 w-12 h-12 flex items-center justify-center mx-auto">
                          <Calendar className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
                        <p className="mt-2 text-muted-foreground">
                          This customer hasn&apos;t made any bookings yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {customerBookings.map((booking) => (
                          <Card key={booking.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-lg">{booking.bounceHouse.name}</CardTitle>
                                    <div className="flex items-center mt-1 space-x-1 text-sm text-muted-foreground">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                      {utcToLocal(new Date(booking.eventDate), booking.eventTimeZone, 'MMM d, yyyy')}
                                      </span>
                                    </div>
                                  </div>
                                  <Badge variant={getStatusBadgeVariant(booking.status)}>
                                    {booking.status}
                                  </Badge>
                                </div>
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium">Event Details</h4>
                                  <div className="flex items-start mt-1">
                                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground mt-0.5" />
                                    <p className="text-sm">{booking.eventAddress}, {booking.eventCity}, {booking.eventState} {booking.eventZipCode}</p>
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Type: {booking.eventType}
                                  </div>
                                </div>
                              </div>
                              <div className="border-t md:border-t-0 md:border-l bg-muted/50 p-4 flex flex-col justify-between gap-4 w-full md:w-48">
                                <div>
                                  <h4 className="text-sm font-medium">Amount</h4>
                                  <p className="text-xl font-bold">${booking.totalAmount.toFixed(2)}</p>
                                </div>
                                <Button
                                  onClick={() => router.push(`/dashboard/${businessId}/bookings?bookingId=${booking.id}`)}
                                  size="sm"
                                  variant="secondary"
                                  className="w-full justify-between"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  <span>View</span>
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button variant="secondary" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsDetailsOpen(false);
                if (selectedCustomer) {
                    openEditDialog(selectedCustomer);
                }
              }}
            >
              Edit Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


// Helper function to determine badge variant based on booking status
const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "success" | "outline" => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "secondary";
    case "CONFIRMED":
      return "success";
    case "CANCELLED":
      return "destructive";
    default:
      return "secondary";
  }
};
