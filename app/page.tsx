import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to English homepage by default
  redirect('/en');
}
