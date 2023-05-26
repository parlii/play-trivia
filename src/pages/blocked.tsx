export default function Blocked() {
  return (
    <div className="flex items-center justify-center bg-gray-100">
      <main className="text-center p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-red-600">
          Too many requests. Access blocked. Try again later!
        </h3>
      </main>
    </div>
  );
}
