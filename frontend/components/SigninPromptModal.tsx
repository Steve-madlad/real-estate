'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { Modal } from './ui/custom/Modal';
import { Loader2, LogIn, Sparkles } from 'lucide-react';

export default function SigninPromptModal({
  open,
  onChange,
  onOpenChange,
}: {
  open: boolean;
  onChange?: (state: boolean) => void;
  onOpenChange?: (state: boolean) => void;
}) {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const handleClick = () => {
    setRedirecting(true);
    router.push('/signin');
  };

  const handleOpenChange = (state: boolean) => {
    if (onOpenChange) onOpenChange(state);
    if (onChange) onChange(state);
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Sign in to Continue"
      description="Save your favorite listings, track properties, and apply seamlessly with a free account."
      className="max-w-md rounded-3xl p-6 text-center sm:p-8"
    >
      <div className="flex flex-col gap-3 pt-4">
        <Button
          onClick={handleClick}
          disabled={redirecting}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full gap-2 rounded-2xl py-5 text-sm font-bold shadow-md"
        >
          {redirecting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Redirecting to Sign In...</span>
            </>
          ) : (
            <>
              <LogIn className="size-4" />
              <span>Sign In to Account</span>
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setRedirecting(true);
            router.push('/signup');
          }}
          disabled={redirecting}
          className="border-border/80 w-full rounded-2xl py-5 text-xs font-semibold"
        >
          Create New Account
        </Button>
      </div>
    </Modal>
  );
}
