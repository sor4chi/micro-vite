import connect from "connect";
import historyApiFallback from "connect-history-api-fallback";
import sirv from "sirv";
import { transformMiddleware } from "./transformMiddleware";
import { getPlugins } from "./plugins";
import { createPluginContainer } from "./pluginContainer";
import { setupReloadServer } from "./reloadPlugin";

export const startDev = () => {
  const server = connect();
  server.listen(3000, "localhost");
  const ws = setupReloadServer();

  const plugins = getPlugins();
  const pluginContainer = createPluginContainer(plugins);

  server.use(transformMiddleware(pluginContainer));
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

  setTimeout(() => {
    console.log("reload!")
    ws.send({ type: "reload" });
  }, 1000 * 5);
};
