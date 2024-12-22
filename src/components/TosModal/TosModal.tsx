import React from 'react';
import ReactModal from 'react-modal';
import Button from '../Button';
import './TosModal.scss';

interface Props extends ReactModal.Props {
  onAccept: () => void;
  onCancel: () => void;
}

const TosModal = (props: Props) => {
  return (
    <ReactModal
      {...props}
      overlayClassName="app-modal__overlay"
      className="app-modal__content"
      onRequestClose={props.onCancel}
      ariaHideApp={false}
    >
      <div className="tos-modal">
        <div className="tos-content">
          <h1>Terms and Conditions</h1>
          <span>
            By accessing this website, you are agreeing to be bound by these
            website Terms and Conditions of Service, the Privacy Policy, all
            applicable laws and regulations, and agree that you are responsible
            for compliance with any applicable local laws. We may modify these
            Terms and Conditions at any time without notice to you by posting
            revised Terms and Conditions of Service. Your use of the website
            constitutes your binding acceptance of these Terms and Conditions of
            Service, including any modifications that we make. If you do not
            agree with any of these terms, you are prohibited from using or
            accessing this site. The materials contained in this website are
            protected by applicable copyright and trademark law. The Service
            includes a combination of content that we create and that other
            third party content suppliers create. You understand that the
            Service are provided AS IS, and that Copyandpasteemoji.com does not
            guarantee the accuracy, integrity or quality of any content
            available on the website. Copyandpasteemoji.com disclaims all
            responsibility and liability for the accuracy, availability,
            timeliness, security or reliability of the Service. We reserve the
            right to modify, suspend or discontinue the Service with or without
            notice at any time and without any liability to you. The Service is
            directed to adults and is not directed to children under the age of
            18. You must be 18 years of age or older to use the Service. Access
            to Sites Copyandpasteemoji.com grants you a limited license to
            access and use the website via Web browsers or RSS readers only. You
            agree not to copy, republish, frame, download, transmit, modify,
            rent, lease, loan, sell, assign, distribute, license, sublicense,
            reverse engineer, or create derivative works based on the Content or
            Design of the website. In addition, you agree not to use any data
            mining, robots, or similar data gathering and extraction methods in
            connection with the website. You further agree that you will not
            interfere with another members use and enjoyment of the Service; you
            will not interfere with or disrupt the security measures of the
            Service; you will not interfere with or disrupt networks connected
            to the Service. Use License Permission is granted to temporarily
            download one copy of the materials (information or software) on
            Copyandpasteemoji.com website for personal, non-commercial
            transitory viewing only. This is the grant of a license, not a
            transfer of title, and under this license you may not: - modify or
            copy the materials; - use the materials for any commercial purpose,
            or for any public display (commercial or non-commercial); - attempt
            to decompile or reverse engineer any software contained on
            Copyandpasteemoji.com website; - remove any copyright or other
            proprietary notations from the materials; or - transfer the
            materials to another person or mirror the materials on any other
            server; - transfer the materials to another person or mirror the
            materials on any other server; - access the site using automated
            means which may degrade service for others. This license shall
            automatically terminate if you violate any of these restrictions and
            may be terminated by Copyandpasteemoji.com at any time. Upon
            terminating your viewing of these materials or upon the termination
            of this license, you must destroy any downloaded materials in your
            possession whether in electronic or printed format. By accessing
            this website, you are agreeing to be bound by these website Terms
            and Conditions of Service, the Privacy Policy, all applicable laws
            and regulations, and agree that you are responsible for compliance
            with any applicable local laws. We may modify these Terms and
            Conditions at any time without notice to you by posting revised
            Terms and Conditions of Service. Your use of the website constitutes
            your binding acceptance of these Terms and Conditions of Service,
            including any modifications that we make. If you do not agree with
            any of these terms, you are prohibited from using or accessing this
            site. The materials contained in this website are protected by
            applicable copyright and trademark law. The Service includes a
            combination of content that we create and that other third party
            content suppliers create. You understand that the Service are
            provided AS IS, and that Copyandpasteemoji.com does not guarantee
            the accuracy, integrity or quality of any content available on the
            website. Copyandpasteemoji.com disclaims all responsibility and
            liability for the accuracy, availability, timeliness, security or
            reliability of the Service. We reserve the right to modify, suspend
            or discontinue the Service with or without notice at any time and
            without any liability to you. The Service is directed to adults and
            is not directed to children under the age of 18. You must be 18
            years of age or older to use the Service. Access to Sites
            Copyandpasteemoji.com grants you a limited license to access and use
            the website via Web browsers or RSS readers only. You agree not to
            copy, republish, frame, download, transmit, modify, rent, lease,
            loan, sell, assign, distribute, license, sublicense, reverse
            engineer, or create derivative works based on the Content or Design
            of the website. In addition, you agree not to use any data mining,
            robots, or similar data gathering and extraction methods in
            connection with the website. You further agree that you will not
            interfere with another members use and enjoyment of the Service.
          </span>
          <div className="buttons-container">
            <Button
              onClick={() => props.onCancel()}
              color="tertiary"
              title="Cancel"
              size="medium"
              className="button"
            />
            <Button
              onClick={() => props.onAccept()}
              title="Accept"
              size="medium"
              className="button"
            />
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default TosModal;
