import Image from "next/image";

export default function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="flex flex-2 items-center justify-center m-2 w-1/2">        
          <Image
            src="/logo-full.png"
            alt="StockEss logo"
            width={1}
            height={1}
            layout="responsive"
            className="mb-6 rounded-4xl"
            />
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
