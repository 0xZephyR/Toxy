var Reaction = /** @class */ (function () {
    function Reaction(reaction) {
        this.timeOutId = null;
        this.reaction = function () { };
        this.reaction = reaction;
    }
    Reaction.prototype.runreaction = function () {
        // if (this.timeOutId) {
        // 	clearTimeout(this.timeOutId);
        // }
        // this.timeOutId = setTimeout(() => {
        // 	this.reaction();
        // 	this.timeOutId = null;
        // }, 0);
        this.reaction();
    };
    return Reaction;
}());
export default Reaction;
