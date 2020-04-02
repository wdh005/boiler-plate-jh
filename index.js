//백엔드의 시작점 
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const { User } = require("./models/User");
const mongoose = require('mongoose');
const config = require('./config/key');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=> console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json type 을 가져온다.
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('hello'));

app.post('/register', (req,res) => {
    //회원가입시 필요한 정보들을 client에서 가져와 DB에 넣어준다.
    const user = new User(req.body);
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        });
    });
});

app.listen(port,() => console.log(`Example app listening on port ${port}!`));