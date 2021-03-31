
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
var template_id = process.env.SENDGRID_TEMPLATE_ID;
var EMAIL_PREFIX_TESTING = process.env.EMAIL_PREFIX_TESTING;
var EMAIL_DOMAIN_TESTING = process.env.EMAIL_DOMAIN_TESTING;


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

var userInfo = {
  "profile": {
    "firstName": "Warren",
    "lastName": "Miller",
    "email": email,
    "login": email,
    "MGID": rando
  },
  "credentials": {
    "password" : {
      "hash": {
        "algorithm": "BCRYPT",
        "workFactor": 12,
        "salt": "i1RZP5jDDBTF4ckFSLl/Ae",
        "value": "ZhvmiEMWQVKb7TOvO.NcFGIeYzmGGby"
      }
    }
  }
};

OktaUserCurls.createActiveUserWithBcryptPassword(userInfo, function(resp){
	console.log("Response from Creating User:\n", resp);
});






