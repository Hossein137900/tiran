import React from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";

interface PersianDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  className,
}) => {
  const handleChange = (date: any) => {
    if (date) {
      // Format date as jYYYY/jMM/jDD
      const formattedDate = date.format("YYYY/MM/DD");
      onChange(formattedDate);
    }
  };

  return (
    <div className={`persian-datepicker-container ${className || ""}`}>
      <DatePicker
        value={value}
        onChange={handleChange}
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        minDate={minDate}
        maxDate={maxDate}
        inputClass="custom-input"
        containerClassName="custom-container"
        placeholder="انتخاب تاریخ"
      />
    </div>
  );
};

export default PersianDatePicker;
