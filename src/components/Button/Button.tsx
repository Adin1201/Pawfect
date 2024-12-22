import classNames from 'classnames';
import React, { CSSProperties } from 'react';
import './Button.scss';
/* eslint react/button-has-type: "off" */

export interface ButtonProps {
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'tertiary';
  type?: 'submit' | 'reset' | 'button';
  size?: 'small' | 'medium' | 'large';
  title?: string;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
}

const Button = (props: ButtonProps) => {
  const {
    onClick,
    title,
    color = 'primary',
    type = 'button',
    disabled,
    loading,
    className,
    size = 'large',
    style,
  } = props;

  const buttonClassNames = classNames('button-root', className, {
    'button--bg-primary': color === 'primary',
    'button--bg-secondary': color === 'secondary',
    'button--bg-tertiary': color === 'tertiary',
    'button--large': size === 'large',
    'button--medium': size === 'medium',
    'button--small': size === 'small',
    'button--loading': loading,
  });

  return (
    <button
      type={type}
      className={buttonClassNames}
      onClick={() => (onClick ? onClick() : null)}
      disabled={loading || disabled}
      style={style}
    >
      {title}
    </button>
  );
};

export default Button;
