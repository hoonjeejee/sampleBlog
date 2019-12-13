import mysql from "mysql2/promise";
import Debug from "debug";

// debug id 정의하기
const debug = Debug("app:mysql");

let connectionPool = null;

class MariaDb {
  /**
   * Perform a query
   *
   * @param {string} sql - The SQL command to be executed.
   * @param {Array}  values - Values to be substituted in SQL placeholders.
   * @return Array containing array of result rows and array of fields.
   *
   * @example
   *    const[books] = await Db.query('Select * From Books where Author =? ', [ 'David' ] );
   */
  static async query(sql, values) {
    try {
      if (!connectionPool) await setupConnectionPool();
      debug(
        "MysqlDb.query",
        sql.trim().split("\n")[0] +
          (sql.trim().split("\n").length > 1 ? "..." : "")
      );
      return connectionPool.query(sql, values);
    } catch (err) {
      debug("query : " + err);
    }
  }

  /**
   *   Get a connection to the database
   *
   *   This is useful for performing multiple queries within a transaction, or sharing data objects
   *   such as temporary tables between subsequent queries.
   *   the connection must be released.
   *
   *  @exmple
   *   const db = await Db.connection();
   *   await db.beginTransaction();
   *   try {
   *      await db.query('Insert Into Posts Set Title = ? , title);
   *      await db.query('Insert Into Log Set Data = ? , log);
   *      await db.commit();
   *   } catch (e) {
   *      await db.rollback();
   *      throw e;
   *   }
   *   db.release();
   *
   *   @returns {Objects} Database connection.
   **/

  static async connect(sql, values) {
    try {
      if (!connectionPool) await setupConnectionPool();
      const db = await connectionPool.getConnection();
      return db;
    } catch (err) {
      debug("connect : " + error);
    }
  }

  /**
   * DB connection 정보가져오기
   *
   * @returns Objects with host, user, password, database properties.
   */
  static async connectionParams(sql, values) {
    try {
      // .env파일에 DB_MYSQL_CONNECTION 항목을 가지고 온다.
      const connectionString = process.env.DB_MYSQL_CONNECTION;
      if (!connectionString)
        throw new Error("No DB_MYSQL_CONNECTION available");

      /**
       *  DB_MYSQL_CONNECTION 항목값을 배열로 만들고, 배열을 map형태로 저장한다.
       *
       *   참고내용
       *     map 메소드 : 배열.map((요소,인덱스,배열) => { return 요소 })
       *     map의 기본원리 : 반복문을 돌며 배열 안의 요소들을 1대 1로 짝지어 주는 것
       *     dbConfigKeyVal의 결과값 형태: [[],[],[]] ===> 배열안의 배열형태
       */
      const dbConfigKeyVal = connectionString
        .split(";")
        .map(v => v.trim().split("="));

      /**
       * 나눠진 값들을 javascript 객체(JS Object)로 만듦
       *
       *    JS Object 와 JSON의 차이
       *      JS Object : JS Engine 메모리안에 있는 데이터 구조
       *      JSON : 객체의 내용을 기술하기 위한 txt 파일, 파일이므로 .json이라는 확장자를 가진 파일이 존재함
       *    참고내용
       *      reduce 메소드 : 배열.reduce((누적값, 현재값, 인덱스, 요소) => {return 결과}, 초기값);
       *      reduceRight 메소드 : reduce 메소드는 index 0부터, reduceRight는 마지막 인덱스 부터
       *      예시)
       *        const oneTwoThree = [1, 2, 3];
       *        result = oneTwoThree.reduce((accumulate, current, index) => {
       *            console.log(accumulate, current, index);
       *            return accumulate + current;
       *        }, 0);      --> 초기값이 없으면, 누적값이 0번째 index값으로 설정됨, 그래서 0번째는 돌지않음, 1번째부터 실행됨
       *        // 0 1 0
       *        // 1 2 1
       *        // 3 3 2
       *        result;  // 6
       *      예시2)
       *       const oneTwoThree = [1, 2, 3];
       *       result = oneTwoThree.reduce((acc, cur) => {
       *          acc.push(cur % 2 ? '홀수' : '짝수');
       *          return acc;
       *       }, []);
       *       result; // ['홀수', '짝수', '홀수']
       */
      const dbConfig = dbConfigKeyVal.reduce((config, v) => {
        config[v[0].toLowerCase] = v[1];
        return config;
      }, {});

      return dbConfig;
    } catch (err) {
      debug("connetionParams : " + error);
    }
  }
}
///// MariaDb 여기까지

/*
 * 앱 시작 후 첫번째 connection 요청은 연결 풀을 설정합니다.
 */
async function setupConnectionPool() {
  try {
    const dbConfig = MariaDb.connectionParams();
    /*
         * placaholder 
         * mysql module uses ? characters as placeholders for values,
         *    connection
                .query('SELECT ?, ?', [
                    'foo',
                    'bar'
                ]);
            
            named placeholders
            connection
                .query('SELECT :foo, :bar', {
                    foo: 'FOO',
                    bar: 'BAR'
                });     
            */
    dbConfig.namedPlaceholders = true;

    /*
     *  Connection pools
     *   help reduce the time spent connecting to the MySQL server by reusing a previous connection
     *   , leaving them open instead of closing when you are done with them
     *   예시)
     *      const pool = mysql.createPool({
     *      host: 'localhost',
     *      user: 'root',
     *      database: 'test',
     *      waitForConnections: true,
     *      connectionLimit: 10,
     *      queueLimit: 0
     *   });
     */
    connectionPool = mysql.createPool(dbConfig);

    debug(
      "MysqlDb.setupConnectionPool",
      `connect to ${dbConfig.host}/${dbConfig.database}`
    );

    /*
     *  TRADITIONAL(기본적인 제약사항에 대한 처리를 모두 가지고 있다.)
     *
     *  참고
     *    SQL MODE는 저장될 데이터에 대한 제약조건의 허용범위를 지정할 수 있다.
     *    예를 들어, not null 인 컬럼에 null값이 들어갈때 경고만 발생하고 임의의 값을 적재할지 아니면
     *    error를 발생할지에 대한 처리등을 SQL_MODE 값 설정을 통해 지정할 수 있다.
     *  참고사이트
     *    https://dev.mysql.com/doc/refman/5.5/en/sql-mode.html
     *    http://www.mysqlkorea.com/sub.html?mcode=manual&scode=01&m_no=21330&cat1=5&cat2=120&cat3=138&lang=k
     */
    await connectionPool.query('SET SESSION sql_mode="TRADITIONAL"');
  } catch (err) {
    debug("setupConnectionPool : " + error);
  }
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
export default MariaDb;
