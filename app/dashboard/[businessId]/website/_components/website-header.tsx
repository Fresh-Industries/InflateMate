'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Globe, ExternalLink, Eye } from "lucide-react";
import Link from "next/link";

interface WebsiteHeaderProps {
  businessId: string;
  businessName: string;
  customDomain: string | null;
}

export default function WebsiteHeader({ businessId, businessName, customDomain }: WebsiteHeaderProps) {
  const { toast } = useToast();
  
  // Format business name for subdomain
  const formattedBusinessName = businessName
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^\w-]/g, '');
  
  const domain = customDomain || `${formattedBusinessName}.localhost`;
  
  
  const handlePreview = () => {
    // Format business name for subdomain
    const formattedBusinessName = businessName
      .replace(/\s+/g, '-')
      .toLowerCase()
      .replace(/[^\w-]/g, '');
    
    // Open the business website using the subdomain format
    const subdomainUrl = `http://${formattedBusinessName}.localhost:3000`;
    window.open(subdomainUrl, '_blank');
  };
  
  const handleCopyDomain = () => {
    navigator.clipboard.writeText(domain);
    toast({
      title: "Domain copied",
      description: "The domain has been copied to your clipboard.",
    });
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Website Customization</h1>
        <p className="text-muted-foreground">
          Customize your website appearance and content
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md text-sm">
          <Globe className="h-4 w-4" />
          <span className="font-medium">{domain}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={handleCopyDomain}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="sr-only">Copy domain</span>
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={handlePreview}
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          asChild
        >
          <Link href={`/dashboard/${businessId}/website/domain`}>
            <ExternalLink className="h-4 w-4" />
            Custom Domain
          </Link>
        </Button>
      </div>
    </div>
  );
} 