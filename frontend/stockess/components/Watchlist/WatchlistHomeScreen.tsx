import Image from "next/image";

export default function WatchlistHomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="flex items-center justify-center m-2 w-1/4">        
          <Image
            src="/cat-doorbell.gif"
            alt="Welcome to the Watchlist"
            width={1}
            height={1}
            layout="responsive"
            className="mb-6 rounded-4xl"
            />
      </div>
      <h1 className="text-4xl font-bold mb-5">Watchlist</h1>
      <p className="text-lg text-gray-600 max-w-md mb-50">
        Get notified with exactly what you want
      </p>
    </div>
  );
}
