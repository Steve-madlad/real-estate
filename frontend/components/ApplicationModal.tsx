import ApplicationForm from './form/ApplicationForm';
import { Modal } from './ui/custom/Modal';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
}

export default function ApplicationModal({ isOpen, onClose, propertyId }: ApplicationModalProps) {
  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Are you absolutely sure?"
      description="This action cannot be undone."
    >
      <ApplicationForm propertyId={propertyId} />
    </Modal>
  );
}
