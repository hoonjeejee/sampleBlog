/* Tip1.
 *   static 또는 인스턴스 함수에서 해야하는 작업들은 API 함수 내부에 직접 구현해도 되지만,
 *   이렇게 메서드를 만들어서 사용하면 가독성도 좋고, 추후 유지보수를 할때도 도움이 된다.
 *
 * Tip2
 *   인스턴스 메서드를 작성할 때는 화살표 함수가 아닌 function 키워드를 사용하여 구현해야 한다.
 *   함수 내부에서 this에 접근해야 하기 때문이다. 여기서 this는 문서 인스턴스를 가리킨다.
 *   화살표 함수를 사용하면 this는 문서 인스턴스를 가리키지 못하게 된다.
 */

import MariaDb from "../lib/mariadb";
import Debug from "debug";
const debug = new Debug("app:auth.model");

export async function setPassword(password) {
  /* Todo 암호화된 비밀번호 생성 로직 */
  const hashedPassword = password + "_hashed";
  return hashedPassword;
}

export async function checkPassword(password) {
  /* Todo 비밀번호 확인 로직 */

  return true;
}

export async function findByUsername(username) {
  const sql = "select username from user where username = ? ";
  const [user] = await MariaDb.query(sql, [username]);
  return user[0];
}
