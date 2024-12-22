import classNames from 'classnames';
import React, { InputHTMLAttributes, Ref } from 'react';
import { FieldError } from 'react-hook-form';
import './Input.scss';

export interface InputProps extends InputHTMLAttributes<any> {
  inputStyle?: 'background-light' | 'background-dark' | 'bordered';
  inputSize?: 'large' | 'normal';
  textarea?: boolean;
  className?: string;
  label?: string;
  error?: FieldError;
}

const Input = React.forwardRef((props: InputProps, ref: Ref<any>) => {
  const {
    inputStyle = 'bordered',
    inputSize = 'normal',
    textarea,
    className,
    label,
    error,
    ...restProps
  } = props;

  const inputClassNames = classNames('input-wrapper', className, {
    'input--bg-light': inputStyle === 'background-light',
    'input--bg-dark': inputStyle === 'background-dark',
    'input--bordered': inputStyle === 'bordered',
    'input--large': inputSize === 'large',
    'input--normal': inputSize === 'normal',
  });

  return (
    <div className={inputClassNames}>
      {label && inputStyle && <span className="input__label">{label}</span>}
      {!textarea ? (
        <input {...restProps} ref={ref} />
      ) : (
        <textarea
          {...restProps}
          ref={ref}
          style={{ height: 120, paddingTop: 10 }}
        />
      )}
      {error?.message && (
        <span className={'error-message'}>{error.message}</span>
      )}
    </div>
  );
});

export default Input;
