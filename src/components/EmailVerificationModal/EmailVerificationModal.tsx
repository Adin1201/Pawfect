import React, { useState } from 'react';
import ReactModal from 'react-modal';
import authService from '../../services/authService';
import Button from '../Button';
import Input from '../Input';
import './EmailVerificationModal.scss';

interface Props extends ReactModal.Props {
  onFinish: () => void;
  onCancel: () => void;
  email: string;
}

interface State {
  code: string;
  pending: boolean;
}

const EmailVerificationModal = (props: Props) => {
  const [state, setState] = useState<State>({
    code: '',
    pending: false,
  });

  const verifyCode = () => {
    setState({
      ...state,
      pending: true,
    });

    authService
      .verifyEmailCode({
        emailVerificationVerifyCodeDto: {
          email: props.email,
          code: state.code,
        },
      })
      .then(
        () => {
          props.onFinish();
        },
        () => {
          setState({
            ...state,
            pending: false,
          });
        }
      );
  };

  return (
    <ReactModal
      {...props}
      className="app-modal__content"
      overlayClassName="app-modal__overlay"
      onRequestClose={props.onCancel}
      ariaHideApp={false}
    >
      <div className="email-verification-modal">
        <h3 className="modal-title">Verify your Email Address</h3>
        <span className="modal-subtitle">
          Enter the code you received in your mail inbox.
        </span>

        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            verifyCode();
          }}
        >
          <Input
            placeholder="Code from mail"
            onChange={(e) =>
              setState({
                ...state,
                code: e.target.value,
              })
            }
          />

          <div className="mt-2">
            <Button
              type="submit"
              title="Verify"
              size="small"
              style={{ width: '100%' }}
              loading={state.pending}
              disabled={!state.code || state.code.length < 4}
            />
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default EmailVerificationModal;
