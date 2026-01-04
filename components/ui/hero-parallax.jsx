"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export const HeroParallax = ({
  products,
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 0.2],
      isMobile ? [-100, 200] : [-550, 500]
    ),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[150vh] md:h-[280vh] py-10 md:py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        {/* Row 1 */}
        <motion.div style={{ x: translateX }} className="mb-10 md:mb-20">
          <motion.div
            className="flex flex-row-reverse space-x-reverse space-x-10 md:space-x-20"
            drag="x"
            dragConstraints={{ left: -1000, right: 1000 }}
            whileTap={{ cursor: "grabbing" }}
          >
            {firstRow.map((product) => (
              <ProductCard
                product={product}
                key={product.link}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Row 2 */}
        <motion.div style={{ x: translateXReverse }} className="mb-10 md:mb-20">
          <motion.div
            className="flex flex-row space-x-10 md:space-x-20"
            drag="x"
            dragConstraints={{ left: -1000, right: 1000 }}
            whileTap={{ cursor: "grabbing" }}
          >
            {secondRow.map((product) => (
              <ProductCard
                product={product}
                key={product.title}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-10 md:py-40 px-4 w-full  left-0 top-0">
      <h1 className="text-4xl md:text-7xl font-bold dark:text-white">
        Crafting Identity <br /> Through Art & Light
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
        Elevate your space with BullCroc&apos;s premium custom name plates, bespoke neon signs, and precision-cut metal letters.
        Designed to make a lasting impression.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-64 w-[16rem] md:h-96 md:w-[30rem] relative flex-shrink-0"
    >
      <Link
        href={product.link}
        className="block group-hover/product:shadow-2xl w-full h-full select-none"
        onDragStart={(e) => e.preventDefault()}
      >
        <div className="h-full w-full relative">
          <Image
            src={product.thumbnail || "https://images.unsplash.com/photo-1741332966416-414d8a5b8887?w=600&auto=format&fit=crop&q=60"}
            height={600}
            width={600}
            className="object-cover object-left-top absolute h-full w-full inset-0"
            alt={product.title}
            draggable={false}
          />
        </div>
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
