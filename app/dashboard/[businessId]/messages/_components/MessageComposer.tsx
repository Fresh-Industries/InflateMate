import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface MessageComposerProps {
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  businessId: string;
}

export function MessageComposer({ customer, businessId }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: "Message is empty",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`/api/businesses/${businessId}/messaging`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: customer.phone,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast({
        title: "Message sent",
        description: `Your text message has been sent to ${customer.name}.`,
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send text message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">

          <Textarea
            placeholder="Type your message here..."
            className="min-h-[150px] resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleSend} disabled={sending} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
