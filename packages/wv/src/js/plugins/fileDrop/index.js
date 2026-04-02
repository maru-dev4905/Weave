const DEFAULT_OPTIONS = {
  selector: '[data-weave-file-drop]',
  zoneAttribute: 'data-weave-file-drop',
  inputSelector: 'input[type="file"]',
  listSelector: '[data-weave-file-drop-list]',
  overClass: 'over',
  emptyMessage: '선택된 파일이 없습니다.',
  zones: {},
  onChange: null,
  onError: null,
};

export function fileDropPlugin(userOptions = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
    zones: {
      ...DEFAULT_OPTIONS.zones,
      ...(userOptions.zones || {}),
    },
  };

  return {
    name: 'fileDrop',

    setup(ctx) {
      ctx.logger.log('fileDrop plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      const zoneKey = getZoneKey(el, options);
      const zoneOptions = resolveZoneOptions(options, zoneKey);
      const input = resolveInputElement(el, zoneOptions);

      if (!input || input.type !== 'file') {
        ctx.logger.warn('fileDrop input[type="file"] not found', el);
        return null;
      }

      applyInputConfig(input, zoneOptions);

      const listTarget = resolveListTarget(el, zoneOptions);
      renderFileList(listTarget, [], zoneOptions);

      let dragDepth = 0;

      const setOverState = (isOver) => {
        el.classList.toggle(zoneOptions.overClass, isOver);
      };

      const handleSelection = (files, source, event) => {
        const result = processSelectedFiles(files, zoneOptions);
        const synced = syncInputFiles(input, result.validFiles);

        if (!synced && source === 'drop' && result.validFiles.length) {
          ctx.logger.warn('fileDrop could not sync dropped files to input', el);
        }

        renderFileList(listTarget, result.items, zoneOptions);

        const callbackContext = {
          el,
          input,
          listTarget,
          zoneKey,
          config: zoneOptions,
          source,
          event,
          validFiles: result.items,
          errors: result.errors,
          inputSynced: synced,
        };

        if (result.items.length) {
          invokeCallback(zoneOptions.onChange, result.items, callbackContext);
          invokeCallback(options.onChange, result.items, callbackContext);
        }

        if (result.errors.length) {
          invokeCallback(zoneOptions.onError, result.errors, callbackContext);
          invokeCallback(options.onError, result.errors, callbackContext);
        }
      };

      const offDragEnter = ctx.events.listen(el, 'dragenter', (event) => {
        if (!hasTransferFiles(event)) return;

        event.preventDefault();
        dragDepth += 1;
        setOverState(true);
      });

      const offDragOver = ctx.events.listen(el, 'dragover', (event) => {
        if (!hasTransferFiles(event)) return;

        event.preventDefault();

        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = 'copy';
        }

        setOverState(true);
      });

      const offDragLeave = ctx.events.listen(el, 'dragleave', (event) => {
        if (!hasTransferFiles(event)) return;

        event.preventDefault();
        dragDepth = Math.max(0, dragDepth - 1);

        if (dragDepth === 0) {
          setOverState(false);
        }
      });

      const offDrop = ctx.events.listen(el, 'drop', (event) => {
        if (!hasTransferFiles(event)) return;

        event.preventDefault();
        dragDepth = 0;
        setOverState(false);

        const files = Array.from(event.dataTransfer?.files || []);
        handleSelection(files, 'drop', event);
      });

      const offInputChange = ctx.events.listen(input, 'change', (event) => {
        const files = Array.from(input.files || []);
        handleSelection(files, 'input', event);
      });

      const offClick = ctx.events.listen(el, 'click', (event) => {
        if (!shouldOpenPicker(event.target, input, el)) return;
        input.click();
      });

      const offKeydown = ctx.events.listen(el, 'keydown', (event) => {
        if (event.target !== el) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;

        event.preventDefault();
        input.click();
      });

      return {
        cleanups: [
          offDragEnter,
          offDragOver,
          offDragLeave,
          offDrop,
          offInputChange,
          offClick,
          offKeydown,
          () => {
            dragDepth = 0;
            setOverState(false);
          },
        ],
      };
    },

    unmount(ctx, el, instance) {
      instance?.cleanups?.forEach((cleanup) => cleanup?.());
      ctx.logger.log('fileDrop plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('fileDrop plugin teardown');
    },
  };
}

function getZoneKey(el, options) {
  return (
    el.getAttribute(options.zoneAttribute) ||
    el.dataset.weaveFileDrop ||
    el.id ||
    ''
  );
}

function resolveZoneOptions(options, zoneKey) {
  const zoneOptions = (zoneKey && options.zones?.[zoneKey]) || {};

  return {
    ...options,
    ...zoneOptions,
    zoneKey,
    accept: normalizeAccept(zoneOptions.accept),
    maxSize: normalizeNumber(zoneOptions.maxSize),
    multiple:
      typeof zoneOptions.multiple === 'boolean'
        ? zoneOptions.multiple
        : undefined,
    renderList: zoneOptions.renderList === true,
  };
}

function resolveInputElement(el, zoneOptions) {
  if (zoneOptions.input instanceof HTMLInputElement) {
    return zoneOptions.input;
  }

  if (typeof zoneOptions.input === 'string') {
    return document.querySelector(zoneOptions.input);
  }

  return el.querySelector(zoneOptions.inputSelector || DEFAULT_OPTIONS.inputSelector);
}

function resolveListTarget(el, zoneOptions) {
  if (zoneOptions.listTarget instanceof HTMLElement) {
    return zoneOptions.listTarget;
  }

  if (typeof zoneOptions.listTarget === 'string') {
    return document.querySelector(zoneOptions.listTarget);
  }

  return el.querySelector(zoneOptions.listSelector || DEFAULT_OPTIONS.listSelector);
}

function applyInputConfig(input, zoneOptions) {
  if (typeof zoneOptions.multiple === 'boolean') {
    input.multiple = zoneOptions.multiple;
  }

  if (zoneOptions.accept.length) {
    input.accept = zoneOptions.accept.join(',');
  }
}

function processSelectedFiles(files, zoneOptions) {
  const nextFiles = Array.from(files || []);
  const validFiles = [];
  const items = [];
  const errors = [];

  nextFiles.forEach((file, index) => {
    if (!zoneOptions.multiple && index > 0) {
      errors.push(createFileError('TOO_MANY_FILES', file, '하나의 파일만 업로드할 수 있습니다.'));
      return;
    }

    const validationResult = validateFile(file, zoneOptions);
    if (validationResult) {
      errors.push(validationResult);
      return;
    }

    validFiles.push(file);
    items.push(createFileItem(file));
  });

  return {
    validFiles,
    items,
    errors,
  };
}

function validateFile(file, zoneOptions) {
  if (!file) {
    return createFileError('EMPTY_FILE', null, '파일 정보를 읽을 수 없습니다.');
  }

  if (typeof zoneOptions.maxSize === 'number' && file.size > zoneOptions.maxSize) {
    return createFileError(
      'FILE_TOO_LARGE',
      file,
      `허용 용량을 초과했습니다. 최대 ${formatFileSize(zoneOptions.maxSize)}까지 가능합니다.`,
    );
  }

  if (!matchesAccept(file, zoneOptions.accept)) {
    return createFileError(
      'INVALID_FILE_TYPE',
      file,
      `허용되지 않는 파일 형식입니다. ${formatAcceptLabel(zoneOptions.accept)} 형식만 가능합니다.`,
    );
  }

  return null;
}

function matchesAccept(file, acceptRules) {
  if (!acceptRules.length) return true;

  const extension = getFileExtension(file.name);
  const mimeType = (file.type || '').toLowerCase();

  return acceptRules.some((rule) => {
    if (!rule) return false;

    if (rule.startsWith('.')) {
      return extension === rule.slice(1).toLowerCase();
    }

    if (rule.includes('/')) {
      if (rule.endsWith('/*')) {
        const prefix = rule.slice(0, rule.indexOf('/'));
        return mimeType.startsWith(`${prefix}/`);
      }

      return mimeType === rule;
    }

    return extension === rule.toLowerCase();
  });
}

function normalizeAccept(value) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item).split(','))
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
  }

  return [];
}

function normalizeNumber(value) {
  if (typeof value !== 'number') return undefined;
  return Number.isFinite(value) ? value : undefined;
}

function createFileItem(file) {
  const extension = getFileExtension(file.name);

  return {
    name: file.name,
    size: file.size,
    sizeLabel: formatFileSize(file.size),
    type: file.type || '',
    extension,
    lastModified: file.lastModified,
    file,
  };
}

function createFileError(code, file, message) {
  return {
    code,
    message,
    fileName: file?.name || '',
    size: file?.size || 0,
    type: file?.type || '',
    extension: file ? getFileExtension(file.name) : '',
  };
}

function renderFileList(listTarget, items, zoneOptions) {
  if (!zoneOptions.renderList || !listTarget) return;

  listTarget.innerHTML = '';

  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'weave_file_drop_empty';
    empty.textContent = zoneOptions.emptyMessage;
    listTarget.appendChild(empty);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'weave_file_drop_list';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'weave_file_drop_item';

    const name = document.createElement('strong');
    name.className = 'weave_file_drop_name';
    name.textContent = item.name;

    const meta = document.createElement('span');
    meta.className = 'weave_file_drop_meta';
    meta.textContent = `${item.extension || 'file'} · ${item.sizeLabel}`;

    li.appendChild(name);
    li.appendChild(meta);
    list.appendChild(li);
  });

  listTarget.appendChild(list);
}

function syncInputFiles(input, files) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'file') {
    return false;
  }

  if (typeof DataTransfer === 'undefined') {
    return false;
  }

  try {
    const dataTransfer = new DataTransfer();

    files.forEach((file) => {
      dataTransfer.items.add(file);
    });

    input.files = dataTransfer.files;
    return true;
  } catch {
    return false;
  }
}

function shouldOpenPicker(target, input, root) {
  if (!(target instanceof Element)) return true;
  if (target === input) return false;
  if (!root.contains(target)) return false;

  return !target.closest('button, a, input, label, select, textarea');
}

function hasTransferFiles(event) {
  const types = event.dataTransfer?.types;
  if (!types) return false;
  return Array.from(types).includes('Files');
}

function invokeCallback(callback, payload, context) {
  if (typeof callback === 'function') {
    callback(payload, context);
  }
}

function getFileExtension(name = '') {
  const segments = String(name).split('.');
  return segments.length > 1 ? segments.pop().toLowerCase() : '';
}

function formatAcceptLabel(acceptRules) {
  return acceptRules.join(', ');
}

function formatFileSize(size) {
  if (!Number.isFinite(size)) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let nextSize = size;
  let unitIndex = 0;

  while (nextSize >= 1024 && unitIndex < units.length - 1) {
    nextSize /= 1024;
    unitIndex += 1;
  }

  const fixed = nextSize >= 10 || unitIndex === 0 ? 0 : 1;
  return `${nextSize.toFixed(fixed)} ${units[unitIndex]}`;
}
