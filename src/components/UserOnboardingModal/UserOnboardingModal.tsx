import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import petImg from '../../assets/images/pet-modal.png';
import '../../assets/scss/onboarding-modal.scss';
import usersService from '../../services/usersService';
import DateOfBirth from './DateOfBirth';
import ExpiryDate from './ExpiryDate';
import Passport from './Passport';
import Surname from './Surname';
import Username from './Username';

export enum UserOnboardingStep {
  Username,
  Surname,
  DateOfBirth,
  Passport,
  ExpiryDate,
}

interface Props extends ReactModal.Props {
  onFinish: () => void;
  onCancel: () => void;
}

interface State {
  currentStep: UserOnboardingStep;
  pending: boolean;
}

const UserOnboardingModal = (props: Props) => {
  const [state, setState] = useState<State>({
    currentStep: UserOnboardingStep.Username,
    pending: false,
  });

  const history = useHistory();

  const dispatch = useDispatch();

  const { setValue, getValues } = useForm<{
    name: string;
    surname: string;
    dateOfBirth: Date;
    passport: string;
    expiryDate: Date;
  }>();

  const updateUser = () => {
    setState({ ...state, pending: true });

    dispatch(
      usersService.put({
        name: getValues('name'),
        surname: getValues('surname'),
        dateOfBirth: getValues('dateOfBirth').toISOString(),
        passportNo: getValues('passport'),
        documentExpiryDate: getValues('expiryDate').toISOString(),
      })
    )
      // @ts-ignore
      .then(
        () => {
          setState({ ...state, pending: false });
          props.onFinish();
          history.push('/user-profile');
        },
        () => {
          setState({ ...state, pending: false });
        }
      );
  };

  return (
    <ReactModal
      {...props}
      overlayClassName="app-modal__overlay"
      className="app-modal__content"
      onRequestClose={props.onCancel}
      ariaHideApp={false}
    >
      <div className="onboarding-modal">
        <div className="row content-wrapper-onboarding">
          <div className="col-md-6 d-flex justify-content-sm-center">
            <img src={petImg} className="pet-img-onboarding" alt="Pet" />
          </div>
          <div className="col content-onboarding">
            <span className="title-text-onboarding">Welcome</span>
            {state.currentStep === UserOnboardingStep.Username && (
              <Username
                onNextStep={(name) => {
                  setState({
                    ...state,
                    currentStep: UserOnboardingStep.Surname,
                  });
                  setValue('name', name);
                }}
              />
            )}

            {state.currentStep === UserOnboardingStep.Surname && (
              <Surname
                onNextStep={(surname) => {
                  setState({
                    ...state,
                    currentStep: UserOnboardingStep.DateOfBirth,
                  });
                  setValue('surname', surname);
                }}
              />
            )}

            {state.currentStep === UserOnboardingStep.DateOfBirth && (
              <DateOfBirth
                onNextStep={(dateOfBirth) => {
                  setState({
                    ...state,
                    currentStep: UserOnboardingStep.Passport,
                  });
                  setValue('dateOfBirth', dateOfBirth);
                }}
              />
            )}

            {state.currentStep === UserOnboardingStep.Passport && (
              <Passport
                onNextStep={(passport) => {
                  setState({
                    ...state,
                    currentStep: UserOnboardingStep.ExpiryDate,
                  });
                  setValue('passport', passport);
                }}
              />
            )}

            {state.currentStep === UserOnboardingStep.ExpiryDate && (
              <ExpiryDate
                onNextStep={(expiryDate) => {
                  setValue('expiryDate', expiryDate);
                  updateUser();
                }}
                pending={state.pending}
              />
            )}
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default UserOnboardingModal;
