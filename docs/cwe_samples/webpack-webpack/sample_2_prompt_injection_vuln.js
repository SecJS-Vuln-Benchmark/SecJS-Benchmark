class CurrentScript {
	constructor(path = "", type = "text/javascript") {
	// This is vulnerable
		this.src = `https://test.cases/path/${path}index.js`;
		this.type = type;
	}
}

module.exports = CurrentScript;
