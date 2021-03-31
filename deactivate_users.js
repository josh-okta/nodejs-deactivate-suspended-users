
/**
 * Use this code to test the dashboard API.
 * Uncomment specific calls below to test them.  Only test on a non-production sites.
 */

// Your Okta Domain.  https://[YOUR_OKTA_TENANT].okta.com
var domain = '';

// create a token under Security -> API -> Tokens
var key = '';

var OktaUserCurls = require('./OktaUserCurls.js')(domain, key, 'email@email.com', 'SENDGRID_API_KEY');

if (!OktaUserCurls) {
    console.log("You need to add your Okta Domain and a token to the to of this file");
    process.exit(1);
} else {
    console.log("You're updating users on " + domain);
}


OktaUserCurls.getSuspendedUsers(function(suspendedUsers){
	if(suspendedUsers){
		var users = JSON.parse(suspendedUsers);
		console.log(users.length + " users set to deactivate");
		for (var i = 0; i < users.length; i++){
			var user = users[i].id;
			OktaUserCurls.deactivateSuspendedUser(user, function(resp){
				if(resp){
					console.log("deactivated user id: ", user);
				} else {
					console.log("error deactivating user id: ", user);
				}
			});
		}		

	}
});

