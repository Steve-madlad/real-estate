'use client';

import * as React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export interface ModalProps extends Omit<React.ComponentProps<typeof Dialog>, 'children'> {
  trigger?: React.ReactElement;
  triggerText?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

export function Modal({
  trigger,
  triggerText,
  title,
  description,
  footer,
  showCloseButton = true,
  className,
  children,
  ...props
}: ModalProps & { children?: React.ReactNode }) {
  return (
    <Dialog {...props}>
      {trigger ? (
        <DialogTrigger render={trigger} />
      ) : triggerText ? (
        <DialogTrigger>{triggerText}</DialogTrigger>
      ) : null}
      <DialogContent className={className} showCloseButton={showCloseButton}>
        {title || description ? (
          <DialogHeader>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
        ) : null}
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}
