import moment from 'moment';
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
  pending: boolean;
}

const ExpiryDate = (props: Props) => {
  const validationSchema: SchemaOf<{ expiryDate?: Date }> = Yup.object({
    expiryDate: Yup.date().required('Field Expiry Date is required.'),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const tomorrowDate = moment().add(1, 'day').toDate();

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<{ expiryDate: Date }>({
    resolver,
  });

  const handleDateChangeRaw = (e: any) => {
    e.preventDefault();
  };

  const onSubmit = () => {
    props.onNextStep(getValues('expiryDate'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <span className="description-text-onboarding">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et eros
        mattis, egestas nunc eget, viverra magna. Mauris a pharetra massa, in
        hendrerit elit. Nam non egestas eros.
      </span>
      <span className="step-text-onboarding">STEP 5/5</span>
      <div className="d-flex">
        <div className="date-input-wrapper">
          <img src={calendarImg} className="calendar-icon" alt="Calendar" />
          <Controller
            name="expiryDate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DateInput
                className="modal-input-onboarding date-input"
                title="Expiry Date:"
                onChange={(date) => onChange(date)}
                selected={value as Date | null}
                placeholderText="Expiry Date"
                dateFormat="dd/MM/yyyy"
                onChangeRaw={handleDateChangeRaw}
                showYearDropdown
                showCalendarIcon={false}
                minDate={tomorrowDate}
              />
            )}
          />
        </div>
        <button
          type="submit"
          className={`modal-input-button-onboarding 
                    ${props.pending ? 'button-loading' : ''}`}
        >
          Next
        </button>
      </div>
      {errors.expiryDate?.message && (
        <span className="error-message-text">{errors.expiryDate.message}</span>
      )}
    </form>
  );
};

export default ExpiryDate;
