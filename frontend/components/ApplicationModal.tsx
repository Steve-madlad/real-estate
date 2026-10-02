'use client';

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
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Rental Application"
      description={description}
      className="max-w-lg rounded-3xl p-6 sm:p-8"
    >
      <ApplicationForm propertyId={propertyId} onSuccess={onSuccess} />
    </Modal>
  );
}
