'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
export default function FeaturesSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={containerVariants}
      className="bg-white px-6 py-24 sm:px-8 lg:px-12 xl:px-16"
    >
      <div className="mx-auto max-w-4xl xl:max-w-6xl">
        <motion.h2
          variants={itemVariants}
          className="mx-auto mb-12 w-full text-center text-3xl font-bold sm:w-2/3"
        >
          Quickly find the home you want using our effective search fitters!
        </motion.h2>
        <div className="gird-cols-1 grid gap-8 md:grid-cols-3 lg:gap-12 xl:gap-16">
          {[0, 1, 2].map((_, index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                imageSrc={`/landing-search${3 - index}.png`}
                title={
                  [
                    'Trustworthy and Verified Listings',
                    'Browse Rental Listings with Ease',
                    'Simplify Your Rental Search with Advanced',
                  ][index]
                }
                description={
                  [
                    'Discover the best rental options with user reviews and ratings',
                    'Get access to user reviews and ratings for a better understanding of rental options',
                    'Find trustworthy and verified rental listings to ensure a hassle-free experiences',
                  ][index]
                }
                linkText={['Explore', 'Search', 'Discover'][index]}
                linkHref={['/explore', '/search', '/discover'][index]}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

const FeatureCard = ({
  imageSrc,
  title,
  description,
  linkText,
  linkHref,
}: {
  imageSrc: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}) => {
  return (
    <div className="text-center">
      <div className="flex-center mb-4 h-48 rounded-lg p-4">
        <Image
          src={imageSrc}
          width="400"
          height="400"
          alt="title"
          className="size-full object-contain"
        />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-4">{description}</p>
      <Link
        href={linkHref}
        className="inline-block rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
        scroll={false}
      >
        {linkText}
      </Link>
    </div>
  );
};
