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
  type: "email" | "text";
  subject?: string;
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
        
        // For demo purposes, set mock data if API fails
        setCustomers(mockCustomers);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [businessId]);

  return { customers, loading, error };
}

export function useMessages(businessId: string, customerId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!customerId) {
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // In a real app, this would be an API call to fetch messages
        // For now, we'll use mock data
        const response = await fetch(`/api/businesses/${businessId}/customers/${customerId}/messages`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load message history. Please try again.");
        
        // For demo purposes, set mock data if API fails
        setMessages(mockMessages.filter(m => m.customerId === customerId));
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [businessId, customerId]);

  return { messages, loading, error };
}

// Mock data for development
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    type: "Regular",
    lastBooking: "2023-02-15T14:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-987-6543",
    type: "VIP",
    lastBooking: "2023-03-01T10:00:00Z",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "555-456-7890",
    type: "Regular",
    lastBooking: "2023-02-28T16:15:00Z",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "555-789-0123",
    type: "VIP",
    lastBooking: "2023-03-05T13:45:00Z",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "555-321-6547",
    type: "Regular",
    lastBooking: null,
  },
];

// Mock messages for development
const mockMessages: (Message & { customerId: string })[] = [
  {
    id: "1",
    customerId: "1",
    type: "email",
    subject: "Booking Confirmation",
    content: "Thank you for booking with us! Your reservation for the Bounce Castle on March 15th has been confirmed.",
    sentAt: "2023-03-10T09:15:00Z",
    status: "delivered",
  },
  {
    id: "2",
    customerId: "1",
    type: "text",
    content: "Your bounce house delivery will arrive in 30 minutes. Please ensure the area is clear.",
    sentAt: "2023-03-15T08:30:00Z",
    status: "read",
  },
  {
    id: "3",
    customerId: "2",
    type: "email",
    subject: "Special VIP Discount",
    content: "As a valued VIP customer, we're offering you 15% off your next booking. Use code VIP15 at checkout.",
    sentAt: "2023-03-02T14:45:00Z",
    status: "read",
  },
  {
    id: "4",
    customerId: "2",
    type: "email",
    subject: "Feedback Request",
    content: "We hope you enjoyed your recent rental! We'd love to hear your feedback. Please take a moment to complete our survey.",
    sentAt: "2023-03-05T16:20:00Z",
    status: "sent",
  },
  {
    id: "5",
    customerId: "3",
    type: "text",
    content: "Your payment of $250 has been received. Thank you!",
    sentAt: "2023-03-01T10:10:00Z",
    status: "delivered",
  },
]; 