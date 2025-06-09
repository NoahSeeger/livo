"use client";

import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto mt-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
      <p className="text-gray-600 mb-6">
        We've sent you an email with a link to verify your account. Please check
        your inbox and follow the instructions to complete your registration.
      </p>
      <p className="text-sm text-gray-500">
        Didn't receive the email? Check your spam folder or{" "}
        <button
          onClick={() => router.refresh()}
          className="text-blue-600 hover:text-blue-500"
        >
          try again
        </button>
      </p>
    </div>
  );
}
