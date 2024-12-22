import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import '../../../assets/scss/onboarding-modal.scss';
import useYupValidationResolver from '../../../utils/use-yup-validation-resolver';
import { onlyDigits } from '../../../validations/validations';

interface Props {
  onNextStep: (value: string) => void;
  pending: boolean;
}

const Microchip = (props: Props) => {
  const validationSchema: SchemaOf<{ microchip: string }> = Yup.object({
    microchip: Yup.string()
      .min(15, 'Microchip No must be 15 characters in length.')
      .max(15, 'Microchip No must be 15 characters in length.')
      .matches(onlyDigits, 'Microchip No must only contain digits.')
      .required('Field Microchip No is required.'),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<{ microchip: string }>({
    resolver,
  });

  useEffect(() => {
    setFocus('microchip');
  }, [setFocus]);

  const onSubmit = () => {
    props.onNextStep(getValues('microchip'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <span className="description-text-onboarding">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et eros
        mattis, egestas nunc eget, viverra magna. Mauris a pharetra massa, in
        hendrerit elit. Nam non egestas eros.
      </span>
      <span className="step-text-onboarding">STEP 3/3</span>
      <div className="d-flex">
        <input
          {...register('microchip')}
          className="modal-input-onboarding"
          placeholder="Transponder/Microchip"
          defaultValue={getValues('microchip')}
        />
        <button
          type="submit"
          className={`modal-input-button-onboarding 
                    ${props.pending ? 'button-loading' : ''}`}
        >
          Next
        </button>
      </div>
      {errors.microchip?.message && (
        <span className="error-message-text">{errors.microchip.message}</span>
      )}
    </form>
  );
};

export default Microchip;
