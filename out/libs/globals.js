import { getAdm } from './createStore';
/**
 * !全局对象
 */
export var currentObserver = {
    current: null,
    set: function (reaction) {
        this.current = reaction;
    },
    get: function () {
        return this.current;
    }
};
// 事务的层数
export var Batch = { level: 0 };
export var batchQueue = {
    id: null,
    reactionQueue: new Set(),
    storeQueue: new Set(),
    addReaction: function (reaction) {
        this.reactionQueue.add(reaction);
    },
    addStore: function (store) {
        this.storeQueue.add(store);
    },
    run: function () {
        var _this = this;
        if (this.id) {
            clearTimeout(this.id);
        }
        this.id = setTimeout(function () {
            _this.reactionQueue.forEach(function (r) { return r.runreaction(); });
            _this.reactionQueue.clear();
            _this.storeQueue.forEach(function (s) { return getAdm(s).fresh(); });
            _this.storeQueue.clear();
            clearTimeout(_this.id);
        }, 0);
    }
};
