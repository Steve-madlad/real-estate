'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function CallToActionSection() {
  return (
    <section className="relative py-24">
      <Image
        src="/landing-call-to-action.jpg"
        alt="Rentiful Search Section Background"
        fill
        className="object-cover"
      />
      <div className="abs-fill bg-black/60"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12 xl:max-w-6xl xl:px-16"
      >
        <div className="col-full-center">
          <div className="mb-6 md:mr-10 md:mb-0">
            <h2 className="text-2xl font-bold text-white">Find your Dream rental Property</h2>
          </div>

          <div>
            <p className="mb-3 text-white">
              Discover a wide range of rental properties in your desired location.
            </p>
            <div className="just-center gap-4 md:justify-start!">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-primary-700 hover:bg-primary-500 hover:text-primary-50 inline-block rounded-lg bg-white px-6 py-3 font-semibold"
              >
                Search
              </button>

              <Link
                href="/signup"
                scroll={false}
                className="bg-secondary-500 hover:bg-secondary-600 inline-block rounded-lg px-6 py-3 font-semibold text-white"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
