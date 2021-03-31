
/**
 * Use this code to test the dashboard API.
 * Uncomment specific calls below to test them.  Only test on a non-production sites.
 */

// Your Okta Domain.  https://[YOUR_OKTA_TENANT].okta.com

// create a token under Security -> API -> Tokens


var OKTA_DOMAIN = process.env.OKTA_DOMAIN;
var OKTA_API_KEY = process.env.OKTA_API_KEY;
var SENDGRID_FROM_EMAIL=process.env.SENDGRID_FROM_EMAIL;
var SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
var SENDGRID_TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_ID;
var EMAIL_PREFIX_TESTING = process.env.EMAIL_PREFIX_TESTING;
var EMAIL_DOMAIN_TESTING = process.env.EMAIL_DOMAIN_TESTING;

var email=""

var OktaUserCurls = require('./OktaUserCurls.js')(OKTA_DOMAIN, OKTA_API_KEY, SENDGRID_FROM_EMAIL, SENDGRID_API_KEY);

if (!OktaUserCurls) {
    console.log("You need to add your Okta Domain and a token to the top of this file");
    process.exit(1);
} else {
    console.log("You're updating users on " + OKTA_DOMAIN);
}

// for testing.
var rando = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

var email = EMAIL_PREFIX_TESTING + rando + EMAIL_DOMAIN_TESTING;
var firstName = "Demo";
var lastName = "User"

OktaUserCurls.createInactiveUser(firstName, lastName, email, email, function(resp1){
	var id = JSON.parse(resp1).id;
	console.log("Create User: ", id);
	console.log("===========================\n\n");

	OktaUserCurls.activateNewUser(id, function(resp2){
		console.log("Activate User:", resp2);
		console.log("===========================\n\n");
		var url = JSON.parse(resp2).activationUrl;
		var token = JSON.parse(resp2).activationToken;
		OktaUserCurls.sendActivationEmail(email, url, token, SENDGRID_TEMPLATE_ID, firstName, function(resp3){
			console.log("Sent Email Response (should be nothing):\n" + resp3 + "\n");
			console.log("===========================\n\n");
		});
	});
});






