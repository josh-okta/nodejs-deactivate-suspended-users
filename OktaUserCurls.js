const exec = require('child_process').exec;

module.exports = function (domain, key) {
    if (!domain || !key) {
        return false;
    } else {
        return new OktaUserCurls(domain, key);
    }
};


function OktaUserCurls(domain, key) {
	this.key = key;			// create a token under Security -> API -> Tokens
	this.domain = domain;   // https://[YOUR_OKTA_DOMAIN]
	this.DEBUG = false;
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


    	var curl = "curl -s GET '" + this.domain + "/api/v1/users?filter=status%20eq%20%22SUSPENDED%22' \
					--header 'Accept: application/json' \
					--header 'Content-Type: application/json' \
					--header 'Authorization: SSWS " + this.key + "'"

        this.callCurl(curl, cb);
    },

    deactivateSuspendedUser: function(userId, cb){

    	var domain = this.domain + "/api/v1/users/" +userId + "/lifecycle/deactivate";

    	var curl = "curl -s --request POST '" + domain + "' \
				--header 'Content-Type: application/json' \
				--header 'Accept: application/json' \
				--header 'Authorization: SSWS" + this.key + "'"

		return this.callCurl(curl, cb);
   }

};