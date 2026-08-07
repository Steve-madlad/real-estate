import { Loader } from 'lucide-react';

export default function loading() {
  return (
    <div className="flex-center h-screen gap-4">
      Loading... <Loader className="animate-spin" />
    </div>
  );
}
