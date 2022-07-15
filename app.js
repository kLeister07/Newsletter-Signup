// npm install express, body-parser, request, https, @mailchimp/mailchimp_marketing
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
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
apiKey: "5a9a4cac6716ebf8355f10b0cb7426e0-us11",
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


// mailchimp api key
// 5a9a4cac6716ebf8355f10b0cb7426e0-us11

// audience id or list id
// ec1520b94d


// OLD VERSION SETUP FROM ANGELAS BOOTCAMP LEFTOVERS:
//     const jsonData = JSON.stringify(data);
// https.request(url, options,  function(response) {
// const url = "https://us11.api.mailchimp.com/3.0/lists/ec1520b94d"
// const options = {
//     method: "POST",
//     auth: "kevin1:5a9a4cac6716ebf8355f10b0cb7426e0-us11"
// }
// const request = https.request(url, options, function(response){
//     response.on("data",function(data){
//         console.log(JSON.parse(data));
//     })
// })
// request.write(jsonData);
// request.end();
// });
// });