import client from "./client";

//로그인
export const login = ({ username, password }) => {
  client.post("api/auth/login", { username, password });
};

//회원가입
export const register = ({ username, password, passwordConfirm }) =>
  client.post("api/auth/register", { username, password, passwordConfirm });

//로그인 상태확인
export const check = () => client.get("api/auth/check");
