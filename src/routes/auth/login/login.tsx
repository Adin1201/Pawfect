import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import { ErrorResponseDto } from '../../../api';
import { UserRoleEnum } from '../../../api/api';
import Button from '../../../components/Button';
import EmailVerificationModal from '../../../components/EmailVerificationModal';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import authService from '../../../services/authService';
import iataService from '../../../services/iataService.ts';
import { formErrorHandler } from '../../../utils/error-handler';
import useYupValidationResolver from '../../../utils/use-yup-validation-resolver';
import { email } from '../../../validations/validations';
import { AuthPage } from '../auth';
import '../auth.scss';

interface Props {
  toggleAuthPage: (page: AuthPage) => void;
  role: UserRoleEnum;
}

interface State {
  pending: boolean;
  emailVerificationVisible: boolean;
}

type LoginFormValues = {
  email: string;
  password: string;
  airlineCode?: { value: string; label: string };
};

export default function Login(props: Props) {
  const [state, setState] = useState<State>({
    pending: false,
    emailVerificationVisible: false,
  });

  const validationSchema: SchemaOf<LoginFormValues> = Yup.object({
    email: Yup.string()
      .matches(email, 'Field Email Address must be in valid format.')
      .required('Field Email Address is required.'),
    password: Yup.string().required('Field Password is required.'),
    airlineCode:
      props.role === UserRoleEnum.Organisation
        ? Yup.object()
            .shape({
              value: Yup.string()
                .required()
                .required('Field Airline Name or Code is required.'),
              label: Yup.string().required(),
            })
            .required()
        : Yup.object().nullable(),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    control,
    setFocus,
    setValue,
  } = useForm<LoginFormValues>({
    resolver,
  });

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { from }: any = location.state || { from: { pathname: '/' } };

  useEffect(() => {
    const state: { email?: string; password?: string } | undefined =
      location.state as any;

    if (state?.email && state?.password) {
      setValue('email', state.email);
      setValue('password', state.password);

      setState((currentState) => ({
        ...currentState,
        emailVerificationVisible: true,
      }));

      delete state.email;
      delete state.password;
      history.replace({ ...history.location, state });
    }
  }, [location.state]);

  const onLogin = ({ email, password, airlineCode }: LoginFormValues) => {
    setState((currentState) => ({ ...currentState, pending: true }));

    dispatch(
      authService.login({
        email,
        password,
        airlineCode: airlineCode?.value,
        role: props.role,
      })
    )
      // @ts-ignore
      .then(
        () => {
          history.replace(from);
        },
        (err: ErrorResponseDto) => {
          setState({ ...state, pending: false });
          formErrorHandler<LoginFormValues>(err, setError, getValues());

          if (err.message === 'EmailNotVerified') {
            setState({
              ...state,
              emailVerificationVisible: true,
            });
          }
        }
      );
  };

  const loadAirlines = _.debounce((query: string, callback: any) => {
    if (_.isEmpty(query)) {
      callback([]);
    } else {
      iataService
        .get({
          query,
        })
        .then((res) => {
          callback(
            res.results?.map((x) => ({
              value: x.code || '',
              label: x.name || '',
            })) || []
          );
        });
    }
  }, 500);

  return (
    <>
      <form onSubmit={handleSubmit(onLogin)}>
        {props.role === UserRoleEnum.Organisation && (
          <div className="input-wrapper">
            <Controller<LoginFormValues>
              name="airlineCode"
              control={control}
              render={({ field }) => (
                <Select
                  field={field}
                  inputStyle="background-dark"
                  placeholder="Airline Name or Code"
                  loadOptions={loadAirlines}
                  onChange={() => setFocus('email')}
                  noOptionsMessage={(e) =>
                    e.inputValue
                      ? 'No airlines found.'
                      : 'Please type to search.'
                  }
                  // @ts-ignore
                  error={errors['airlineCode.value']}
                />
              )}
            />
          </div>
        )}

        <Input
          {...register('email')}
          type="text"
          placeholder="Email address"
          inputStyle="background-dark"
          inputSize="large"
          error={errors.email}
        />

        <Input
          {...register('password')}
          type="password"
          placeholder="Password"
          inputStyle="background-dark"
          inputSize="large"
          error={errors.password}
        />

        <Button
          onClick={() => {}}
          title="Sign in"
          type="submit"
          color="secondary"
          loading={state.pending}
          style={{ marginTop: 16, width: '100%' }}
        />
      </form>

      <div className="row footer-wrapper">
        <div className="col-auto">
          {props.role === UserRoleEnum.User && (
            <span className="forgot-password-text">
              Don&apos;t have an account?
              <button
                type="button"
                onClick={() => props.toggleAuthPage(AuthPage.Register)}
                className="button"
              >
                Sign Up
              </button>
            </span>
          )}
        </div>
        <div className="col-auto">
          <span className="forgot-password-text">
            Forgot password?
            <button
              type="button"
              onClick={() => props.toggleAuthPage(AuthPage.ResetPassword)}
              className="button"
            >
              Reset password
            </button>
          </span>
        </div>
      </div>

      {state.emailVerificationVisible && (
        <EmailVerificationModal
          isOpen={state.emailVerificationVisible}
          email={getValues('email')}
          onCancel={() =>
            setState({ ...state, emailVerificationVisible: false })
          }
          onFinish={() => {
            setState((currentState) => ({
              ...currentState,
              emailVerificationVisible: false,
            }));
            handleSubmit(onLogin)();
          }}
        />
      )}
    </>
  );
}
