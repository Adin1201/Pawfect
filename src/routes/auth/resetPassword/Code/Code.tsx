import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import useYupValidationResolver from '../../../../utils/use-yup-validation-resolver';
import '../../auth.scss';

interface Props {
  onNextStep: (value: string) => void;
  onResendCode: () => void;
  pending: boolean;
}

interface State {
  resendButtonShown: boolean;
}

const Code = (props: Props) => {
  const [state, setState] = useState<State>({
    resendButtonShown: true,
  });

  const validationSchema: SchemaOf<{ code: string }> = Yup.object({
    code: Yup.string().required('Field Code is required.'),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<{ code: string }>({
    resolver,
  });

  useEffect(() => {
    setFocus('code');
  }, [setFocus]);

  const onSubmit = () => {
    props.onNextStep(getValues('code'));
  };

  const onResendCode = () => {
    setState({ resendButtonShown: false });
    props.onResendCode();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="reset-password-step-title">
        Enter the code you received via email.
      </div>
      <Input
        {...register('code')}
        placeholder="Code"
        inputStyle="background-dark"
        inputSize="large"
        error={errors.code}
        disabled={props.pending}
      />
      <Button
        title="Next"
        type="submit"
        color="secondary"
        loading={props.pending}
        className={'submit-button'}
      />
      {state.resendButtonShown && (
        <span className="forgot-password-text">
          <button
            type="button"
            className="button resend-button"
            onClick={() => onResendCode()}
          >
            Resend
          </button>
          code
        </span>
      )}
    </form>
  );
};

export default Code;
