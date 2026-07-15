import type { Metadata } from 'next';

// noIndex: verification step of the legacy student-portal auth flow,
// superseded by /student-login — see app/student-portal/page.tsx.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function StudentPortalVerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
