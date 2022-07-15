// npm install express, body-parser, request, https, @mailchimp/mailchimp_marketing
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
// const apiKey1 = process.env.API_KEY;
// Use body-parser
app.use(bodyParser.urlencoded({extended: true}));
// The public folder which holds the CSS and images
app.use(express.static("public"));
// Listening on port 3000 and logging if server is running
app.listen(process.env.PORT || 3000, function(){
console.log("Server is running on port 3000.");
});
// Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/", function(req,res){
res.sendFile(__dirname + "/signup.html");
});
// Setting up MailChimp
mailchimp.setConfig({
// ENTER API KEY HERE
// apiKey: ${String(apiKey1)},
// apiKey: apiKey1,
// `apiKey:${String(apiKey1)}`
// apiKey: ${process.env.API_KEY},
apiKey: process.env.API_KEY,

// ENTER API KEY PREFIX HERE i.e. THE SERVER
server: "us11",
});
// As soon as the sign in button is pressed execute this
app.post("/", function(req, res){
// MATCH THESE TO THE VALUES ENTERED IN THE INPUT ATTRIBUTE IN HTML
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    console.log(firstName, lastName, email);
// ENTER AUDIENCE OR LIST ID HERE
const listId = "ec1520b94d";
// CREATE AN OBJECT WITH THE USERS DATA
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };
// UPLOADING THE DATA TO THE SERVER
async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
           }
        });
// IF ALL GOES WELL LOGGING THE CONTACT'S ID
res.sendFile(__dirname + "/success.html")
console.log(
    `Successfully added contact as an audience member. The contact's id is ${
        response.id
        }.`
       );
       }
// RUNNING THE FUNCTION AND CATCHING THE ERRORS (IF ANY)
run().catch(e => res.sendFile(__dirname + "/failure.html"));
});
// RETURN HOME FROM FAILURE
app.post("/failure", function(req, res){
res.redirect("/");
});


// mailchimp api key secured, in command line enter:
// heroku config:set API_KEY=<your api key>
// to check:
// heroku config:get API_KEY
// store and call on api key with heroku
// const apiKey = process.env.API_KEY;
// auth:`uname:${String(apiKey)}`

// audience id or list id
// ec1520b94d