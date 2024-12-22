import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import Button from '../Button';
import './NavigationPrompt.scss';

const NavigationPrompt = (message: string, callback: (ok: boolean) => void) => {
  const container = document.createElement('div');

  container.setAttribute('custom-confirmation-navigation', '');

  document.body.appendChild(container);

  const closeModal = (callbackState: any) => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    callback(callbackState);
  };

  ReactDOM.render(
    <ReactModal
      isOpen={true}
      overlayClassName="app-modal__overlay"
      className="app-modal__content"
      ariaHideApp={false}
    >
      <div className="navigation-prompt-modal">
        <h2>Confirm Navigation</h2>
        <span className="navigation-prompt-message">{message}</span>
        <div className="buttons-container">
          <Button
            onClick={() => closeModal(false)}
            color="tertiary"
            title="Stay"
            size="medium"
            className="button"
          />
          <Button
            onClick={() => closeModal(true)}
            title="Leave"
            size="medium"
            className="button"
          />
        </div>
      </div>
    </ReactModal>,
    container
  );
};

export default NavigationPrompt;
