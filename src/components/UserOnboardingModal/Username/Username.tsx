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

const Username = (props: Props) => {
  const user = useSelector((state: AppState) => state.auth.user);

  const validationSchema: SchemaOf<{ name: string }> = Yup.object({
    name: Yup.string().required('Field Name is required.'),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<{ name: string }>({
    resolver,
  });

  useEffect(() => {
    if (user != null) {
      setValue('name', user.name || '');
      setFocus('name');
    }
  }, [setFocus]);

  const onSubmit = () => {
    props.onNextStep(getValues('name'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <span className="description-text-onboarding">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et eros
        mattis, egestas nunc eget, viverra magna. Mauris a pharetra massa, in
        hendrerit elit. Nam non egestas eros.
      </span>
      <span className="step-text-onboarding">STEP 1/5</span>
      <div className="d-flex">
        <input
          {...register('name')}
          className="modal-input-onboarding"
          placeholder="Name"
          defaultValue={getValues('name')}
        />
        <button type="submit" className="modal-input-button-onboarding">
          Next
        </button>
      </div>
      {errors.name?.message && (
        <span className="error-message-text">{errors.name.message}</span>
      )}
    </form>
  );
};

export default Username;
