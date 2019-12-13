import Router from "koa-router";
//import * as authCtrl from "./auth.ctrl";

const auth = new Router();

auth.post("/register", ctx => {
  ctx.body = "register";
});
auth.post("/login", ctx => {
  ctx.body = "login";
});
auth.post("/logout", ctx => {
  ctx.body = "logout";
});
auth.get("/check", ctx => {
  ctx.body = "check";
});

export default auth;
