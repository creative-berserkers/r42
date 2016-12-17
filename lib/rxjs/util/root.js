let objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
};
export let root = (objectTypes[typeof self] && self) || (objectTypes[typeof window] && window);
let freeGlobal = objectTypes[typeof global] && global;
if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
}
//# sourceMappingURL=root.js.map