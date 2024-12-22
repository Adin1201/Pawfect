import moment from 'moment';
import React from 'react';
import { MedicalStatusEnum, PetResponseDto } from '../../api';
import defaultPetImg from '../../assets/images/no-image.png';
import './MyPetCard.scss';

interface Props {
  petData: PetResponseDto;
  onClick: () => void;
}

const MyPetCard = (props: Props) => {
  const { petData, onClick } = props;

  const getMedicalStatus = (medicalStatus: MedicalStatusEnum) => {
    switch (medicalStatus) {
      case MedicalStatusEnum.NotVerified:
        return <div className="status status-not-verified" />;
      case MedicalStatusEnum.Declined:
        return <div className="status status-declined" />;
      case MedicalStatusEnum.Expired:
        return <div className="status status-declined" />;
      case MedicalStatusEnum.Verified:
        return <div className="status" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="my-pet-card"
      onClick={() => onClick()}
      onKeyDown={() => {}}
      role="presentation"
    >
      <div className="pet-img-container">
        <div
          style={{
            backgroundImage: `url(${petData.petImage ?? defaultPetImg})`,
          }}
          className="pet-img"
        />
      </div>
      <div className="pet-info-wrapper">
        <span className="pet-info-label">
          Name: <span className="pet-info-text">{petData.name}</span>
        </span>
        <span className="pet-info-label">
          Passport No:{' '}
          <span className="pet-info-text">{petData.passportNo}</span>
        </span>
        <span className="pet-info-label">
          Passport Country:{' '}
          <span className="pet-info-text">{petData.passportCountry}</span>
        </span>
        <span className="pet-info-label">
          Transponder/Microchip No:{' '}
          <span className="pet-info-text">{petData.microchipNo}</span>
        </span>
      </div>
      {((petData.vaccinationAgainstRabiesStatus ||
        petData.antiEchinococcousTreatmentStatus) && (
        <>
          <div className="border-separator" />
          <div className="pet-info-wrapper">
            <span className="pet-info-label">Medical Info</span>
            {(petData.vaccinationAgainstRabiesStatus && (
              <div className="medical-info-item-wrapper">
                {getMedicalStatus(petData.vaccinationAgainstRabiesStatus)}
                <span className="pet-info-text">
                  Vaccination against Rabies
                </span>
              </div>
            )) ||
              null}
            {(petData.antiEchinococcousTreatmentStatus && (
              <div className="medical-info-item-wrapper">
                {getMedicalStatus(petData.antiEchinococcousTreatmentStatus)}
                <span className="pet-info-text">
                  Anti-Echinococcous Treatment
                </span>
              </div>
            )) ||
              null}
          </div>
        </>
      )) ||
        null}
      <div className="border-separator" />
      <div className="pet-info-wrapper">
        <div>
          <span className="pet-info-text-muted">
            Rabies Antibody Titration Test:{' '}
          </span>
          {petData.medical?.rabbiesAntibodyDate && (
            <span className="pet-info-text-muted">
              {moment
                .utc(petData.medical?.rabbiesAntibodyDate)
                .local()
                .format('DD.MM.YYYY.')}
            </span>
          )}
        </div>
        <div>
          <span className="pet-info-text-muted">
            Other Parasite Treatments:{' '}
          </span>
          {petData.medical?.otherParasiteTreatments && (
            <span className="pet-info-text-muted">
              {petData.medical.otherParasiteTreatments}
            </span>
          )}
        </div>
        <div>
          <span className="pet-info-text-muted">Other Vaccinations: </span>
          {petData.medical?.otherVaccinations && (
            <span className="pet-info-text-muted">
              {petData.medical.otherVaccinations}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPetCard;
