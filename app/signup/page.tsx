import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import AuthLayout from "@/components/AuthLayout";

const SignupForm = dynamic(() => import("@/components/SignupForm"), { ssr: false });

export default function SignupPage() {
  return (
    <AuthLayout title="Open your account" subtitle="Takes about three minutes. Funding is optional until you're ready.">
      <Suspense fallback={<div />}>
        <SignupForm />
      </Suspense>
    </AuthLayout>
  );
}
