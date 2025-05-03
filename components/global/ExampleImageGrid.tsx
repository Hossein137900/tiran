"use client";
import ImageGrid from "./categoryGrid";

// Sample data for the image grid
const imageItems = [
  {
    id: "img1",
    imageUrl: "/assets/images/fashion/6.avif",
    title: "رویداد نمایشگاه تیران",
    description:
      "بزرگترین نمایشگاه محصولات تیران با تخفیف‌های ویژه و جوایز ارزنده",
    link: "/events/exhibition",
  },
  {
    id: "img2",
    imageUrl: "/assets/images/fashion/1.avif",
    title: "همایش سالانه",
    description: "همایش سالانه متخصصان و مدیران صنعت با حضور سخنرانان برجسته",
    link: "/events/conference",
  },
  {
    id: "img3",
    imageUrl: "/assets/images/fashion/5.avif",
    title: "کارگاه آموزشی",
    description:
      "کارگاه‌های تخصصی آموزش مهارت‌های فنی و مدیریتی با مدرسان مجرب",
    link: "/events/workshop",
  },
  {
    id: "img4",
    imageUrl: "/assets/images/fashion/4.avif",
    title: "جشنواره نوآوری",
    description:
      "معرفی آخرین دستاوردها و نوآوری‌های صنعت در قالب جشنواره سالانه",
    link: "/events/innovation",
  },
];

export default function ExampleImageGrid() {
  return (
    <div className=" py-16 mb-8">
      <div className="container mx-auto px-4">
        <div className="text-center" dir="rtl">
          <h2 className="md:text-3xl text-xl font-bold mb-4">رویدادهای ویژه</h2>
          <p className="text-gray-600 border-b border-dashed pb-2 text-sm md:text-lg mb-8 max-w-2xl mx-auto">
            آخرین رویدادها و برنامه‌های ویژه تیران را دنبال کنید و از فرصت‌های
            پیش رو مطلع شوید.
          </p>
        </div>

        <ImageGrid images={imageItems} />
      </div>
    </div>
  );
}
