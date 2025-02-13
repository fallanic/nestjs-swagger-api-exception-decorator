'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.resolveTypeTemplate = exports.buildMessageByType = void 0;
const constants_1 = require('@nestjs/swagger/dist/constants');
const helpers_1 = require('@nestjs/swagger/dist/decorators/helpers');
const model_properties_accessor_1 = require('@nestjs/swagger/dist/services/model-properties-accessor');
const accessor = new model_properties_accessor_1.ModelPropertiesAccessor();
const isFunction = func => typeof func === 'function';
const isClass = func => typeof func === 'function' && /^class\s/.test(Function.prototype.toString.call(func));
const resolveLazyTypeFunction = type => (isFunction(type) && !isClass(type) && type.name === 'type' ? type() : type);
const getExampleValue = metadata => {
  var _a;
  if (metadata.example !== undefined) {
    return metadata.isArray ? [metadata.example] : metadata.example;
  }
  if ((_a = metadata.enum) === null || _a === void 0 ? void 0 : _a.length) {
    return metadata.enum[0];
  }
  return metadata.type.name;
};
const buildExampleResponse = settings => {
  const { options, deepMetadata, typeKey = 'type' } = settings;
  const typeArgument =
    (deepMetadata === null || deepMetadata === void 0 ? void 0 : deepMetadata.type) || options[typeKey];
  const isArrayArgument = (deepMetadata === null || deepMetadata === void 0 ? void 0 : deepMetadata.type)
    ? !!deepMetadata.isArray
    : options.isArray;
  const [_type, isArray] = (0, helpers_1.getTypeIsArrayTuple)(typeArgument, isArrayArgument);
  const type = typeKey === 'type' ? resolveLazyTypeFunction(_type) : _type();
  const requiredProperties = [];
  const messageExample = {};
  for (const property of accessor.getModelProperties(type.prototype)) {
    const metadata = Reflect.getMetadata(constants_1.DECORATORS.API_MODEL_PROPERTIES, type.prototype, property);
    metadata.type = resolveLazyTypeFunction(metadata.type);
    if (isClass(metadata.type)) {
      messageExample[property] = buildExampleResponse({ options, deepMetadata: metadata });
    } else {
      messageExample[property] = getExampleValue(metadata);
      if (!deepMetadata && metadata.required) {
        requiredProperties.push(property);
      }
    }
  }
  if (requiredProperties.length && !options.requiredProperties) {
    options.requiredProperties = requiredProperties;
  }
  return isArray ? [messageExample] : messageExample;
};
const buildMessageByType = (template, options) => {
  if (!options.userDefinedTemplate && options.type) {
    template.message = buildExampleResponse({ options });
  }
};
exports.buildMessageByType = buildMessageByType;
const resolveTypeTemplate = options => {
  if ((options === null || options === void 0 ? void 0 : options.template) && typeof options.template === 'function') {
    options.template = buildExampleResponse({
      options,
      typeKey: 'template',
    });
  }
};
exports.resolveTypeTemplate = resolveTypeTemplate;
//# sourceMappingURL=type.util.js.map
