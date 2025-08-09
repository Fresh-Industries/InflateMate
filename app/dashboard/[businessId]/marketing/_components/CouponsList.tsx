"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash, Copy, Calendar } from "lucide-react";
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
import Link from "next/link";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountAmount: number;
  maxUses: number | null;
  usedCount: number;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  minimumAmount: number | null;
  createdAt: string;
  updatedAt: string;
}

interface CouponsListProps {
  businessId: string;
}

export default function CouponsList({ businessId }: CouponsListProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Fetch coupons
  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/businesses/${businessId}/coupons`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch coupons");
      }
      
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to fetch coupons. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle coupon active status
  const toggleCouponStatus = async (couponId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/businesses/${businessId}/coupons/${couponId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update coupon status");
      }
      
      // Update local state
      setCoupons(coupons.map(coupon => 
        coupon.id === couponId ? { ...coupon, isActive } : coupon
      ));
      
      toast.success(`Coupon ${isActive ? "activated" : "deactivated"} successfully.`);
    } catch (error) {
      console.error("Error updating coupon status:", error);
      toast.error("Failed to update coupon status. Please try again.");
    }
  };
  
  // Delete coupon
  const deleteCoupon = async () => {
    if (!deletingId) return;
    
    try {
      const response = await fetch(`/api/businesses/${businessId}/coupons/${deletingId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete coupon");
      }
      
      // Update local state
      setCoupons(coupons.filter(coupon => coupon.id !== deletingId));
      
      toast.success("Coupon deleted successfully.");
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon. Please try again.");
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

  // Copy coupon code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied to clipboard");
  };
  
  // Load coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, [businessId]);
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date set";
    return new Date(dateString).toLocaleDateString();
  };

  // Check if coupon is expired
  const isExpired = (coupon: Coupon) => {
    if (!coupon.endDate) return false;
    return new Date(coupon.endDate) < new Date();
  };

  // Get coupon status badge
  const getCouponStatusBadge = (coupon: Coupon) => {
    if (!coupon.isActive) {
      return <Badge variant="outline" className="bg-gray-100">Inactive</Badge>;
    }
    if (isExpired(coupon)) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return <Badge variant="destructive">Limit Reached</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
  };
  
  return (
    <>
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the coupon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteCoupon}
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
        ) : coupons.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground mb-4">No coupons found</p>
              <Link href={`/dashboard/${businessId}/marketing/coupons/new`}>
                <Button variant="outline">Create Coupon</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon) => (
              <Card key={coupon.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span>{coupon.code}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full"
                          onClick={() => copyToClipboard(coupon.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {coupon.description || "No description"}
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
                        <Link href={`/dashboard/${businessId}/marketing/coupons/${coupon.id}`}>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        
                        <DropdownMenuItem
                          onClick={() => onDeleteConfirm(coupon.id)}
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
                        {getCouponStatusBadge(coupon)}
                      </div>
                      <Switch
                        checked={coupon.isActive}
                        onCheckedChange={(checked) => toggleCouponStatus(coupon.id, checked)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Discount:</span>
                      <span className="text-sm">
                        {coupon.discountType === "PERCENTAGE" 
                          ? `${coupon.discountAmount}%` 
                          : `$${coupon.discountAmount.toFixed(2)}`}
                      </span>
                    </div>
                    {coupon.maxUses && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Usage:</span>
                        <span className="text-sm">{coupon.usedCount} / {coupon.maxUses}</span>
                      </div>
                    )}
                    {(coupon.startDate || coupon.endDate) && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {coupon.startDate && `From ${formatDate(coupon.startDate)}`}
                          {coupon.startDate && coupon.endDate && " - "}
                          {coupon.endDate && `To ${formatDate(coupon.endDate)}`}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(coupon.createdAt).toLocaleDateString()}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 