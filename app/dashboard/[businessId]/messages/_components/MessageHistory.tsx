import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  sentAt: string;
  status: "sent" | "delivered" | "read" | "failed";
}

interface MessageHistoryProps {
  customer: {
    id: string;
    name: string;
  } | null;
  messages: Message[];
}

export function MessageHistory({ customer, messages }: MessageHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const getStatusColor = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return "bg-blue-500";
      case "delivered":
        return "bg-green-500";
      case "read":
        return "bg-green-700";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">
          {customer ? `Message History with ${customer.name}` : "Message History"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!customer ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Select a customer to view message history
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No message history with this customer
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-4 px-4 py-2">
              {messages.map((message) => (
                <div key={message.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Text Message</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(message.status)}`} />
                      <span className="text-xs capitalize text-muted-foreground">{message.status}</span>
                      <Badge variant="outline" className="ml-2">
                        {formatDate(message.sentAt)}
                      </Badge>
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
