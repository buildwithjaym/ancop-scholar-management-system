import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Qorban Scholar Portal",
  description:
    "Secure access to the Qorban Scholar academic management portal.",
};

type LoginLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function LoginLayout({ children }: LoginLayoutProps) {
  return children;
}