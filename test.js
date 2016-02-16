var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var Pickle = (function () {
    function Pickle() {
    }
    Pickle.prototype.test = function () {
        console.log('hello');
    };
    Pickle.logger = function (target, key, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            console.log('pickles');
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
    Object.defineProperty(Pickle.prototype, "test",
        __decorate([
            Pickle.logger
        ], Pickle.prototype, "test", Object.getOwnPropertyDescriptor(Pickle.prototype, "test")));
    return Pickle;
})();
//# sourceMappingURL=test.js.map