const jwt = require("jsonwebtoken");
const User = require("../schemas/user")

module.exports = async(req, res, next) => {
    const {authorization} = req.cookies;
    //Bearer qwerqwrew.qwerwerwqer.wqerqrewqr 형태로 JWT토큰이 들어온다.
    //authorization 이 존재하지 않는 경우 undefined가 할당 됨.
    //authorization 쿠키가 존재하지 않았을 때를 대비
    const [authType, authToken] = (authorization ?? "").split(" ") // ??: null 병합 문자열, 왼쪽에 있는 값이 비었거나, null 일 경우 오른쪽에 있는 값("")으로 대체

//authType === Bearer 값인지 확인
//authToken 검증
    if(authType !== "Bearer" || !authToken) {
        res.status(400).json({
            errorMessage: "로그인 후에 이용할 수 있는 기능입니다."
        });
        return;
    }

    try{
    // 1.authToken이 만료되었는지 확인
    // 2.authToken이 서버가 발급한 토큰이 맞는지 검증
        const {userId} = jwt.verify(authToken, "customized-secert-key");

    // 3.authToken에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인
        const user = await User.findById(userId);
        res.locals.user = user;

        next(); // 해당 미들웨어 다음으로 보낸다.

    } catch (error ){
        console.error(error);
        res.status(400).json({
            errorMessage: "로그인 후에 이용할 수 있는 기능입니다."
        })
        return;
    }

}