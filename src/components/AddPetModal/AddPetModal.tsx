import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { useHistory } from 'react-router-dom';
import petImg from '../../assets/images/pet-modal.png';
import '../../assets/scss/onboarding-modal.scss';
import usersPetService from '../../services/usersPetService';
import Microchip from './Microchip';
import Name from './Name';
import Passport from './Passport';

export enum AddPetStep {
  Name,
  Passport,
  Microchip,
}

interface Props extends ReactModal.Props {
  onFinish: () => void;
  onCancel: () => void;
}

interface State {
  currentStep: AddPetStep;
  pending: boolean;
}

const AddPetModal = (props: Props) => {
  const initialState: State = {
    currentStep: AddPetStep.Name,
    pending: false,
  };
  const [state, setState] = useState<State>(initialState);

  const history = useHistory();

  const { setValue, getValues } = useForm<{
    name: string;
    passport: string;
    microchip: string;
  }>();

  const createPet = () => {
    setState({ ...state, pending: true });

    usersPetService
      .post({
        petRequestDto: {
          name: getValues('name'),
          passportNo: getValues('passport'),
          microchipNo: getValues('microchip'),
        },
      })
      .then(
        (res) => {
          const id = res.id;
          setState({
            ...state,
            pending: false,
          });
          props.onFinish();
          history.push(`/pets/${id}`);
        },

        () => {
          setState({ ...state, pending: false });
        }
      );
  };

  const onRequestClose = () => {
    setState({ ...state, currentStep: AddPetStep.Name });
    props.onCancel();
  };

  return (
    <ReactModal
      {...props}
      overlayClassName="app-modal__overlay"
      className="app-modal__content"
      onRequestClose={onRequestClose}
      ariaHideApp={false}
    >
      <div className="onboarding-modal">
        <div className="row content-wrapper-onboarding">
          <div className="col-md-6 d-flex justify-content-sm-center">
            <img src={petImg} className="pet-img-onboarding" alt="Pet" />
          </div>
          <div className="col content-onboarding">
            <span className="title-text-onboarding">Pet details</span>
            {state.currentStep === AddPetStep.Name && (
              <Name
                onNextStep={(name) => {
                  setState({ ...state, currentStep: AddPetStep.Passport });
                  setValue('name', name);
                }}
              />
            )}

            {state.currentStep === AddPetStep.Passport && (
              <Passport
                onNextStep={(passport) => {
                  setState({ ...state, currentStep: AddPetStep.Microchip });
                  setValue('passport', passport);
                }}
              />
            )}

            {state.currentStep === AddPetStep.Microchip && (
              <Microchip
                onNextStep={(microchip) => {
                  setValue('microchip', microchip);
                  createPet();
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

export default AddPetModal;
