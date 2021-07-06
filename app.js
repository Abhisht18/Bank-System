const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const hbs = require("hbs");
const path = require("path");
const { toNumber } = require("lodash");

mongoose.connect("mongodb+srv://admin-abhisht:Popjohn123@cluster0.uu063.mongodb.net/clientDB", {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.set('useFindAndModify', false);

const app = express(); // defining app
const port = process.env.PORT || 3000 ;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))
const clientSchema = new mongoose.Schema ({
    id : Number,
    name : String,
    email : String,
    balance : Number
})

const transactionSchema = new mongoose.Schema ({
    from : String,
    to : String,
    money : Number,
    date : String
})

const Transact = mongoose.model("Transact", transactionSchema);
const Client = mongoose.model("Client", clientSchema);

const joey = new Client ({
    id : 1,
    name : "Joey",
    email : "drake.ramoray@gmail.com",
    balance : 70000
})
const ross = new Client ({
    id : 2,
    name : "Ross",
    email : "rossisfine@gmail.com",
    balance : 30000
})
const chandler = new Client ({
    id : 3,
    name : "Chandler",
    email : "sarcastic.chandler@gmail.com",
    balance : 100000
})
const phoebe = new Client ({
    id : 4,
    name : "Phoebe",
    email : "regina.felangi@gmail.com",
    balance : 20000
})
const monica = new Client ({
    id : 5,
    name : "Monica",
    email : "monica.know@gmail.com",
    balance : 10000
})
const rachel = new Client ({
    id : 6,
    name : "Rachel",
    email : "rachel.onbreak@gmail.com",
    balance : 50000
})
const sheldon = new Client ({
    id : 7,
    name : "Sheldon",
    email : "sheldoncooper@gmail.com",
    balance : 90000
})
const leonard = new Client ({
    id : 8,
    name : "Leonard",
    email : "leonard@gmail.com",
    balance : 100000
})
const raj = new Client ({
    id : 9,
    name : "Rajesh",
    email : "rajk@gmail.com",
    balance : 80000
})
const howard = new Client ({
    id : 10,
    name : "Howard",
    email : "howard@MIT.ac.in",
    balance : 80000
})
const clientArr = [];
clientArr.push(joey); 
    clientArr.push(ross);
    clientArr.push(chandler);
    clientArr.push(phoebe);
    clientArr.push(monica);
    clientArr.push(rachel);
    clientArr.push(sheldon);
    clientArr.push(leonard);
    clientArr.push(raj);
    clientArr.push(howard);
    
Client.find({},function(err,clntItem){
    console.log(clntItem.length);
    if(clntItem.length === 0){
        Client.insertMany(clientArr, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Successfully Added");
            }
        });
    }
})

app.get("/", function(req,res){ // app.get for home route
    res.render("frontpage");
});

app.post("/", function(req,res){
    console.log(req.body);
});

app.get("/ourClients", function(req,res){ 
    Client.find({}, function(err, clientss){
        res.render("ourClients",{clientss : clientss});
    });
});

app.get("/transfer", function(req,res){ // app.get for home route
    Client.find({}, function(err, clientss){
        res.render("transfer",{clientss : clientss});
    });
});

app.get("/previousTransaction", function(req, res){
    Transact.find({}, function(err, transs){
        res.render("previousTransaction",{transs : transs});
    });
})

app.post("/transfer", function(req,res){

    if(req.body.from === req.body.recipient){
        res.render("failure");
        res.redirect("/");
    }

    Client.findOne({name: req.body.from}, function(err, clnt){
        if(err){
            console.log(err);
        }else{
            if(clnt.balance < req.body.amount){
                res.render("failure");
            }else{
                updateAmount( clnt.balance-req.body.amount);
                let trans = new Transact();
                trans.money = req.body.amount;
                trans.from = req.body.from;
                trans.to = req.body.recipient;
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0');
                var yyyy = today.getFullYear();
                var hh = today.getHours();
                var min = today.getMinutes();
                trans.date = dd + '/' + mm + '/' + yyyy + " " + hh + ":" + min;
                trans.save();
                Client.findOne({name : req.body.recipient}, function(err, clint){
                    if(err){
                        console.log(err);
                    }else{
                        trans.to = clint.name;
                        updateBalance(toNumber(clint.balance)+ toNumber(req.body.amount));
                    }
                });
                res.render("success");
            }
        }
    });

    function updateAmount(final){
        Client.findOneAndUpdate({name : req.body.from}, {$set:{balance: final}}, {new: true}, function(err){
            if(err){
                console.log(err);
            }
        });
    }

    function updateBalance(finale){
        Client.findOneAndUpdate({name : req.body.recipient}, {$set:{balance: finale}}, {new: true}, function(err){
            if(err){
                console.log(err);
            }
        });
    }
});

app.listen(port,() => {
    console.log(`listening to the port at ${port}`);
});