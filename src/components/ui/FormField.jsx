import React, { useId, useState } from 'react';
import Icon from './Icon';

/**
 * Maydon qobig'i: yorliq + boshqaruv + izoh/xato.
 * onChange har doim xom qiymatni qaytaradi: onChange(value)
 */
export const Field = ({ label, required, hint, error, htmlFor, children, right }) => (
  <div className="field">
    {label && (
      <label className="field__label" htmlFor={htmlFor}>
        <span>
          {label}
          {required && <span className="field__req"> *</span>}
        </span>
        {right}
      </label>
    )}
    {children}
    {error ? <span className="field__error">{error}</span> : hint ? <span className="field__hint">{hint}</span> : null}
  </div>
);

export const TextField = ({
  label,
  value,
  onChange,
  type = 'text',
  icon,
  hint,
  error,
  required = false,
  as = 'input',
  rows = 4,
  className = '',
  ...rest
}) => {
  const id = useId();
  const invalid = Boolean(error);
  const shared = {
    id,
    value: value ?? '',
    onChange: (e) => onChange(e.target.value),
    className: `${as === 'textarea' ? 'textarea' : 'input'} ${invalid ? 'input--invalid' : ''} ${className}`,
    ...rest,
  };

  let control;
  if (as === 'textarea') {
    control = <textarea rows={rows} {...shared} />;
  } else if (icon) {
    control = (
      <div className={`input-wrap ${type === 'password' ? 'input-wrap--right' : ''}`}>
        <span className="input-wrap__icon">
          <Icon name={icon} size={16} />
        </span>
        <input type={type} {...shared} />
      </div>
    );
  } else {
    control = <input type={type} {...shared} />;
  }

  return (
    <Field label={label} required={required} hint={hint} error={error} htmlFor={id}>
      {control}
    </Field>
  );
};

export const PasswordField = ({ label, value, onChange, hint, error, required, placeholder, ...rest }) => {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label} required={required} hint={hint} error={error} htmlFor={id}>
      <div className="input-wrap">
        <span className="input-wrap__icon">
          <Icon name="lock" size={16} />
        </span>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className={`input ${error ? 'input--invalid' : ''}`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="new-password"
          {...rest}
        />
        <span className="input-wrap__icon input-wrap__icon--right">
          <button
            type="button"
            className="input-wrap__btn"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
            tabIndex={-1}
          >
            <Icon name={visible ? 'eye-off' : 'eye'} size={16} />
          </button>
        </span>
      </div>
    </Field>
  );
};

export const SelectField = ({ label, value, onChange, options = [], children, hint, error, required, placeholder, className = '', ...rest }) => {
  const id = useId();
  return (
    <Field label={label} required={required} hint={hint} error={error} htmlFor={id}>
      <select
        id={id}
        className={`select ${error ? 'select--invalid' : ''} ${className}`}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
        {children}
      </select>
    </Field>
  );
};

export const Checkbox = ({ label, checked, onChange, ...rest }) => (
  <label className="check">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} {...rest} />
    <span>{label}</span>
  </label>
);
