'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-900 p-6 font-sans text-white">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-700 bg-slate-800 p-8 text-center shadow-2xl">
          <h2 className="text-2xl font-bold">A critical error occurred</h2>
          <p className="text-sm text-slate-400">
            {error?.message || 'We are experiencing an issue rendering the application.'}
          </p>
          <button
            onClick={() => reset()}
            className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-rose-700"
          >
            Refresh App
          </button>
        </div>
      </body>
    </html>
  );
}
