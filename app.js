const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing"); //mailchimp
const e = require("express");

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
    const mailchimpServerPrefix = "us12";
    const myApiKey = "1629a413d4909855b4b093edd068a69f-us12";
    const myAudienceId = "a911a10f9e";
    const options = {
        method: "post",
        auth: "marcus1:" + myApiKey,

    };

    app.post("/failure", function(req, res){
        res.redirect("/");
    });

    app.post("/exists", function(req, res){
        res.redirect("/");
    });

    client.setConfig({
        apiKey: myApiKey,
        server: mailchimpServerPrefix,
    });

    const run = async () => {
        const response = await client.lists.batchListMembers(myAudienceId, {
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
