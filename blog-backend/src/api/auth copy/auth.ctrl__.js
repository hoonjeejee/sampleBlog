import Auth from "./auth.model";
import Debug from "debug";
import MariaDb from "../../lib/mariadb";

const debug = new Debug("app:auth.ctrl");

class Auth {
  static async register(ctx) {
    ctx.body = "register";
  }
}

export default Auth;
