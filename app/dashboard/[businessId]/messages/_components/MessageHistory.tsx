import { Mail, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  type: "email" | "text";
  subject?: string;
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

  const emailMessages = messages.filter((message) => message.type === "email");
  const textMessages = messages.filter((message) => message.type === "text");

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
          <Tabs defaultValue="all" className="w-full">
            <div className="px-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[calc(100vh-400px)]">
              <TabsContent value="all" className="px-4 py-2">
                <MessageList messages={messages} formatDate={formatDate} getStatusColor={getStatusColor} />
              </TabsContent>

              <TabsContent value="email" className="px-4 py-2">
                {emailMessages.length === 0 ? (
                  <div className="flex h-32 items-center justify-center">
                    <p className="text-sm text-muted-foreground">No email history</p>
                  </div>
                ) : (
                  <MessageList messages={emailMessages} formatDate={formatDate} getStatusColor={getStatusColor} />
                )}
              </TabsContent>

              <TabsContent value="text" className="px-4 py-2">
                {textMessages.length === 0 ? (
                  <div className="flex h-32 items-center justify-center">
                    <p className="text-sm text-muted-foreground">No text message history</p>
                  </div>
                ) : (
                  <MessageList messages={textMessages} formatDate={formatDate} getStatusColor={getStatusColor} />
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

interface MessageListProps {
  messages: Message[];
  formatDate: (date: string) => string;
  getStatusColor: (status: Message["status"]) => string;
}

function MessageList({ messages, formatDate, getStatusColor }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="rounded-lg border p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {message.type === "email" ? (
                <Mail className="h-4 w-4 text-muted-foreground" />
              ) : (
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-medium">
                {message.type === "email" ? "Email" : "Text Message"}
              </span>
              {message.subject && (
                <span className="text-sm text-muted-foreground">
                  - {message.subject}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${getStatusColor(
                  message.status
                )}`}
              />
              <span className="text-xs capitalize text-muted-foreground">
                {message.status}
              </span>
              <Badge variant="outline" className="ml-2">
                {formatDate(message.sentAt)}
              </Badge>
            </div>
          </div>
          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
        </div>
      ))}
    </div>
  );
} 