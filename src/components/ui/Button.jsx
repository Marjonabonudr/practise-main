import React from 'react';
import Icon from './Icon';
import './Button.css';

const VARIANTS = {
  default: '',
  primary: 'btn--primary',
  accent: 'btn--accent',
  ghost: 'btn--ghost',
  outline: 'btn--outline',
  danger: 'btn--danger',
};

const SIZES = { md: '', sm: 'btn--sm', xs: 'btn--xs', lg: 'btn--lg' };

/**
 * Yagona tugma komponenti. Barcha variantlar `.btn` klassi ustiga quriladi.
 */
const Button = ({
  variant = 'default',
  size = 'md',
  icon,
  iconRight,
  block = false,
  loading = false,
  className = '',
  children,
  type = 'button',
  ...rest
}) => {
  const classes = [
    'btn',
    VARIANTS[variant] || '',
    SIZES[size] || '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} disabled={loading || rest.disabled} {...rest}>
      {loading ? (
        <span className="spinner" aria-hidden="true" />
      ) : (
        icon && <span className="btn__icon">{typeof icon === 'string' ? <Icon name={icon} size={size === 'sm' || size === 'xs' ? 14 : 16} /> : icon}</span>
      )}
      {children}
      {iconRight && !loading && (
        <span className="btn__icon">{typeof iconRight === 'string' ? <Icon name={iconRight} size={size === 'sm' || size === 'xs' ? 14 : 16} /> : iconRight}</span>
      )}
    </button>
  );
};

export default Button;
