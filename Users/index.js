var users = [];

module.exports = function (context, req) {

    context.log('JavaScript HTTP trigger function processed a request.');

	var id = parseInt(context.bindingData.id);
	context.log('Method: ', req.method, "id:", id, typeof(id));

	var res;

	if (req.method === 'HEAD') {
		if (id == null) {
			res = {
				status: 400,
				body: "Missing route parameter"
			};
		} else {
			if (users.some(function(e) {return e.id == id;})) {
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
			users.push({id: req.body.id, name: req.body.name});
			res = {body: req.body.name + " has been added"};
		} else {
			res = {
				status: 400,
				body: (req.body && typeof(req.body) === "object") 
					? "id and name are required parameter"
					: "invalid json"
			};
		}
		context.log(users);
	}

	if (req.method === 'GET') {
		res = {body: users};
	}

	if (req.method === 'DELETE') {
		
	}
	
    context.done(null, res);
} 