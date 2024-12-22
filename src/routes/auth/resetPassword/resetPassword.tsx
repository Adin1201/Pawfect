import { Dispatch } from '@reduxjs/toolkit';
import React from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import authService from '../../../services/authService';
import typedBindActionCreators from '../../../utils/typed-bind-action-creators';
import useStateCallback from '../../../utils/use-state-callback';
import { AuthPage } from '../auth';
import '../auth.scss';
import Code from './Code';
import Email from './Email';
import NewPassword from './NewPassword';

interface Props extends ReturnType<typeof mapDispatchToProps> {
  toggleAuthPage: (page: AuthPage) => void;
}

export enum ResetPasswordStep {
  Email,
  Code,
  NewPassword,
}

interface State {
  currentStep: ResetPasswordStep;
  pending: boolean;
}

function ResetPassword(props: Props) {
  const [state, setState] = useStateCallback<State>({
    currentStep: ResetPasswordStep.Email,
    pending: false,
  });

  const { setValue, getValues } = useForm<{
    email: string;
    code: string;
    newPassword: string;
  }>();

  const onNextStep = () => {
    const { currentStep } = state;

    if (currentStep === ResetPasswordStep.Email) {
      setState({
        ...state,
        pending: true,
      });

      props
        .forgotPasswordRequest({
          forgotPasswordRequestDto: {
            email: getValues('email'),
          },
        })
        .then(
          () => {
            setState({
              ...state,
              currentStep: ResetPasswordStep.Code,
              pending: false,
            });
          },
          () => {
            setState({
              ...state,
              pending: false,
            });
          }
        );
    } else if (currentStep === ResetPasswordStep.Code) {
      setState({
        ...state,
        pending: true,
      });

      props
        .forgotPasswordVerifyCode({
          forgotPasswordVerifyCodeDto: {
            email: getValues('email'),
            code: getValues('code'),
          },
        })
        .then(
          () => {
            setState({
              ...state,
              currentStep: ResetPasswordStep.NewPassword,
              pending: false,
            });
          },
          () => {
            setState({
              ...state,
              pending: false,
            });
          }
        );
    } else if (currentStep === ResetPasswordStep.NewPassword) {
      setState({
        ...state,
        pending: true,
      });
      props
        .forgotPasswordResetPassword({
          forgotPasswordResetDto: {
            email: getValues('email'),
            code: getValues('code'),
            password: getValues('newPassword'),
          },
        })
        .then(
          () => {
            toast.success(
              'Password change successful. Please login with your new password.'
            );
            props.toggleAuthPage(AuthPage.Login);
            setState({
              ...state,
              pending: false,
            });
          },
          () => {
            setState({
              ...state,
              pending: false,
            });
          }
        );
    }
  };

  const onResendCode = () => {
    props
      .forgotPasswordRequest({
        forgotPasswordRequestDto: { email: getValues('email') },
      })
      .then(() => {
        toast.success('Please check your email for new code.');
      });
  };

  return (
    <>
      {state.currentStep === ResetPasswordStep.Email && (
        <Email
          onNextStep={(email) => {
            setState({ ...state, currentStep: ResetPasswordStep.Code });
            setValue('email', email);
            onNextStep();
          }}
          pending={state.pending}
        />
      )}

      {state.currentStep === ResetPasswordStep.Code && (
        <Code
          onNextStep={(code) => {
            setState({ ...state, currentStep: ResetPasswordStep.NewPassword });
            setValue('code', code);
            onNextStep();
          }}
          onResendCode={() => onResendCode()}
          pending={state.pending}
        />
      )}

      {state.currentStep === ResetPasswordStep.NewPassword && (
        <NewPassword
          onNextStep={(newPassword) => {
            setValue('newPassword', newPassword);
            onNextStep();
          }}
          pending={state.pending}
        />
      )}

      <div className="footer-wrapper">
        <span className="forgot-password-text">
          Go back to
          <button
            type="button"
            onClick={() => props.toggleAuthPage(AuthPage.Login)}
            className="button"
          >
            Login
          </button>
        </span>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  typedBindActionCreators(
    {
      forgotPasswordRequest: authService.forgotPasswordRequest,
      forgotPasswordVerifyCode: authService.forgotPasswordVerifyCode,
      forgotPasswordResetPassword: authService.forgotPasswordResetPassword,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(ResetPassword);
