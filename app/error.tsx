'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("APP ERROR", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-8 text-center text-red-900 border-4 border-red-500">
      <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
      <pre className="text-left bg-white p-4 rounded border border-red-200 overflow-auto max-w-4xl text-sm mb-4">
        {error.message}
        {"\n\n"}
        {error.stack}
      </pre>
      <button
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
