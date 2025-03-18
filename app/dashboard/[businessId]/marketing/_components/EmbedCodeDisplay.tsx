"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmbedCodeDisplayProps {
  businessId: string;
}

export function EmbedCodeDisplay({ businessId }: EmbedCodeDisplayProps) {
  const [embedCode, setEmbedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchEmbedCode = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/businesses/${businessId}/sales-funnels/embed`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch embed code");
        }
        
        const code = await response.text();
        setEmbedCode(code);
      } catch (error) {
        console.error("Error fetching embed code:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch embed code");
        toast({
          title: "Error",
          description: "Failed to fetch embed code. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmbedCode();
  }, [businessId, toast]);
  
  const copyToClipboard = async () => {
    if (!embedCode) return;
    
    try {
      await navigator.clipboard.writeText(embedCode);
      setIsCopied(true);
      
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard",
      });
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Code</CardTitle>
        <CardDescription>
          Add this code to your website to display your sales funnel popup
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : embedCode ? (
          <div className="relative">
            <pre className="p-4 bg-gray-50 rounded-md overflow-x-auto text-sm max-h-96">
              <code>{embedCode}</code>
            </pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500">No embed code available</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
        <div className="text-sm text-gray-500">
          <p>Place this code before the closing &lt;/body&gt; tag on your website.</p>
        </div>
        <Button
          onClick={copyToClipboard}
          disabled={!embedCode || isLoading}
          className="w-full sm:w-auto"
        >
          {isCopied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 