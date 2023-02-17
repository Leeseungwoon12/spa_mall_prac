const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({ // 장바구니에 사용자 별 ID를 부여
  userId: {
    type: String, // ObjectID 이기 때문에 문자열
    required: true, // 장바구니는 특정 사용자만 사용가능 하기에 ID필수
  },
  goodsId: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("Cart", cartSchema);