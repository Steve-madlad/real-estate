import { toast } from 'sonner';
import ApplicationForm from './form/ApplicationForm';
import { Modal } from './ui/custom/Modal';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  description: string;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  propertyId,
  description,
}: ApplicationModalProps) {
  const onSuccess = () => {
    toast.success('we in there fam');
    onClose();
  };
  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Apply for Property"
      description={description}
      className="p-6"
    >
      <ApplicationForm propertyId={propertyId} onSuccess={onClose} />
    </Modal>
  );
}
