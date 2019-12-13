import Debug from "debug";
import MariaDb from "../../lib/mariadb";

const debug = Debug("app:loanModel");

class Auth {
  static async register({ username, password }) {
    //const register = async ({ username, password }) => {
    let sql = " insert into user (username, password)  into ( ? ,? ) ";

    try {
      await MariaDb.query(sql, [username, password]);
    } catch (err) {
      debug("register : " + err);
    }
  }

  static async login() {}

  static async logout() {}

  static async check() {}
}

export default Auth;
