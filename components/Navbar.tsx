import { NAVBAR_HEIGHT } from '@/asset-download/asset-download/client/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Navbar() {
  return (
    <div className={`fixed top-0 left-0 z-50 w-full shadow-xl h-${NAVBAR_HEIGHT}`}>
      <div className="flex-between bg-primary-700 w-full px-8 py-3 text-white">
        <div className="align-center gap-4 md:gap-6">
          <Link href="/" className="hover:text-primary-300! cursor-pointer" scroll={false}>
            <div className="align-center gap-3">
              <Image
                src="/logo.svg"
                alt="Rentiful Logo"
                width={24}
                height={24}
                className="size-6"
              />
              <div className="text-xl font-bold">
                RENT
                <span className="text-secondary-500 hover:text-primary-300! font-light">IFUL</span>
              </div>
            </div>
          </Link>
        </div>

        <p className="text-primary-200 hidden md:block">
          Discover your perfect rental parartment with our advanced search
        </p>

        <div className="align-center gap-5">
          <Link href="/signin">
            <Button
              variant="outline"
              className="hover:text-primary-700 rounded-lg border-white bg-transparent text-white hover:bg-white"
            >
              Sign In
            </Button>
          </Link>

          <Link href="/signup">
            <Button
              variant="outline"
              className="bg-secondary-600 hover:text-primary-700 rounded-lg text-white hover:bg-white"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
