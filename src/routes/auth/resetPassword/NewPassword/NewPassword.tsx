import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import useYupValidationResolver from '../../../../utils/use-yup-validation-resolver';
import '../../auth.scss';

interface Props {
  onNextStep: (value: string) => void;
  pending: boolean;
}

const NewPassword = (props: Props) => {
  const validationSchema: SchemaOf<{ newPassword: string }> = Yup.object({
    newPassword: Yup.string().required('Field New Password is required.'),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<{ newPassword: string }>({
    resolver,
  });

  useEffect(() => {
    setFocus('newPassword');
  }, [setFocus]);

  const onSubmit = () => {
    props.onNextStep(getValues('newPassword'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="reset-password-step-title">
        Enter a new password for your account.
      </div>
      <Input
        {...register('newPassword')}
        type="password"
        placeholder="New password"
        inputStyle="background-dark"
        inputSize="large"
        error={errors.newPassword}
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

export default NewPassword;
