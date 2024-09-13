export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <div className="loader border-t-4 border-b-4 border-blue-500 rounded-full w-12 h-12 mb-4 animate-spin"></div>
        <p className="text-white">Loading ...</p>
      </div>
    </div>
  );
}
