export default function Cancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
      <p className="text-gray-700 mb-6">
        Your payment was not completed. You can try again.
      </p>
      <a
        href="/home"
        className="px-4 py-2 bg-gray-800 text-white rounded-lg"
      >
        Return Home
      </a>
    </div>
  );
}
