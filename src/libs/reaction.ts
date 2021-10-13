interface IReaction {
	readonly reaction: () => void;
}

export default class Reaction implements IReaction {
	private timeOutId: any = null;
	reaction: () => void = () => {};
	constructor(reaction: () => void) {
		this.reaction = reaction;
	}

	runreaction() {
		// if (this.timeOutId) {
		// 	clearTimeout(this.timeOutId);
		// }
		// this.timeOutId = setTimeout(() => {
		// 	this.reaction();
		// 	this.timeOutId = null;
		// }, 0);
		this.reaction();
	}
}

export class Batch implements IReaction {
	private timeOutId: any = null;
	reaction: () => void = () => {};
	constructor(reaction: () => void) {
		this.reaction = reaction;
	}

	runreaction() {
		if (this.timeOutId) {
			clearTimeout(this.timeOutId);
		}
		this.timeOutId = setTimeout(() => {
			this.reaction();
			this.timeOutId = null;
		}, 0);
	}
}
