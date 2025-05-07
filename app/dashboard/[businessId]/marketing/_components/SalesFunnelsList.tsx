"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { SalesFunnelForm } from "./SalesFunnelForm";

interface SalesFunnel {       
  id: string;
  name: string;
  isActive: boolean;
  popupTitle: string;
  popupText: string;
  popupImage?: string;
  formTitle: string;
  thankYouMessage: string;
  couponId?: string;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

interface SalesFunnelsListProps {
  businessId: string;
}

export function SalesFunnelsList({ businessId }: SalesFunnelsListProps) {
  const [salesFunnels, setSalesFunnels] = useState<SalesFunnel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingFunnel, setEditingFunnel] = useState<SalesFunnel | null>(null);
  const [deletingFunnelId, setDeletingFunnelId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSalesFunnels = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/businesses/${businessId}/sales-funnels`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch sales funnels");
      }
      
      const data = await response.json();
      setSalesFunnels(data);
    } catch (error) {
      console.error("Error fetching sales funnels:", error);
      toast({
        title: "Error",
        description: "Failed to load sales funnels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchSalesFunnels();
    }
  }, [businessId]);

  const handleToggleActive = async (funnelId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/businesses/${businessId}/sales-funnels/${funnelId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update funnel status");
      }

      setSalesFunnels(prev => 
        prev.map(funnel => 
          funnel.id === funnelId ? { ...funnel, isActive: !isActive } : funnel
        )
      );

      toast({
        title: "Success",
        description: `Sales funnel ${isActive ? "deactivated" : "activated"} successfully.`,
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

  const handleDeleteFunnel = async () => {
    if (!deletingFunnelId) return;
    
    try {
      const response = await fetch(`/api/businesses/${businessId}/sales-funnels/${deletingFunnelId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete sales funnel");
      }

      setSalesFunnels(prev => prev.filter(funnel => funnel.id !== deletingFunnelId));
      
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
      setDeletingFunnelId(null);
    }
  };

  const handleFormSubmit = () => {
    setIsCreating(false);
    setEditingFunnel(null);
    fetchSalesFunnels();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Funnels</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Funnel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Sales Funnel</DialogTitle>
              <DialogDescription>
                Create a new sales funnel to capture leads and offer discounts.
              </DialogDescription>
            </DialogHeader>
            <SalesFunnelForm 
              businessId={businessId} 
              onSuccess={handleFormSubmit} 
              onCancel={() => setIsCreating(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading sales funnels...</p>
        </div>
      ) : salesFunnels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <h3 className="text-lg font-medium mb-2">No sales funnels yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first sales funnel to start capturing leads and offering discounts.
            </p>
            <Button variant="outline" onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Funnel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salesFunnels.map((funnel) => (
            <Card key={funnel.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{funnel.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id={`active-${funnel.id}`}
                      checked={funnel.isActive}
                      onCheckedChange={() => handleToggleActive(funnel.id, funnel.isActive)}
                    />
                    <Label htmlFor={`active-${funnel.id}`} className="text-sm">
                      {funnel.isActive ? "Active" : "Inactive"}
                    </Label>
                  </div>
                </div>
                <CardDescription>
                  Created on {new Date(funnel.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Popup Title:</p>
                  <p className="text-sm text-muted-foreground">{funnel.popupTitle}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3 border-t">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setEditingFunnel(funnel)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Sales Funnel</DialogTitle>
                      <DialogDescription>
                        Update your sales funnel details.
                      </DialogDescription>
                    </DialogHeader>
                    {editingFunnel && (
                      <SalesFunnelForm 
                        businessId={businessId} 
                        funnel={editingFunnel}
                        onSuccess={handleFormSubmit} 
                        onCancel={() => setEditingFunnel(null)}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setDeletingFunnelId(funnel.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this sales funnel. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeletingFunnelId(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteFunnel}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 