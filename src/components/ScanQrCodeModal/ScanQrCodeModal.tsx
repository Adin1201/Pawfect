import React from 'react';
import ReactModal from 'react-modal';
import QrReader from 'react-qr-reader';
import './ScanQrCodeModal.scss';

interface QrCodeData {
  Id: number;
  MicrochipNumber: string;
  Name: string;
  Status: number;
}

interface Props extends ReactModal.Props {
  onSuccess: (microchipNumber: string) => void;
  onCancel: () => void;
}

const ScanQrCodeModal = (props: Props) => {
  const onScan = (data: string | null) => {
    if (data) {
      const json = JSON.parse(data) as QrCodeData;

      if (json.MicrochipNumber) {
        props.onSuccess(json.MicrochipNumber);
      }
    }
  };
  return (
    <ReactModal
      {...props}
      className="app-modal__content"
      overlayClassName="app-modal__overlay"
      onRequestClose={props.onCancel}
      ariaHideApp={false}
    >
      <div className="scan-qr-code-modal">
        <QrReader
          delay={300}
          facingMode="environment"
          onError={() => {}}
          onScan={(res) => {
            onScan(res);
          }}
          style={{ width: 450, height: 450 }}
        />
      </div>
    </ReactModal>
  );
};

export default ScanQrCodeModal;
