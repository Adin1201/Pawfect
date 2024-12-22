import _ from 'lodash';
import moment from 'moment';
import React, { ReactElement, RefObject, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, Prompt, useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import { ErrorResponseDto, GenderType, UserResponseDto } from '../../api';
import { MedicalStatusEnum, UserRoleEnum, UserStatusEnum } from '../../api/api';
import cameraIcon from '../../assets/images/camera.png';
import eyeIcon from '../../assets/images/eye.png';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import DateInput from '../../components/DateInput';
import Input from '../../components/Input';
import SelectDropDown from '../../components/Select';
import Table from '../../components/Table';
import { TableColumn, TableData } from '../../components/Table/Table';
import adminPetsService from '../../services/adminPetsService';
import adminUsersService from '../../services/adminUsersService';
import countriesService from '../../services/countriesService';
import organisationUsersService from '../../services/organisationUsersService';
import usersPetsService from '../../services/usersPetService';
import usersService from '../../services/usersService';
import { formErrorHandler } from '../../utils/error-handler';
import useStateCallback from '../../utils/use-state-callback';
import useYupValidationResolver from '../../utils/use-yup-validation-resolver';
import {
  email,
  onlyDigits,
  onlyLettersAndNumbers,
} from '../../validations/validations';
import './userProfile.scss';

type FormValues = {
  id?: number | null;
  name: string;
  passportNo: string;
  nationality: { label: string; value: number } | null;
  dateOfBirth?: Date;
  documentExpiryDate?: Date;
  surname?: string;
  genderType?: { label: string; value: number } | null;
  address?: string;
  telephone?: string;
  email?: string;
  otherInformation?: string;
  facebook?: string;
  instagram?: string;
  linkedIn?: string;
  liabilityForm?: boolean;
  status?: { label: string; value: UserStatusEnum };
};

enum PageTypeEnum {
  UserProfile,
  PetOwnership,
}

interface TableRow {
  id: number;
  name: string;
  passportNumber: string;
  microchipNumber: string;
  finalStatus: MedicalStatusEnum;
}

interface PetsTableData extends TableData<TableRow> {
  loading: boolean;
}

interface GenderDropdown {
  label: string;
  value: GenderType;
}

interface UserStatusDropdown {
  label: string;
  value: UserStatusEnum;
}

interface Props {
  editable?: boolean;
  id?: number;
  onBackClick?: () => void;
  userRole: UserRoleEnum;
}

interface State {
  pending: boolean;
  pendingUpdate: boolean;
  isEditing: boolean;
  file: {
    previewUrl: string;
    obj: any;
  } | null;
  userData: UserResponseDto | null;
  selectedTabHeader: PageTypeEnum;
  tableData: PetsTableData;
}

export default function UserProfile(props: Props) {
  const [state, setState] = useStateCallback<State>({
    pending: true,
    pendingUpdate: false,
    isEditing: false,
    file: null,
    userData: null,
    selectedTabHeader: PageTypeEnum.UserProfile,
    tableData: {
      results: [],
      totalPages: 0,
      currentPage: 0,
      pageSize: 0,
      query: undefined,
      sort: undefined,
      loading: false,
    },
  });

  const { editable = true, userRole = UserRoleEnum.User } = props;
  const tomorrowDate = moment().add(1, 'day').toDate();

  const refFileInput: RefObject<any> = React.useRef();

  const dispatch = useDispatch();

  const params = useParams<{ id: string }>();

  const history = useHistory();

  const validationSchema: SchemaOf<FormValues> = Yup.object({
    id: Yup.number().nullable(true),
    name: Yup.string()
      .max(50, 'Field First Name must be less than 50 characters.')
      .required('Field Name is required.'),
    passportNo: Yup.string()
      .required('Field Passport Number is required.')
      .matches(
        onlyLettersAndNumbers,
        'Field Passport No must only contain letters and numbers.'
      ),
    dateOfBirth: Yup.date().required('DOB is required.'),
    documentExpiryDate: Yup.date().required(
      'Field Document Expiry Date is required.'
    ),
    surname: Yup.string().max(
      50,
      'Field Last Name must be less than 50 characters.'
    ),
    genderType: Yup.object()
      .shape({ value: Yup.number(), label: Yup.string() })
      .nullable()
      .required('Field Gender is required.'),
    nationality: Yup.object()
      .shape({ value: Yup.number(), label: Yup.string() })
      .typeError('Field Nationality is required.')
      .required('Field Nationality is required.'),
    address: Yup.string(),
    telephone: Yup.string().matches(
      onlyDigits,
      'Field Telephone must only contain digits.'
    ),
    email: Yup.string()
      .matches(email, 'Field Email Address must be in valid format.')
      .required('Field Email Address is required.'),
    otherInformation: Yup.string(),
    facebook: Yup.string(),
    instagram: Yup.string(),
    linkedIn: Yup.string(),
    liabilityForm: Yup.boolean(),
    status: Yup.object()
      .shape({ value: Yup.number(), label: Yup.string() })
      .nullable(true),
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
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver,
  });

  const genderOptions: GenderDropdown[] = [
    {
      label: 'Male',
      value: GenderType.Male,
    },
    {
      label: 'Female',
      value: GenderType.Female,
    },
  ];

  const userStatusOptions: UserStatusDropdown[] = [
    {
      label: 'Pending',
      value: UserStatusEnum.NotVerified,
    },
    {
      label: 'Verified',
      value: UserStatusEnum.Verified,
    },
    {
      label: 'Expired',
      value: UserStatusEnum.Expired,
    },
  ];

  const loadNationalities = _.debounce((query: string, callback: any) => {
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
              label: x.nationality || '',
            })) || []
          );
        });
    }
  }, 500);

  const getUser = (id: number) => {
    let apiCall = null;

    if (userRole === UserRoleEnum.SystemAdministrator && id) {
      apiCall = adminUsersService.getById({ id });
    } else if (userRole === UserRoleEnum.User) {
      apiCall = dispatch(usersService.getMe());
    } else if (userRole === UserRoleEnum.Organisation) {
      apiCall = organisationUsersService.getById({ id: props.id || 0 });
    }

    if (!apiCall) {
      return;
    }

    apiCall
      // @ts-ignore
      .then(
        (res: UserResponseDto) => {
          setValue('id', res.id);
          setValue('name', res.name || '');
          setValue('surname', res.surname || '');
          setValue(
            'genderType',
            res.genderType
              ? {
                  label: GenderType[res.genderType || 0],
                  value: res.genderType || 0,
                }
              : null
          );
          setValue(
            'dateOfBirth',
            res.dateOfBirth ? moment(res.dateOfBirth).toDate() : undefined
          );
          setValue('passportNo', res.passportNo || '');
          setValue(
            'documentExpiryDate',
            res.documentExpiryDate
              ? moment(res.documentExpiryDate).toDate()
              : undefined
          );
          setValue(
            'nationality',
            res.nationality?.id
              ? {
                  value: res.nationality?.id,
                  label: res.nationality?.nationality || '',
                }
              : null
          );
          setValue('address', res.address || '');
          setValue('telephone', res.telephone || '');
          setValue('email', res.email || '');
          setValue('otherInformation', res.otherInformation || '');
          setValue('facebook', res.facebook || '');
          setValue('instagram', res.instagram || '');
          setValue('linkedIn', res.linkedIn || '');
          setValue('liabilityForm', res.liabilityForm);

          const statusOption = userStatusOptions.find(
            (x) => x.value === res.status
          );
          setValue('status', statusOption);

          setState((currentState) => ({
            ...currentState,
            userData: res,
            pending: false,
          }));
        },
        () => {
          setState((currentState) => ({ ...currentState, pending: false }));
        }
      );
  };

  const columns: TableColumn[] = [
    {
      Header: 'ID',
      accessor: 'id',
      sortable: true,
    },
    {
      Header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      Header: 'Passport No',
      accessor: 'passportNumber',
    },
    {
      Header: 'Microchip No',
      accessor: 'microchipNumber',
    },
    {
      Header: 'Status',
      accessor: 'status',
      sortable: true,
      Cell: (cell) => {
        const status = (cell.row.original as TableRow).finalStatus;
        let elem: ReactElement | null = null;

        switch (status) {
          case MedicalStatusEnum.NotVerified:
            elem = <div className="status status--not-verified">Pending</div>;
            break;
          case MedicalStatusEnum.Verified:
            elem = <div className="status status--verified">Verified</div>;
            break;
          case MedicalStatusEnum.Declined:
            elem = <div className="status status--declined">Declined</div>;
            break;
          case MedicalStatusEnum.Expired:
            elem = <div className="status status--declined">Expired</div>;
            break;
          default:
            break;
        }

        return elem;
      },
    },
    {
      Header: 'Actions',
      Cell: (cell) => {
        const id = (cell.row.original as TableRow).id;
        let url = '';

        if (props.userRole === UserRoleEnum.User) {
          url = `/pets/${id}`;
        } else if (props.userRole === UserRoleEnum.SystemAdministrator) {
          url = `/admin/pets/${id}`;
        } else if (props.userRole === UserRoleEnum.Organisation) {
          url = '';
        }

        return (
          <>
            <Link to={url} className="action-button">
              <img src={eyeIcon} alt="See details" />
            </Link>
          </>
        );
      },
    },
  ];

  const loadPage = ({
    page = state.tableData.currentPage,
    pageSize = state.tableData.pageSize,
    sort = state.tableData.sort,
    query = state.tableData.query,
  }: {
    page?: number;
    pageSize?: number;
    sort?: { column: string; desc: boolean };
    query?: string;
  }) => {
    const userId = params.id ? parseInt(params.id, 10) : null;
    let apiCall = null;

    if (userRole === UserRoleEnum.SystemAdministrator && userId) {
      apiCall = adminPetsService.get({
        page,
        pageSize: pageSize || 10,
        query,
        orderByKey: sort?.column,
        isDescending: sort?.desc,
        filter: JSON.stringify({ userId: [userId] }),
      });
    } else if (userRole === UserRoleEnum.User) {
      apiCall = usersPetsService.get({
        page,
        pageSize: pageSize || 10,
        query,
        orderByKey: sort?.column,
        isDescending: sort?.desc,
      });
    }

    if (!apiCall) {
      return;
    }

    setState((currentState) => ({
      ...currentState,
      tableData: {
        ...currentState.tableData,
        results: [],
        query,
        sort,
        loading: true,
      },
    }));

    apiCall.then(
      (res) => {
        const results: TableRow[] =
          res.results?.map((x) => ({
            id: x.id || 0,
            name: x.name || '',
            microchipNumber: x.microchipNo || '',
            passportNumber: x.passportNo || '',
            finalStatus: x.finalStatus || MedicalStatusEnum.NotVerified,
          })) || [];

        setState((currentState) => ({
          ...currentState,
          tableData: {
            ...currentState.tableData,
            results,
            totalPages: res.totalPages || 0,
            currentPage: res.page || 0,
            pageSize: res.pageSize || 0,
            query,
            sort,
            loading: false,
          },
        }));
      },
      () => {
        setState((currentState) => ({
          ...currentState,
          tableData: {
            ...currentState.tableData,
            loading: false,
          },
        }));
      }
    );
  };

  useEffect(() => {
    getUser(parseInt(params.id || '0', 10));
    loadPage({ page: 1 });
  }, []);

  const updateUser = (form: FormValues) => {
    const data = {
      id: form.id || 0,
      dateOfBirth: form.dateOfBirth?.toISOString(),
      email: form.email,
      genderType: form.genderType?.value,
      name: form.name,
      surname: form.surname,
      documentExpiryDate: form.documentExpiryDate?.toISOString(),
      nationalityId: form.nationality?.value,
      telephone: form.telephone,
      address: form.address,
      passportNo: form.passportNo,
      facebook: form.facebook,
      instagram: form.instagram,
      linkedIn: form.linkedIn,
      liabilityForm: form.liabilityForm,
      otherInformation: form.otherInformation,
      profileImage: state.file?.obj,
    };

    let apiCall = null;

    if (userRole === UserRoleEnum.SystemAdministrator && params.id) {
      apiCall = adminUsersService.put({ ...data, status: form.status?.value });
    } else if (userRole === UserRoleEnum.User) {
      apiCall = dispatch(usersService.put({ ...data }));
    }

    if (!apiCall) {
      return;
    }

    setState({ ...state, pendingUpdate: true });

    apiCall
      // @ts-ignore
      .then(
        () => {
          setState({ ...state, pendingUpdate: false, isEditing: false });

          reset(form);

          if (userRole === UserRoleEnum.SystemAdministrator) {
            history.push('/admin/users');
          }
        },
        (err: ErrorResponseDto) => {
          formErrorHandler<FormValues>(err, setError, getValues());
          setState({ ...state, pendingUpdate: false });
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

  const profileImageUrl =
    state.file?.previewUrl ?? state.userData?.profileImage;

  return (
    <div className="user-profile-page">
      {state.pending && <div className="spinner" />}

      <Prompt
        message={
          'Any unsaved changes will be lost. Are you sure you want to leave this page?'
        }
        when={(isDirty || state.file !== null) && state.isEditing}
      />

      {!state.pending && state.userData && (
        <form
          onSubmit={handleSubmit(updateUser)}
          id="form"
          className="user-profile-card"
        >
          <div className="card-header">
            <div className="row justify-content-center">
              <div className="col d-flex justify-content-sm-between justify-content-center">
                {props.userRole !== UserRoleEnum.Organisation && (
                  <div className="d-flex">
                    <button
                      className={
                        state.selectedTabHeader === PageTypeEnum.UserProfile
                          ? 'header-tab-button header-tab-button-active'
                          : 'header-tab-button'
                      }
                      type="button"
                      onClick={() =>
                        setState({
                          ...state,
                          selectedTabHeader: PageTypeEnum.UserProfile,
                        })
                      }
                    >
                      <span>User Profile</span>
                    </button>
                    <button
                      className={
                        state.selectedTabHeader === PageTypeEnum.PetOwnership
                          ? 'header-tab-button header-tab-button-active'
                          : 'header-tab-button'
                      }
                      type="button"
                      onClick={() =>
                        setState({
                          ...state,
                          selectedTabHeader: PageTypeEnum.PetOwnership,
                        })
                      }
                      disabled={state.isEditing ?? true}
                      style={{ marginLeft: 24, minWidth: 180 }}
                    >
                      <span>Pet Ownership</span>
                    </button>
                  </div>
                )}
                {props.userRole === UserRoleEnum.Organisation && (
                  <div style={{ marginLeft: 'auto' }}>
                    <Button
                      title="Back"
                      size="small"
                      style={{ marginBottom: 16 }}
                      onClick={() =>
                        props.onBackClick ? props.onBackClick() : {}
                      }
                    />
                  </div>
                )}
              </div>
              {editable && (
                <div className="col-auto mt-3 mb-3 mt-lg-0 mb-lg-0">
                  {!state.isEditing &&
                    state.selectedTabHeader !== PageTypeEnum.PetOwnership && (
                      <Button
                        className="edit-button"
                        onClick={() => setState({ ...state, isEditing: true })}
                        title="Edit"
                        size="small"
                      />
                    )}
                  {state.isEditing && (
                    <Button
                      className="edit-button"
                      type="submit"
                      title="Save"
                      size="small"
                      loading={state.pendingUpdate}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <fieldset disabled={!state.isEditing}>
            {state.selectedTabHeader === PageTypeEnum.UserProfile && (
              <div className="card-add-user-info">
                <div className="row justify-content-center">
                  <div className="col-auto mb-3">
                    <div
                      className={`user-avatar-container ${
                        !profileImageUrl ? 'no-avatar' : ''
                      }`}
                      role="presentation"
                      onClick={() => refFileInput.current?.click()}
                      style={
                        !state.isEditing
                          ? {
                              cursor: 'default',
                              backgroundImage: `url(${
                                profileImageUrl ?? cameraIcon
                              })`,
                            }
                          : {
                              backgroundImage: `url(${
                                profileImageUrl ?? cameraIcon
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
                    <div className="d-none">
                      <input
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        ref={refFileInput}
                        onChange={(e) => imageChanged(e)}
                      />
                    </div>
                    {userRole === UserRoleEnum.SystemAdministrator && (
                      <div className="mt-3">
                        <Controller<FormValues>
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <SelectDropDown
                              field={field}
                              isDisabled={!state.isEditing}
                              defaultOptions={userStatusOptions}
                              // @ts-ignore
                              error={errors.status}
                            />
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-md">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                      <div className="col">
                        <Input
                          {...register('name')}
                          type="text"
                          className="text-input"
                          label="Name:"
                          error={errors.name}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('surname')}
                          type="text"
                          className="text-input"
                          label="Surname:"
                          error={errors.surname}
                        />
                      </div>
                      <div className="col">
                        <Controller<FormValues>
                          name="genderType"
                          control={control}
                          render={({ field }) => (
                            <SelectDropDown
                              field={field}
                              label="Gender:"
                              isDisabled={!state.isEditing}
                              defaultOptions={genderOptions}
                              // @ts-ignore
                              error={errors.genderType}
                            />
                          )}
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
                              maxDate={new Date()}
                            />
                          )}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('passportNo')}
                          type="text"
                          className="text-input"
                          label="Passport Number/Government ID:"
                          error={errors.passportNo}
                        />
                      </div>
                      <div className="col">
                        <Controller<FormValues>
                          name="documentExpiryDate"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <DateInput
                              label="Document Expiry Date:"
                              disabled={!state.isEditing}
                              dateFormat="dd/MM/yyyy"
                              className="date-input"
                              onChange={(date) => onChange(date)}
                              selected={value as Date | null}
                              error={errors.documentExpiryDate}
                              minDate={tomorrowDate}
                            />
                          )}
                        />
                      </div>
                      <div className="col">
                        <Controller<FormValues>
                          name="nationality"
                          control={control}
                          render={({ field }) => (
                            <SelectDropDown
                              field={field}
                              label="Nationality:"
                              placeholder="Select Nationality"
                              isDisabled={!state.isEditing}
                              loadOptions={loadNationalities}
                              noOptionsMessage={(e) =>
                                e.inputValue
                                  ? 'No nationalities found.'
                                  : 'Please type to search.'
                              }
                              // @ts-ignore
                              error={errors.nationality}
                            />
                          )}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('address')}
                          type="text"
                          className="text-input"
                          label="Address:"
                          error={errors.address}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('telephone')}
                          type="text"
                          className="text-input"
                          label="Telephone:"
                          error={errors.telephone}
                        />
                      </div>
                    </div>

                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                      <div className="col">
                        <Input
                          {...register('email')}
                          className="text-input"
                          type="text"
                          label="Email:"
                          error={errors.email}
                        />
                      </div>
                      <div className="col" />
                      <div className="col" />
                    </div>

                    <div className="col">
                      <Input
                        {...register('otherInformation')}
                        type="text"
                        className="text-input"
                        label="Other information:"
                        error={errors.otherInformation}
                      />
                    </div>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                      <div className="col">
                        <Input
                          {...register('facebook')}
                          type="text"
                          className="text-input"
                          label="Facebook:"
                          error={errors.facebook}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('instagram')}
                          type="text"
                          className="text-input"
                          label="Instagram:"
                          error={errors.instagram}
                        />
                      </div>
                      <div className="col">
                        <Input
                          {...register('linkedIn')}
                          type="text"
                          className="text-input"
                          label="LinkedIn:"
                          error={errors.linkedIn}
                        />
                      </div>
                      <div className="col mt-3">
                        {props.userRole === UserRoleEnum.User && (
                          <div className="d-flex flex-row align-items-center">
                            <Controller<FormValues>
                              name="liabilityForm"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <Checkbox
                                  defaultValue={'liabilityForm'}
                                  disabled={!state.isEditing}
                                  type="secondary"
                                  checked={value as boolean}
                                  onChange={(e) => onChange(e.target.checked)}
                                />
                              )}
                            />
                            <span>
                              Liability form (Click{' '}
                              <Link to={'forms'} className="checkbox-link">
                                here
                              </Link>{' '}
                              to find out more)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </fieldset>
          {state.selectedTabHeader === PageTypeEnum.PetOwnership && (
            <>
              {state.tableData.results && (
                <div className="card-pet-ownership">
                  <Table
                    columns={columns}
                    data={state.tableData}
                    isLoading={state.tableData.loading}
                    onPageChange={(page, pageSize) =>
                      loadPage({ page, pageSize })
                    }
                    onSearchChange={(query) => loadPage({ page: 1, query })}
                    onSortChange={(sort) => loadPage({ page: 1, sort })}
                  />
                </div>
              )}
            </>
          )}
        </form>
      )}
    </div>
  );
}
