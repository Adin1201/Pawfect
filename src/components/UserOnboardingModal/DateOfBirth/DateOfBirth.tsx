import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import calendarImg from '../../../assets/images/calendar.png';
import '../../../assets/scss/onboarding-modal.scss';
import useYupValidationResolver from '../../../utils/use-yup-validation-resolver';
import DateInput from '../../DateInput';

interface Props {
  onNextStep: (value: Date) => void;
}

const DateOfBirth = (props: Props) => {
  const validationSchema: SchemaOf<{ dateOfBirth?: Date }> = Yup.object({
    dateOfBirth: Yup.date().required('Field DOB is required.'),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<{ dateOfBirth: Date }>({
    resolver,
  });

  const handleDateChangeRaw = (e: any) => {
    e.preventDefault();
  };

  const onSubmit = () => {
    props.onNextStep(getValues('dateOfBirth'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <span className="description-text-onboarding">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et eros
        mattis, egestas nunc eget, viverra magna. Mauris a pharetra massa, in
        hendrerit elit. Nam non egestas eros.
      </span>
      <span className="step-text-onboarding">STEP 3/5</span>
      <div className="d-flex">
        <div className="date-input-wrapper">
          <img src={calendarImg} className="calendar-icon" alt="Calendar" />
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DateInput
                className="modal-input-onboarding date-input"
                title="Date of Birth:"
                onChange={(date) => onChange(date)}
                selected={value as Date | null}
                maxDate={new Date()}
                minDate={new Date('01-01-1900')}
                placeholderText="Enter your DOB"
                dateFormat="dd/MM/yyyy"
                onChangeRaw={handleDateChangeRaw}
                showYearDropdown
                showCalendarIcon={false}
              />
            )}
          />
        </div>
        <button type="submit" className="modal-input-button-onboarding">
          Next
        </button>
      </div>
      {errors.dateOfBirth?.message && (
        <span className="error-message-text">{errors.dateOfBirth.message}</span>
      )}
    </form>
  );
};

export default DateOfBirth;
