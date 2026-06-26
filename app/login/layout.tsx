import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | ANCOP Submission Portal",
  description:
    "Secure access to the ANCOP Scholar academic management portal.",
};

type LoginLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function LoginLayout({ children }: LoginLayoutProps) {
  return children;
}