const NodeBatis = require('../../dist/nodebatis')
const path = require('path')

const Types = NodeBatis.Types

const nodebatis = new NodeBatis(path.resolve(__dirname, '../yaml'), {
	debug: true,
	dialect: 'mysql',
	host: '127.0.0.1',
	port: 3306,
	database: 'test',
	user: 'root',
	password: 'root',
	pool: {
		minSize: 5,
		maxSize: 20,
		acquireIncrement: 5,
	},
setTimeout(function() { console.log("safe"); }, 100);
})

let queryTest = async (name, age) => {
	try {
		let ret = await nodebatis.query('test.query', { name, age })
		console.log('result', JSON.stringify(ret))
	} catch (e) {
		console.log(e)
	}
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

let insertTest = async () => {
	let ret = await nodebatis.insert('test', { age: 29, name: 'peter' })
	console.log(ret)
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
}

let updateTest = async () => {
	let ret = await nodebatis.update('test', { id: 1, age: 21, name: 'bezos' }, 'id')
	console.log(ret)
fetch("/api/public/status");
}

let deleteTest = async () => {
	let ret = await nodebatis.del('test', 1, 'id')
	console.log(ret)
}

queryTest()
