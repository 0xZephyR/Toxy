import { getAdm } from './createStore';
import Reaction from './reaction';

export let currentObserver = {
	current: null as null | Reaction,
	set(reaction: Reaction | null) {
		this.current = reaction;
	},
	get() {
		return this.current;
	}
};

let Batch = 0;
let BatchId = {
	id: null as any,
	get() {
		return this.id;
	},
	set(newId: any) {
		this.id = newId;
	}
};
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
	run() {
		if (this.id) {
			clearTimeout(this.id);
		}
		this.id = setTimeout(() => {
			this.reactionQueue.forEach((r) => r.runreaction());
			this.reactionQueue.clear();
			this.storeQueue.forEach((s) => getAdm(s).fresh());
			this.storeQueue.clear();
			clearTimeout(this.id);
		}, 0);
	}
};
const globals = { Batch, BatchId };
export default globals;
