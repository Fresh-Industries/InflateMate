"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, MessagesSquare, ChevronLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { CustomerList } from "./_components/CustomerList";
import { MessageComposer } from "./_components/MessageComposer";
import { useCustomers, useMessages, Customer, Message } from "./_components/useCustomers";

export default function MessagesPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { customers, loading: customersLoading, error: customersError } = useCustomers(businessId);
  const { messages, loading: messagesLoading, error: messagesError }: { messages: Message[]; loading: boolean; error: string | null } = useMessages(
    businessId,
    selectedCustomer?.phone || null
  );

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  if (customersError) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Customers</AlertTitle>
          <AlertDescription>{customersError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const contentHeight = "h-[calc(100vh-theme(spacing.16))]";

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex items-center flex-shrink-0 border-b p-3 md:p-4">
        <h1 className="text-xl font-semibold tracking-tight ml-2">
          Messages
        </h1>
      </div>

      <div className={`flex flex-grow overflow-hidden ${contentHeight}`}>
        <div
          className={cn(
            "flex flex-col w-full flex-shrink-0 bg-background md:w-72 md:border-r",
            selectedCustomer ? "hidden md:flex" : "flex"
          )}
        >
          <CustomerList
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={handleSelectCustomer}
            isLoading={customersLoading}
          />
        </div>

        <div
          className={cn(
            "flex-grow flex-col bg-background relative md:flex",
            selectedCustomer ? "flex" : "hidden md:flex"
          )}
        >
          {selectedCustomer ? (
            <>
              <div className="flex items-center p-3 border-b flex-shrink-0 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 md:hidden"
                  onClick={() => setSelectedCustomer(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Back</span>
                </Button>
                <div className="flex-1 text-center">
                  <span className="text-sm font-medium truncate">
                    To: {selectedCustomer.name} {selectedCustomer.phone ? `(${selectedCustomer.phone})` : ''}
                  </span>
                </div>
                <div className="w-8 md:hidden"></div>
              </div>

              <div className="flex-grow overflow-y-auto p-4 space-y-3 md:space-y-4">
                {!messagesLoading && !messagesError && messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex flex-col max-w-[70%] md:max-w-[65%]",
                      message.senderType === 'BUSINESS'
                        ? "ml-auto items-end"
                        : "mr-auto items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "px-3 py-2 rounded-lg shadow-sm",
                        message.senderType === 'BUSINESS'
                          ? "bg-blue-600 text-white"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm break-words">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 px-1">
                      {formatDistanceToNow(new Date(message.timestamp || Date.now()), { addSuffix: true })}
                    </span>
                  </div>
                ))}
                {messagesError && (
                  <Alert variant="destructive" className="m-4">
                    <AlertTitle>Error Loading Messages</AlertTitle>
                    <AlertDescription>{messagesError}</AlertDescription>
                  </Alert>
                )}
                <div className="h-2 flex-shrink-0"></div>
              </div>

              <div className="flex-shrink-0 border-t p-3 md:p-4 bg-muted/50 mt-auto">
                <MessageComposer customer={selectedCustomer} businessId={businessId} />
              </div>
            </>
          ) : (
            <div className="flex-grow flex-col items-center justify-center text-center text-muted-foreground p-6 hidden md:flex">
              <MessagesSquare className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Choose a customer from the list to start messaging.</p>
            </div>
          )}

          {messagesLoading && selectedCustomer && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-20">
               <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
               <p className="text-muted-foreground">Loading messages...</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
