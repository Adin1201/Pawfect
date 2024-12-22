import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import { ErrorResponseDto } from '../../../api';
import Button from '../../../components/Button';
import Checkbox from '../../../components/Checkbox';
import Input from '../../../components/Input';
import TosModal from '../../../components/TosModal';
import authService from '../../../services/authService';
import { formErrorHandler } from '../../../utils/error-handler';
import useYupValidationResolver from '../../../utils/use-yup-validation-resolver';
import { email, nameAndSurname } from '../../../validations/validations';
import { AuthPage } from '../auth';
import '../auth.scss';

interface Props {
  toggleAuthPage: (page: AuthPage) => void;
}

interface State {
  pending: boolean;
  showTosModal: boolean;
}

type RegisterFormValues = {
  firstName: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  checkbox: boolean;
};

export default function Register(props: Props) {
  const [state, setState] = useState<State>({
    showTosModal: false,
    pending: false,
  });

  const validationSchema: SchemaOf<RegisterFormValues> = Yup.object({
    firstName: Yup.string()
      .required('Field Name is required.')
      .min(1, 'Field First Name must be greater than 1 character.')
      .max(50, 'Field First Name must be less than 50 characters.')
      .matches(nameAndSurname, 'You must enter valid First Name.'),
    surname: Yup.string()
      .required('Field Last Name is required.')
      .min(1, 'Field Last Name must be greater than 1 character.')
      .max(50, 'Field Last Name must be less than 50 characters.')
      .matches(nameAndSurname, 'You must enter valid Last Name.'),
    email: Yup.string()
      .matches(email, 'Field Email address must be in valid format.')
      .required('Field Email is required.'),
    password: Yup.string()
      .required('Field Password is required.')
      .min(6, 'The length of Password field must be at least 6 characters.'),
    confirmPassword: Yup.string()
      .required('Field Confirm password is required.')
      .min(
        6,
        'The length of Confirm Password field must be at least 6 characters.'
      )
      .oneOf([Yup.ref('password')], 'Passwords fields must match.'),
    checkbox: Yup.boolean().required('You must accept Terms and Conditions.'),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    control,
    setValue,
  } = useForm<RegisterFormValues>({
    resolver,
  });

  const dispatch = useDispatch();

  const history = useHistory();

  const onRegister = ({
    firstName,
    surname,
    email,
    password,
  }: RegisterFormValues) => {
    setState({ ...state, pending: true });

    dispatch(
      authService.register({
        firstName,
        surname,
        email,
        password,
      })
    )
      // @ts-ignore
      .then(
        () => {},
        (err: ErrorResponseDto) => {
          setState({ ...state, pending: false });
          formErrorHandler<RegisterFormValues>(err, setError, getValues());

          if (err.message === 'EmailNotVerified') {
            props.toggleAuthPage(AuthPage.Login);
            history.replace('/auth', { email, password });
          }
        }
      );
  };

  const onAcceptTos = () => {
    setValue('checkbox', true);
    setState({ ...state, showTosModal: false });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onRegister)}>
        <div className="row">
          <div className="col-md">
            <Input
              {...register('firstName')}
              inputStyle="background-dark"
              inputSize="large"
              placeholder="First name"
              error={errors.firstName}
            />
          </div>
          <div className="col-md">
            <Input
              {...register('surname')}
              inputStyle="background-dark"
              inputSize="large"
              placeholder="Last name"
              error={errors.surname}
            />
          </div>
        </div>
        <Input
          {...register('email')}
          inputStyle="background-dark"
          inputSize="large"
          type="text"
          placeholder="Email address"
          error={errors.email}
        />
        <Input
          {...register('password')}
          inputStyle="background-dark"
          inputSize="large"
          type="password"
          placeholder="Password"
          className="input"
          error={errors.password}
        />
        <Input
          {...register('confirmPassword')}
          inputStyle="background-dark"
          inputSize="large"
          type="password"
          placeholder="Confirm password"
          className="input"
          error={errors.confirmPassword}
        />
        <div className="row row-auth-register">
          <div className="col-auto mt-4 mt-md-0">
            <div className="checkbox-container">
              <Controller<RegisterFormValues>
                name="checkbox"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    defaultValue={'liabilityForm'}
                    type="primary"
                    checked={value as boolean}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
              <span className="tos-text">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setState({ ...state, showTosModal: true })}
                  className="tos-button"
                >
                  Terms and Conditions
                </button>
              </span>
            </div>
            {errors.checkbox && (
              <span className="error-message">{errors.checkbox.message}</span>
            )}
          </div>
          <div className="col-auto mt-4 mt-md-0">
            <Button
              onClick={() => {}}
              type="submit"
              title="Sign up"
              color="secondary"
              loading={state.pending}
              style={{ width: 200 }}
            />
          </div>
        </div>
      </form>

      <TosModal
        isOpen={state.showTosModal}
        onAccept={() => onAcceptTos()}
        onCancel={() => setState({ ...state, showTosModal: false })}
      />

      <div className="footer-wrapper" style={{ justifyContent: 'center' }}>
        <span className="forgot-password-text">
          Back to
          <button
            type="button"
            onClick={() =>
              !state.pending ? props.toggleAuthPage(AuthPage.Login) : {}
            }
            className="button"
          >
            Sign In
          </button>
        </span>
      </div>
    </>
  );
}
