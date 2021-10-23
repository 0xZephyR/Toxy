interface IReaction {
	readonly reaction: () => void;
}

export default class Reaction implements IReaction {
	reaction: () => void = () => {};
	constructor(reaction: () => void) {
		this.reaction = reaction;
	}

	runReaction() {
		this.reaction();
	}
}

export class Batch extends Reaction {
	private timeOutId: any = null;

	runReaction() {
		if (this.timeOutId) {
			clearTimeout(this.timeOutId);
		}
		this.timeOutId = setTimeout(() => {
			this.reaction();
			this.timeOutId = null;
		}, 0);
	}
}
