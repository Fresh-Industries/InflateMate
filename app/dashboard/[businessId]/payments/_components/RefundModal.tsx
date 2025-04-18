'use client';

import { useState } from 'react';
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Type for the payment
interface Payment {
  id: string;
  amount: number;
  type: "DEPOSIT" | "FULL_PAYMENT" | "REFUND";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  createdAt: string;
  paidAt: string | null;
  stripePaymentId: string | null;
  booking?: {
    id: string;
    eventDate: string;
    customer?: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
}

interface RefundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
  businessId: string;
  onRefundProcessed: () => void;
}

export default function RefundModal({
  open,
  onOpenChange,
  payment,
  businessId,
  onRefundProcessed
}: RefundModalProps) {
  const [refundAmount, setRefundAmount] = useState<number>(payment ? Number(payment.amount) : 0);
  const [refundReason, setRefundReason] = useState("");
  const [isFullRefund, setIsFullRefund] = useState(true);
  const [refundProcessing, setRefundProcessing] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Process a refund
  const processRefund = async () => {
    if (!payment) return;
    
    setRefundProcessing(true);
    try {
      const response = await fetch(
        `/api/businesses/${businessId}/payments/${payment.id}/refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullRefund: isFullRefund,
            amount: isFullRefund ? undefined : refundAmount,
            reason: refundReason,
          }),
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Refund processed",
          description: `Successfully refunded ${formatCurrency(data.refundAmount)}`,
        });
        onOpenChange(false);
        onRefundProcessed();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to process refund",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive",
      });
    } finally {
      setRefundProcessing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Process Refund</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to process a refund for payment #{payment?.id.substring(0, 8)}
            {" "}for{" "}
            {payment ? formatCurrency(Number(payment.amount)) : "$0.00"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Refund Type</label>
            <Select 
              value={isFullRefund ? "full" : "partial"}
              onValueChange={(value) => setIsFullRefund(value === "full")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select refund type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Refund</SelectItem>
                <SelectItem value="partial">Partial Refund</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {!isFullRefund && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Refund Amount</label>
              <Input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                min={0}
                max={payment ? Number(payment.amount) : 0}
                step={0.01}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason (optional)</label>
            <Input
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Reason for refund"
            />
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={refundProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              processRefund();
            }}
            disabled={refundProcessing}
          >
            {refundProcessing ? "Processing..." : "Process Refund"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 