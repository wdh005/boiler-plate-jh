//백엔드의 시작점 
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());
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

app.post('/api/users/login', (req,res) => {
//요청된 이메일을 DB에 있는지 찾는다. & 이메일이 있다면 비밀번호가 맞는지 확인
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "해당 이메일이 존재하지 않습니다."
            });
        }

        user.comparePassword(req.body.password, (err, isMatch ) => {
            if(!isMatch) {
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
            }

            //이메일과 비밀번호가 맞다면 토큰을 생성한다.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                //token save  -> 쿠키, 로컬스토리지 등등 
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id });
            });
        });
    });

});

app.listen(port,() => console.log(`Example app listening on port ${port}!`));