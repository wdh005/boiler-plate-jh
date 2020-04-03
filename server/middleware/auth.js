const { User } = require("../models/User");

let auth = (req, res, next) => {
    //인증 처리 하는 곳
    // 클라이언트 쿠키에서 토튼을 가져온다.
    let token = req.cookies.x_auth;
    // 토튼을 복호화 한 후 유저를 찾는다. & 유저가 존재하면 인증 성공 없으면 인증 실패
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true });

        req.token = token;
        req.user = user;
        next();
    });
};

module.exports = { auth };
