"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomerList } from "./_components/CustomerList";
import { MessageComposer } from "./_components/MessageComposer";
import { MessageHistory } from "./_components/MessageHistory";
import { useCustomers, useMessages, Customer } from "./_components/useCustomers";

export default function MessagesPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { customers, loading: customersLoading, error: customersError } = useCustomers(businessId);
  const { messages, loading: messagesLoading, error: messagesError } = useMessages(
    businessId,
    selectedCustomer?.phone || null
  );

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  if (customersError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{customersError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
      </div>

      {customersLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <CustomerList
              customers={customers}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={handleSelectCustomer}
            />
          </div>
          <div className="lg:col-span-2 space-y-6">
            {selectedCustomer && (
              <MessageComposer customer={selectedCustomer} businessId={businessId} />
            )}
            {messagesError ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{messagesError}</AlertDescription>
              </Alert>
            ) : (
              <div className="relative">
                {messagesLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                <MessageHistory customer={selectedCustomer} messages={messages} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
