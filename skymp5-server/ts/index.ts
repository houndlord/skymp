/*
import * as ui from "./ui";

// @ts-ignore
import * as sourceMapSupport from "source-map-support";
sourceMapSupport.install({
  retrieveSourceMap: function (source: string) {
    if (source.endsWith('skymp5-server.js')) {
      return {
        url: 'original.js',
        map: require('fs').readFileSync('dist_back/skymp5-server.js.map', 'utf8')
      };
    }
    return null;
  }
});

import { Settings } from "./settings";
import { System } from "./systems/system";
import { MasterClient } from "./systems/masterClient";
import { Spawn } from "./systems/spawn";
import { Login } from "./systems/login";
import { DiscordBanSystem } from "./systems/discordBanSystem";
import { MasterApiBalanceSystem } from "./systems/masterApiBalanceSystem";
import { EventEmitter } from "events";
import { pid } from "process";
import * as fs from "fs";
import * as chokidar from "chokidar";
import * as path from "path";
import * as os from "os";

import * as manifestGen from "./manifestGen";
import { createScampServer } from "./scampNative";

const gamemodeCache = new Map<string, string>();

function requireTemp(module: string) {
  // https://blog.mastykarz.nl/create-temp-directory-app-node-js/
  let tmpDir;
  const appPrefix = 'skymp5-server';
  try {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));

    const contents = fs.readFileSync(module, 'utf8');
    const tempPath = path.join(tmpDir, Math.random() + '-' + Date.now() + '.js');
    fs.writeFileSync(tempPath, contents);

    require(tempPath);
  }
  catch (e) {
    console.error(e.stack);
  }
  finally {
    try {
      if (tmpDir) {
        fs.rmSync(tmpDir, { recursive: true });
      }
    }
    catch (e) {
      console.error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`);
    }
  }
}

function requireUncached(
  module: string,
  clear: () => void,
  server: scampNative.ScampServer
): void {
  let gamemodeContents = fs.readFileSync(require.resolve(module), "utf8");

  // Reload gamemode.js only if there are real changes
  const gamemodeContentsOld = gamemodeCache.get(module);
  if (gamemodeContentsOld !== gamemodeContents) {
    gamemodeCache.set(module, gamemodeContents);

    while (1) {
      try {
        clear();

        // In native module we now register mp-api methods into the ScampServer class
        // This workaround allows code that is bound to global 'mp' object to run
        // @ts-ignore
        globalThis.mp = globalThis.mp || server;

        requireTemp(module);
        return;
      } catch (e) {
        if (`${e}`.indexOf("'JsRun' returned error 0x30002") === -1) {
          throw e;
        } else {
          console.log("Bad syntax, ignoring");
          return;
        }
      }
    }
  }
}

const setupStreams = (scampNative: any) => {
  class LogsStream {
    constructor(private logLevel: string) {
    }

    write(chunk: Buffer, encoding: string, callback: () => void) {
      // @ts-ignore
      const str = chunk.toString(encoding);
      if (str.trim().length > 0) {
        scampNative.writeLogs(this.logLevel, str);
      }
      callback();
    }
  }

  const infoStream = new LogsStream('info');
  const errorStream = new LogsStream('error');
  // @ts-ignore
  process.stdout.write = (chunk: Buffer, encoding: string, callback: () => void) => {
    infoStream.write(chunk, encoding, callback);
  };
  // @ts-ignore
  process.stderr.write = (chunk: Buffer, encoding: string, callback: () => void) => {
    errorStream.write(chunk, encoding, callback);
  };
};
*/

import * as scampNative from "./scampNative";

const main = async () => {
  console.log(scampNative.getScampNative().test());
  // const server = createScampServer(123, 123, {});

  // const toAbsolute = (p: string) => {
  //   if (path.isAbsolute(p)) return p;
  //   return path.resolve("", p);
  // };

  // const clear = () => server.clear();

  // const log = console.log;
  // const absoluteGamemodePath = toAbsolute('gamemode.js');
  // log(`Gamemode path is "${absoluteGamemodePath}"`);
  // try {
  //   requireUncached(absoluteGamemodePath, clear, server);
  // } catch (e) {
  //   console.error(e);
  // }
};

main();

// This is needed at least to handle axios errors in masterClient
// TODO: implement alerts
process.on("unhandledRejection", (...args) => {
  console.error("[!!!] unhandledRejection")
  console.error(...args);
});

// setTimeout on gamemode should not be able to kill the entire server
// TODO: implement alerts
process.on("uncaughtException", (...args) => {
  console.error("[!!!] uncaughtException")
  console.error(...args);
});
