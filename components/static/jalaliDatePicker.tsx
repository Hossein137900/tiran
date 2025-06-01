import React from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import type { DateObject } from "react-multi-date-picker";
import { PersianDatePickerProps } from "@/types/type";

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  className,
}) => {
  const handleChange = (date: DateObject | DateObject[] | null) => {
    if (date && !Array.isArray(date)) {
      // Format the date as YYYY/MM/DD
      const formattedDate = date.format("YYYY/MM/DD");
      onChange(formattedDate);
    }
  };

  return (
    <div className={className}>
      <DatePicker
        value={value}
        onChange={handleChange}
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        minDate={minDate}
        maxDate={maxDate}
        inputClass="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
};

export default PersianDatePicker;
