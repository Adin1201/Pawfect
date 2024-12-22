import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import '../../../assets/scss/onboarding-modal.scss';
import { AppState } from '../../../redux/rootReducer';
import useYupValidationResolver from '../../../utils/use-yup-validation-resolver';

interface Props {
  onNextStep: (value: string) => void;
}

const Surname = (props: Props) => {
  const user = useSelector((state: AppState) => state.auth.user);

  const validationSchema: SchemaOf<{ surname: string }> = Yup.object({
    surname: Yup.string()
      .max(50, 'Field Surname must be less than 50 characters.')
      .required('Field Surname is required.'),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    getValues,
    formState: { errors },
  } = useForm<{ surname: string }>({
    resolver,
  });

  useEffect(() => {
    if (user != null) {
      setValue('surname', user.surname || '');
      setFocus('surname');
    }
  }, [setFocus]);

  const onSubmit = () => {
    props.onNextStep(getValues('surname'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <span className="description-text-onboarding">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et eros
        mattis, egestas nunc eget, viverra magna. Mauris a pharetra massa, in
        hendrerit elit. Nam non egestas eros.
      </span>
      <span className="step-text-onboarding">STEP 2/5</span>
      <div className="d-flex">
        <input
          {...register('surname')}
          className="modal-input-onboarding"
          placeholder="Surname"
        />
        <button type="submit" className="modal-input-button-onboarding">
          Next
        </button>
      </div>
      {errors.surname?.message && (
        <span className="error-message-text">{errors.surname.message}</span>
      )}
    </form>
  );
};

export default Surname;
