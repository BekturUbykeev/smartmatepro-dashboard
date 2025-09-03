"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="p-8">
                <h2 className="text-xl font-semibold">Something went wrong</h2>
                <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
                <button
                    onClick={reset}
                    className="mt-4 rounded-lg bg-black px-4 py-2 text-white"
                >
                    Try again
                </button>
            </body>
        </html>
    );
}
