'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  LayoutGrid,
  List,
  Plus,
  Package,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InventoryList } from "@/app/dashboard/[businessId]/inventory/_components/InventoryList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InventoryItem {
  id: string;
  name: string;
  status: "AVAILABLE" | "MAINTENANCE" | "RETIRED";
  type: "BOUNCE_HOUSE" | "INFLATABLE" | "GAME" | "OTHER";
  description: string;
  dimensions: string;
  capacity: number;
  price: number;
  setupTime: number;
  teardownTime: number;
  minimumSpace: string;
  weightLimit: number;
  ageRange: string;
  primaryImage?: string;
  images: string[];
  weatherRestrictions: string[];
  availability?: {
    startTime: string;
    endTime: string;
  }[];
  quantity: number;
  bookingCount: number;
}

export default function InventoryPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params?.businessId as string;
  const { toast } = useToast();

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch inventory items
  const fetchInventory = useCallback(async () => {
    try {
      if (!businessId) {
        throw new Error("No business ID found");
      }
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/businesses/${businessId}/inventory`);
      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }
      const data = await response.json();
      setInventoryItems(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch inventory");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch inventory",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [businessId, toast]);

  useEffect(() => {
    if (businessId) {
      fetchInventory();
    }
  }, [businessId, fetchInventory]);

  // Memoize filtered inventory items
  const filteredInventory = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [inventoryItems, statusFilter, typeFilter, searchQuery]);

  const totalUnits = inventoryItems.length;
  const availableCount = inventoryItems.filter((item) => item.status === "AVAILABLE").length;
  const maintenanceCount = inventoryItems.filter((item) => item.status === "MAINTENANCE").length;
  const totalValue = inventoryItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Define badge variants based on status
  const getStatusBadgeVariant = (status: InventoryItem['status']): 'default' | 'destructive' | 'secondary' => {
    switch (status) {
      case "AVAILABLE":
        return "default";
      case "MAINTENANCE":
        return "destructive";
      case "RETIRED":
        return "secondary";
      default:
        return "default";
    }
  };

  // Returns a display name for inventory type
  const getInventoryTypeDisplay = (type: string) => {
    switch (type) {
      case "BOUNCE_HOUSE": return "Bounce House";
      case "INFLATABLE": return "Inflatable";
      case "GAME": return "Game";
      case "OTHER": return "Other";
      default: return type;
    }
  };

  // Loading State Component
  const LoadingSkeleton = () => (
    <div className="text-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading inventory...</p>
    </div>
  );

  // Error State Component
  const ErrorDisplay = ({ message }: { message: string }) => (
    <Card className="bg-destructive/10 border-destructive/30 text-destructive text-center py-8 px-4 rounded-xl shadow-sm">
      <AlertTriangle className="h-10 w-10 mx-auto mb-3 opacity-80" />
      <p className="font-medium">Failed to load inventory</p>
      <p className="text-sm opacity-90">{message}</p>
    </Card>
  );

   // Empty State Component
  const EmptyState = () => (
    <Card className="text-center py-16 px-4 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/10">
       <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
       <h3 className="text-xl font-semibold mb-2">No Inventory Found</h3>
       <p className="text-muted-foreground mb-6 max-w-md mx-auto">
         It looks like there are no inventory items matching your current filters, or you haven&apos;t added any yet.
       </p>
       <Button onClick={() => router.push(`/dashboard/${businessId}/inventory/create`)} className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
         <Plus className="mr-2 h-4 w-4" />
         Add Your First Item
       </Button>
    </Card>
  );

  return (
    <div className="space-y-8 p-6 bg-[#fafbff]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Inventory
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            Manage your inventory items and view their status.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full h-11 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transition-all duration-300 transform hover:scale-105 group">
              <Plus className="mr-2 h-5 w-5" />
              Add Item
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-lg shadow-lg border border-blue-200/30 mt-2 w-48">
            <DropdownMenuItem className="cursor-pointer py-2 px-3" onClick={() => router.push(`/dashboard/${businessId}/inventory/create?type=BOUNCE_HOUSE`)}>
              Bounce House
            </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2 px-3" onClick={() => router.push(`/dashboard/${businessId}/inventory/create?type=INFLATABLE`)}>
                Inflatable
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2 px-3" onClick={() => router.push(`/dashboard/${businessId}/inventory/create?type=GAME`)}>
              Game
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2 px-3" onClick={() => router.push(`/dashboard/${businessId}/inventory/create?type=OTHER`)}>
              Other
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Overview - Add subtle border and refined shadow/hover */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Units", value: totalUnits, icon: Package, color: "blue", description: "All items in inventory" },
          { title: "Available Now", value: availableCount, icon: CheckCircle2, color: "green", description: "Ready for booking" },
          { title: "In Maintenance", value: maintenanceCount, icon: AlertTriangle, color: "yellow", description: "Under repair/inspection" },
          { title: "Estimated Value", value: formatCurrency(totalValue), icon: DollarSign, color: "purple", description: "Total inventory worth" }
        ].map((stat, index) => (
          <Card key={index} className="rounded-xl border border-blue-200/30 bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow duration-300 group p-5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 text-${stat.color}-500`} />
            </CardHeader>
            <CardContent className="p-0 mt-1">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Inventory List/Grid - Add border, consistent shadow */}
      <Card className="rounded-xl shadow-sm overflow-hidden border border-blue-200/30">
        <CardHeader className="border-b border-blue-200/30 bg-muted/30 p-4 md:p-5">
             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your Inventory</CardTitle>
                    <CardDescription className="mt-1 text-muted-foreground">Search, filter, and manage your items.</CardDescription>
                </div>
                <div className="flex items-center gap-1 border bg-background rounded-full p-1 shadow-inner">
                <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-full w-9 h-9 transition-colors duration-200"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                >
                    <LayoutGrid className="h-5 w-5" />
                </Button>
                <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-full w-9 h-9 transition-colors duration-200"
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                >
                    <List className="h-5 w-5" />
                </Button>
                </div>
            </div>
             <div className="flex flex-col md:flex-row items-center gap-3 mt-4">
                <div className="relative flex-grow w-full md:w-auto md:min-w-[250px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name..."
                    className="pl-10 h-10 rounded-md shadow-sm border border-blue-200/50 focus:border-primary focus:ring-1 focus:ring-primary transition-colors w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[160px] h-10 rounded-md shadow-sm border border-blue-200/50 focus:ring-1 focus:ring-primary focus:border-primary transition-colors">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg border border-blue-200/30">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="RETIRED">Retired</SelectItem>
                </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[160px] h-10 rounded-md shadow-sm border border-blue-200/50 focus:ring-1 focus:ring-primary focus:border-primary transition-colors">
                    <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg border border-blue-200/30">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="BOUNCE_HOUSE">Bounce House</SelectItem>
                    <SelectItem value="INFLATABLE">Inflatable</SelectItem>
                    <SelectItem value="GAME">Game</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent className="p-0">
            {isLoading ? (
                <LoadingSkeleton />
            ) : error ? (
                <div className="p-6">
                    <ErrorDisplay message={error} />
                </div>
            ) : filteredInventory.length === 0 ? (
                <div className="p-6">
                    <EmptyState />
                </div>
            ) : viewMode === "grid" ? (
                <div className="p-4 md:p-6">
                    <InventoryList
                    inventoryItems={filteredInventory}
                    businessId={businessId}
                    />
                </div>
            ) : (
                 /* Restyled Table View - ensure consistent padding/borders */
                <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader className="bg-muted/30 border-b border-blue-200/30">
                    <TableRow>
                        <TableHead className="py-3 px-4 md:px-5">Name</TableHead>
                        <TableHead className="py-3 px-4 md:px-5">Type</TableHead>
                        <TableHead className="py-3 px-4 md:px-5">Status</TableHead>
                        <TableHead className="py-3 px-4 md:px-5">Price</TableHead>
                        <TableHead className="py-3 px-4 md:px-5">Capacity</TableHead>
                        <TableHead className="py-3 px-4 md:px-5 hidden md:table-cell">Dimensions</TableHead>
                        <TableHead className="py-3 px-4 md:px-5 hidden lg:table-cell">Quantity</TableHead>
                        <TableHead className="py-3 px-4 md:px-5 text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredInventory.map((item) => (
                        <TableRow
                            key={item.id}
                            className="hover:bg-muted/20 transition-colors cursor-pointer border-b border-blue-200/20 last:border-b-0"
                            onClick={() => router.push(`/dashboard/${businessId}/inventory/${item.id}`)}
                        >
                        <TableCell className="font-medium py-3 px-4 md:px-5">
                            <div className="flex items-center gap-3">
                                {item.primaryImage ? (
                                    <img src={item.primaryImage} alt={item.name} className="h-8 w-8 rounded-sm object-cover" />
                                ) : item.images && item.images.length > 0 ? (
                                    <img src={item.images[0]} alt={item.name} className="h-8 w-8 rounded-sm object-cover" />
                                ) : (
                                    <div className="h-8 w-8 rounded-sm bg-muted flex items-center justify-center">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                )}
                                <span>{item.name}</span>
                            </div>
                        </TableCell>
                        <TableCell className="py-3 px-4 md:px-5 text-muted-foreground">
                            {getInventoryTypeDisplay(item.type)}
                        </TableCell>
                        <TableCell className="py-3 px-4 md:px-5">
                            <Badge variant={getStatusBadgeVariant(item.status)} className="capitalize text-xs px-2 py-0.5">
                                {item.status.toLowerCase()}
                            </Badge>
                        </TableCell>
                        <TableCell className="py-3 px-4 md:px-5 text-muted-foreground">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="py-3 px-4 md:px-5 text-muted-foreground">{item.capacity} ppl</TableCell>
                        <TableCell className="py-3 px-4 md:px-5 text-muted-foreground hidden md:table-cell">{item.dimensions}</TableCell>
                        <TableCell className="py-3 px-4 md:px-5 text-muted-foreground hidden lg:table-cell">{item.quantity}</TableCell>
                        <TableCell className="py-3 px-4 md:px-5 text-right">
                            <Button
                            variant="outline"
                            size="sm"
                            className="rounded-md border-blue-300/50 hover:bg-muted/50 focus:ring-1 focus:ring-primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/${businessId}/inventory/${item.id}`);
                            }}
                            >
                             Edit
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
