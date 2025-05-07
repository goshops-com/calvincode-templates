'use client';

import { PropsWithChildren, useState } from 'react';

export default function ClientComponentWithChildren({
  children,
}: PropsWithChildren) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-y-1">
      {open && children}
      <p onClick={() => setOpen(true)}>Content (client component with children)</p>
    </div>
  );
}
