import _ from 'lodash';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import { ErrorResponseDto, UserRoleEnum } from '../../api/api';
import logoWhite from '../../assets/images/logo-white.png';
import '../../assets/scss/onboarding-modal.scss';
import adminUsersService from '../../services/adminUsersService';
import iataService from '../../services/iataService.ts';
import { formErrorHandler } from '../../utils/error-handler';
import useStateCallback from '../../utils/use-state-callback';
import useYupValidationResolver from '../../utils/use-yup-validation-resolver';
import { email } from '../../validations/validations';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Input from '../Input';
import Select from '../Select';
import styles from './AddUserModal.module.scss';

type UserFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  sendEmailWithDetails?: boolean;
};

type OrganisationFormValues = {
  name: string;
  airlineCode: { value: number; label: string };
  email: string;
  password: string;
  sendEmailWithDetails?: boolean;
};

interface Props extends ReactModal.Props {
  onFinish: () => void;
  onCancel: () => void;
}

interface State {
  pending: boolean;
  selectedRole: { value: UserRoleEnum; label: string } | null;
}

const AddUserModal = (props: Props) => {
  const [state, setState] = useStateCallback<State>({
    pending: false,
    selectedRole: null,
  });

  const validationSchema: SchemaOf<UserFormValues> = Yup.object({
    firstName: Yup.string()
      .max(50, 'Field First Name must be less than 50 characters.')
      .required('Field First Name is required.'),
    lastName: Yup.string()
      .max(50, 'Field Last Name must be less than 50 characters.')
      .required('Field Last Name is required.'),
    email: Yup.string()
      .matches(email, 'Field Email Address must be in valid format.')
      .required('Field Email Address is required.'),
    password: Yup.string()
      .required('Field Password is required.')
      .min(6, 'The length of Password field must be at least 6 characters.'),
    confirmPassword: Yup.string()
      .required('Field Confirm password is required.')
      .min(
        6,
        'The length of Confirm Password field must be at least 6 characters.'
      )
      .oneOf([Yup.ref('password')], 'Passwords fields must match.'),
    sendEmailWithDetails: Yup.boolean(),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    control,
    reset,
  } = useForm<UserFormValues>({
    resolver,
  });

  const validationSchemaOrg: SchemaOf<OrganisationFormValues> = Yup.object({
    name: Yup.string().required('Organisation Name is required.'),
    email: Yup.string()
      .matches(email, 'Email Address must be in valid format.')
      .required('Field Email Address is required.'),
    password: Yup.string()
      .required('Field Password is required.')
      .min(6, 'The length of Password must be at least 6 characters.'),
    airlineCode: Yup.object()
      .shape({
        value: Yup.string().required(),
        label: Yup.string().required(),
      })
      .required('Airline Name or Code is required.'),
    sendEmailWithDetails: Yup.boolean(),
  });

  const resolverOrganisation = useYupValidationResolver(validationSchemaOrg);

  const {
    register: registerOrg,
    handleSubmit: handleSubmitOrg,
    formState: { errors: errorsOrg },
    setError: setErrorOrg,
    getValues: getValuesOrg,
    control: controlOrg,
    reset: resetOrg,
  } = useForm<OrganisationFormValues>({
    resolver: resolverOrganisation,
  });

  const onCreate = (data: UserFormValues) => {
    setState({
      ...state,
      pending: true,
    });

    adminUsersService
      .post({
        adminCreateUserRequestDto: {
          role: state.selectedRole?.value,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          sendEmailWithDetails: data.sendEmailWithDetails,
        },
      })
      .then(
        () => {
          props.onFinish();
        },
        (err: ErrorResponseDto) => {
          setState({ ...state, pending: false });
          formErrorHandler<UserFormValues>(err, setError, getValues());
          setState({
            ...state,
            pending: false,
          });
        }
      );
  };

  const onCreateOrg = (data: OrganisationFormValues) => {
    setState({
      ...state,
      pending: true,
    });

    adminUsersService
      .post({
        adminCreateUserRequestDto: {
          role: state.selectedRole?.value,
          organisationName: data.name,
          email: data.email,
          password: data.password,
          iataId: data.airlineCode.value,
          sendEmailWithDetails: data.sendEmailWithDetails,
        },
      })
      .then(
        () => {
          props.onFinish();
        },
        (err: ErrorResponseDto) => {
          setState({ ...state, pending: false });
          formErrorHandler<OrganisationFormValues>(
            err,
            setErrorOrg,
            getValuesOrg()
          );
          setState({
            ...state,
            pending: false,
          });
        }
      );
  };

  const loadAirlines = _.debounce((query: string, callback: any) => {
    if (_.isEmpty(query)) {
      callback([]);
    } else {
      iataService
        .get({
          query,
        })
        .then((res) => {
          callback(
            res.results?.map((x) => ({
              value: x.id || 0,
              label: x.name || '',
            })) || []
          );
        });
    }
  }, 500);

  useEffect(() => {
    if (!props.isOpen) {
      reset();
      resetOrg();
      setState({
        pending: false,
        selectedRole: null,
      });
    }
  }, [props.isOpen]);

  return (
    <ReactModal
      {...props}
      overlayClassName="app-modal__overlay"
      className="app-modal__content"
      onRequestClose={props.onCancel}
      ariaHideApp={false}
    >
      <div className={styles.modalContainer}>
        <img src={logoWhite} className={styles.logoImg} alt="Pawfect logo" />

        <div className={styles.contentWrapper}>
          <div style={{ position: 'relative', zIndex: 20 }}>
            <Select
              inputStyle="background-dark"
              placeholder="Account Role"
              defaultOptions={[
                {
                  value: UserRoleEnum.User,
                  label: 'User',
                },
                {
                  value: UserRoleEnum.Organisation,
                  label: 'Organisation',
                },
                {
                  value: UserRoleEnum.SystemAdministrator,
                  label: 'System Administrator',
                },
              ]}
              onChange={(role) => setState({ ...state, selectedRole: role })}
            />
          </div>

          {state.selectedRole &&
            state.selectedRole?.value !== UserRoleEnum.Organisation && (
              <form onSubmit={handleSubmit(onCreate)}>
                <div className="row mt-3">
                  <div className="col-md">
                    <Input
                      {...register('firstName')}
                      inputStyle="background-dark"
                      inputSize="large"
                      placeholder="First name"
                      error={errors.firstName}
                    />
                  </div>
                  <div className="col-md">
                    <Input
                      {...register('lastName')}
                      inputStyle="background-dark"
                      inputSize="large"
                      placeholder="Surname"
                      error={errors.lastName}
                    />
                  </div>
                </div>
                <Input
                  {...register('email')}
                  inputStyle="background-dark"
                  inputSize="large"
                  placeholder="Email address"
                  className="mt-3"
                  error={errors.email}
                />
                <Input
                  {...register('password')}
                  inputStyle="background-dark"
                  inputSize="large"
                  type="password"
                  placeholder="Password"
                  className="mt-3"
                  error={errors.password}
                />
                <Input
                  {...register('confirmPassword')}
                  inputStyle="background-dark"
                  inputSize="large"
                  type="password"
                  placeholder="Confirm password"
                  className="mt-3"
                  error={errors.confirmPassword}
                />
                <div className="row align-items-center mt-4">
                  <div className="col mt-4 mt-md-0">
                    <Controller<UserFormValues>
                      name="sendEmailWithDetails"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          type="primary"
                          checked={value as boolean}
                          onChange={(e) => onChange(e.target.checked)}
                          label="Send email with account details to user"
                          error={errors.sendEmailWithDetails}
                        />
                      )}
                    />
                  </div>
                  <div className="col-auto mt-4 mt-md-0">
                    <Button
                      onClick={() => {}}
                      type="submit"
                      title="Create"
                      color="secondary"
                      loading={state.pending}
                      style={{ width: 200 }}
                    />
                  </div>
                </div>
              </form>
            )}

          {state.selectedRole &&
            state.selectedRole?.value === UserRoleEnum.Organisation && (
              <form onSubmit={handleSubmitOrg(onCreateOrg)}>
                <div className="row mt-3">
                  <div className="col-md">
                    <Input
                      {...registerOrg('name')}
                      inputStyle="background-dark"
                      inputSize="large"
                      placeholder="Organisation Name"
                      error={errorsOrg.name}
                    />
                  </div>
                  <div className="col-md">
                    <Controller<OrganisationFormValues>
                      name="airlineCode"
                      control={controlOrg}
                      render={({ field }) => (
                        <Select
                          field={field}
                          inputStyle="background-dark"
                          placeholder="Airline Name or Code"
                          loadOptions={loadAirlines}
                          noOptionsMessage={(e) =>
                            e.inputValue
                              ? 'No airlines found.'
                              : 'Please type to search.'
                          }
                          // @ts-ignore
                          error={errorsOrg.airlineCode}
                        />
                      )}
                    />
                  </div>
                </div>
                <Input
                  {...registerOrg('email')}
                  inputStyle="background-dark"
                  inputSize="large"
                  placeholder="Email address"
                  className="mt-3"
                  error={errors.email}
                />
                <Input
                  {...registerOrg('password')}
                  inputStyle="background-dark"
                  inputSize="large"
                  type="password"
                  placeholder="Password"
                  className="mt-3"
                  error={errors.password}
                />
                <div className="row align-items-center mt-4">
                  <div className="col mt-4 mt-md-0">
                    <Controller<OrganisationFormValues>
                      name="sendEmailWithDetails"
                      control={controlOrg}
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          type="primary"
                          checked={value as boolean}
                          onChange={(e) => onChange(e.target.checked)}
                          label="Send email with account details to user"
                          error={errorsOrg.sendEmailWithDetails}
                        />
                      )}
                    />
                  </div>
                  <div className="col-auto mt-4 mt-md-0">
                    <Button
                      onClick={() => {}}
                      type="submit"
                      title="Create"
                      color="secondary"
                      loading={state.pending}
                      style={{ width: 200 }}
                    />
                  </div>
                </div>
              </form>
            )}
        </div>
      </div>
    </ReactModal>
  );
};

export default AddUserModal;
