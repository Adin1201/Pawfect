import _ from 'lodash';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SchemaOf } from 'yup';
import useDidMountEffect from '../../utils/use-did-mount-effect';
import useYupValidationResolver from '../../utils/use-yup-validation-resolver';
import Input from '../Input';
import Select from '../Select';
import styles from './TableHeader.module.scss';

type HeaderFormValue = {
  pageSize?: { value: number; label: string };
  query?: string;
};

interface Props {
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (query?: string) => void;
}

const TableHeader = (props: Props) => {
  const validationSchema: SchemaOf<HeaderFormValue> = Yup.object({
    pageSize: Yup.object()
      .shape({
        value: Yup.string().required(),
        label: Yup.string().required(),
      })
      .nullable(),
    query: Yup.string(),
  });

  const resolver = useYupValidationResolver(validationSchema);

  const { register, control, watch, setValue } = useForm<HeaderFormValue>({
    resolver,
    defaultValues: {
      pageSize: { value: 10, label: '10' },
      query: '',
    },
  });

  const watchPageSize = watch('pageSize');
  const watchQuery = watch('query');

  useDidMountEffect(() => {
    props.onPageSizeChange(watchPageSize?.value || 10);
  }, [watchPageSize]);

  useDidMountEffect(() => {
    props.onSearchChange(watchQuery);
  }, [watchQuery]);

  const debounceSetQuery = _.debounce((q) => {
    setValue('query', q);
  }, 500);

  return (
    <div className={styles.tableHeader}>
      <div className={styles.pageSizeWrapper}>
        <span>Show</span>
        <div className={styles.selectWrapper}>
          <Controller<HeaderFormValue>
            name="pageSize"
            control={control}
            render={({ field }) => (
              <Select
                name="pageSize"
                field={field}
                defaultOptions={[
                  { value: 10, label: 10 },
                  { value: 20, label: 20 },
                  { value: 50, label: 50 },
                  { value: 100, label: 100 },
                ]}
              />
            )}
          />
        </div>
        <span>entries</span>
      </div>
      <div className={styles.searchWrapper}>
        <Input
          {...register('query')}
          onChange={(e) => debounceSetQuery(e.target.value)}
          placeholder="Search..."
        />
      </div>
    </div>
  );
};

export default TableHeader;
