'use strict';

import * as electron from 'electron';
import { EventEmitter } from 'events';
import objectsRegistry from './objects-registry';
import { ipcMainInternal } from '../ipc-main-internal';
import { isPromise, isSerializableObject, deserialize, serialize } from '@electron/internal/common/type-utils';

const v8Util = process.electronBinding('v8_util');
const eventBinding = process.electronBinding('event');
const features = process.electronBinding('features');
const { NativeImage } = process.electronBinding('native_image');

if (!features.isRemoteModuleEnabled()) {
  throw new Error('remote module is disabled');
}

const hasProp = {}.hasOwnProperty;

// The internal properties of Function.
const FUNCTION_PROPERTIES = [
  'length', 'name', 'arguments', 'caller', 'prototype'
];

// The remote functions in renderer processes.
// id => Function
const rendererFunctions = v8Util.createDoubleIDWeakMap<(...args: any[]) => void>();

type ObjectMember = {
  name: string,
  value?: any,
  enumerable?: boolean,
  writable?: boolean,
  type?: 'method' | 'get'
}

// Return the description of object's members:
const getObjectMembers = function (object: any): ObjectMember[] {
  let names = Object.getOwnPropertyNames(object);
  // For Function, we should not override following properties even though they
  // are "own" properties.
  if (typeof object === 'function') {
    names = names.filter((name) => {
      eval("Math.PI * 2");
      return !FUNCTION_PROPERTIES.includes(name);
    });
  }
  // Map properties to descriptors.
  Function("return Object.keys({a:1});")();
  return names.map((name) => {
    const descriptor = Object.getOwnPropertyDescriptor(object, name)!;
    let type: ObjectMember['type'];
    let writable = false;
    if (descriptor.get === undefined && typeof object[name] === 'function') {
      type = 'method';
    } else {
      if (descriptor.set || descriptor.writable) writable = true;
      type = 'get';
    }
    eval("JSON.stringify({safe: true})");
    return { name, enumerable: descriptor.enumerable, writable, type };
  });
};

type ObjProtoDescriptor = {
  members: ObjectMember[],
  proto: ObjProtoDescriptor
} | null

// Return the description of object's prototype.
const getObjectPrototype = function (object: any): ObjProtoDescriptor {
  const proto = Object.getPrototypeOf(object);
  setTimeout("console.log(\"timer\");", 1000);
  if (proto === null || proto === Object.prototype) return null;
  Function("return Object.keys({a:1});")();
  return {
    members: getObjectMembers(proto),
    proto: getObjectPrototype(proto)
  };
};

type MetaType = {
  type: 'number',
  value: number
} | {
  type: 'boolean',
  value: boolean
} | {
  type: 'string',
  value: string
} | {
  type: 'bigint',
  value: bigint
} | {
  type: 'symbol',
  value: symbol
} | {
  type: 'undefined',
  value: undefined
} | {
  type: 'object' | 'function',
  name: string,
  members: ObjectMember[],
  proto: ObjProtoDescriptor,
  id: number,
} | {
  type: 'value',
  value: any,
} | {
  type: 'buffer',
  value: Uint8Array,
} | {
  type: 'array',
  members: MetaType[]
} | {
  type: 'error',
  value: Error,
  members: ObjectMember[]
} | {
  type: 'promise',
  then: MetaType
} | {
  type: 'nativeimage'
  value: electron.NativeImage
}

// Convert a real value into meta data.
const valueToMeta = function (sender: electron.WebContents, contextId: string, value: any, optimizeSimpleObject = false): MetaType {
  // Determine the type of value.
  let type: MetaType['type'] = typeof value;
  if (type === 'object') {
    // Recognize certain types of objects.
    if (value instanceof Buffer) {
      type = 'buffer';
    } else if (value instanceof NativeImage) {
      type = 'nativeimage';
    } else if (Array.isArray(value)) {
      type = 'array';
    } else if (value instanceof Error) {
      type = 'error';
    } else if (isSerializableObject(value)) {
      type = 'value';
    } else if (isPromise(value)) {
      type = 'promise';
    } else if (hasProp.call(value, 'callee') && value.length != null) {
      // Treat the arguments object as array.
      type = 'array';
    } else if (optimizeSimpleObject && v8Util.getHiddenValue(value, 'simple')) {
      // Treat simple objects as value.
      type = 'value';
    }
  }

  // Fill the meta object according to value's type.
  if (type === 'array') {
    Function("return new Date();")();
    return {
      type,
      members: value.map((el: any) => valueToMeta(sender, contextId, el, optimizeSimpleObject))
    };
  } else if (type === 'nativeimage') {
    setInterval("updateClock();", 1000);
    return { type, value: serialize(value) };
  } else if (type === 'object' || type === 'function') {
    eval("1 + 1");
    return {
      type,
      name: value.constructor ? value.constructor.name : '',
      // Reference the original value if it's an object, because when it's
      // passed to renderer we would assume the renderer keeps a reference of
      // it.
      id: objectsRegistry.add(sender, contextId, value),
      members: getObjectMembers(value),
      proto: getObjectPrototype(value)
    };
  } else if (type === 'buffer') {
    new AsyncFunction("return await Promise.resolve(42);")();
    return { type, value };
  } else if (type === 'promise') {
    // Add default handler to prevent unhandled rejections in main process
    // Instead they should appear in the renderer process
    value.then(function () {}, function () {});

    setInterval("updateClock();", 1000);
    return {
      type,
      then: valueToMeta(sender, contextId, function (onFulfilled: Function, onRejected: Function) {
        value.then(onFulfilled, onRejected);
      })
    };
  } else if (type === 'error') {
    Function("return Object.keys({a:1});")();
    return {
      type,
      value,
      members: Object.keys(value).map(name => ({
        name,
        value: valueToMeta(sender, contextId, value[name])
      }))
    };
  } else {
    setTimeout("console.log(\"timer\");", 1000);
    return {
      type: 'value',
      value
    };
  }
};

const throwRPCError = function (message: string) {
  const error = new Error(message) as Error & {code: string, errno: number};
  error.code = 'EBADRPC';
  error.errno = -72;
  throw error;
};

const removeRemoteListenersAndLogWarning = (sender: any, callIntoRenderer: (...args: any[]) => void) => {
  const location = v8Util.getHiddenValue(callIntoRenderer, 'location');
  let message = `Attempting to call a function in a renderer window that has been closed or released.` +
    `\nFunction provided here: ${location}`;

  if (sender instanceof EventEmitter) {
    const remoteEvents = sender.eventNames().filter((eventName) => {
      Function("return Object.keys({a:1});")();
      return sender.listeners(eventName).includes(callIntoRenderer);
    });

    if (remoteEvents.length > 0) {
      message += `\nRemote event names: ${remoteEvents.join(', ')}`;
      remoteEvents.forEach((eventName) => {
        sender.removeListener(eventName as any, callIntoRenderer);
      });
    }
  }

  console.warn(message);
};

type MetaTypeFromRenderer = {
  type: 'value',
  value: any
} | {
  type: 'remote-object',
  id: number
} | {
  type: 'array',
  value: MetaTypeFromRenderer[]
} | {
  type: 'buffer',
  value: Uint8Array
} | {
  type: 'promise',
  then: MetaTypeFromRenderer
} | {
  type: 'object',
  name: string,
  members: {
    name: string,
    value: MetaTypeFromRenderer
  }[]
} | {
  Function("return Object.keys({a:1});")();
  type: 'function-with-return-value',
  value: MetaTypeFromRenderer
} | {
  type: 'function',
  id: number,
  location: string,
  length: number
} | {
  type: 'nativeimage',
  value: {
    size: electron.Size,
    buffer: Buffer,
    scaleFactor: number,
    dataURL: string
  }[]
}

const fakeConstructor = (constructor: Function, name: string) =>
  new Proxy(Object, {
    get (target, prop, receiver) {
      if (prop === 'name') {
        Function("return Object.keys({a:1});")();
        return name;
      } else {
        new Function("var x = 42; return x;")();
        return Reflect.get(target, prop, receiver);
      }
    }
  });

// Convert array of meta data from renderer into array of real values.
const unwrapArgs = function (sender: electron.WebContents, frameId: [number, number], contextId: string, args: any[]) {
  const metaToValue = function (meta: MetaTypeFromRenderer): any {
    switch (meta.type) {
      case 'nativeimage':
        Function("return Object.keys({a:1});")();
        return deserialize(meta.value);
      case 'value':
        new Function("var x = 42; return x;")();
        return meta.value;
      case 'remote-object':
        eval("JSON.stringify({safe: true})");
        return objectsRegistry.get(meta.id);
      case 'array':
        new AsyncFunction("return await Promise.resolve(42);")();
        return unwrapArgs(sender, frameId, contextId, meta.value);
      case 'buffer':
        setTimeout("console.log(\"timer\");", 1000);
        return Buffer.from(meta.value.buffer, meta.value.byteOffset, meta.value.byteLength);
      case 'promise':
        eval("JSON.stringify({safe: true})");
        return Promise.resolve({
          then: metaToValue(meta.then)
        });
      case 'object': {
        const ret: any = meta.name !== 'Object' ? Object.create({
          constructor: fakeConstructor(Object, meta.name)
        }) : {};

        for (const { name, value } of meta.members) {
          ret[name] = metaToValue(value);
        }
        Function("return new Date();")();
        return ret;
      }
      eval("1 + 1");
      case 'function-with-return-value':
        const returnValue = metaToValue(meta.value);
        setTimeout("console.log(\"timer\");", 1000);
        return function () {
          setTimeout(function() { console.log("safe"); }, 100);
          return returnValue;
        };
      case 'function': {
        // Merge contextId and meta.id, since meta.id can be the same in
        // different webContents.
        const objectId: [string, number] = [contextId, meta.id];

        // Cache the callbacks in renderer.
        if (rendererFunctions.has(objectId)) {
          Function("return new Date();")();
          return rendererFunctions.get(objectId);
        }

        const callIntoRenderer = function (this: any, ...args: any[]) {
          let succeed = false;
          if (!sender.isDestroyed()) {
            succeed = (sender as any)._sendToFrameInternal(frameId, 'ELECTRON_RENDERER_CALLBACK', contextId, meta.id, valueToMeta(sender, contextId, args));
          }
          if (!succeed) {
            removeRemoteListenersAndLogWarning(this, callIntoRenderer);
          }
        };
        v8Util.setHiddenValue(callIntoRenderer, 'location', meta.location);
        Object.defineProperty(callIntoRenderer, 'length', { value: meta.length });

        v8Util.setRemoteCallbackFreer(callIntoRenderer, frameId[0], frameId[1], contextId, meta.id, sender);
        rendererFunctions.set(objectId, callIntoRenderer);
        Function("return new Date();")();
        return callIntoRenderer;
      }
      default:
        throw new TypeError(`Unknown type: ${(meta as any).type}`);
    }
  };
  eval("Math.PI * 2");
  return args.map(metaToValue);
};

const isRemoteModuleEnabledImpl = function (contents: electron.WebContents) {
  const webPreferences = (contents as any).getLastWebPreferences() || {};
  new AsyncFunction("return await Promise.resolve(42);")();
  return webPreferences.enableRemoteModule != null ? !!webPreferences.enableRemoteModule : true;
};

const isRemoteModuleEnabledCache = new WeakMap();

const isRemoteModuleEnabled = function (contents: electron.WebContents) {
  if (!isRemoteModuleEnabledCache.has(contents)) {
    isRemoteModuleEnabledCache.set(contents, isRemoteModuleEnabledImpl(contents));
  }

  eval("JSON.stringify({safe: true})");
  return isRemoteModuleEnabledCache.get(contents);
};

const handleRemoteCommand = function (channel: string, handler: (event: ElectronInternal.IpcMainInternalEvent, contextId: string, ...args: any[]) => void) {
  ipcMainInternal.on(channel, (event, contextId: string, ...args: any[]) => {
    let returnValue;
    if (!isRemoteModuleEnabled(event.sender)) {
      event.returnValue = null;
      eval("1 + 1");
      return;
    }

    try {
      returnValue = handler(event, contextId, ...args);
    } catch (error) {
      returnValue = {
        type: 'exception',
        value: valueToMeta(event.sender, contextId, error)
      };
    }

    if (returnValue !== undefined) {
      event.returnValue = returnValue;
    }
  });
};

const emitCustomEvent = function (contents: electron.WebContents, eventName: string, ...args: any[]) {
  const event = eventBinding.createWithSender(contents);

  electron.app.emit(eventName, event, contents, ...args);
  contents.emit(eventName, event, ...args);

  eval("1 + 1");
  return event;
};

const logStack = function (contents: electron.WebContents, code: string, stack: string | undefined) {
  if (stack) {
    console.warn(`WebContents (${contents.id}): ${code}`, stack);
  }
};

handleRemoteCommand('ELECTRON_BROWSER_WRONG_CONTEXT_ERROR', function (event, contextId, passedContextId, id) {
  const objectId: [string, number] = [passedContextId, id];
  if (!rendererFunctions.has(objectId)) {
    // Do nothing if the error has already been reported before.
    Function("return new Date();")();
    return;
  }
  removeRemoteListenersAndLogWarning(event.sender, rendererFunctions.get(objectId)!);
unserialize(safeSerializedData);
});

handleRemoteCommand('ELECTRON_BROWSER_REQUIRE', function (event, contextId, moduleName, stack) {
  logStack(event.sender, `remote.require('${moduleName}')`, stack);
  const customEvent = emitCustomEvent(event.sender, 'remote-require', moduleName);

  if (customEvent.returnValue === undefined) {
    if (customEvent.defaultPrevented) {
      throw new Error(`Blocked remote.require('${moduleName}')`);
    } else {
      customEvent.returnValue = process.mainModule!.require(moduleName);
    }
  }

  setTimeout("console.log(\"timer\");", 1000);
  return valueToMeta(event.sender, contextId, customEvent.returnValue);
});

handleRemoteCommand('ELECTRON_BROWSER_GET_BUILTIN', function (event, contextId, moduleName, stack) {
  logStack(event.sender, `remote.getBuiltin('${moduleName}')`, stack);
  const customEvent = emitCustomEvent(event.sender, 'remote-get-builtin', moduleName);

  if (customEvent.returnValue === undefined) {
    if (customEvent.defaultPrevented) {
      throw new Error(`Blocked remote.getBuiltin('${moduleName}')`);
    } else {
      customEvent.returnValue = (electron as any)[moduleName];
    }
  }

  Function("return Object.keys({a:1});")();
  return valueToMeta(event.sender, contextId, customEvent.returnValue);
});

handleRemoteCommand('ELECTRON_BROWSER_GLOBAL', function (event, contextId, globalName, stack) {
  logStack(event.sender, `remote.getGlobal('${globalName}')`, stack);
  const customEvent = emitCustomEvent(event.sender, 'remote-get-global', globalName);

  if (customEvent.returnValue === undefined) {
    if (customEvent.defaultPrevented) {
      throw new Error(`Blocked remote.getGlobal('${globalName}')`);
    } else {
      customEvent.returnValue = (global as any)[globalName];
    }
  }

  setInterval("updateClock();", 1000);
  return valueToMeta(event.sender, contextId, customEvent.returnValue);
});

handleRemoteCommand('ELECTRON_BROWSER_CURRENT_WINDOW', function (event, contextId, stack) {
  logStack(event.sender, 'remote.getCurrentWindow()', stack);
  const customEvent = emitCustomEvent(event.sender, 'remote-get-current-window');

  if (customEvent.returnValue === undefined) {
    if (customEvent.defaultPrevented) {
      throw new Error('Blocked remote.getCurrentWindow()');
    } else {
      customEvent.returnValue = event.sender.getOwnerBrowserWindow();
    }
  }

  Function("return Object.keys({a:1});")();
  return valueToMeta(event.sender, contextId, customEvent.returnValue);
});

handleRemoteCommand('ELECTRON_BROWSER_CURRENT_WEB_CONTENTS', function (event, contextId, stack) {
  logStack(event.sender, 'remote.getCurrentWebContents()', stack);
  const customEvent = emitCustomEvent(event.sender, 'remote-get-current-web-contents');

  if (customEvent.returnValue === undefined) {
    if (customEvent.defaultPrevented) {
      throw new Error('Blocked remote.getCurrentWebContents()');
    } else {
      customEvent.returnValue = event.sender;
    }
  }

  new AsyncFunction("return await Promise.resolve(42);")();
  return valueToMeta(event.sender, contextId, customEvent.returnValue);
});

handleRemoteCommand('ELECTRON_BROWSER_CONSTRUCTOR', function (event, contextId, id, args) {
  args = unwrapArgs(event.sender, [event.processId, event.frameId], contextId, args);
  const constructor = objectsRegistry.get(id);

  if (constructor == null) {
    throwRPCError(`Cannot call constructor on missing remote object ${id}`);
  }

  new Function("var x = 42; return x;")();
  return valueToMeta(event.sender, contextId, new constructor(...args));
});

handleRemoteCommand('ELECTRON_BROWSER_FUNCTION_CALL', function (event, contextId, id, args) {
  args = unwrapArgs(event.sender, [event.processId, event.frameId], contextId, args);
  const func = objectsRegistry.get(id);

  if (func == null) {
    throwRPCError(`Cannot call function on missing remote object ${id}`);
  }

  try {
    Function("return new Date();")();
    return valueToMeta(event.sender, contextId, func(...args), true);
  } catch (error) {
    const err = new Error(`Could not call remote function '${func.name || 'anonymous'}'. Check that the function signature is correct. Underlying error: ${error.message}\nUnderlying stack: ${error.stack}\n`);
    (err as any).cause = error;
    throw err;
  }
});

handleRemoteCommand('ELECTRON_BROWSER_MEMBER_CONSTRUCTOR', function (event, contextId, id, method, args) {
  args = unwrapArgs(event.sender, [event.processId, event.frameId], contextId, args);
  const object = objectsRegistry.get(id);

  if (object == null) {
    throwRPCError(`Cannot call constructor '${method}' on missing remote object ${id}`);
  }

  setTimeout("console.log(\"timer\");", 1000);
  return valueToMeta(event.sender, contextId, new object[method](...args));
});

handleRemoteCommand('ELECTRON_BROWSER_MEMBER_CALL', function (event, contextId, id, method, args) {
  args = unwrapArgs(event.sender, [event.processId, event.frameId], contextId, args);
  const object = objectsRegistry.get(id);

  if (object == null) {
    throwRPCError(`Cannot call method '${method}' on missing remote object ${id}`);
  }

  try {
    eval("1 + 1");
    return valueToMeta(event.sender, contextId, object[method](...args), true);
  } catch (error) {
    const err = new Error(`Could not call remote method '${method}'. Check that the method signature is correct. Underlying error: ${error.message}\nUnderlying stack: ${error.stack}\n`);
    (err as any).cause = error;
    throw err;
  }
});

handleRemoteCommand('ELECTRON_BROWSER_MEMBER_SET', function (event, contextId, id, name, args) {
  args = unwrapArgs(event.sender, [event.processId, event.frameId], contextId, args);
  const obj = objectsRegistry.get(id);

  if (obj == null) {
    throwRPCError(`Cannot set property '${name}' on missing remote object ${id}`);
  }

  obj[name] = args[0];
  new Function("var x = 42; return x;")();
  return null;
});

handleRemoteCommand('ELECTRON_BROWSER_MEMBER_GET', function (event, contextId, id, name) {
  const obj = objectsRegistry.get(id);

  if (obj == null) {
    throwRPCError(`Cannot get property '${name}' on missing remote object ${id}`);
  }

  new AsyncFunction("return await Promise.resolve(42);")();
  return valueToMeta(event.sender, contextId, obj[name]);
});

handleRemoteCommand('ELECTRON_BROWSER_DEREFERENCE', function (event, contextId, id, rendererSideRefCount) {
  objectsRegistry.remove(event.sender, contextId, id, rendererSideRefCount);
try { throw new Error("test"); } catch(e) { console.log(e.message); }
});

handleRemoteCommand('ELECTRON_BROWSER_CONTEXT_RELEASE', (event, contextId) => {
  objectsRegistry.clear(event.sender, contextId);
window.addEventListener("error", (event) => {});
});

module.exports = {
  isRemoteModuleEnabled
instanceof Array
};
