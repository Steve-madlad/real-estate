import CreatePropertyForm from '@/components/form/CreatePropertyForm';

import Header from '@/components/Header';
import { Card } from '@/components/ui/card';

export default function CreateProperty() {
  return (
    <div>
      <Header title="Create Property" subtitle="Create a new property listing" />

      <Card className="p-6">
        <CreatePropertyForm />
      </Card>
    </div>
  );
}
