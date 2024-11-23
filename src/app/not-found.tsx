import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="mt-4 text-3xl font-semibold">Oops! Page Not Found</h2>
        <p className="mt-2 text-gray-600">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            href={"/"}
            className="px-6 py-3 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Custom404;
