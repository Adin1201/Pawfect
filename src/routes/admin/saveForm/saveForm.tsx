import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import { LiabilityFormResponseDto } from '../../../api/api';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import RichTextEditor from '../../../components/RichTextEditor';
import Select from '../../../components/Select';
import adminLiabilityFormsService from '../../../services/adminLiabilityFormsService';
import iataService from '../../../services/iataService.ts';
import { formErrorHandler } from '../../../utils/error-handler';
import useYupValidationResolver from '../../../utils/use-yup-validation-resolver';

type LiabilityFormValues = {
  id?: number;
  name: string;
  description: string;
  airlineCode: { value: number; label: string } | undefined;
};

interface State {
  saving: boolean;
  loading: boolean;
  file: any;
  liabilityFormData: LiabilityFormResponseDto | null;
}

const AdminSaveFormPage = () => {
  const [state, setState] = useState<State>({
    saving: false,
    loading: false,
    file: null,
    liabilityFormData: null,
  });

  const params = useParams<{ id: string }>();
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validationSchema: SchemaOf<LiabilityFormValues> = Yup.object({
    id: Yup.number(),
    name: Yup.string()
      .max(50, 'Field Name must be less than 50 characters.')
      .required('Field Name is required.'),
    description: Yup.string().required('Field Description is required.'),
    airlineCode: Yup.object()
      .shape({
        value: Yup.number().required(),
        label: Yup.string().required(),
      })
      .required('Field Airline Name or Code is required.'),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    setValue,
    control,
  } = useForm<LiabilityFormValues>({
    resolver,
  });

  useEffect(() => {
    if (params.id) {
      setState({
        ...state,
        loading: true,
      });

      adminLiabilityFormsService.getById(parseInt(params.id, 10)).then(
        (res) => {
          setValue('id', res.id || 0);
          setValue('name', res.name || '');
          setValue('description', res.description || '');
          setValue(
            'airlineCode',
            res.iata
              ? {
                  label: res.iata?.name || '',
                  value: res.iata?.id || 0,
                }
              : undefined
          );

          setState({
            ...state,
            loading: false,
            liabilityFormData: res,
          });
        },
        () => {
          history.push('/admin/forms');
        }
      );
    }
  }, [params.id]);

  const saveChanges = () => {
    const apiCall = params.id
      ? adminLiabilityFormsService.put
      : adminLiabilityFormsService.post;

    setState({
      ...state,
      saving: true,
    });

    apiCall({
      id: getValues('id'),
      name: getValues('name'),
      description: getValues('description'),
      iATAId: getValues('airlineCode')?.value || 0,
      file: state.file,
    }).then(
      () => {
        toast.success('Successfully updated Form');
        history.push('/admin/forms');
      },
      (err) => {
        formErrorHandler<LiabilityFormValues>(err, setError, getValues());
        setState({
          ...state,
          saving: false,
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
              value: x.id || '',
              label: x.name || '',
            })) || []
          );
        });
    }
  }, 500);

  const hasUploadedFile = state.file || state.liabilityFormData?.document;
  let uploadedFileUrl = null;

  if (state.file) {
    uploadedFileUrl = URL.createObjectURL(state.file);
  } else if (state.liabilityFormData?.document) {
    uploadedFileUrl = state.liabilityFormData.document;
  }

  return (
    <div className="app-page-wrapper">
      <div className="page-card">
        <form onSubmit={handleSubmit(saveChanges)}>
          <div className="page-header">
            <h3>{params.id ? 'Edit Form' : 'New Form'}</h3>

            <div className="page-header__actions">
              <Button
                onClick={() => {}}
                title="Save "
                size="small"
                loading={state.saving}
                type="submit"
              />
            </div>
          </div>
          <div className="page-content">
            {state.loading && <div className="spinner" />}
            {!state.loading && (
              <>
                <Input
                  {...register('name')}
                  type="text"
                  placeholder="Name"
                  inputSize="large"
                  error={errors.name}
                />

                <div className="mt-4" style={{ maxWidth: 300 }}>
                  <Controller<LiabilityFormValues>
                    name="airlineCode"
                    control={control}
                    render={({ field }) => (
                      <Select
                        field={field}
                        inputStyle="bordered"
                        inputSize="large"
                        placeholder="Airline Name or Code"
                        loadOptions={loadAirlines}
                        noOptionsMessage={(e) =>
                          e.inputValue
                            ? 'No airlines found.'
                            : 'Please type to search.'
                        }
                      />
                    )}
                  />
                </div>

                <div className="mt-4">
                  <Controller<LiabilityFormValues>
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor
                        field={field}
                        error={errors.description}
                      />
                    )}
                  />
                </div>

                <div className="mt-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept=".pdf"
                    onChange={(e) =>
                      setState({
                        ...state,
                        file: e.target.files?.length ? e.target.files[0] : null,
                      })
                    }
                  />
                  <Button
                    title={hasUploadedFile ? 'Change PDF' : 'Upload PDF'}
                    onClick={() => fileInputRef.current?.click()}
                    color="tertiary"
                    size="medium"
                  />
                  {uploadedFileUrl && (
                    <a
                      href={uploadedFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ marginLeft: 8 }}
                    >
                      See uploaded PDF
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSaveFormPage;
