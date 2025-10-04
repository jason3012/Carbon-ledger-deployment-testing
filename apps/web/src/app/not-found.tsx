export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Not Found</h2>
        <p className="text-gray-600 mb-4">Could not find requested resource</p>
        <a
          href="/"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
