'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.mergeOptions = exports.DefaultTemplateRequiredProperties = void 0;
const DefaultOptions = {
  contentType: 'application/json',
  template: {
    statusCode: '$status',
    message: '$description',
    error: '$error',
  },
};
exports.DefaultTemplateRequiredProperties = ['statusCode', 'message'];
const mergeOptions = options => {
  // If `null` is specified as template, we need to remove it to apply the default template
  if ((options === null || options === void 0 ? void 0 : options.template) === null) {
    delete options.template;
  }
  const mergedOptions = Object.assign(Object.assign({}, DefaultOptions), options);
  if (options) {
    // Needed because we need to determine later if the used template is the default template or a user defined template
    mergedOptions.userDefinedTemplate = !!options.template;
  }
  return mergedOptions;
};
exports.mergeOptions = mergeOptions;
//# sourceMappingURL=options.util.js.map
