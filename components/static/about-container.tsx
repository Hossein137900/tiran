import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "درباره ما | تیران",
  description: "آشنایی با فروشگاه تیران، ارزش‌ها و اهداف ما",
};

const TeamSection = [
  {
    name: "علی محمدی",
    role: "بنیانگذار و مدیرعامل",
    image: "/assets/images/fashion/1.avif",
  },
  {
    name: "سارا رضایی",
    role: "مدیر خلاقیت",
    image: "/assets/images/fashion/3.avif",
  },
  {
    name: "محمد کریمی",
    role: "مدیر محصول",
    image: "/assets/images/fashion/2.avif",
  },
  {
    name: "نیلوفر احمدی",
    role: "مدیر بازاریابی",
    image: "/assets/images/fashion/6.avif",
  },
];

export default function AboutContainer() {
  return (
    <main dir="rtl">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="relative h-[70vh] overflow-hidden">
          <Image
            src="/assets/images/fashion/2.avif"
            alt="تیم تیران"
            width={4000}
            height={4000}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0  flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
              داستان ما
            </h1>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-4xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">درباره تیران</h2>
        <div className="prose prose-lg max-w-none">
          <p>
            تیران در سال ۱۳۹۸ با هدف ارائه محصولات با کیفیت و طراحی منحصر به فرد
            تاسیس شد. ما معتقدیم که هر محصول باید داستانی برای گفتن داشته باشد و
            هر مشتری شایسته تجربه‌ای خاص است.
          </p>
          <p>
            فلسفه ما ساده است: ترکیب هنر، طراحی و کاربرد در محصولاتی که زندگی
            روزمره را غنی‌تر می‌کنند. ما با دقت تمام، محصولاتی را انتخاب می‌کنیم
            که نه تنها زیبا هستند، بلکه کیفیت استثنایی و دوام بالایی نیز دارند.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 rounded-xl mb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">ارزش‌های ما</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16  rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">کیفیت</h3>
              <p className="text-gray-600 text-center">
                ما هرگز در کیفیت مصالحه نمی‌کنیم. هر محصول در فروشگاه ما با دقت
                انتخاب شده و استانداردهای سختگیرانه ما را برآورده می‌کند.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">نوآوری</h3>
              <p className="text-gray-600 text-center">
                ما همواره به دنبال محصولات نوآورانه و طراحی‌های خلاقانه هستیم که
                زندگی مشتریان ما را بهبود بخشند.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16  rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">پایداری</h3>
              <p className="text-gray-600 text-center">
                ما متعهد به انتخاب محصولات و شرکایی هستیم که به محیط زیست احترام
                می‌گذارند و شیوه‌های تولید پایدار را دنبال می‌کنند.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">تیم ما</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TeamSection.map((member, index) => (
            <div key={index} className="text-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">ماموریت ما</h2>
          <p className="text-gray-700">
            ماموریت ما ارائه محصولات منحصر به فرد و با کیفیت است که زندگی روزمره
            را غنی‌تر می‌کنند. ما می‌خواهیم با هر محصولی که ارائه می‌دهیم،
            تجربه‌ای لذت‌بخش و ماندگار برای مشتریان خود ایجاد کنیم.
          </p>
        </div>

        <div className="bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">چشم‌انداز ما</h2>
          <p className="text-gray-700">
            چشم‌انداز ما تبدیل شدن به مرجعی معتبر برای محصولات طراحی شده با
            کیفیت در ایران است. ما می‌خواهیم الهام‌بخش سبک زندگی‌ای باشیم که در
            آن زیبایی، کاربرد و پایداری در کنار هم قرار دارند.
          </p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-black text-white py-16 px-4  text-center mb-12">
        <h2 className="text-3xl font-bold mb-6">با ما در ارتباط باشید</h2>
        <p className="max-w-2xl mx-auto mb-8">
          ما مشتاق شنیدن نظرات، پیشنهادات و سوالات شما هستیم. تیم پشتیبانی ما
          آماده کمک به شماست.
        </p>
        <Link
          href="/contact"
          className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          تماس با ما
        </Link>
      </section>
    </main>
  );
}
