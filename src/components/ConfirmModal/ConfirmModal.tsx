import React from 'react';
import ReactModal from 'react-modal';
import petImg from '../../assets/images/pet-modal.png';
import Button from '../Button';
import './ConfirmModal.scss';

interface Props extends ReactModal.Props {
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  title?: string;
  subtitle?: string;
  loading?: boolean;
}

const ConfirmModal = (props: Props) => {
  return (
    <ReactModal
      {...props}
      className="app-modal__content"
      overlayClassName="app-modal__overlay"
      onRequestClose={props.onCancel}
      ariaHideApp={false}
    >
      <div className="confirm-modal">
        <div className="row">
          <div className="col-md-6 d-flex mb--4 mb-sm-3 justify-content-sm-center">
            <img src={petImg} className="pet-img" alt="Pet" />
          </div>
          <div className="col content-container">
            <div className="heading-wrapper">
              <span className="title-text">
                {props.title ? props.title : 'Are you sure?'}
              </span>
              <span className="subtitle-text">
                {props.subtitle
                  ? props.subtitle
                  : 'Are you sure you want to perform this action?'}
              </span>
            </div>

            <div className="row">
              <div className="col">
                <Button
                  onClick={() => props.onConfirm()}
                  color="primary"
                  title={props.confirmText ? props.confirmText : 'Yes'}
                  size="medium"
                  style={{ width: '100%' }}
                  loading={props.loading}
                />
              </div>
              <div className="col">
                <Button
                  onClick={() => props.onCancel()}
                  color="tertiary"
                  title={props.cancelText ? props.cancelText : 'No'}
                  size="medium"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default ConfirmModal;
