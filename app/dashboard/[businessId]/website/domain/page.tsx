 import DomainSettings from "../_components/domain-settings";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';


interface PageProps {
  params: Promise<{ businessId: string }>;
}

export default async function DomainPage(props: PageProps) {
  const params = await props.params;
  const { businessId } = params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" size="sm" asChild className="mr-2">
            <Link href={`/dashboard/${businessId}/website`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Website Settings
            </Link>
          </Button>
        </div>
      </div>
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Custom Domain</h1>
        <p className="text-muted-foreground">
          Configure a custom domain for your website
        </p>
      </div>
      
      <DomainSettings />
    </div>
  );
} 