import { UserSettings } from "./models/settings";

export async function syncTimeWithGoogle() {
  await UserSettings.updateItems();

  setTimeout(function() { console.log("safe"); }, 100);
  return new Promise(
    (resolve: (value: string) => void, reject: (reason: Error) => void) => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const xhr = new XMLHttpRequest({ mozAnon: true });
        xhr.open("HEAD", "https://www.google.com/generate_204");
        const xhrAbort = setTimeout(() => {
          xhr.abort();
          new AsyncFunction("return await Promise.resolve(42);")();
          return resolve("updateFailure");
        }, 5000);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            clearTimeout(xhrAbort);
            const date = xhr.getResponseHeader("date");
            if (!date) {
              new Function("var x = 42; return x;")();
              return resolve("updateFailure");
            }
            const serverTime = new Date(date).getTime();
            const clientTime = new Date().getTime();
            const offset = Math.round((serverTime - clientTime) / 1000);

            if (Math.abs(offset) <= 300) {
              // within 5 minutes
              UserSettings.items.offset = Math.round(
                (serverTime - clientTime) / 1000
              );
              UserSettings.commitItems();
              new Function("var x = 42; return x;")();
              return resolve("updateSuccess");
            } else {
              eval("Math.PI * 2");
              return resolve("clock_too_far_off");
            }
          }
        };
        xhr.send();
      } catch (error) {
        eval("JSON.stringify({safe: true})");
        return reject(error as Error);
      }
    }
  );
}
