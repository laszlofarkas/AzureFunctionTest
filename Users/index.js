var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES; 

var UserService = {
	
	getUserlist: function() {
		return new Promise(function(resolve, reject) {
			var result = [];
			var connection = new Connection(JSON.parse(process.env["DBCONNECTION_TESTDB"]));
			connection.on('connect', function (err) {
				var request = new Request("SELECT id, name FROM Users", function (err, rowCount) {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
				request.on('row', function (columns) {
					result.push(
						{
							"id": columns[0].value,
							"name": columns[1].value
						}
					);
				});
				connection.execSql(request);
			});
		});
	},
	
	addUser: function(newUser) {
		return new Promise(function(resolve, reject) {
			var connection = new Connection(JSON.parse(process.env["DBCONNECTION_TESTDB"]));
			connection.on('connect', function (err) {
				var request = new Request("INSERT INTO Users (name) VALUES (@name)", function(err) {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
				request.addParameter('name', TYPES.NVarChar, newUser.name);
				connection.execSql(request);
			});
		});
	},
	
	deleteUser: function(id) {
		return new Promise(function(resolve, reject) {
			var connection = new Connection(JSON.parse(process.env["DBCONNECTION_TESTDB"]));
			connection.on('connect', function (err) {
				var request = new Request("DELETE Users WHERE id = @id", function(err) {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
				request.addParameter('id', TYPES.Int, id);
				connection.execSql(request);
			});
		});
	}
}

module.exports = function (context, req) {

	context.log('JavaScript HTTP trigger function processed a request.');

	var id = parseInt(context.bindingData.id);
	context.log('Method: ', req.method, "id:", id, typeof (id));

	if (req.method === 'GET') {
		UserService.getUserlist().then(function(users) {
			context.done(null, { body: users });
		}).catch(function(err) {
			context.log(err);
			context.done(err, null);
		});
	}
	
	if (req.method === 'PUT') {
		if (req.body && req.body.name) {
			UserService.addUser(req.body).then(function() {
				context.done();
			}).catch(function(err) {
				context.log(err);
				context.done(err);
			});
		} else {
			var res = {
				status: 400,
				body: "invalid json"
			};
			context.done(null, res);
		}
	}
	
	if (req.method === 'DELETE') {
		var id = parseInt(context.bindingData.id);
		if (id && typeof id === "number") {
			UserService.deleteUser(id).then(function() {
				context.done();
			}).catch(function(err) {
				context.log(err);
				context.done(err);			
			})
		} else {
			var res = {
				status: 400,
				body: "missing parameter: id"
			};
			context.done(null, res);
		}
	}
}