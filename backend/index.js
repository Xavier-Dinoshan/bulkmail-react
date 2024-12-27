const express = require('express');
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose= require('mongoose');


const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://xrdinoshan1999:zcOBWEhRbckQ7wyA@cluster0.8guy0.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function () {
    console.log("connected successfully");
    
}).catch(function () {
    console.log("connection failed");
    
})

const credential = mongoose.model("credential", {}, "bulmail")


app.post("/sendmail", function (req, res) {

    var msg = req.body.msg

    var emailList = req.body.emailList

    credential.find().then(function (data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });


        new Promise(async function (resolve, reject) {
            try {
                for (i = 0; i < emailList.length; i++) {
                    await transporter.sendMail(
                        {
                            from: "xrdinoshan1999@gmail.com",
                            to: emailList[i],
                            subject: "For Testing purpose",
                            text: msg
                        },

                    )
                    console.log("send mail to" + emailList[i]);

                }

                resolve(true)
            }
            catch {
                reject(false)
            }
        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })


    }).catch(function (error) {
        console.log(error);

    })

    
    
    
    

    
})



app.listen(5000, function () {
    console.log("Server Started...");
    
})