export default class Reaction {
	private timeOutId: any = null;
	private readonly reaction: () => void = () => {};
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
