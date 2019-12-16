import Debug from "debug";
import Joi from "joi";
import MariaDb from "../../lib/mariadb";
import * as userModel from "../../model/user.js";

const debug = new Debug("app:auth.ctrl");

// 회원가입
export const register = async ctx => {
  //joi로 유효성 검사
  const schema = Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(20)
      .required(),
    password: Joi.string().required()
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  // 데이터 존재여부확인 > 비밀번호암호화 > 저장
  const { username, password } = ctx.request.body;

  let sql = "";
  let temp = "";
  try {
    // username 존재여부 확인
    const user = await userModel.findByUsername(username);

    if (user) {
      ctx.status = 409; //  Conflict
      return;
    }
    // todo  비밀번호 암호화
    const cryptedPassword = await userModel.setPassword(password);

    // 회원정보 저장
    sql = " insert into user (username, password)  values ( ? ,? ) ";
    temp = await MariaDb.query(sql, [username, cryptedPassword]);

    ctx.body = `${username} 님, 가입되셨습니다.`;
  } catch (err) {
    ctx.throw(500, err);
  }
};

// 로그인
export const login = async ctx => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 401; // Unauthorized
    return;
  }

  try {
    const user = await userModel.findByUsername(username);

    if (!user) {
      ctx.status = 401; // Unauthorized
      return;
    }

    const valid = await userModel.checkPassword(password);

    if (!valid) {
      ctx.status = 401; // Unauthorized
      return;
    }

    ctx.body = user;
  } catch (err) {
    ctx.throw(500, err);
  }
};

// 로그인 상태 확인
export const check = async ctx => {
  ctx.body = "로그인 상태 확인";
};

// 로그아웃
export const logout = async ctx => {
  ctx.body = "로그아웃";
};
