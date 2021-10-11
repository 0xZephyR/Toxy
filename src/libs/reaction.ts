export default class Reaction {
	private timeOutId: any = null;
	constructor(public reaction: () => void) {}

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
