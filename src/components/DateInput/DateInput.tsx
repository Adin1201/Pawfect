import React from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { FieldError } from 'react-hook-form';
import calendarIcon from '../../assets/images/calendar.png';
import './DateInput.scss';

interface Props extends ReactDatePickerProps {
  className?: string;
  label?: string;
  error?: FieldError;
  showCalendarIcon?: boolean;
}

export default function DateInput(props: Props) {
  const { className, label, error, showCalendarIcon = true } = props;

  const handleDateChangeRaw = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="date-input">
      {label && <span className="title-text">{label}</span>}
      <div style={{ position: 'relative' }}>
        <DatePicker
          {...props}
          className={`date-picker ${className}`}
          placeholderText={
            props.placeholderText ? props.placeholderText : 'Select Date'
          }
          yearDropdownItemNumber={100}
          scrollableYearDropdown={true}
          showYearDropdown
          onChangeRaw={handleDateChangeRaw}
        />
        {showCalendarIcon && (
          <img
            src={calendarIcon}
            alt="Calendar icon"
            className="calendar-icon"
          />
        )}
        {error?.message && (
          <span className="error-message">{error.message}</span>
        )}
      </div>
    </div>
  );
}
