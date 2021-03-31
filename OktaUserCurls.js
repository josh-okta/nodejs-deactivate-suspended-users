const exec = require('child_process').exec;

const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

module.exports = function (OKTA_DOMAIN, OKTA_API_KEY, FROM_EMAIL, SENDGRID_API_KEY) {
    if (!OKTA_DOMAIN || !OKTA_API_KEY || !FROM_EMAIL || !SENDGRID_API_KEY) {
        return false;
    } else {
        return new OktaUserCurls(OKTA_DOMAIN, OKTA_API_KEY, FROM_EMAIL, SENDGRID_API_KEY);
    }
};


function OktaUserCurls(OKTA_DOMAIN, OKTA_API_KEY, FROM_EMAIL, SENDGRID_API_KEY) {
	  this.OKTA_API_KEY = OKTA_API_KEY;			// create a token under Security -> API -> Tokens
	  this.OKTA_DOMAIN = OKTA_DOMAIN;   // https://[YOUR_OKTA_DOMAIN]
	  this.DEBUG = true;
    this.FROM_EMAIL = FROM_EMAIL;
    this.SENDGRID_API_KEY = SENDGRID_API_KEY;
}

OktaUserCurls.prototype = {

    /**
     * Call the CURL command
     * @param curl
     */
    callCurl: function (curl, cb) {
        if (this.DEBUG) {
	        console.log("CURL COMMAND:");
	        console.log(curl);
        }

        exec(curl, (error, output) => {
        	if(!error){
        		cb(output);
        	} else {
        		console.log('something went wrong.  invalid curl response');
				cb(false);        		
        	}
        });
    },

    /**
     * Update both main and sidebar logos.
     */
    getSuspendedUsers: function (cb) {


    	var curl = "curl -s GET '" + this.OKTA_DOMAIN + "/api/v1/users?filter=status%20eq%20%22SUSPENDED%22' \
					--header 'Accept: application/json' \
					--header 'Content-Type: application/json' \
					--header 'Authorization: SSWS " + this.OKTA_API_KEY + "'"

        this.callCurl(curl, cb);
    },

    deactivateSuspendedUser: function(userId, cb){

    	var domain = this.OKTA_DOMAIN + "/api/v1/users/" +userId + "/lifecycle/deactivate";

    	var curl = "curl -s --request POST '" + domain + "' \
				--header 'Content-Type: application/json' \
				--header 'Accept: application/json' \
				--header 'Authorization: SSWS" + this.OKTA_API_KEY + "'"

		return this.callCurl(curl, cb);
   },

   sendActivationEmail: function(to_email, url, token, template_id, firstName, cb) {

    var json = {
               "from":{
                  "email": SENDGRID_FROM_EMAIL
               },
               "personalizations":[
                  {
                     "to":[
                        {
                           "email": to_email
                        }
                     ],
                     "dynamic_template_data":{
                        "activationUrl": url, 
                        "activationToken": token,
                        "firstName": firstName
                      }
                  }
               ],
               "template_id": template_id
            };

        var curl = "curl --request POST --url https://api.sendgrid.com/v3/mail/send \
                    --header 'Authorization: Bearer " + this.SENDGRID_API_KEY + "' \
                    --header 'Content-Type: application/json' \
                    -d '" + JSON.stringify(json) + "'";

        return this.callCurl(curl, cb);

   },


   createInactiveUser: function(fn, ln, email, login, cb){

        var json = { "profile": {
                "firstName": fn,
                "lastName": ln,
                "email": email,
                "login": login
                }
            };

        var curl = "curl --location --request POST " + this.OKTA_DOMAIN + "'/api/v1/users?activate=false' \
        --header 'Accept: application/json' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: SSWS " + this.OKTA_API_KEY + "' \
        --data-raw '" + JSON.stringify(json) + "'";

        return this.callCurl(curl, cb);
   },

   activateNewUser: function (id, cb) {

        var domain = this.OKTA_DOMAIN + "/api/v1/users/" + id + "/lifecycle/activate?sendEmail=false";

        var curl = "curl --location --request POST " + domain + " \
        --header 'Accept: application/json' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: SSWS " + this.OKTA_API_KEY + "'";

        return this.callCurl(curl, cb);    
   },

   createActiveUserWithBcryptPassword: function(userInfo, cb){

        var curl = "curl --location --request POST " + this.OKTA_DOMAIN + "'/api/v1/users?activate=true' \
        --header 'Accept: application/json' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: SSWS " + this.OKTA_API_KEY + "' \
        --data-raw '" + JSON.stringify(userInfo) + "'";

        return this.callCurl(curl, cb);
   }

};