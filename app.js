const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing"); //mailchimp
const e = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//mailchimp
/* client.setConfig({
  apiKey: "1629a413d4909855b4b093edd068a69f-us12",
  server: "https://us12.admin.mailchimp.com/account/api/",
});

const run = async () => {
  const response = await client.lists.batchListMembers("list_id", {
    members: [{}],
  });
  console.log(response);
};

run(); */
//end mailchimp

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
    })

    client.setConfig({
        apiKey: myApiKey,
        server: mailchimpServerPrefix,
    });
    // console.log(client);

    /* const request = https.request(client, options, function (response) {
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end(); */

    //checking ping
    /* async function run() {
        const response = await client.ping.get();
        console.log(response);
      } */

    //for lists
    /* const run = async () => {
        try {
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
    
            console.log(response.errors);
    
            // const errorCount = Number(response.error_count);
            // console.log(errorCount);
            res.sendFile(__dirname + "/success.html");
        } catch (err) {
            console.log(err.status);
            res.sendFile(__dirname + "/failure.html")
        }
    } */

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
        } else {
            console.log(response.errors);
            res.sendFile(__dirname + "/failure.html");
        }
        // const errorCount = Number(response.error_count);
        // console.log(errorCount);        
    }
    run();
});

app.listen(process.env.PORT, function () {
    console.log("server is running on port 3000");
});
