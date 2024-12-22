import React, { CSSProperties, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';
import './Checkbox.scss';

interface Props extends InputHTMLAttributes<any> {
  type?: 'primary' | 'secondary';
  checked: boolean;
  label?: string;
  id?: string;
  disabled?: boolean;
  style?: CSSProperties;
  error?: FieldError;
}

const Checkbox = (props: Props) => {
  const {
    type = 'primary',
    checked,
    label,
    id,
    disabled,
    style,
    error,
    ...restProps
  } = props;

  const uniqueID =
    id !== undefined ? id : Math.random().toString(36).substr(2, 9);

  return (
    <div className="checkbox">
      <div
        className={`checkbox-wrapper ${
          type === 'primary' ? 'checkbox-primary' : 'checkbox-secondary'
        }`}
        style={style}
      >
        <input
          {...restProps}
          id={uniqueID}
          type="checkbox"
          checked={checked}
          disabled={disabled}
        />
        {label && (
          <label htmlFor={uniqueID} className="checkbox-label">
            {label}
          </label>
        )}
      </div>
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

export default Checkbox;
