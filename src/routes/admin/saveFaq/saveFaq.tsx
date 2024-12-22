import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import RichTextEditor from '../../../components/RichTextEditor';
import adminFaqService from '../../../services/adminFaqService';
import { formErrorHandler } from '../../../utils/error-handler';
import useYupValidationResolver from '../../../utils/use-yup-validation-resolver';

type FaqFormValues = {
  id?: number;
  question: string;
  answer: string;
};

interface State {
  saving: boolean;
  loading: boolean;
}

const AdminSaveFaqPage = () => {
  const [state, setState] = useState<State>({
    saving: false,
    loading: false,
  });

  const params = useParams<{ id: string }>();
  const history = useHistory();

  const validationSchema: SchemaOf<FaqFormValues> = Yup.object({
    id: Yup.number(),
    question: Yup.string().required('Field Question is required.'),
    answer: Yup.string().required('Field Answer is required.'),
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
  } = useForm<FaqFormValues>({
    resolver,
  });

  useEffect(() => {
    if (params.id) {
      setState({
        ...state,
        loading: true,
      });

      adminFaqService.getById(parseInt(params.id, 10)).then(
        (res) => {
          setValue('id', res.id || 0);
          setValue('question', res.question || '');
          setValue('answer', res.answer || '');

          setState({
            ...state,
            loading: false,
          });
        },
        () => {
          history.push('/admin/faq');
        }
      );
    }
  }, [params.id]);

  const saveChanges = () => {
    const apiCall = params.id ? adminFaqService.put : adminFaqService.post;

    setState({
      ...state,
      saving: true,
    });

    apiCall({
      faqRequestDto: {
        id: getValues('id'),
        question: getValues('question'),
        answer: getValues('answer'),
      },
    }).then(
      () => {
        toast.success('Successfully updated FAQ');
        history.push('/admin/faq');
      },
      (err) => {
        formErrorHandler<FaqFormValues>(err, setError, getValues());
        setState({
          ...state,
          saving: false,
        });
      }
    );
  };

  return (
    <div className="app-page-wrapper">
      <div className="page-card">
        <form onSubmit={handleSubmit(saveChanges)}>
          <div className="page-header">
            <h3>{params.id ? 'Edit FAQ' : 'New FAQ'}</h3>

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
                  {...register('question')}
                  type="text"
                  placeholder="Question"
                  inputSize="large"
                  error={errors.question}
                />

                <div className="mt-4">
                  <Controller<FaqFormValues>
                    name="answer"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor field={field} error={errors.answer} />
                    )}
                  />
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSaveFaqPage;
