import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface MessageComposerProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export function MessageComposer({ customer }: MessageComposerProps) {
  const [messageType, setMessageType] = useState<"email" | "text">("email");
  const [subject, setSubject] = useState("");
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

    if (messageType === "email" && !subject.trim()) {
      toast({
        title: "Subject is empty",
        description: "Please enter a subject for your email.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      // Send email using Resend
      if (messageType === "email") {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: customer.email,
            subject,
            html: message,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send email");
        }
      } else {
        // Text message sending will be implemented later
        toast({
          title: "Text messaging",
          description: "Text messaging functionality will be implemented soon.",
          variant: "default",
        });
      }

      toast({
        title: "Message sent",
        description: `Your ${messageType} has been sent to ${customer.name}.`,
      });

      // Reset form
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: `Failed to send ${messageType}. Please try again.`,
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
          <div className="flex items-center space-x-4">
            <RadioGroup
              defaultValue="email"
              value={messageType}
              onValueChange={(value) => setMessageType(value as "email" | "text")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text">Text Message</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label className="w-20">To:</Label>
              <div className="flex-1">
                <Input
                  value={messageType === "email" ? customer.email : customer.phone}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            {messageType === "email" && (
              <div className="flex items-center space-x-2">
                <Label className="w-20">Subject:</Label>
                <div className="flex-1">
                  <Input
                    placeholder="Enter subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Textarea
              placeholder={`Type your ${messageType} message here...`}
              className="min-h-[150px] resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSend}
                disabled={sending}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {sending ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 