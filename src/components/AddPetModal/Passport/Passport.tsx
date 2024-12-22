import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import '../../../assets/scss/onboarding-modal.scss';
import useYupValidationResolver from '../../../utils/use-yup-validation-resolver';
import { onlyLettersAndNumbers } from '../../../validations/validations';

interface Props {
  onNextStep: (value: string) => void;
}

const Passport = (props: Props) => {
  const validationSchema: SchemaOf<{ passport: string }> = Yup.object({
    passport: Yup.string()
      .required('Field Passport No is required.')
      .matches(
        onlyLettersAndNumbers,
        'Field Passport No must only contain letters and numbers.'
      ),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<{ passport: string }>({
    resolver,
  });

  useEffect(() => {
    setFocus('passport');
  }, [setFocus]);

  const onSubmit = () => {
    props.onNextStep(getValues('passport'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <span className="description-text-onboarding">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et eros
        mattis, egestas nunc eget, viverra magna. Mauris a pharetra massa, in
        hendrerit elit. Nam non egestas eros.
      </span>
      <span className="step-text-onboarding">STEP 2/3</span>
      <div className="d-flex">
        <input
          {...register('passport')}
          className="modal-input-onboarding"
          placeholder="Passport No"
          defaultValue={getValues('passport')}
        />
        <button type="submit" className="modal-input-button-onboarding">
          Next
        </button>
      </div>
      {errors.passport?.message && (
        <span className="error-message-text">{errors.passport.message}</span>
      )}
    </form>
  );
};

export default Passport;
