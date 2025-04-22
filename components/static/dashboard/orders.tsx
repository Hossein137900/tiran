import React from "react";

const Orders: React.FC = () => {
  const orders = [
    { id: 1, item: "محصول الف", date: "2023-09-01", status: "تحویل شده" },
    { id: 2, item: "محصول ب", date: "2023-09-10", status: "در انتظار" },
    { id: 3, item: "محصول ج", date: "2023-09-15", status: "ارسال شده" },
  ];
  const formatDateToPersian = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">سفارشات شما</h2>
      <table className="w-full table-auto bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-black ">
            <th className="px-4 py-2 text-right">شناسه سفارش</th>
            <th className="px-4 py-2 text-right">کالا</th>
            <th className="px-4 py-2 text-right">تاریخ</th>
            <th className="px-4 py-2 text-right">وضعیت</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b text-black">
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.item}</td>
              <td className="px-4 py-2">{formatDateToPersian(order.date)}</td>
              <td className="px-4 py-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
