import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CreatePropertyForm from '@/components/form/CreatePropertyForm';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';

export default function CreatePropertyPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-2 flex items-center gap-2">
        <Link
          href="/managers/dashboard/properties"
          className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to Properties
        </Link>
      </div>

      <Header
        title="List a New Property"
        subtitle="Provide property details, upload high-resolution photos, and set pricing terms."
      />

      <Card className="border-border/80 bg-card rounded-3xl border p-6 shadow-xs sm:p-8">
        <CreatePropertyForm />
      </Card>
    </div>
  );
}
