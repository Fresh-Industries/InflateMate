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
} from "lucide-react";
import { CreateBounceHouseDialog } from "@/app/dashboard/[businessId]/inventory/_components/CreateBounceHouseDialog";
import { useToast } from "@/hooks/use-toast";
import { BounceHouseList } from "@/app/dashboard/[businessId]/inventory/_components/BounceHouseList";
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

interface BounceHouse {
  id: string;
  name: string;
  status: "AVAILABLE" | "MAINTENANCE" | "RETIRED";
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
  features: { name: string }[];
  weatherRestrictions: string[];
  availability?: {
    startTime: string;
    endTime: string;
  }[];
}

export default function InventoryPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params?.businessId as string;
  const { toast } = useToast();

  const [bounceHouses, setBounceHouses] = useState<BounceHouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch bounce houses using useCallback to memoize the function
  const fetchBounceHouses = useCallback(async () => {
    try {
      if (!businessId) {
        throw new Error("No business ID found");
      }
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/businesses/${businessId}/inventory`);
      if (!response.ok) {
        throw new Error("Failed to fetch bounce houses");
      }
      const data = await response.json();
      setBounceHouses(data);
    } catch (error) {
      console.error("Error fetching bounce houses:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch bounce houses");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch bounce houses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [businessId, toast]);

  useEffect(() => {
    if (businessId) {
      fetchBounceHouses();
    }
  }, [businessId, fetchBounceHouses]);

  // Memoize filtered bounce houses to avoid unnecessary recalculations
  const filteredBounceHouses = useMemo(() => {
    return bounceHouses.filter((bounceHouse) => {
      const matchesStatus = statusFilter === "all" || bounceHouse.status === statusFilter;
      const matchesSearch = bounceHouse.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bounceHouses, statusFilter, searchQuery]);

  const availableCount = bounceHouses.filter((bh) => bh.status === "AVAILABLE").length;
  const maintenanceCount = bounceHouses.filter((bh) => bh.status === "MAINTENANCE").length;
  const totalBookings = bounceHouses.reduce(
    (acc, bh) => acc + (bh.availability?.length || 0),
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your bounce house inventory and maintenance schedules
          </p>
        </div>
        <CreateBounceHouseDialog 
          businessId={businessId} 
          onBounceHouseCreated={fetchBounceHouses} 
        />
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
          <CardDescription>View and manage your bounce house inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
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
          ) : filteredBounceHouses.length === 0 ? (
            <div className="text-center py-8">No bounce houses found</div>
          ) : viewMode === "grid" ? (
            <BounceHouseList
              bounceHouses={filteredBounceHouses}
              businessId={businessId}
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Age Range</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBounceHouses.map((bounceHouse) => (
                    <TableRow key={bounceHouse.id}>
                      <TableCell className="font-medium">
                        {bounceHouse.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(bounceHouse.status)}>
                          {bounceHouse.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(bounceHouse.price)}</TableCell>
                      <TableCell>{bounceHouse.capacity} people</TableCell>
                      <TableCell>{bounceHouse.dimensions}</TableCell>
                      <TableCell>{bounceHouse.ageRange}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/${businessId}/inventory/${bounceHouse.id}`
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
