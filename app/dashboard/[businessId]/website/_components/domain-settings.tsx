'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Globe, AlertCircle, Check, Trash2, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from "sonner";
import { Badge } from '@/components/ui/badge';

// Schema for domain validation
const domainSchema = z.object({
  domain: z
    .string()
    .min(1, 'Domain is required')
    .refine(
      (domain) => /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(domain),
      'Please enter a valid domain (e.g., example.com)'
    ),
});

type DomainFormValues = z.infer<typeof domainSchema>;

type DomainStatus = 'loading' | 'valid' | 'invalid' | 'configuring' | 'active';

export default function DomainSettings() {
  const params = useParams();
  const businessId = typeof params.businessId === 'string' ? params.businessId : '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<string | null>(null);
  const [domainStatus, setDomainStatus] = useState<DomainStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize form
  const form = useForm<DomainFormValues>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain: '',
    },
  });

  // Fetch the current domain
  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const res = await fetch(`/api/businesses/${businessId}/domain`);
        const data = await res.json();
        
        if (data.customDomain) {
          setCurrentDomain(data.customDomain);
          setDomainStatus('active'); // Assume active if there's a domain
        } else {
          setDomainStatus('valid');
        }
        
        setErrorMessage(null);
      } catch (error) {
        console.error('Error fetching domain:', error);
        setErrorMessage('Failed to load domain information');
        setDomainStatus('invalid');
      }
    };

    if (businessId) {
      fetchDomain();
    }
  }, [businessId]);

  // Handle form submission
  const onSubmit = async (values: DomainFormValues) => {
    setIsSubmitting(true);
    setDomainStatus('configuring');
    setErrorMessage(null);
    
    try {
      // Submit to your API endpoint for verification
      const res = await fetch(`/api/businesses/${businessId}/domain/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: values.domain }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to configure domain');
      }
      
      // Success
      setCurrentDomain(values.domain);
      setDomainStatus('active');
      form.reset();
      
      toast.success("Domain added successfully");
    } catch (error) {
      console.error('Error adding domain:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to add domain');
      setDomainStatus('invalid');
      
      toast.error(error instanceof Error ? error.message : 'Failed to add domain');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle domain removal
  const handleRemoveDomain = async () => {
    if (!currentDomain) return;
    
    if (!confirm('Are you sure you want to remove this domain? This action cannot be undone.')) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/businesses/${businessId}/domain`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customDomain: null }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to remove domain');
      }
      
      setCurrentDomain(null);
      setDomainStatus('valid');
      
      toast.success("Domain removed");
    } catch (error) {
      console.error('Error removing domain:', error);
      
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render status badge for current domain
  const getDomainStatusBadge = () => {
    switch (domainStatus) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'configuring':
        return <Badge className="bg-yellow-500">Configuring</Badge>;
      case 'invalid':
        return <Badge className="bg-red-500">Invalid</Badge>;
      case 'loading':
        return <Badge className="bg-gray-400">Loading</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Domain Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" /> 
            Custom Domain
          </CardTitle>
          <CardDescription>
            Connect your own domain to your business website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentDomain ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{currentDomain}</span>
                  {getDomainStatusBadge()}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRemoveDomain}
                  disabled={isSubmitting}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Remove
                </Button>
              </div>
              
              {domainStatus === 'active' && (
                <Alert className="bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertTitle>Domain Active</AlertTitle>
                  <AlertDescription>
                    Your domain is properly configured and active.
                  </AlertDescription>
                </Alert>
              )}
              
              {domainStatus === 'invalid' && errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Configuration Error</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Custom Domain</AlertTitle>
              <AlertDescription>
                You&apos;re currently using our default domain. Add your custom domain below.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      {/* Add New Domain Section */}
      {!currentDomain && (
        <Card>
          <CardHeader>
            <CardTitle>Add Custom Domain</CardTitle>
            <CardDescription>
              Enter your domain to connect it with your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain Name</FormLabel>
                      <FormControl>
                        <Input placeholder="example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your domain without &apos;http://&apos; or &apos;www.&apos; (e.g., example.com)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  variant="primary-gradient"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Configuring...
                    </>
                  ) : (
                    'Add & Verify Domain'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      
      {/* Domain Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>DNS Configuration Guide</CardTitle>
          <CardDescription>
            How to set up your DNS records correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              After adding your domain, you&apos;ll need to configure your DNS records at your domain registrar:
            </p>
            
            <div className="rounded-md bg-muted p-4">
              <h4 className="font-medium mb-2">CNAME Record</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium">Type</div>
                <div className="col-span-2">CNAME</div>
                <div className="font-medium">Name</div>
                <div className="col-span-2">www or @</div>
                <div className="font-medium">Value</div>
                <div className="col-span-2">cname.vercel-dns.com</div>
                <div className="font-medium">TTL</div>
                <div className="col-span-2">Automatic or 3600</div>
              </div>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle>Need Help?</AlertTitle>
              <AlertDescription className="flex items-center">
                Check our <a href="#" className="text-blue-600 hover:underline ml-1 mr-1">domain setup guide</a> for more detailed instructions.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 py-3 px-6 flex justify-between">
          <span className="text-sm text-muted-foreground">
            Having trouble? Contact our support team.
          </span>
          <Button variant="outline" size="sm" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1 h-4 w-4" />
              DNS Documentation
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 