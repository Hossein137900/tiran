import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MegaMenuProps } from "@/types/type";

const MegaMenu: React.FC<MegaMenuProps> = ({
  categories,
  hoveredCategory,
  setHoveredCategory,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<number | null>(
    null
  );
  console.log(hoveredSubcategory);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const megaMenuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      height: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  const categoryImageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, delay: 0.1 },
    },
  };

  const childCategoryVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: 0.05 * custom },
    }),
  };

  const thirdLevelVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const thirdLevelItemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {hoveredCategory !== null && (
        <motion.div
          className="absolute left-0 right-0 w-screen bg-white shadow-lg z-9999"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={megaMenuVariants}
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={() => setHoveredCategory(null)}
          style={{ top: "100%" }}
        >
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {categories[hoveredCategory] && (
              <div className="grid grid-cols-12 gap-6">
                {/* Category Image */}
                <motion.div
                  className="col-span-3 flex flex-col items-center justify-center"
                  variants={categoryImageVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-black text-xl font-medium mb-2 pb-2 border-b border-gray-400 w-fit px-4 ml-auto text-right">
                    {categories[hoveredCategory].cat_name}
                  </h3>

                  <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3 shadow-md transform transition-transform duration-300 hover:scale-105">
                    <Image
                      src={
                        categories[hoveredCategory].image_url ||
                        "/assets/images/imagegrow.avif"
                      }
                      alt={categories[hoveredCategory].cat_name}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>

                  <Link
                    href={`/category/${categories[hoveredCategory].slug}`}
                    className="text-gray-700 hover:text-black font-medium text-sm flex items-center group"
                  >
                    <span className="relative">
                      مشاهده همه محصولات
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </motion.div>

                {/* Subcategories */}
                <div className="col-span-9">
                  <div className="grid grid-cols-5">
                    {categories[hoveredCategory].children &&
                      categories[hoveredCategory].children.map(
                        (subcategory, index) => (
                          <motion.div
                            key={subcategory.id}
                            custom={index}
                            variants={childCategoryVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col"
                            onMouseEnter={() => setHoveredSubcategory(index)}
                            onMouseLeave={() => setHoveredSubcategory(null)}
                          >
                            <Link
                              href={`/category/${subcategory.slug}`}
                              className="text-gray-900 font-medium text-base mb-3 hover:text-black  transition-all duration-300 hover:border-black hover:pr-3"
                            >
                              {subcategory.cat_name}
                            </Link>

                            {/* Third level categories if they exist */}
                            {subcategory.children &&
                              subcategory.children.length > 0 && (
                                <motion.div
                                  className="flex flex-col space-y-2 pr-4"
                                  variants={thirdLevelVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  {subcategory.children.map(
                                    (thirdLevel, idx) => (
                                      <motion.div
                                        key={idx}
                                        variants={thirdLevelItemVariants}
                                        className="overflow-hidden"
                                      >
                                        <Link
                                          href={`/category/${thirdLevel.slug}`}
                                          className="text-gray-600 text-sm hover:text-black hover:pr-1 transition-all duration-200 block relative group"
                                        >
                                          <span className="inline-block">
                                            {thirdLevel.cat_name}
                                          </span>
                                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-400 transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                      </motion.div>
                                    )
                                  )}
                                </motion.div>
                              )}
                          </motion.div>
                        )
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
