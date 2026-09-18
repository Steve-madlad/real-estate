import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { Modal } from './ui/custom/Modal';
import { Loader2 } from 'lucide-react';

export default function SigninPromptModal({
  open,
  onChange,
}: {
  open: boolean;
  onChange: (state: boolean) => void;
}) {
  const router = useRouter();
  const handleClick = () => {
    setRedirecting(true);
    router.push('/signin');
  };

  const [redirecting, setRedirecting] = useState(false);
  return (
    <Modal
      open={open}
      onOpenChange={onChange}
      title="Sign In?"
      description="You need to sign in to favorite properties"
    >
      <Button onClick={handleClick} disabled={redirecting}>
        {redirecting ? (
          <>
            <Loader2 className="animate-spin" />
            {'Redirecting'}
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </Modal>
  );
}
