'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AllergensSheet } from './AllergensSheet';

export function AllergensSheetAuto() {
  const searchParams = useSearchParams();
  const [isSheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('alergias') === 'true') {
      setSheetOpen(true);
    }
  }, [searchParams]);

  return <AllergensSheet open={isSheetOpen} onOpenChange={setSheetOpen} />;
}
