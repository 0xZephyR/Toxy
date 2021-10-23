import { getAdm } from './createStore';
import Reaction from './reaction';
/**
 * !全局对象
 */
export let currentObserver = {
	current: null as null | Reaction,
	set(reaction: Reaction | null) {
		this.current = reaction;
	},
	get() {
		return this.current;
	}
};

// 事务的层数
export let Batch = { level: 0, delay: 0 };
export let batchQueue = {
	id: null as any,
	reactionQueue: new Set<Reaction>(),
	storeQueue: new Set<any>(),
	addReaction(reaction: Reaction) {
		this.reactionQueue.add(reaction);
	},
	addStore(store: any) {
		this.storeQueue.add(store);
	},
	run(delay: number) {
		if (this.id) {
			clearTimeout(this.id);
		}
		this.id = setTimeout(() => {
			this.reactionQueue.forEach((r) => r.runReaction());
			this.reactionQueue.clear();
			this.storeQueue.forEach((s) => getAdm(s).fresh());
			this.storeQueue.clear();
			clearTimeout(this.id);
		}, delay);
	}
};
