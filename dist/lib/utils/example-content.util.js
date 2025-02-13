'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.mergeExampleContent = exports.buildContentObjects = exports.resolveTemplatePlaceholders = void 0;
const placeholder_builder_1 = require('../builder/placeholder.builder');
const example_util_1 = require('./example.util');
const schema_util_1 = require('./schema.util');
const type_util_1 = require('./type.util');
const PLACEHOLDER_IDENTIFIER = '$';
const isPlaceholder = value => typeof value === 'string' && value.startsWith(PLACEHOLDER_IDENTIFIER);
// This builds a placeholder builder without an exception matcher
const buildGenericPlaceholder = resolver => (0, placeholder_builder_1.buildPlaceholder)(undefined, resolver);
const BuiltinPlaceholders = {
  status: buildGenericPlaceholder(exception => exception.getStatus()),
  description: buildGenericPlaceholder(exception => {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }
    return response['message'];
  }),
  error: buildGenericPlaceholder(exception => {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }
    if (response['error']) {
      return response['error'];
    }
    return response['message'];
  }),
};
const resolveBuiltinPlaceholder = (placeholder, exception) =>
  BuiltinPlaceholders[placeholder]
    ? BuiltinPlaceholders[placeholder].resolver(exception)
    : `${PLACEHOLDER_IDENTIFIER}${placeholder}`;
const resolvePlaceholders = (template, exception, options) => {
  var _a;
  for (const key of Object.keys(template)) {
    const templateValue = template[key];
    if (isPlaceholder(templateValue)) {
      const placeholder = templateValue.substring(1);
      template[key] = resolveBuiltinPlaceholder(placeholder, exception);
      if ((_a = options.placeholders) === null || _a === void 0 ? void 0 : _a[placeholder]) {
        const { exceptionMatcher, resolver } = options.placeholders[placeholder];
        if (exception instanceof exceptionMatcher()) {
          template[key] = resolver(exception);
        }
      }
      if (isPlaceholder(template[key])) {
        delete template[key];
      }
    } else if (templateValue !== null && typeof templateValue === 'object') {
      resolvePlaceholders(templateValue, exception, options);
    }
  }
};
const resolveTemplatePlaceholders = (options, exception) => {
  const copy = JSON.parse(JSON.stringify(options.template));
  (0, type_util_1.buildMessageByType)(copy, options);
  resolvePlaceholders(copy, exception, options);
  return copy;
};
exports.resolveTemplatePlaceholders = resolveTemplatePlaceholders;
const buildContentObjects = (exceptions, options) => {
  const contents = {};
  for (const exception of exceptions) {
    const statusCode = exception.getStatus();
    if (!contents[statusCode]) {
      contents[statusCode] = { [options.contentType]: { examples: {} } };
      contents[statusCode][options.contentType].schema = (0, schema_util_1.buildSchema)(options, exception);
    }
    const content = contents[statusCode];
    const exampleResponse = (0, exports.resolveTemplatePlaceholders)(options, exception);
    (0, example_util_1.merge)(content[options.contentType].examples, {
      [exception.constructor.name]: {
        description: options.description || exception.message,
        value: exampleResponse,
      },
    });
  }
  return contents;
};
exports.buildContentObjects = buildContentObjects;
const mergeExampleContent = (content, newContent) => {
  for (const key of Object.keys(newContent)) {
    const { examples } = content[key];
    const { examples: newExamples } = newContent[key];
    (0, example_util_1.merge)(examples, newExamples);
  }
};
exports.mergeExampleContent = mergeExampleContent;
//# sourceMappingURL=example-content.util.js.map
