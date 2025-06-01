import Link from "next/link";

export default function HelpContainer() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl mt-36 font-bold text-center mb-8">راهنما</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 rtl">
        <h2 className="text-2xl font-bold mb-4 text-right">ثبت سفارش</h2>
        <p className="text-right mb-4">
          روند ثبت سفارش در این وب‌سایت بر پایه سادگی و راحتی برای شما ایجاد شده
          و شامل هیچ پیچیدگی خاصی نمی‌باشد. اما به طور خلاصه برای ثبت سفارش،
          مراحل زیر را دنبال کنید:
        </p>
        <ol className=" pr-8 mb-4 text-right">
          <li className="mb-2">
            در صفحه‌نخست یا صفحه‌ها، محصول مورد نظر خود را انتخاب کنید تا به
            صفحه نمایش اطلاعات آن منتقل شوید
          </li>
          <li className="mb-2">
            در صورتی که مشخصاتی مانند رنگ، اندازه و... وجود داشت، انتخاب کنید
          </li>
          <li className="mb-2">
            بر روی دکمه‌ی افزودن به سبد خرید کلیک و صبر کنید تا پنجره‌ای به
            منظور موفقیت عملیات نمایش داده شود
          </li>
          <li className="mb-2">
            بر روی دکمه‌ی مشاهده سبد خرید یا لینک سبد خرید کلیک کنید
          </li>
          <li className="mb-2">
            در صفحه سبد خرید، محصولاتی که انتخاب کرده‌اید را مشاهده می‌کنید.
            امکان ویرایش تعداد و حذف هر یک وجود دارد. پس از بررسی محصولات، بر
            روی دکمه‌ی ثبت سفارش کلیک کنید
          </li>
          <li className="mb-2">
            در مراحل بعد، فرم‌ها با توجه به محصولاتی که انتخاب کردید و وضعیت
            عضویت شما، متفاوت خواهند بود. مراحل را گام به گام پیش روید و اطلاعات
            را ثبت کنید تا فرآیند ثبت سفارش شما تکمیل شود
          </li>
        </ol>
        <p className="text-right">
          در صورتی که سوالی دارید، با کارشناسان پشتیبانی ما تماس بگیرید تا از
          راهنمایی آن‌ها بهره‌مند شوید
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 rtl">
        <h2 className="text-2xl font-bold mb-4 text-right">پیگیری سفارش</h2>
        <p className="text-right">
          برای اطلاع از وضعیت سفارش‌های خود،{" "}
          <Link
            href="/profile/orders"
            className="text-blue-600 hover:underline"
          >
            این‌جا
          </Link>{" "}
          را کلیک کنید و پس از ورود به پنل کاربری، سفارش مورد نظر را انتخاب کنید
          تا اطلاعات تکمیلی آن، نمایش داده شود. در صورتی که سوالی دارید، با
          کارشناسان پشتیبانی ما تماس بگیرید تا از راهنمایی آن‌ها بهره‌مند شوید
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 rtl">
        <h2 className="text-2xl font-bold mb-4 text-right">
          آیا امکان پرداخت از طریق کارت بانکی وجود دارد؟
        </h2>
        <p className="text-right">
          بله. برای پرداخت الکترونیک کافی است کارت بانکی شما به شبکه شتاب متصل
          باشد و رمز دوم آن را دریافت کرده باشد. پرداخت از طریق درگاه امن بانکی
          به صورت رمزنگاری شده (https) انجام خواهد شد و اطلاعات کارت شما نزد
          بانک محفوظ خواهد ماند
        </p>
      </div>
    </div>
  );
}
