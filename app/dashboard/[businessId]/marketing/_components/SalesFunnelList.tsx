"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SalesFunnel {
  id: string;
  name: string;
  popupTitle: string;
  popupText: string;
  popupImage: string | null;
  formTitle: string;
  thankYouMessage: string;
  couponId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  coupon?: {
    id: string;
    code: string;
    name: string;
  } | null;
}

interface SalesFunnelsListProps {
  businessId: string;
}

export default function SalesFunnelList({ businessId }: SalesFunnelsListProps) {
  const [funnels, setFunnels] = useState<SalesFunnel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  
  // Fetch sales funnels
  const fetchFunnels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/businesses/${businessId}/sales-funnels`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch sales funnels");
      }
      
      const data = await response.json();
      setFunnels(data);
    } catch (error) {
      console.error("Error fetching sales funnels:", error);
      toast({
        title: "Error",
        description: "Failed to fetch sales funnels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle funnel active status
  const toggleFunnelStatus = async (funnelId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/businesses/${businessId}/sales-funnels/${funnelId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update funnel status");
      }
      
      // Update local state
      setFunnels(funnels.map(funnel => 
        funnel.id === funnelId ? { ...funnel, isActive } : funnel
      ));
      
      toast({
        title: "Success",
        description: `Sales funnel ${isActive ? "activated" : "deactivated"} successfully.`,
      });
    } catch (error) {
      console.error("Error updating funnel status:", error);
      toast({
        title: "Error",
        description: "Failed to update funnel status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Delete funnel
  const deleteFunnel = async () => {
    if (!deletingId) return;
    
    try {
      const response = await fetch(`/api/businesses/${businessId}/sales-funnels/${deletingId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete sales funnel");
      }
      
      // Update local state
      setFunnels(funnels.filter(funnel => funnel.id !== deletingId));
      
      toast({
        title: "Success",
        description: "Sales funnel deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting sales funnel:", error);
      toast({
        title: "Error",
        description: "Failed to delete sales funnel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      setIsDeleteModalOpen(false);
    }
  };
  
  // Confirm delete
  const onDeleteConfirm = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };
  
  // Load funnels on component mount
  useEffect(() => {
    fetchFunnels();
  }, [businessId]);
  
  return (
    <>
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sales funnel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteFunnel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : funnels.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground mb-4">No sales funnels found</p>
              <Link href={`/dashboard/${businessId}/marketing/sales-funnels/new`}>
                <Button>Create Sales Funnel</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          funnels.map((funnel) => (
            <Card key={funnel.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{funnel.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {funnel.popupTitle}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/${businessId}/marketing/sales-funnels/${funnel.id}`)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={() => onDeleteConfirm(funnel.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Status:</span>
                      <span className={`text-sm ${funnel.isActive ? "text-green-600" : "text-gray-500"}`}>
                        {funnel.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <Switch
                      checked={funnel.isActive}
                      onCheckedChange={(checked) => toggleFunnelStatus(funnel.id, checked)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  {funnel.coupon && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Coupon:</span>
                      <span className="text-sm">{funnel.coupon.name} ({funnel.coupon.code})</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(funnel.createdAt).toLocaleDateString()}
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </>
  );
} 