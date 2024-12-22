import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import useYupValidationResolver from '../../../../utils/use-yup-validation-resolver';
import { email } from '../../../../validations/validations';
import '../../auth.scss';

interface Props {
  onNextStep: (value: string) => void;
  pending: boolean;
}

const Email = (props: Props) => {
  const validationSchema: SchemaOf<{ email: string }> = Yup.object({
    email: Yup.string()
      .matches(email, 'Field Email Address must be in valid format.')
      .required('Field Email Address is required.'),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver,
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = () => {
    props.onNextStep(getValues('email'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="reset-password-step-title">
        Enter your email so we can send you a code to reset your password.
      </div>
      <Input
        {...register('email')}
        placeholder="Email address"
        inputStyle="background-dark"
        inputSize="large"
        error={errors.email}
        disabled={props.pending}
      />
      <Button
        title="Next"
        type="submit"
        color="secondary"
        loading={props.pending}
        className={'submit-button'}
      />
    </form>
  );
};

export default Email;
