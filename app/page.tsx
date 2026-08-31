import { redirect } from 'next/navigation';

// This app only exists to host the Keystatic admin. Send the root at it.
export default function Home() {
  redirect('/keystatic');
}
