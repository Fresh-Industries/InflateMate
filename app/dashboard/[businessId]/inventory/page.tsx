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
  History,
  LayoutGrid,
  List,
  Plus,
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

  const availableCount = inventoryItems.filter((item) => item.status === "AVAILABLE").length;
  const maintenanceCount = inventoryItems.filter((item) => item.status === "MAINTENANCE").length;
  const totalBookings = inventoryItems.reduce(
    (acc, item) => acc + (item.bookingCount || 0),
    0
  );

  // Returns a variant string for the Badge component based on status
  const getStatusBadgeVariant = (status: string) => {
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
      case "BOUNCE_HOUSE":
        return "Bounce House";
      case "INFLATABLE":
        return "Inflatable";
      case "GAME":
        return "Game";
      case "OTHER":
        return "Other";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your inventory items and maintenance schedules
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/${businessId}/inventory/create?type=BOUNCE_HOUSE`)}>
              Bounce House
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/${businessId}/inventory/create?type=INFLATABLE`)}>
              Inflatable
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/${businessId}/inventory/create?type=GAME`)}>
              Game
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/${businessId}/inventory/create?type=OTHER`)}>
              Other
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Units</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableCount}</div>
            <p className="text-xs text-muted-foreground">Ready for booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceCount}</div>
            <p className="text-xs text-muted-foreground">Under repair or inspection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <History className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>View and manage your inventory items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="RETIRED">Retired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BOUNCE_HOUSE">Bounce House</SelectItem>
                <SelectItem value="INFLATABLE">Inflatable</SelectItem>
                <SelectItem value="GAME">Game</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 border rounded-md p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-center text-destructive py-4">
              {error}
            </div>
          )}

          {/* Content */}
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredInventory.length === 0 ? (
            <div className="text-center py-8">No inventory items found</div>
          ) : viewMode === "grid" ? (
            <InventoryList
              inventoryItems={filteredInventory}
              businessId={businessId}
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell>
                        {getInventoryTypeDisplay(item.type)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>{item.capacity} people</TableCell>
                      <TableCell>{item.dimensions}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/${businessId}/inventory/${item.id}`
                            )
                          }
                        >
                          Edit Details
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
