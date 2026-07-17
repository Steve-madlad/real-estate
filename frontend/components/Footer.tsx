import Link from 'next/link';
import { AiFillInstagram, AiFillLinkedin, AiFillYoutube } from 'react-icons/ai';
import { FaFacebook } from 'react-icons/fa6';
import { GrTwitter } from 'react-icons/gr';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="col-between items-center">
          <div className="mb-4">
            <Link href="/" className="text-xl font-bold" scroll={false}>
              RENTIFUL
            </Link>
          </div>

          <div className="mb-4">
            <ul className="flex space-x-6">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </div>

          <div className="mb-4 flex space-x-4">
            <a href="#" className="hover:text-primary-600" aria-label="Facebook">
              <FaFacebook size={22} />
            </a>
            <a href="#" className="hover:text-primary-600" aria-label="Twitter">
              <GrTwitter size={22} />
            </a>
            <a href="#" className="hover:text-primary-600" aria-label="YouTube">
              <AiFillYoutube size={25} />
            </a>
            <a href="#" className="hover:text-primary-600" aria-label="Instagram">
              <AiFillInstagram size={25} />
            </a>
            <a href="#" className="hover:text-primary-600" aria-label="LinkedIn">
              <AiFillLinkedin size={25} />
            </a>
          </div>
        </div>

        <div className="just-center mt-8 text-center text-sm text-gray-500">
          <span>© {new Date().getFullYear()} RENTIFUL. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
