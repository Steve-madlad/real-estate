import { ArrowUpRightIcon, Building } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Empty as EmptyBase,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { ReactNode } from 'react';

interface EmptyProps {
  emptyTitle: string;
  emptyDescription: string;
  children: ReactNode;
}
export function Empty({ emptyTitle, emptyDescription, children }: EmptyProps) {
  return (
    <EmptyBase>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Building />
        </EmptyMedia>
        <EmptyTitle>{emptyTitle}</EmptyTitle>
        <EmptyDescription>{emptyDescription}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">{children}</EmptyContent>
    </EmptyBase>
  );
}
