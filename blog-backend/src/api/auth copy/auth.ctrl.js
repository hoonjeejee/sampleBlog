import Auth from "./auth.model";
import Debug from "debug";
import MariaDb from "../../lib/mariadb";

const debug = new Debug("app:auth.ctrl");

// 회원가입
export const register = async function(ctx) {
  //export const register = async ctx => {
  // Todo ,  joi로 유효성 검사
  // const schema = Joi.object().keys({
  //   username: Joi.string()
  //     .alpahnum()
  //     .min(3)
  //     .max(20)
  //     .required(),
  //   password: Joi.string().required()
  // });

  // const result = Joi.validate(ctx.request.body, schema);

  // if (result.error) {
  //   ctx.status = 400;
  //   ctx.body = result.error;
  //   return;
  // }

  const { username, password } = ctx.request.body;

  let sql = "";
  let temp = "";

  try {
    // username 존재여부 확인
    sql = "select username from user where username = ? ";

    const exists = await this.MariaDb.query(sql, [username]);

    if (exists) {
      ctx.status = 409; //  Conflict
      return;
    }

    // todo  비밀번호 암호화
    // todo  username,password  저장
    sql = " insert into user (username, password)  into ( ? ,? ) ";
    temp = await MariaDb.query(sql, [username, password]);
    debug("temp : " + temp);
    // todo 응답할 데이터에서 hashedPassword 필드제거 ... --> 이거 필요한가?

    ctx.body = data;
  } catch (err) {
    ctx.throw(500, e);
  }
};

// 로그인
export const login = async ctx => {
  ctx.body = "로그인";
};

// 로그인 상태 확인
export const check = async ctx => {};

// 로그아웃
export const logout = async ctx => {};
