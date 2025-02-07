'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildSchema = void 0;
const swagger_1 = require('@nestjs/swagger');
const helpers_1 = require('@nestjs/swagger/dist/decorators/helpers');
const example_content_util_1 = require('./example-content.util');
const options_util_1 = require('./options.util');
// eslint-disable-next-line @typescript-eslint/ban-types
const buildSwaggerTypeRef = options => {
  const [type, isArray] = (0, helpers_1.getTypeIsArrayTuple)(options.type, !!options.isArray);
  const schemaPath = (0, swagger_1.getSchemaPath)(type());
  if (isArray) {
    return {
      type: 'array',
      items: {
        type: 'object',
        $ref: schemaPath,
      },
    };
  } else {
    return {
      $ref: schemaPath,
    };
  }
};
const buildSchema = (options, exception) => {
  const { userDefinedTemplate, requiredProperties } = options;
  const resolvedTemplate = (0, example_content_util_1.resolveTemplatePlaceholders)(options, exception);
  const properties = {};
  for (const [key, value] of Object.entries(resolvedTemplate)) {
    if (key === 'message' && !options.userDefinedTemplate && (options.messageSchema || options.type)) {
      if (options.messageSchema) {
        properties[key] = options.messageSchema;
      } else {
        properties[key] = buildSwaggerTypeRef(options);
      }
    } else {
      properties[key] = {
        type: typeof value,
        example: value,
      };
    }
  }
  let required = options_util_1.DefaultTemplateRequiredProperties;
  if (userDefinedTemplate) {
    if (requiredProperties) {
      required = requiredProperties;
    } else {
      required = Object.keys(resolvedTemplate);
    }
  }
  const optionsSchema = options.enrichSchema ? options.enrichSchema : {};
  return Object.assign({ type: 'object', description: options.description, properties, required }, optionsSchema);
};
exports.buildSchema = buildSchema;
//# sourceMappingURL=schema.util.js.map
