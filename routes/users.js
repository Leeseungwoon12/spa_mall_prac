const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");

// 내 정보 조회 API
// /users/me라는 주소에 들어오면 auth-middleward(사용자 인증 미들웨어)를 가서 로직을 해결하고, 다시 res 로 돌아온다.
router.get('/users/me', authMiddleware, async(req, res) => { 
  const {email, nickname} = res.locals.user;
  res.status(200).json({
    user : {
      email: email,
      nickname: nickname
    }
  });
});

// 회원가입 API
router.post("/users", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  // email 또는 nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findOne({
    $or: [{ email }, { nickname }],
  });
  if (existsUsers) {
    // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
    res.status(400).json({
      errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
    });
    return;
  }

  const user = new User({ email, nickname, password });
  await user.save();

  res.status(201).json({});
});


module.exports = router;