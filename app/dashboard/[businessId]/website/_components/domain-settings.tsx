'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertTriangle, CheckCircle, Globe, ExternalLink, Copy, Info } from "lucide-react";

interface DomainSettingsProps {
  businessId: string;
  initialDomain: string | null;
  businessName?: string;
}

export default function DomainSettings({ businessId, initialDomain, businessName = "" }: DomainSettingsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [customDomain, setCustomDomain] = useState(initialDomain || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"none" | "pending" | "success" | "error">("none");
  
  // Format business name for default domain suggestion
  const formattedBusinessName = businessName
    ? businessName.replace(/\s+/g, '-').toLowerCase().replace(/[^\w-]/g, '')
    : businessId;
  
  const defaultDomain = `${formattedBusinessName}.localhost`;
  const previewUrl = customDomain 
    ? `http://${customDomain}` 
    : `http://${formattedBusinessName}.localhost:3000`;
  
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDomain(e.target.value);
    setVerificationStatus("none");
  };
  
  const handleVerifyDomain = async () => {
    if (!customDomain) return;
    
    setIsVerifying(true);
    
    try {
      // Call the domain verification API
      const response = await fetch(`/api/businesses/${businessId}/domain/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: customDomain }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }
      
      setVerificationStatus("success");
      toast({
        title: "Domain verified",
        description: data.message || "Your domain has been successfully verified.",
      });
    } catch (error) {
      console.error("Error verifying domain:", error);
      setVerificationStatus("error");
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "There was a problem verifying your domain.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleSaveDomain = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/businesses/${businessId}/domain`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customDomain }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update domain");
      }
      
      toast({
        title: "Domain updated",
        description: "Your custom domain has been saved successfully.",
      });
      
      router.refresh();
    } catch (error) {
      console.error("Error updating domain:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your custom domain.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyDnsRecord = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied",
      description: "DNS record copied to clipboard",
    });
  };
  
  const handlePreviewSite = () => {
    window.open(previewUrl, '_blank');
  };
  
  // Set default domain if no custom domain is set
  useEffect(() => {
    if (!customDomain && formattedBusinessName) {
      setCustomDomain(defaultDomain);
    }
  }, [customDomain, formattedBusinessName, defaultDomain]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Your website is available at:</h2>
          <div className="flex items-center mt-1">
            <code className="bg-muted px-2 py-1 rounded text-sm font-mono flex items-center">
              {previewUrl}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 ml-2" 
                onClick={() => {
                  navigator.clipboard.writeText(previewUrl);
                  toast({
                    title: "URL copied",
                    description: "Website URL copied to clipboard",
                  });
                }}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy URL</span>
              </Button>
            </code>
          </div>
        </div>
        <Button onClick={handlePreviewSite} className="gap-2">
          <ExternalLink className="h-4 w-4" />
          Preview Site
        </Button>
      </div>
      
      <Tabs defaultValue="custom-domain">
        <TabsList>
          <TabsTrigger value="custom-domain">Custom Domain</TabsTrigger>
          <TabsTrigger value="dns-settings">DNS Settings</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="custom-domain" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain</CardTitle>
              <CardDescription>
                Connect your own domain to your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customDomain">Domain Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="customDomain"
                    value={customDomain}
                    onChange={handleDomainChange}
                    placeholder={defaultDomain}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleVerifyDomain}
                    disabled={!customDomain || isVerifying}
                    variant="outline"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter your domain name without "http://" or "https://".
                </p>
              </div>
              
              {verificationStatus === "success" && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Domain verified</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Your domain has been successfully verified. You can now save your changes.
                  </AlertDescription>
                </Alert>
              )}
              
              {verificationStatus === "error" && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Verification failed</AlertTitle>
                  <AlertDescription>
                    We couldn't verify your domain. Please check your DNS settings and try again.
                  </AlertDescription>
                </Alert>
              )}
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>How to set up your custom domain</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>1. Purchase a domain from a domain registrar (like Namecheap, GoDaddy, or Google Domains)</p>
                  <p>2. Configure your DNS settings as shown in the DNS Settings tab</p>
                  <p>3. Enter your domain above and click Verify</p>
                  <p>4. Once verified, click Save Changes to activate your custom domain</p>
                </AlertDescription>
              </Alert>
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Default Domain</h3>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <code className="text-sm bg-muted-foreground/20 px-1 py-0.5 rounded">
                    {defaultDomain}
                  </code>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This is your default domain. It will always work, even if you set up a custom domain.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/dashboard/${businessId}/website`)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveDomain}
                disabled={isLoading || (customDomain !== initialDomain && verificationStatus !== "success")}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="dns-settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>DNS Configuration</CardTitle>
              <CardDescription>
                Configure your DNS settings to point to our servers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  You need to configure your DNS settings with your domain registrar for your custom domain to work.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <h3 className="font-medium">DNS Records</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Value</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="px-4 py-2">CNAME</td>
                        <td className="px-4 py-2">@</td>
                        <td className="px-4 py-2">cname.yourdomain.com</td>
                        <td className="px-4 py-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCopyDnsRecord('cname.yourdomain.com')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">CNAME</td>
                        <td className="px-4 py-2">www</td>
                        <td className="px-4 py-2">cname.yourdomain.com</td>
                        <td className="px-4 py-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCopyDnsRecord('cname.yourdomain.com')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">TXT</td>
                        <td className="px-4 py-2">_inflatemate-verification</td>
                        <td className="px-4 py-2">{`verification=${businessId}`}</td>
                        <td className="px-4 py-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCopyDnsRecord(`verification=${businessId}`)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">DNS Propagation</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    DNS changes can take up to 48 hours to propagate across the internet. If your domain doesn't work immediately, please be patient.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="troubleshooting" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
              <CardDescription>
                Common issues and solutions for custom domains
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Domain not working after configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    DNS changes can take up to 48 hours to propagate. Wait at least 24 hours before troubleshooting further.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Domain verification failing</h3>
                  <p className="text-sm text-muted-foreground">
                    Make sure you've added the TXT record exactly as shown in the DNS Settings tab. Some domain registrars require you to add the full domain name in the Name field.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">HTTPS not working</h3>
                  <p className="text-sm text-muted-foreground">
                    SSL certificates are automatically provisioned for verified domains. This process can take up to 24 hours after domain verification.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Need more help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact our support team at support@inflatemate.com for assistance with your custom domain setup.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 