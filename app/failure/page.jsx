"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Page() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Failure />
    </Suspense>
  );
}
const Failure = () => {
  const searchParams = useSearchParams();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold text-red-500 text-center mb-4">Fail</h1>
        <p className="text-lg font-medium text-gray-700 mb-2">Transaction ID: <span className="text-gray-900">{searchParams.get("transactionId")}</span></p>
        <p className="text-lg font-medium text-gray-700 mb-2">Amount: <span className="text-gray-900">{Number(searchParams.get("amount"))}</span></p>
        <p className="text-lg font-medium text-gray-700">Provider Reference ID: <span className="text-gray-900">{searchParams.get("providerReferenceId")}</span></p>
      </div>
    </div>
  )
}
