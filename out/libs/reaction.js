var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Reaction = /** @class */ (function () {
    function Reaction(reaction) {
        this.reaction = function () { };
        this.reaction = reaction;
    }
    Reaction.prototype.runreaction = function () {
        this.reaction();
    };
    return Reaction;
}());
export default Reaction;
var Batch = /** @class */ (function (_super) {
    __extends(Batch, _super);
    function Batch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timeOutId = null;
        return _this;
    }
    Batch.prototype.runreaction = function () {
        var _this = this;
        if (this.timeOutId) {
            clearTimeout(this.timeOutId);
        }
        this.timeOutId = setTimeout(function () {
            _this.reaction();
            _this.timeOutId = null;
        }, 0);
    };
    return Batch;
}(Reaction));
export { Batch };
