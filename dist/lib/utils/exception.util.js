'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.instantiateExceptions = void 0;
const instantiateExceptions = exceptions => {
  const resolvedExceptions = exceptions();
  return (Array.isArray(resolvedExceptions) ? resolvedExceptions : [resolvedExceptions]).map(exception => {
    if (typeof exception === 'object') {
      return exception;
    }
    try {
      return new exception();
    } catch (error) {
      const name = exception.name;
      const err =
        new Error(`Could not instantiate exception '${name}'. You need to instantiate it yourself with \`new ${name}(possibleArguments)\`!

    `);
      err.stack = error.stack;
      throw err;
    }
  });
};
exports.instantiateExceptions = instantiateExceptions;
//# sourceMappingURL=exception.util.js.map
