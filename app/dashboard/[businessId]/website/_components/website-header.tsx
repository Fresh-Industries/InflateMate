'use client';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Globe, ExternalLink, Eye, Copy } from "lucide-react";
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
  
  const domain = customDomain || `${formattedBusinessName}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  
  
  const handlePreview = () => {
    // Format business name for subdomain
    const formattedBusinessName = businessName
      .replace(/\s+/g, '-')
      .toLowerCase()
      .replace(/[^\w-]/g, '');
    
    // Open the business website using the subdomain format
    if (process.env.NODE_ENV === 'development') {
      const subdomainUrl = `http://${formattedBusinessName}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
      window.open(subdomainUrl, '_blank');
    } else {
      const subdomainUrl = `https://${formattedBusinessName}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
      window.open(subdomainUrl, '_blank');
    }
  };
  
  const handleCopyDomain = () => {
    navigator.clipboard.writeText(domain);
    toast({
      title: "Domain copied",
      description: "The domain has been copied to your clipboard.",
    });
  };
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6 mb-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Website Customization
        </h1>
        <p className="text-base text-muted-foreground mt-1">
          Customize your website appearance, content, and domain.
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 border bg-secondary/50 px-3 py-1.5 rounded-md text-sm font-medium">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span>{domain}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={handleCopyDomain}
            aria-label="Copy domain"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy domain</span>
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={handlePreview}
        >
          <Eye className="h-4 w-4" />
          Preview Site
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          asChild
        >
          <Link href={`/dashboard/${businessId}/website/domain`}>
            <ExternalLink className="h-4 w-4" />
            Manage Domain
          </Link>
        </Button>
      </div>
    </div>
  );
} 