'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [cnt, setCnt] = useState(0);

  return (
    <div className="flex gap-x-2">
      <div
        className="cursor-pointer select-none"
        onClick={() => setCnt((prev) => prev - 1)}
      >
        -
      </div>
      <div>{cnt} (client component)</div>
      <div
        className="cursor-pointer select-none"
        onClick={() => setCnt((prev) => prev + 1)}
      >
        +
      </div>
    </div>
  );
}
