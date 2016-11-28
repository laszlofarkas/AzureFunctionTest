module.exports = function (context, blob) {
	context.log("Kacsa count:", blob.match(/kacsa/g).length);
	context.done();
};