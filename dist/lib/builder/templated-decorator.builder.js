'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildTemplatedApiExceptionDecorator = void 0;
const __1 = require('..');
/**
 * Build your own custom decorator. This enables you to re-use the same template again without the need to specify it
 * over and over again
 *
 * @param template Any object describing the template which should be shown as example value
 * @param globalOptions Specify the content type
 */
const buildTemplatedApiExceptionDecorator = (template, globalOptions) => {
  return (exceptions, options) => {
    const mergedOptions = Object.assign(Object.assign(Object.assign({}, globalOptions), { template }), options);
    return (0, __1.ApiException)(exceptions, mergedOptions);
  };
};
exports.buildTemplatedApiExceptionDecorator = buildTemplatedApiExceptionDecorator;
//# sourceMappingURL=templated-decorator.builder.js.map
