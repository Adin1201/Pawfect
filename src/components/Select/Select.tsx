import React, { Ref } from 'react';
import { ControllerRenderProps, FieldError } from 'react-hook-form';
import { ControlProps, NamedProps, StylesConfig } from 'react-select';
import AsyncSelect, { AsyncProps } from 'react-select/async';
import Creatable from 'react-select/creatable';
import './Select.scss';

interface SelectDropdownProps extends AsyncProps<any>, NamedProps<any> {
  label?: string;
  inputStyle?: 'background-light' | 'background-dark' | 'bordered';
  inputSize?: 'large' | 'normal';
  field?: ControllerRenderProps;
  creatable?: boolean;
  error?: FieldError;
}

const customStyleBordered = (
  size: 'large' | 'normal'
): StylesConfig<any, any> => ({
  control: (base: any, props: ControlProps<any, any>) => ({
    ...base,
    height: size === 'normal' ? 45 : 65,
    borderRadius: 5,
    backgroundColor: props.isDisabled ? '#FAFAFA' : '#fff',
    borderColor: '#d2d2d2',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#565656',
    fontSize: size === 'normal' ? 16 : 20,
  }),
  valueContainer: (base) => ({
    ...base,
    marginLeft: size === 'normal' ? 7 : 14,
  }),
  input: (base) => ({
    ...base,
    color: '#565656',
    fontSize: size === 'normal' ? 16 : 20,
  }),
  placeholder: (base) => ({
    ...base,
    color: '#999',
    fontSize: size === 'normal' ? 16 : 20,
  }),
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
});

const customStyleBackgroundDark: StylesConfig<any, any> = {
  control: (base: any) => ({
    ...base,
    border: 'none',
    height: 65,
    borderRadius: 10,
    background: 'rgba(0,0,0,.1)',
    padding: 0,
    margin: 0,
    fontSize: 20,
  }),
  input: (base) => ({
    ...base,
    color: '#fff',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#fff',
  }),
  valueContainer: (base) => ({
    ...base,
    paddingLeft: 20,
    color: '#fff',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#ddd',
  }),
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
};

const SelectDropdown = React.forwardRef(
  (props: SelectDropdownProps, ref: Ref<any>) => {
    const {
      label,
      inputStyle = 'bordered',
      inputSize = 'normal',
      field,
      creatable,
      error,
      ...rest
    } = props;

    const customStyles =
      inputStyle === 'bordered'
        ? customStyleBordered(inputSize)
        : customStyleBackgroundDark;

    return (
      <div className={'select-dropdown'}>
        {label && <span className="label-text">{label}</span>}
        {creatable ? (
          <Creatable
            {...rest}
            {...field}
            onChange={(value, action) => {
              if (props.onChange) {
                props.onChange(value, action);
              }

              if (field?.onChange) {
                field.onChange(value);
              }
            }}
            styles={customStyles}
            ref={ref}
          />
        ) : (
          <AsyncSelect
            {...rest}
            {...field}
            onChange={(value, action) => {
              if (props.onChange) {
                props.onChange(value, action);
              }

              if (field?.onChange) {
                field.onChange(value);
              }
            }}
            styles={customStyles}
            ref={ref}
          />
        )}

        {error?.message && (
          <span className={'error-message'}>{error.message}</span>
        )}
      </div>
    );
  }
);

export default SelectDropdown;
