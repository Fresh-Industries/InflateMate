import { useState, useEffect } from "react";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type?: "Regular" | "VIP";
  lastBooking?: string | null;
}

export interface Message {
  id: string;
  content: string;
  sentAt: string;
  status: "sent" | "delivered" | "read" | "failed";
}


export function useCustomers(businessId: string) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call to fetch customers
        // For now, we'll use mock data
        const response = await fetch(`/api/businesses/${businessId}/customers`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers. Please try again.");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [businessId]);

  return { customers, loading, error };
}

export function useMessages(businessId: string, customerPhone: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!customerPhone) {
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `/api/businesses/${businessId}/messaging?phone=${encodeURIComponent(customerPhone)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load message history. Please try again.");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [businessId, customerPhone]);

  return { messages, loading, error };
}
