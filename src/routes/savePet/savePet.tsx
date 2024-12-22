import _ from 'lodash';
import moment from 'moment';
import React, { RefObject, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useForm } from 'react-hook-form';
import { Prompt, useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import {
  ErrorResponseDto,
  GenderType,
  MedicalStatusEnum,
  PetResponseDto,
  UserRoleEnum,
} from '../../api';
import cameraIcon from '../../assets/images/camera.png';
import Button from '../../components/Button';
import ConfirmModal from '../../components/ConfirmModal';
import DateInput from '../../components/DateInput';
import Input from '../../components/Input';
import SelectDropDown from '../../components/Select';
import adminPetsService from '../../services/adminPetsService';
import countriesService from '../../services/countriesService';
import organisationPetsService from '../../services/organisationPetsService';
import usersPetService from '../../services/usersPetService';
import breedData from '../../utils/breed-data';
import { formErrorHandler } from '../../utils/error-handler';
import useStateCallback from '../../utils/use-state-callback';
import useYupValidationResolver from '../../utils/use-yup-validation-resolver';
import {
  onlyDigits,
  onlyLettersAndNumbers,
} from '../../validations/validations';
import './savePet.scss';

type FormValues = {
  externalId?: string;
  id?: number | null;
  name: string;
  sex?: GenderDropdown;
  passportNo: string;
  species: string;
  dateOfBirth?: Date;
  passportCountry?: { label: string; value: number } | null;
  breed: { label: string; value: string } | null;
  color?: string;
  microchipNo?: string;
  dateOfApplicationOfTransponder?: Date;
  locationOfTransponder?: string;
  petTatto?: string;
  dateOfApplicationOfTattoo?: Date;
  locationOfTatto?: string;
  veterinarianName?: string;
  veterinarianAddress?: string;
  veterinarianPhone?: string;
  veterinarianEmail?: string;
  veterinarianNotableCharacteristics?: string;
  veterinarianComments?: string;
  qrCodeImage?: string;
  medicalId?: number | null;
  rabbiesManufacturer?: string;
  rabbiesNameOfProduct?: string;
  rabbiesBachNumber?: string;
  rabbiesValidTo?: Date;
  rabbiesAmendments?: string;
  rabbiesAuthorisedVeterinarian?: string;
  rabbiesStatus?: MedicalStatusDropdown;
  rabbiesAntibodySampleCollectionDate?: Date;
  rabbiesAntibodyAuthorisedVeterinarian?: string;
  rabbiesAntibodyAddress?: string;
  rabbiesAntibodyTelephone?: string;
  rabbiesAntibodyDate?: Date;
  rabbiesAntibodySignature?: string;
  antiEchinococcousManufacturer?: string;
  antiEchinococcousNameOfProduct?: string;
  antiEchinococcousValidTo?: Date;
  antiEchinococcousAuthorisedVeterinarian?: string;
  antiEchinococcousStatus?: MedicalStatusDropdown;
  otherParasiteTreatments?: string;
  otherVaccinations?: string;
  clinicalExamination?: string;
  legalisation?: string;
  others?: string;
};

enum PageTypeEnum {
  PetDetails,
  MedicalInfo,
}

interface GenderDropdown {
  label: string;
  value: GenderType;
}

interface MedicalStatusDropdown {
  label: string;
  value: MedicalStatusEnum;
}

interface Props {
  userRole: UserRoleEnum;
  id?: number;
  onBackClick?: () => void;
}

interface State {
  selectedTabHeader: PageTypeEnum;
  pending: boolean;
  pendingUpdate: boolean;
  pendingDelete: boolean;
  isEditing: boolean;
  isOpenConfirmModal: boolean;
  file: {
    previewUrl: string;
    obj: any;
  } | null;
  petData: PetResponseDto | null;
}

export default function SavePet(props: Props) {
  const [state, setState] = useStateCallback<State>({
    selectedTabHeader: PageTypeEnum.PetDetails,
    pending: true,
    pendingUpdate: false,
    pendingDelete: false,
    isEditing: false,
    isOpenConfirmModal: false,
    file: null,
    petData: null,
  });

  const minDate = moment().add(1, 'day').toDate();
  const maxDate = moment().add(-1, 'day').toDate();

  const validationSchema: SchemaOf<FormValues> = Yup.object({
    externalId: Yup.string(),
    id: Yup.number().nullable(true),
    name: Yup.string()
      .required('Field Name is required.')
      .max(50, 'Field Name must be less than 50 characters in length.'),
    sex: Yup.object()
      .shape({ value: Yup.number(), label: Yup.string() })
      .nullable(true)
      .required('Field Sex is required.'),
    passportNo: Yup.string()
      .required('Field Passport No is required.')
      .matches(
        onlyLettersAndNumbers,
        'Field Passport No must only contain letters and numbers.'
      ),
    species: Yup.string().required('Field Species is required.'),
    dateOfBirth: Yup.date(),
    passportCountry: Yup.object()
      .shape({ value: Yup.number(), label: Yup.string() })
      .nullable(true),
    breed: Yup.object()
      .shape({ value: Yup.string(), label: Yup.string() })
      .nullable(true)
      .required('Field Breed is required.'),
    color: Yup.string(),
    microchipNo: Yup.string()
      .required('Field Microchip No is required.')
      .min(15, 'Field Microchip No must be 15 characters in length.')
      .max(15, 'Field Microchip No must be 15 characters in length.')
      .matches(onlyDigits, 'Field Microchip No must only contain digits.'),
    dateOfApplicationOfTransponder: Yup.date(),
    locationOfTransponder: Yup.string(),
    petTatto: Yup.string(),
    dateOfApplicationOfTattoo: Yup.date(),
    locationOfTatto: Yup.string(),
    veterinarianName: Yup.string().max(
      50,
      'Field Veterinarian Name be less than 50 characters in length.'
    ),
    veterinarianAddress: Yup.string(),
    veterinarianPhone: Yup.string(),
    veterinarianEmail: Yup.string(),
    veterinarianNotableCharacteristics: Yup.string(),
    veterinarianComments: Yup.string(),
    qrCodeImage: Yup.string(),
    medicalId: Yup.number().nullable(true),
    rabbiesManufacturer: Yup.string(),
    rabbiesNameOfProduct: Yup.string(),
    rabbiesBachNumber: Yup.string(),
    rabbiesValidTo: Yup.date(),
    rabbiesAmendments: Yup.string(),
    rabbiesAuthorisedVeterinarian: Yup.string(),
    rabbiesStatus: Yup.object()
      .shape({ value: Yup.number(), label: Yup.string() })
      .nullable(true),
    rabbiesAntibodySampleCollectionDate: Yup.date(),
    rabbiesAntibodyAuthorisedVeterinarian: Yup.string(),
    rabbiesAntibodyAddress: Yup.string(),
    rabbiesAntibodyTelephone: Yup.string(),
    rabbiesAntibodyDate: Yup.date(),
    rabbiesAntibodySignature: Yup.string(),
    antiEchinococcousManufacturer: Yup.string(),
    antiEchinococcousNameOfProduct: Yup.string(),
    antiEchinococcousValidTo: Yup.date(),
    antiEchinococcousAuthorisedVeterinarian: Yup.string(),
    antiEchinococcousStatus: Yup.object()
      .shape({ value: Yup.number(), label: Yup.string() })
      .nullable(true),
    otherParasiteTreatments: Yup.string(),
    otherVaccinations: Yup.string(),
    clinicalExamination: Yup.string(),
    legalisation: Yup.string(),
    others: Yup.string(),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    control,
    register,
    setError,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<FormValues>({
    resolver,
  });

  const sex: GenderDropdown[] = [
    {
      label: 'Male',
      value: GenderType.Male,
    },
    {
      label: 'Female',
      value: GenderType.Female,
    },
  ];

  const medialcalStatusOptions: MedicalStatusDropdown[] = [
    {
      label: 'Not verified',
      value: MedicalStatusEnum.NotVerified,
    },
    {
      label: 'Verified',
      value: MedicalStatusEnum.Verified,
    },
    {
      label: 'Declined',
      value: MedicalStatusEnum.Declined,
    },
    {
      label: 'Expired',
      value: MedicalStatusEnum.Expired,
    },
  ];

  const refFileInput: RefObject<any> = React.useRef();

  const params = useParams<{ id: string }>();

  const history = useHistory();

  useEffect(() => {
    const petId = parseInt(params.id, 10);
    let getApi = null;

    if (props.userRole === UserRoleEnum.User) {
      getApi = usersPetService.getById({ petId });
    } else if (props.userRole === UserRoleEnum.Organisation) {
      getApi = organisationPetsService.getById({ id: props.id || 0 });
    } else if (props.userRole === UserRoleEnum.SystemAdministrator) {
      getApi = adminPetsService.getById({ id: petId });
    }

    if (!getApi) {
      return;
    }

    getApi.then(
      (res) => {
        setValue('id', res.id);
        setValue('externalId', res.externalId || undefined);
        setValue('name', res.name || '');
        setValue(
          'sex',
          res.sex
            ? {
                label: GenderType[res.sex || 0],
                value: res.sex || 0,
              }
            : undefined
        );
        setValue('qrCodeImage', res.qrCodeImage || '');
        setValue('passportNo', res.passportNo || '');
        setValue('species', res.species || '');
        setValue(
          'dateOfBirth',
          res.dateOfBirth ? moment(res.dateOfBirth).toDate() : undefined
        );
        setValue(
          'passportCountry',
          res.passportCountry?.id
            ? {
                value: res.passportCountry?.id,
                label: res.passportCountry?.name || '',
              }
            : null
        );
        setValue(
          'breed',
          res.breed
            ? {
                value: res.breed,
                label: res.breed,
              }
            : null
        );
        setValue('color', res.color || '');
        setValue('microchipNo', res.microchipNo || '');
        setValue(
          'dateOfApplicationOfTransponder',
          res.dateOfApplicationOfTransponder
            ? moment(res.dateOfApplicationOfTransponder).toDate()
            : undefined
        );
        setValue('locationOfTransponder', res.locationOfTransponder || '');
        setValue('petTatto', res.petTatto || '');
        setValue(
          'dateOfApplicationOfTattoo',
          res.dateOfApplicationOfTattoo
            ? moment(res.dateOfApplicationOfTattoo).toDate()
            : undefined
        );
        setValue('locationOfTatto', res.locationOfTatto || '');
        setValue('veterinarianName', res.veterinarian?.name || '');
        setValue('veterinarianAddress', res.veterinarian?.address || '');
        setValue('veterinarianPhone', res.veterinarian?.phone || '');
        setValue('veterinarianEmail', res.veterinarian?.email || '');
        setValue(
          'veterinarianNotableCharacteristics',
          res.veterinarian?.notableCharacteristics || ''
        );
        setValue('veterinarianComments', res.veterinarian?.comments || '');

        setValue('medicalId', res.medicalId);
        setValue('rabbiesManufacturer', res.medical?.rabbiesManufacturer || '');
        setValue(
          'rabbiesNameOfProduct',
          res.medical?.rabbiesNameOfProduct || ''
        );
        setValue('rabbiesBachNumber', res.medical?.rabbiesBachNumber || '');
        setValue('species', res.species || '');
        setValue(
          'rabbiesValidTo',
          res.medical?.rabbiesValidTo
            ? moment(res.medical?.rabbiesValidTo).toDate()
            : undefined
        );
        setValue('rabbiesAmendments', res.medical?.rabbiesAmendments || '');
        setValue(
          'rabbiesAuthorisedVeterinarian',
          res.medical?.rabbiesAuthorisedVeterinarian || ''
        );
        setValue(
          'rabbiesStatus',
          medialcalStatusOptions.find(
            (x) => x.value === res.medical?.rabbiesStatus
          )
        );

        setValue(
          'rabbiesAntibodySampleCollectionDate',
          res.medical?.rabbiesAntibodySampleCollectionDate
            ? moment(res.medical?.rabbiesAntibodySampleCollectionDate).toDate()
            : undefined
        );
        setValue(
          'rabbiesAntibodyAuthorisedVeterinarian',
          res.medical?.rabbiesAntibodyAuthorisedVeterinarian || ''
        );
        setValue(
          'rabbiesAntibodyAddress',
          res.medical?.rabbiesAntibodyAddress || ''
        );
        setValue(
          'rabbiesAntibodyTelephone',
          res.medical?.rabbiesAntibodyTelephone || ''
        );
        setValue(
          'rabbiesAntibodyDate',
          res.medical?.rabbiesAntibodyDate
            ? moment(res.medical?.rabbiesAntibodyDate).toDate()
            : undefined
        );
        setValue(
          'rabbiesAntibodySignature',
          res.medical?.rabbiesAntibodySignature || ''
        );
        setValue(
          'antiEchinococcousManufacturer',
          res.medical?.antiEchinococcousManufacturer || ''
        );
        setValue(
          'antiEchinococcousNameOfProduct',
          res.medical?.antiEchinococcousNameOfProduct || ''
        );
        setValue(
          'antiEchinococcousValidTo',
          res.medical?.antiEchinococcousValidTo
            ? moment(res.medical?.antiEchinococcousValidTo).toDate()
            : undefined
        );
        setValue(
          'antiEchinococcousAuthorisedVeterinarian',
          res.medical?.antiEchinococcousAuthorisedVeterinarian || ''
        );
        setValue(
          'antiEchinococcousStatus',
          medialcalStatusOptions.find(
            (x) => x.value === res.antiEchinococcousTreatmentStatus
          )
        );

        setValue(
          'otherParasiteTreatments',
          res.medical?.otherParasiteTreatments || ''
        );
        setValue('otherVaccinations', res.medical?.otherVaccinations || '');
        setValue('clinicalExamination', res.medical?.clinicalExamination || '');
        setValue('legalisation', res.medical?.legalisation || '');
        setValue('others', res.medical?.others || '');

        setState({
          ...state,
          petData: res,
          pending: false,
        });
      },
      () => {
        setState({ ...state, pending: false });
      }
    );
  }, []);

  const updatePet = (data: FormValues) => {
    let saveApi = null;

    if (props.userRole === UserRoleEnum.User) {
      saveApi = usersPetService.put;
    } else if (props.userRole === UserRoleEnum.SystemAdministrator) {
      saveApi = adminPetsService.put;
    }

    if (!saveApi) {
      return;
    }

    setState({ ...state, pendingUpdate: true });

    saveApi({
      id: data.id || 0,
      name: data.name,
      sex: data.sex?.value,
      passportNo: data.passportNo,
      species: data.species,
      dateOfBirth: data.dateOfBirth?.toISOString(),
      passportCountryId: data.passportCountry?.value,
      breed: data.breed?.value,
      color: data.color,
      microchipNo: data.microchipNo,
      locationOfTransponder: data.locationOfTransponder,
      dateOfApplicationOfTransponder:
        data.dateOfApplicationOfTransponder?.toISOString(),
      petTatto: data.petTatto,
      dateOfApplicationOfTattoo: data.dateOfApplicationOfTattoo?.toISOString(),
      locationOfTatto: data.locationOfTatto,
      veterinarianName: data.veterinarianName,
      veterinarianAddress: data.veterinarianAddress,
      veterinarianPhone: data.veterinarianPhone,
      veterinarianEmail: data.veterinarianEmail,
      veterinarianComments: data.veterinarianComments,
      veterinarianNotableCharacteristics:
        data.veterinarianNotableCharacteristics,
      medicalId: data.medicalId || 0,
      medicalRabbiesManufacturer: data.rabbiesManufacturer,
      medicalRabbiesNameOfProduct: data.rabbiesNameOfProduct,
      medicalRabbiesBachNumber: data.rabbiesBachNumber,
      medicalRabbiesValidTo: data.rabbiesValidTo?.toISOString(),
      medicalRabbiesAmendments: data.rabbiesAmendments,
      medicalRabbiesAuthorisedVeterinarian: data.rabbiesAuthorisedVeterinarian,
      medicalRabbiesStatus: data.rabbiesStatus?.value,
      medicalRabbiesAntibodySampleCollectionDate:
        data.rabbiesAntibodySampleCollectionDate?.toISOString(),
      medicalRabbiesAntibodyAuthorisedVeterinarian:
        data.rabbiesAntibodyAuthorisedVeterinarian,
      medicalRabbiesAntibodyAddress: data.rabbiesAntibodyAddress,
      medicalRabbiesAntibodyTelephone: data.rabbiesAntibodyTelephone,
      medicalRabbiesAntibodyDate: data.rabbiesAntibodyDate?.toISOString(),
      medicalRabbiesAntibodySignature: data.rabbiesAntibodySignature,
      medicalAntiEchinococcousManufacturer: data.antiEchinococcousManufacturer,
      medicalAntiEchinococcousNameOfProduct:
        data.antiEchinococcousNameOfProduct,
      medicalAntiEchinococcousValidTo:
        data.antiEchinococcousValidTo?.toISOString(),
      medicalAntiEchinococcousAuthorisedVeterinarian:
        data.antiEchinococcousAuthorisedVeterinarian,
      medicalAntiEchinococcousStatus: data.antiEchinococcousStatus?.value,
      medicalOtherParasiteTreatments: data.otherParasiteTreatments,
      medicalOtherVaccinations: data.otherVaccinations,
      medicalClinicalExamination: data.clinicalExamination,
      medicalLegalisation: data.legalisation,
      medicalOthers: data.others,
      petImage: state.file?.obj,
    }).then(
      () => {
        setState({ ...state, pendingUpdate: false, isEditing: false });

        reset(data);

        if (props.userRole === UserRoleEnum.User) {
          history.push('/');
        } else if (props.userRole === UserRoleEnum.SystemAdministrator) {
          history.push('/admin/pets');
        }
      },
      (err: ErrorResponseDto) => {
        formErrorHandler<FormValues>(err, setError, getValues());
        setState({ ...state, pendingUpdate: false });
      }
    );
  };

  const deletePet = () => {
    let deleteApi = null;

    if (props.userRole === UserRoleEnum.User) {
      deleteApi = usersPetService.deletePet;
    } else if (props.userRole === UserRoleEnum.SystemAdministrator) {
      deleteApi = adminPetsService.deletePet;
    }

    if (!deleteApi) {
      return;
    }

    setState({ ...state, pendingDelete: true });

    deleteApi({ id: getValues('id') || 0 }).then(
      () => {
        setState({ ...state, pendingDelete: false, isOpenConfirmModal: false });
        history.push('/');
      },
      () => {
        setState({ ...state, pendingDelete: false, isOpenConfirmModal: false });
      }
    );
  };

  const imageChanged = (e: any) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];

      setState({
        ...state,
        file: {
          previewUrl: URL.createObjectURL(file),
          obj: file,
        },
      });
    }
  };

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

  const loadCountries = _.debounce((query: string, callback: any) => {
    if (_.isEmpty(query)) {
      callback([]);
    } else {
      countriesService
        .get({
          query,
        })
        .then((res) => {
          callback(
            res.results?.map((x) => ({
              value: x.id || '',
              label: x.name || '',
            })) || []
          );
        });
    }
  }, 500);

  const openConfirmModal = () => {
    setState({ ...state, isOpenConfirmModal: true });
  };

  const closeConfirmModal = () => {
    setState({ ...state, isOpenConfirmModal: false });
  };

  const petImageUrl = state.file?.previewUrl ?? state.petData?.petImage;

  return (
    <div className="add-pet-page">
      {state.pending && <div className="spinner" />}

      <Prompt
        message={
          'Any unsaved changes will be lost. Are you sure you want to leave this page?'
        }
        when={(isDirty || state.file !== null) && state.isEditing}
      />

      {getValues('id') && (
        <form
          className="add-pet-details-card"
          onSubmit={handleSubmit(updatePet)}
          id="form"
        >
          <div className="card-header">
            <div className="row">
              <div className="col-md">
                <div className="d-flex">
                  <button
                    type="button"
                    onClick={() =>
                      setState({
                        ...state,
                        selectedTabHeader: PageTypeEnum.PetDetails,
                      })
                    }
                    className={
                      state.selectedTabHeader === PageTypeEnum.PetDetails
                        ? 'header-tab-button header-tab-button-active'
                        : 'header-tab-button'
                    }
                  >
                    Pet details
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setState({
                        ...state,
                        selectedTabHeader: PageTypeEnum.MedicalInfo,
                      })
                    }
                    className={
                      state.selectedTabHeader === PageTypeEnum.MedicalInfo
                        ? 'header-tab-button header-tab-button-active'
                        : 'header-tab-button'
                    }
                    style={{ marginLeft: 24 }}
                  >
                    Medical info
                  </button>
                </div>
              </div>

              <div className="col-auto mt-3 mb-3 mt-lg-0 mb-lg-0">
                {props.userRole === UserRoleEnum.Organisation && (
                  <div className="buttons-wrapper">
                    <Button
                      title="Back"
                      size="small"
                      onClick={() =>
                        props.onBackClick ? props.onBackClick() : {}
                      }
                    />
                  </div>
                )}
                {props.userRole !== UserRoleEnum.Organisation && (
                  <div className="row buttons-wrapper">
                    {params.id && state.isEditing && (
                      <div className="col mb-2 mb-sm-0 d-flex justify-content-center">
                        <Button
                          className="modify-pet-button remove-pet-button"
                          onClick={() => openConfirmModal()}
                          title="Remove pet"
                          size="small"
                          loading={state.pendingDelete}
                        />
                      </div>
                    )}
                    {!state.isEditing && (
                      <div className="col d-flex justify-content-center">
                        <Button
                          className="modify-pet-button"
                          onClick={() =>
                            setState({ ...state, isEditing: true })
                          }
                          title="Edit"
                          size="small"
                        />
                      </div>
                    )}
                    {state.isEditing && (
                      <div className="col d-flex justify-content-center">
                        <Button
                          className="modify-pet-button"
                          type="submit"
                          title="Save"
                          size="small"
                          loading={state.pendingUpdate}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <fieldset disabled={!state.isEditing}>
            {state.selectedTabHeader === PageTypeEnum.PetDetails && (
              <div className="card-add-pet-info">
                {!isValid && isDirty && (
                  <span className="error-message">
                    There are some validation errors for Pet Details or Medical
                    Info form.
                  </span>
                )}
                <div className="row justify-content-center">
                  <div className="col-auto mb-3">
                    <div
                      className={`pet-avatar-container ${
                        !petImageUrl ? 'no-avatar' : ''
                      }`}
                      role="presentation"
                      onClick={() => refFileInput.current?.click()}
                      style={
                        !state.isEditing
                          ? {
                              cursor: 'default',
                              backgroundImage: `url(${
                                petImageUrl ?? cameraIcon
                              })`,
                            }
                          : {
                              backgroundImage: `url(${
                                petImageUrl ?? cameraIcon
                              })`,
                            }
                      }
                    />
                    {state.isEditing && (
                      <button
                        type="button"
                        onClick={() => refFileInput.current?.click()}
                        className="add-avatar-button"
                      >
                        Upload image
                      </button>
                    )}
                    {!state.isEditing && (
                      <div className="external-id-container">
                        <span className="external-id-text">
                          Pet ID: {getValues('externalId')?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="d-none">
                      <input
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        ref={refFileInput}
                        onChange={(e) => imageChanged(e)}
                      />
                    </div>

                    {getValues('qrCodeImage') && (
                      <div className="qr-code-container">
                        <img
                          alt="QR Code"
                          src={getValues('qrCodeImage')}
                          className="qr-code-img"
                        />
                      </div>
                    )}

                    {props.userRole === UserRoleEnum.Organisation && (
                      <div className="pet-medical-status">
                        <h4>
                          Pet Status:{' '}
                          {state.petData?.finalStatus ===
                            MedicalStatusEnum.NotVerified && 'Pending'}
                          {state.petData?.finalStatus ===
                            MedicalStatusEnum.Verified && 'Verified'}
                          {state.petData?.finalStatus ===
                            MedicalStatusEnum.Declined && 'Declined'}
                          {state.petData?.finalStatus ===
                            MedicalStatusEnum.Expired && 'Expired'}
                        </h4>

                        {(state.petData?.vaccinationAgainstRabiesStatus && (
                          <div className="medical-info-item-wrapper">
                            {getMedicalStatus(
                              state.petData?.vaccinationAgainstRabiesStatus
                            )}
                            <span className="pet-info-text">
                              Vaccination against Rabies
                            </span>
                          </div>
                        )) ||
                          null}
                        {(state.petData?.antiEchinococcousTreatmentStatus && (
                          <div className="medical-info-item-wrapper">
                            {getMedicalStatus(
                              state.petData?.antiEchinococcousTreatmentStatus
                            )}
                            <span className="pet-info-text">
                              Anti-Echinococcous Treatment
                            </span>
                          </div>
                        )) ||
                          null}
                      </div>
                    )}
                  </div>

                  <div className="col-md">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                      <div className="col">
                        <Input
                          {...register('name')}
                          className="text-input"
                          label="Name:"
                          error={errors.name}
                        />
                      </div>
                      <div className="col">
                        <Controller<FormValues>
                          name="sex"
                          control={control}
                          render={({ field }) => (
                            <SelectDropDown
                              field={field}
                              label="Sex:"
                              isDisabled={!state.isEditing}
                              defaultOptions={sex}
                              // @ts-ignore
                              error={errors.sex}
                            />
                          )}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('passportNo')}
                          className="text-input"
                          label="Passport No:"
                          error={errors.passportNo}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('species')}
                          className="text-input"
                          label="Species:"
                          error={errors.species}
                        />
                      </div>
                      <div className="col">
                        <Controller<FormValues>
                          name="dateOfBirth"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <DateInput
                              label="DOB:"
                              disabled={!state.isEditing}
                              dateFormat="dd/MM/yyyy"
                              className="date-input"
                              onChange={(date) => onChange(date)}
                              selected={value as Date | null}
                              error={errors.dateOfBirth}
                              maxDate={maxDate}
                              minDate={new Date('01-01-1900')}
                            />
                          )}
                        />
                      </div>
                      <div className="col">
                        <Controller<FormValues>
                          name="passportCountry"
                          control={control}
                          render={({ field }) => (
                            <SelectDropDown
                              field={field}
                              label="Passport Country:"
                              isDisabled={!state.isEditing}
                              loadOptions={loadCountries}
                              noOptionsMessage={(e) =>
                                e.inputValue
                                  ? 'No countries found.'
                                  : 'Please type to search.'
                              }
                              // @ts-ignore
                              error={errors.passportCountry}
                            />
                          )}
                        />
                      </div>
                      <div className="col">
                        <Controller<FormValues>
                          name="breed"
                          control={control}
                          render={({ field }) => {
                            return (
                              <SelectDropDown
                                field={field}
                                label="Breed:"
                                isDisabled={!state.isEditing}
                                options={breedData}
                                creatable
                                isClearable
                                // @ts-ignore
                                error={errors.breed}
                              />
                            );
                          }}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('color')}
                          className="text-input"
                          label="Color:"
                          error={errors.color}
                        />
                      </div>
                      <div className="col" />

                      <div className="d-none">
                        <input
                          type="file"
                          ref={refFileInput}
                          onChange={(e) => imageChanged(e)}
                        />
                      </div>
                    </div>

                    <div className="col-md">
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                        <div className="col">
                          <Input
                            {...register('microchipNo')}
                            className="text-input"
                            label="Transponder/Microchip No:"
                            error={errors.microchipNo}
                          />
                        </div>
                        <div className="col">
                          <Controller<FormValues>
                            name="dateOfApplicationOfTransponder"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <DateInput
                                label="Date of application Transponder:"
                                disabled={!state.isEditing}
                                dateFormat="dd/MM/yyyy"
                                className="date-input"
                                onChange={(date) => onChange(date)}
                                selected={value as Date | null}
                                error={errors.dateOfApplicationOfTransponder}
                                maxDate={maxDate}
                              />
                            )}
                          />
                        </div>
                        <div className="col">
                          <Input
                            {...register('locationOfTransponder')}
                            className="text-input"
                            label="Location of Transponder:"
                            error={errors.locationOfTransponder}
                          />
                        </div>
                        <div className="col">
                          <Input
                            {...register('petTatto')}
                            className="text-input"
                            label="Tattoo:"
                            error={errors.petTatto}
                          />
                        </div>
                        <div className="col">
                          <Controller<FormValues>
                            name="dateOfApplicationOfTattoo"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <DateInput
                                label="Date of application tattoo:"
                                disabled={!state.isEditing}
                                dateFormat="dd/MM/yyyy"
                                className="date-input"
                                onChange={(date) => onChange(date)}
                                selected={value as Date | null}
                                error={errors.dateOfApplicationOfTattoo}
                                maxDate={maxDate}
                              />
                            )}
                          />
                        </div>
                        <div className="col">
                          <Input
                            {...register('locationOfTatto')}
                            className="text-input"
                            label="Location of tattoo:"
                            error={errors.locationOfTatto}
                          />
                        </div>
                      </div>
                      <div
                        className="title-container"
                        style={{ marginTop: 15, marginBottom: 15 }}
                      >
                        Vet info
                      </div>
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4">
                        <div className="col">
                          <Input
                            {...register('veterinarianName')}
                            className="text-input"
                            label="Name:"
                            error={errors.veterinarianName}
                          />
                        </div>
                        <div className="col">
                          <Input
                            {...register('veterinarianAddress')}
                            label="Address:"
                            error={errors.veterinarianName}
                          />
                        </div>
                        <div className="col">
                          <Input
                            {...register('veterinarianPhone')}
                            label="Telephone:"
                            error={errors.veterinarianPhone}
                          />
                        </div>
                        <div className="col">
                          <Input
                            {...register('veterinarianEmail')}
                            type="email"
                            label="Email:"
                            error={errors.veterinarianEmail}
                          />
                        </div>
                      </div>
                      <Input
                        {...register('veterinarianNotableCharacteristics')}
                        className="text-input"
                        label="Notable characteristics:"
                        error={errors.veterinarianNotableCharacteristics}
                      />
                      <Input
                        {...register('veterinarianComments')}
                        textarea
                        label="Other comments:"
                        error={errors.veterinarianComments}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {state.selectedTabHeader === PageTypeEnum.MedicalInfo && (
              <div className="card-add-pet-info">
                {!isValid && isDirty && (
                  <span className="error-message">
                    There are some validation errors for Pet Details or Medical
                    Info form.
                  </span>
                )}
                <div className="row">
                  <div className="col">
                    <div className="row" style={{ marginBottom: 16 }}>
                      <div className="col">
                        <div className="title-container">
                          Vaccination against Rabies:
                        </div>
                      </div>

                      {props.userRole === UserRoleEnum.SystemAdministrator && (
                        <div className="col-auto" style={{ width: 200 }}>
                          <Controller<FormValues>
                            name="rabbiesStatus"
                            control={control}
                            render={({ field }) => (
                              <SelectDropDown
                                field={field}
                                isDisabled={!state.isEditing}
                                defaultOptions={medialcalStatusOptions}
                                // @ts-ignore
                                error={errors.rabbiesStatus}
                              />
                            )}
                          />
                        </div>
                      )}
                    </div>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                      <div className="col">
                        <Input
                          {...register('rabbiesManufacturer')}
                          className="text-input"
                          label="Manufacturer:"
                          error={errors.rabbiesManufacturer}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('rabbiesNameOfProduct')}
                          className="text-input"
                          label="Name of Vaccine:"
                          error={errors.rabbiesNameOfProduct}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('rabbiesBachNumber')}
                          className="text-input"
                          label="Batch number:"
                          error={errors.rabbiesBachNumber}
                        />
                      </div>
                      <div className="col">
                        <Controller<FormValues>
                          name="rabbiesValidTo"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <DateInput
                              label="Vaccination Valid:"
                              disabled={!state.isEditing}
                              dateFormat="dd/MM/yyyy"
                              className="date-input"
                              onChange={(date) => onChange(date)}
                              selected={value as Date | null}
                              error={errors.rabbiesValidTo}
                              minDate={minDate}
                            />
                          )}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('rabbiesAmendments')}
                          className="text-input"
                          label="Amendments/Corrections:"
                          error={errors.rabbiesAmendments}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('rabbiesAuthorisedVeterinarian')}
                          className="text-input"
                          label="Authorised Veterinarian:"
                          error={errors.rabbiesAuthorisedVeterinarian}
                        />
                      </div>
                    </div>
                    <div
                      className="row"
                      style={{ marginBottom: 16, marginTop: 16 }}
                    >
                      <div className="col">
                        <div className="title-container">
                          Rabies Antibody Titration Test:
                        </div>
                      </div>
                    </div>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                      <div className="col">
                        <Controller<FormValues>
                          name="rabbiesAntibodySampleCollectionDate"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <DateInput
                              label="Sample collection date:"
                              disabled={!state.isEditing}
                              dateFormat="dd/MM/yyyy"
                              className="date-input"
                              onChange={(date) => onChange(date)}
                              selected={value as Date | null}
                              error={errors.rabbiesAntibodySampleCollectionDate}
                              maxDate={maxDate}
                            />
                          )}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('rabbiesAntibodyAuthorisedVeterinarian')}
                          className="text-input"
                          label="Authorised Veterinarian:"
                          error={errors.rabbiesAntibodyAuthorisedVeterinarian}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('rabbiesAntibodyAddress')}
                          className="text-input"
                          label="Address:"
                          error={errors.rabbiesAntibodyAddress}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('rabbiesAntibodyTelephone')}
                          className="text-input"
                          label="Telephone:"
                          error={errors.rabbiesAntibodyTelephone}
                        />
                      </div>
                      <div className="col">
                        <Controller<FormValues>
                          name="rabbiesAntibodyDate"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <DateInput
                              label="Date:"
                              disabled={!state.isEditing}
                              dateFormat="dd/MM/yyyy"
                              className="date-input"
                              onChange={(date) => onChange(date)}
                              selected={value as Date | null}
                              error={errors.rabbiesAntibodyDate}
                              maxDate={maxDate}
                            />
                          )}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('rabbiesAntibodySignature')}
                          className="text-input"
                          label="Signature & Stamp:"
                          error={errors.rabbiesAntibodySignature}
                        />
                      </div>
                    </div>
                    <div
                      className="row"
                      style={{ marginBottom: 16, marginTop: 16 }}
                    >
                      <div className="col">
                        <div className="title-container">
                          Anti-Echinococcous Treatment:
                        </div>
                      </div>

                      {props.userRole === UserRoleEnum.SystemAdministrator && (
                        <div className="col-auto" style={{ width: 200 }}>
                          <Controller<FormValues>
                            name="antiEchinococcousStatus"
                            control={control}
                            render={({ field }) => (
                              <SelectDropDown
                                field={field}
                                isDisabled={!state.isEditing}
                                defaultOptions={medialcalStatusOptions}
                                // @ts-ignore
                                error={errors.antiEchinococcousStatus}
                              />
                            )}
                          />
                        </div>
                      )}
                    </div>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                      <div className="col">
                        <Input
                          {...register('antiEchinococcousManufacturer')}
                          className="text-input"
                          label="Manufacturer:"
                          error={errors.antiEchinococcousManufacturer}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('antiEchinococcousNameOfProduct')}
                          className="text-input"
                          label="Name of Product:"
                          error={errors.antiEchinococcousNameOfProduct}
                        />
                      </div>
                      <div className="col">
                        <Controller<FormValues>
                          name="antiEchinococcousValidTo"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <DateInput
                              label="Vaccination Valid:"
                              disabled={!state.isEditing}
                              dateFormat="dd/MM/yyyy"
                              className="date-input"
                              onChange={(date) => onChange(date)}
                              selected={value as Date | null}
                              error={errors.antiEchinococcousValidTo}
                              minDate={minDate}
                            />
                          )}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register(
                            'antiEchinococcousAuthorisedVeterinarian'
                          )}
                          className="text-input"
                          label="Authorized Veterinarian:"
                          error={errors.antiEchinococcousAuthorisedVeterinarian}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3" style={{ marginTop: 16 }}>
                    <Input
                      {...register('otherParasiteTreatments')}
                      textarea
                      className="text-input"
                      label="Other Parasite Treatments:"
                      error={errors.otherParasiteTreatments}
                    />
                    <Input
                      {...register('otherVaccinations')}
                      textarea
                      className="text-input"
                      label="Other Vaccinations:"
                      error={errors.otherVaccinations}
                    />
                    <Input
                      {...register('clinicalExamination')}
                      textarea
                      className="text-input"
                      label="Clinical Examination:"
                      error={errors.clinicalExamination}
                    />
                    <Input
                      {...register('legalisation')}
                      textarea
                      className="text-input"
                      label="Legalization:"
                      error={errors.legalisation}
                    />
                    <Input
                      {...register('others')}
                      textarea
                      className="text-input"
                      label="Others:"
                      error={errors.others}
                    />
                  </div>
                </div>
              </div>
            )}
          </fieldset>
        </form>
      )}
      <ConfirmModal
        isOpen={state.isOpenConfirmModal}
        title="Are you sure?"
        subtitle="Are you sure you want to delete?"
        onConfirm={() => deletePet()}
        onCancel={() => closeConfirmModal()}
        loading={state.pendingDelete}
      />
    </div>
  );
}
