####
1. Add envs and the like to the api.env.
1. source api.env


##### SendGrid Example
1. node sendgrid_user_flow

##### Password Hash via BCrypt
1. pip3 install crypto
1. python3 bcrypt.py
1. Copy hash and salt for `create_user_with_password.js`

##### Create Active User with Password
1. Add salt/hash to JSON object in create_user_with_password.js
1. node create_user_with_password.js


*NOTE: To output the cURL commands you're constructing, open up `OktaUserCurls.js` and set this.DEBUG=true (if false).