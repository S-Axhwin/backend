const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("./models/User");
const Chat = require("./models/Chat");

const connectDB = require("./connect");
const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/reg", async(req, res)=>{
    const {username, password} = req.body;
    if(!username || !password) return res.status(403).json({status: false, err: 'missing name or password'});
    const profileUrl = req.body.profileUrl;
    //console.log(req.params.type);
    const alreadyUser = await User.findOne({username})
    //console.log(alreadyUser);
    if(!alreadyUser){
        const hasPass = await bcrypt.hash(password, 10);
        //console.log(hasPass);
        try{
            const newUser = await User.create({username, password: hasPass, profileUrl});
            console.log("created");
            res.status(200).json({status: true});
            return 0;
        }catch(err){
            //console.log(err);
            res.status(400).json({status: false, reason: 'user already exisiting!'})
            return 0;
        }
    }
    res.status(400).json({status: false, reason: 'user already exisiting!'})
    
});

app.post("/api/login", async(req, res)=>{
    const {username, password} = req.body;
    if(!username || !password) return res.status(403).json({status: false, err: 'missing name or password'});

    const alreadyUser = await User.findOne({username})

    if(alreadyUser){
        bcrypt.compare(password, alreadyUser.password).then(async(result) => {
            if (result) {
                const newToken = await jwt.sign({username}, "nothing", {expiresIn: '10m'});
                res.json({status: true, token: newToken, username});
            } else {
                res.status(400).json({status: false, reason: 'password wrong!'})
                
            }
        });
    }else{
        res.status(400).json({status: false, reason: 'no user found'})
    }
})

app.post("/api/newChat", async (req, res) => {
    const {from, to, message} = req.body;
    console.log(from, to, message);
    if(!(from && to && message)) return res.json({status: false, reason: "missing some values"});

    const isnewChat =  await Chat.findOne({mem1: from, mem2: to});
    const oldChat = isnewChat.messages
    //console.log("old chat",oldChat);
    if(! isnewChat) {
        await Chat.create({mem1: from, mem2: to});
    }

    const respo = await Chat.updateOne(
        {mem1: from, mem2: to},
        {$set: { messages: [...oldChat,{from, to, message}] }}
    )
    res.send("OK")
})

const PORT = process.env.PORT || 5001

connectDB().then(() => {

    app.listen(PORT, () => {
        console.log("listening to port", PORT);
    })
})