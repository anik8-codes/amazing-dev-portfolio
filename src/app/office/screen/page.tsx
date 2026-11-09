import type { Metadata } from 'next';
import { OfficeDesktop } from '@/components/office/OfficeDesktop';

export const metadata: Metadata = {
  title: 'desktop · anik8',
  robots: { index: false, follow: false },
};

export default function OfficeScreen() {
  return <OfficeDesktop />;
}
