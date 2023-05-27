import Link from "next/link";

export default function Blocked() {
  return (
    <div className="flex items-center justify-center bg-gray-100">
      <main className="text-center p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-red-600">
          Too many requests. Access blocked. Try again later!
        </h3>

        <Link
          href="/"
          className="inline-block px-4 py-2 mt-4 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-500"
        >
          Go back to home page
        </Link>
      </main>
    </div>
  );
}
