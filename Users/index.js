module.exports = function (context, req) {

    context.log('JavaScript HTTP trigger function processed a request.');

	var id = context.bindingData.id;
	context.log('Method: ', req.method, " id: ", id);

	var res;
/*
	if (req.method === 'HEAD') {
		if ()
	}

	if (req.method === 'PUT') {
		
	}

	if (req.method === 'GET') {
		
	}

	if (req.method === 'DELETE') {
		
	}
*/
    context.done(null, res);
} 