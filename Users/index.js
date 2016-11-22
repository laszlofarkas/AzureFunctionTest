var users = [];

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;


module.exports = function (context, req) {

	context.log('JavaScript HTTP trigger function processed a request.');

	context.log(process.env["SQLAZURECONNSTR_TestDB"]);
	context.log(JSON.parse(process.env["SQLAZURECONNSTR_TestDB"]));

	var connection = new Connection(JSON.parse(process.env["SQLAZURECONNSTR_TestDB"]));
	connection.on('connect', function (err) {
		executeStatement();
	});

	function executeStatement() {
		var request = new Request("select 42, 'hello world'", function (err, rowCount) {
			if (err) {
				context.log(err);
			} else {
				context.log(rowCount + ' rows');
			}
		});

		request.on('row', function (columns) {
			columns.forEach(function (column) {
				context.log(column.value);
			});
		});

		connection.execSql(request);
	}


	var id = parseInt(context.bindingData.id);
	context.log('Method: ', req.method, "id:", id, typeof (id));

	var res;

	if (req.method === 'HEAD') {
		if (id == null) {
			res = {
				status: 400,
				body: "Missing route parameter"
			};
		} else {
			if (users.some(function (e) { return e.id == id; })) {
				res = {
					status: 200,
					body: "Found"
				};
			} else {
				res = {
					status: 404,
					body: "Not found"
				};
			}
		}
	}

	if (req.method === 'PUT') {
		if (req.body && req.body.id && req.body.name) {
			users.push({ id: req.body.id, name: req.body.name });
			res = { body: req.body.name + " has been added" };
		} else {
			res = {
				status: 400,
				body: (req.body && typeof (req.body) === "object")
					? "id and name are required parameter"
					: "invalid json"
			};
		}
		context.log(users);
	}

	if (req.method === 'GET') {
		res = { body: users };
	}

	if (req.method === 'DELETE') {

	}

	context.done(null, res);
}