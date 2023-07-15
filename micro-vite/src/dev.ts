import connect from "connect";
import historyApiFallback from "connect-history-api-fallback";
import sirv from "sirv";
import { transformMiddleware } from "./transformMiddleware";

export const startDev = () => {
  const server = connect();
  server.listen(3000, "localhost");

  server.use(transformMiddleware());
  server.use(
    sirv(undefined, {
      dev: true,
      etag: true,
      setHeaders: (res, pathname) => {
        if (/\.[tj]s$/.test(pathname)) {
          res.setHeader("Content-Type", "application/javascript");
        }
      },
    })
  );
  server.use(historyApiFallback() as any); // ファイルが存在しなかったときにindex.htmlを返すようにするミドルウェア

  console.log("dev server running at http://localhost:3000");
};
