export default class Reaction {
	constructor(public reaction: () => void) {}

	runreaction() {
		this.reaction();
	}
}
