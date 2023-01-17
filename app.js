const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing"); //mailchimp
const e = require("express");
const {userConfigs} = require(__dirname + "/user-config.js");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                email_type: "text",
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            },
        ],
    };

    const jsonData = JSON.stringify(data);
    const options = {
        method: "post",
        auth: "marcus1:" + userConfigs.myApiKey,

    };

    app.post("/failure", function(req, res){
        res.redirect("/");
    });

    app.post("/exists", function(req, res){
        res.redirect("/");
    });

    client.setConfig({
        apiKey: userConfigs.myApiKey,
        server: userConfigs.mailchimpServerPrefix,
    });

    const run = async () => {
        const response = await client.lists.batchListMembers(userConfigs.myAudienceId, {
            members: [
                {
                    email_address: email,
                    email_type: "text",
                    status: "subscribed",
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName,
                    },
                },
            ],
        });

        if (response.error_count == 0) {
            res.sendFile(__dirname + "/success.html");
        } else if (response.errors[0].error_code == 'ERROR_CONTACT_EXISTS') {
            console.log(response.errors[0]);
            res.sendFile(__dirname + "/exists.html");
        } else {
            console.log(response.errors[0]);
            res.sendFile(__dirname + "/failure.html");
        } 
    }
    run();
});

app.listen(process.env.PORT || 3000, function () {
    console.log("server is running");
});
