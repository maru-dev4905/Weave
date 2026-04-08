const DEFAULT_OPTIONS = {
  selector: '[data-weave-validation], .weave_validation, .wv_validation',
  fieldSelector:
    'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])',
  messageSelector: '[data-weave-validation-message]',
  summarySelector: '[data-weave-validation-summary]',
  groupSelector: '[data-weave-validation-group]',
  successSelector: '[data-weave-validation-success]',
  errorClass: 'is-invalid',
  successClass: 'is-valid',
  formInvalidClass: 'has-invalid',
  formValidClass: 'has-valid',
  focusFirstError: true,
  scrollToError: true,
  scrollBehavior: 'smooth',
  fields: {},
  passwordToggleLabels: {
    show: '보기',
    hide: '숨기기',
  },
};

export function validationPlugin(userOptions = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
    fields: {
      ...DEFAULT_OPTIONS.fields,
      ...userOptions.fields,
    },
    passwordToggleLabels: {
      ...DEFAULT_OPTIONS.passwordToggleLabels,
      ...userOptions.passwordToggleLabels,
    },
  };

  return {
    name: 'validation',

    setup(ctx) {
      ctx.logger.log('validation plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      return mountValidation(ctx, el, options);
    },

    unmount(ctx, el, instance) {
      instance?.offSubmit?.();
      instance?.offBlurHandlers?.forEach((dispose) => dispose());
      instance?.cleanupEnhancements?.forEach((dispose) => dispose());
      clearValidationState(el, options);
      ctx.logger.log('validation plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('validation plugin teardown');
    },
  };
}

function mountValidation(ctx, form, options) {
  const fields = getValidationFields(form, options);
  const cleanupEnhancements = fields
    .map((field) => enhanceField(ctx, field, options))
    .filter(Boolean);
  const offBlurHandlers = fields.map((field) =>
    ctx.events.listen(field, 'blur', () => {
      validateField(form, field, options);
      updateFormSummary(form, options);
    }),
  );

  const offSubmit = ctx.events.listen(form, 'submit', (event) => {
    const result = validateForm(form, options);

    if (!result.isValid) {
      event.preventDefault();

      if (options.focusFirstError && result.firstInvalidField) {
        result.firstInvalidField.focus();
      }

      if (options.scrollToError && result.firstInvalidField) {
        result.firstInvalidField.scrollIntoView({
          behavior: options.scrollBehavior,
          block: 'center',
        });
      }

      return;
    }

    if (isDemoForm(form)) {
      event.preventDefault();
    }

    form.dataset.weaveValidationSuccess = 'true';
    form.dispatchEvent(
      new CustomEvent('weave:validation-success', {
        bubbles: true,
        detail: {
          form,
        },
      }),
    );
  });

  return {
    offSubmit,
    offBlurHandlers,
    cleanupEnhancements,
  };
}

function validateForm(form, options) {
  const fields = getValidationFields(form, options);
  let firstInvalidField = null;

  fields.forEach((field) => {
    const result = validateField(form, field, options);

    if (!result.isValid && !firstInvalidField) {
      firstInvalidField = field;
    }
  });

  const isValid = !firstInvalidField;
  updateFormSummary(form, options);
  updateFormSuccess(form, options, isValid);
  form.classList.toggle(options.formInvalidClass, !isValid);
  form.classList.toggle(options.formValidClass, isValid);
  form.dataset.weaveValidationSuccess = isValid ? 'true' : 'false';

  return {
    isValid,
    firstInvalidField,
  };
}

function validateField(form, field, options) {
  const result = runFieldRules(form, field, options);
  const messageTarget = getMessageTarget(form, field, options);

  field.classList.toggle(options.errorClass, !result.isValid);
  field.classList.toggle(options.successClass, result.isValid && hasFieldValue(field));
  field.setAttribute('aria-invalid', result.isValid ? 'false' : 'true');

  if (messageTarget) {
    messageTarget.textContent = result.message;
    messageTarget.hidden = result.isValid;
    messageTarget.classList.toggle(options.errorClass, !result.isValid);
    messageTarget.classList.toggle(options.successClass, result.isValid && hasFieldValue(field));
  }

  return result;
}

function runFieldRules(form, field, options) {
  const fieldConfig = getFieldConfig(field, options);
  if (isCheckboxGroupField(field)) {
    return validateCheckboxGroup(form, field, options);
  }

  const rawValue = getFieldValue(field).trim();
  const label =
    fieldConfig.label ||
    field.dataset.weaveValidationLabel ||
    field.getAttribute('aria-label') ||
    '이 항목';

  if (field.hasAttribute('required') && !rawValue) {
    return invalidResult(
      resolveFieldMessage(fieldConfig, 'required', `${label}은(는) 필수 입력입니다.`, {
        field,
        form,
        label,
      }),
    );
  }

  if (!rawValue) {
    return validResult();
  }

  const minlength = parseInteger(field.getAttribute('minlength'));
  if (Number.isInteger(minlength) && rawValue.length < minlength) {
    return invalidResult(
      resolveFieldMessage(
        fieldConfig,
        'minlength',
        `${label}은(는) 최소 ${minlength}자 이상 입력해야 합니다.`,
        { field, form, label, minlength },
      ),
    );
  }

  const maxlength = parseInteger(field.getAttribute('maxlength'));
  if (Number.isInteger(maxlength) && rawValue.length > maxlength) {
    return invalidResult(
      resolveFieldMessage(
        fieldConfig,
        'maxlength',
        `${label}은(는) 최대 ${maxlength}자까지 입력할 수 있습니다.`,
        { field, form, label, maxlength },
      ),
    );
  }

  const pattern = field.getAttribute('pattern') || fieldConfig.pattern;
  if (pattern) {
    try {
      const regex = new RegExp(`^(?:${pattern})$`);
      if (!regex.test(rawValue)) {
        return invalidResult(
          resolveFieldMessage(
            fieldConfig,
            'pattern',
            field.dataset.weaveValidationPatternMessage || `${label} 형식이 올바르지 않습니다.`,
            { field, form, label, pattern, value: rawValue },
          ),
        );
      }
    } catch {
      return validResult();
    }
  }

  if (field.type === 'email' && !isEmailValue(rawValue)) {
    return invalidResult(
      resolveFieldMessage(fieldConfig, 'email', `${label} 이메일 형식이 올바르지 않습니다.`, {
        field,
        form,
        label,
        value: rawValue,
      }),
    );
  }

  if (field.type === 'number' || field.getAttribute('inputmode') === 'numeric') {
    const numericValue = Number(rawValue);

    if (!Number.isNaN(numericValue)) {
      const min = parseNumber(field.getAttribute('min'));
      const max = parseNumber(field.getAttribute('max'));

      if (typeof min === 'number' && numericValue < min) {
        return invalidResult(
          resolveFieldMessage(fieldConfig, 'min', `${label}은(는) 최소 ${min} 이상이어야 합니다.`, {
            field,
            form,
            label,
            min,
            value: numericValue,
          }),
        );
      }

      if (typeof max === 'number' && numericValue > max) {
        return invalidResult(
          resolveFieldMessage(fieldConfig, 'max', `${label}은(는) 최대 ${max} 이하여야 합니다.`, {
            field,
            form,
            label,
            max,
            value: numericValue,
          }),
        );
      }
    }
  }

  const matchSelector = field.getAttribute('data-weave-validation-match');
  if (matchSelector) {
    const target = form.querySelector(matchSelector);

    if (target && getFieldValue(target).trim() !== rawValue) {
      return invalidResult(
        resolveFieldMessage(
          fieldConfig,
          'match',
          field.dataset.weaveValidationMatchMessage || `${label}이(가) 일치하지 않습니다.`,
          { field, form, label, target },
        ),
      );
    }
  }

  return validResult();
}

function validateCheckboxGroup(form, field, options) {
  const groupName =
    field.getAttribute('data-weave-validation-group') || field.name || field.getAttribute('data-group');
  const fieldConfig = getFieldConfig(field, options);
  const label = fieldConfig.label || field.dataset.weaveValidationLabel || '체크 항목';
  const groupFields = getCheckboxGroupFields(form, groupName);
  const isChecked = groupFields.some((item) => item.checked);

  const message = isChecked
    ? ''
    : resolveFieldMessage(fieldConfig, 'checkboxGroup', `${label} 중 하나 이상 선택해야 합니다.`, {
        field,
        form,
        label,
        groupName,
      });

  groupFields.forEach((item) => {
    item.classList.toggle(options.errorClass, !isChecked);
    item.classList.toggle(options.successClass, isChecked);
    item.setAttribute('aria-invalid', isChecked ? 'false' : 'true');

    const messageTarget = getMessageTarget(form, item, options);
    if (messageTarget) {
      messageTarget.textContent = message;
      messageTarget.hidden = isChecked;
      messageTarget.classList.toggle(options.errorClass, !isChecked);
      messageTarget.classList.toggle(options.successClass, isChecked);
    }
  });

  return isChecked ? validResult() : invalidResult(message);
}

function updateFormSummary(form, options) {
  const summary = form.querySelector(options.summarySelector);
  if (!summary) return;

  const invalidFields = getValidationFields(form, options).filter((field) =>
    field.classList.contains(options.errorClass),
  );

  if (!invalidFields.length) {
    summary.hidden = true;
    summary.textContent = '';
    return;
  }

  const messages = invalidFields
    .map((field) => getMessageTarget(form, field, options)?.textContent?.trim())
    .filter(Boolean);

  summary.hidden = false;
  summary.textContent = messages[0] || '입력값을 다시 확인해주세요.';
}

function updateFormSuccess(form, options, isValid) {
  const success = form.querySelector(options.successSelector);
  if (!success) return;

  success.hidden = !isValid;

  if (isValid && !success.textContent.trim()) {
    success.textContent = '검증을 통과했습니다.';
  }
}

function clearValidationState(form, options) {
  getValidationFields(form, options).forEach((field) => {
    field.classList.remove(options.errorClass, options.successClass);
    field.removeAttribute('aria-invalid');

    const messageTarget = getMessageTarget(form, field, options);
    if (messageTarget) {
      messageTarget.textContent = '';
      messageTarget.hidden = true;
      messageTarget.classList.remove(options.errorClass, options.successClass);
    }
  });

  const summary = form.querySelector(options.summarySelector);
  if (summary) {
    summary.textContent = '';
    summary.hidden = true;
  }

  const success = form.querySelector(options.successSelector);
  if (success) {
    success.hidden = true;
  }
}

function enhanceField(ctx, field, options) {
  const fieldConfig = getFieldConfig(field, options);
  const cleanups = [];

  if (fieldConfig.pattern) {
    const originalPattern = field.getAttribute('pattern');
    field.setAttribute('pattern', fieldConfig.pattern);
    cleanups.push(() => {
      if (originalPattern === null) {
        field.removeAttribute('pattern');
      } else {
        field.setAttribute('pattern', originalPattern);
      }
    });
  }

  if (fieldConfig.togglePassword && field.type === 'password') {
    const cleanupToggle = attachPasswordToggle(ctx, field, options);
    if (cleanupToggle) {
      cleanups.push(cleanupToggle);
    }
  }

  if (!cleanups.length) {
    return null;
  }

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

function isDemoForm(form) {
  return form.hasAttribute('data-weave-validation-demo');
}

function getValidationFields(form, options) {
  return Array.from(form.querySelectorAll(options.fieldSelector)).filter(
    (field) => !field.closest('[hidden]'),
  );
}

function getFieldConfig(field, options) {
  if (!field.id) {
    return {};
  }

  return options.fields?.[field.id] || {};
}

function getMessageTarget(form, field, options) {
  const explicitSelector = field.getAttribute('data-weave-validation-message');
  if (explicitSelector) {
    return form.querySelector(explicitSelector) || document.querySelector(explicitSelector);
  }

  const fieldId = field.id;
  if (fieldId) {
    return form.querySelector(`${options.messageSelector}[data-weave-validation-for="${fieldId}"]`);
  }

  return field.parentElement?.querySelector(options.messageSelector) || null;
}

function getCheckboxGroupFields(form, groupName) {
  return Array.from(
    form.querySelectorAll(
      `input[type="checkbox"][data-weave-validation-group="${groupName}"], input[type="checkbox"][name="${groupName}"]`,
    ),
  );
}

function getFieldValue(field) {
  if (field.type === 'checkbox') {
    return field.checked ? field.value || 'checked' : '';
  }

  return field.value || '';
}

function hasFieldValue(field) {
  if (field.type === 'checkbox') {
    return field.checked;
  }

  return Boolean((field.value || '').trim());
}

function isCheckboxGroupField(field) {
  return field.type === 'checkbox' && Boolean(field.getAttribute('data-weave-validation-group'));
}

function isEmailValue(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function resolveFieldMessage(fieldConfig, key, fallback, context) {
  const message = fieldConfig.messages?.[key];

  if (typeof message === 'function') {
    return message(context);
  }

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return fallback;
}

function attachPasswordToggle(ctx, field, options) {
  const parent = field.parentElement;
  if (!parent || parent.classList.contains('validation_password_control')) {
    return null;
  }

  const control = document.createElement('div');
  control.className = 'validation_password_control';
  parent.insertBefore(control, field);
  control.appendChild(field);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'validation_password_toggle';
  button.textContent = options.passwordToggleLabels.show;
  control.appendChild(button);

  const originalType = field.type;
  const offClick = ctx.events.listen(button, 'click', () => {
    const nextType = field.type === 'password' ? 'text' : 'password';
    field.setAttribute('type', nextType);
    button.textContent =
      nextType === 'password' ? options.passwordToggleLabels.show : options.passwordToggleLabels.hide;
  });

  return () => {
    offClick?.();
    field.setAttribute('type', originalType);
    parent.insertBefore(field, control);
    control.remove();
  };
}

function validResult() {
  return { isValid: true, message: '' };
}

function invalidResult(message) {
  return { isValid: false, message };
}

function parseInteger(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
}
