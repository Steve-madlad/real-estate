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

export default function DiscoverSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={containerVariants}
      className="mb-16 bg-white py-12"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 xl:max-w-7xl xl:px-16">
        <motion.div variants={itemVariants} className="my-12 text-center">
          <h2 className="text-3xl leading-tight font-semibold text-gray-800">Discover</h2>
          <p className="mt-4 text-lg text-gray-600 capitalize">
            Find your dream rental property today!
          </p>
          <p className="mx-auto mt-2 max-w-3xl text-gray-500">
            Searching for your dream rental property has never been easier. With our user-friendly
            search feature, you can quickly find the perfect home that meets all your needs. Start
            your search today and discover your dr9rn rental property!
          </p>
        </motion.div>

        <div className="gird-cols-1 grid gap-8 text-center md:grid-cols-3 lg:gap-12 xl:gap-16">
          {[
            {
              imageSrc: '/landing-icon-wand.png',
              title: 'Search for Properties',
              description:
                'Browse through our extensive collection of rental properties in your desired location',
            },
            {
              imageSrc: '/landing-icon-calendar.png',
              title: 'Book your Rental',
              description:
                'Once you •ve found the perfect rental property, easily book it online with just a few clicks',
            },
            {
              imageSrc: '/landing-icon-heart.png',
              title: 'Enjoy your New Home ',
              description: 'Move into your rental property and start enjoying your dream home',
            },
          ].map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <DiscoverCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

const DiscoverCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-primary-50 col-full-center rounded-lg px-4 py-12 shadow-lg md:h-72">
      <div className="bg-primary-700 mx-auto mb-4 size-10 rounded-full p-2.5">
        <Image src={imageSrc} width="30" height="30" alt="title" className="size-full" />
      </div>
      <h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>
      <p className="mb-2 text-base text-gray-500">{description}</p>
    </div>
  );
};
