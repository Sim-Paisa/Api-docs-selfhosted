import HideDeleteGuard from './hide-delete-guard';

// Wraps every /keystatic route. Mounts the soft guard that hides the entry-level
// Delete action to prevent accidental whole-page deletion.
export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <HideDeleteGuard />
    </>
  );
}
