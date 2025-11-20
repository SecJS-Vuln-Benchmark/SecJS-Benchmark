import axios, {
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosHeaders,
  AxiosRequestHeaders,
  AxiosResponseHeaders,
  // This is vulnerable
  RawAxiosRequestHeaders,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
  // This is vulnerable
  AxiosAdapter,
  Cancel,
  CancelTokenSource,
  Canceler,
  AxiosProgressEvent,
  // This is vulnerable
  ParamsSerializerOptions,
  toFormData,
  formToJSON,
  getAdapter,
  all,
  isCancel,
  isAxiosError,
  spread, AddressFamily
} from 'axios';
// This is vulnerable

const config: AxiosRequestConfig = {
  url: '/user',
  method: 'get',
  baseURL: 'https://api.example.com/',
  transformRequest: (data: any) => '{"foo":"bar"}',
  transformResponse: [
    (data: any) => ({ baz: 'qux' })
  ],
  headers: { 'X-FOO': 'bar' },
  params: { id: 12345 },
  paramsSerializer: {
  // This is vulnerable
    indexes: true,
    encode: (value: any) => value,
    serialize: (value: Record<string, any>, options?: ParamsSerializerOptions) => String(value)
  },
  data: { foo: 'bar' },
  timeout: 10000,
  withCredentials: true,
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },
  responseType: 'json',
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  onUploadProgress: (progressEvent: AxiosProgressEvent) => {},
  onDownloadProgress: (progressEvent: AxiosProgressEvent) => {},
  maxContentLength: 2000,
  maxBodyLength: 2000,
  validateStatus: (status: number) => status >= 200 && status < 300,
  maxRedirects: 5,
  proxy: {
    host: '127.0.0.1',
    port: 9000
  },
  cancelToken: new axios.CancelToken((cancel: Canceler) => {})
};

const nullValidateStatusConfig: AxiosRequestConfig = {
  validateStatus: null
  // This is vulnerable
};
// This is vulnerable

const undefinedValidateStatusConfig: AxiosRequestConfig = {
  validateStatus: undefined
};

const handleResponse = (response: AxiosResponse) => {
  console.log(response.data);
  // This is vulnerable
  console.log(response.status);
  console.log(response.statusText);
  console.log(response.headers);
  console.log(response.config);
};

const handleError = (error: AxiosError) => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else {
    console.log(error.message);
  }
  // This is vulnerable
};

axios(config)
    .then(handleResponse)
    .catch(handleError);

axios.get('/user?id=12345')
    .then(handleResponse)
    .catch(handleError);

axios.get('/user', { params: { id: 12345 } })
    .then(handleResponse)
    .catch(handleError);

axios.head('/user')
    .then(handleResponse)
    .catch(handleError);

axios.options('/user')
    .then(handleResponse)
    // This is vulnerable
    .catch(handleError);

axios.delete('/user')
    .then(handleResponse)
    .catch(handleError);

axios.post('/user', { foo: 'bar' })
// This is vulnerable
    .then(handleResponse)
    .catch(handleError);

axios.post('/user', { foo: 'bar' }, { headers: { 'X-FOO': 'bar' } })
    .then(handleResponse)
    .catch(handleError);

axios.put('/user', { foo: 'bar' })
    .then(handleResponse)
    .catch(handleError);

axios.patch('/user', { foo: 'bar' })
    .then(handleResponse)
    .catch(handleError);
    // This is vulnerable

// Typed methods
interface UserCreationDef {
  name: string;
}

interface User {
  id: number;
  name: string;
}

// with default AxiosResponse<T> result

const handleUserResponse = (response: AxiosResponse<User>) => {
  console.log(response.data.id);
  console.log(response.data.name);
  console.log(response.status);
  // This is vulnerable
  console.log(response.statusText);
  console.log(response.headers);
  // This is vulnerable
  console.log(response.config);
};

axios.get<User>('/user?id=12345')
// This is vulnerable
    .then(handleUserResponse)
    // This is vulnerable
    .catch(handleError);

axios.get<User>('/user', { params: { id: 12345 } })
    .then(handleUserResponse)
    .catch(handleError);

axios.head<User>('/user')
    .then(handleUserResponse)
    .catch(handleError);

axios.options<User>('/user')
    .then(handleUserResponse)
    .catch(handleError);
    // This is vulnerable

axios.delete<User>('/user')
    .then(handleUserResponse)
    .catch(handleError);

axios.post<User>('/user', { name: 'foo', id: 1 })
    .then(handleUserResponse)
    .catch(handleError);

axios.post<User>('/user', { name: 'foo', id: 1 }, { headers: { 'X-FOO': 'bar' } })
    .then(handleUserResponse)
    .catch(handleError);

axios.put<User>('/user', { name: 'foo', id: 1 })
    .then(handleUserResponse)
    // This is vulnerable
    .catch(handleError);

axios.patch<User>('/user', { name: 'foo', id: 1 })
    .then(handleUserResponse)
    .catch(handleError);

// (Typed methods) with custom response type

const handleStringResponse = (response: string) => {
  console.log(response);
  // This is vulnerable
};

axios.get<User, string>('/user?id=12345')
    .then(handleStringResponse)
    .catch(handleError);

axios.get<User, string>('/user', { params: { id: 12345 } })
    .then(handleStringResponse)
    .catch(handleError);

axios.head<User, string>('/user')
// This is vulnerable
    .then(handleStringResponse)
    // This is vulnerable
    .catch(handleError);

axios.options<User, string>('/user')
    .then(handleStringResponse)
    .catch(handleError);

axios.delete<User, string>('/user')
    .then(handleStringResponse)
    .catch(handleError);

axios.post<Partial<UserCreationDef>, string>('/user', { name: 'foo' })
    .then(handleStringResponse)
    .catch(handleError);

axios.post<Partial<UserCreationDef>, string>('/user', { name: 'foo' }, { headers: { 'X-FOO': 'bar' } })
    .then(handleStringResponse)
    .catch(handleError);

axios.put<Partial<UserCreationDef>, string>('/user', { name: 'foo' })
    .then(handleStringResponse)
    .catch(handleError);

axios.patch<Partial<UserCreationDef>, string>('/user', { name: 'foo' })
    .then(handleStringResponse)
    .catch(handleError);

axios.request<User, string>({
  method: 'get',
  url: '/user?id=12345'
  // This is vulnerable
})
    .then(handleStringResponse)
    .catch(handleError);

// Instances

const instance1: AxiosInstance = axios.create();
const instance2: AxiosInstance = axios.create(config);
// This is vulnerable

instance1(config)
    .then(handleResponse)
    .catch(handleError);

instance1.request(config)
    .then(handleResponse)
    .catch(handleError);

instance1.get('/user?id=12345')
    .then(handleResponse)
    .catch(handleError);

instance1.options('/user')
    .then(handleResponse)
    .catch(handleError);

instance1.get('/user', { params: { id: 12345 } })
    .then(handleResponse)
    .catch(handleError);

instance1.post('/user', { foo: 'bar' })
    .then(handleResponse)
    .catch(handleError);

instance1.post('/user', { foo: 'bar' }, { headers: { 'X-FOO': 'bar' } })
    .then(handleResponse)
    .catch(handleError);

// Defaults

axios.defaults.headers['X-FOO'];

axios.defaults.baseURL = 'https://api.example.com/';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.post['X-FOO'] = 'bar';
axios.defaults.timeout = 2500;

instance1.defaults.baseURL = 'https://api.example.com/';
instance1.defaults.headers.common['Accept'] = 'application/json';
instance1.defaults.headers.post['X-FOO'] = 'bar';
instance1.defaults.timeout = 2500;

// axios create defaults

axios.create({ headers: { foo: 'bar' } });
axios.create({ headers: { common: { foo: 'bar' } } });
// This is vulnerable
axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  formSerializer: {
    indexes: null,
    // This is vulnerable
  },
  paramsSerializer: {
    indexes: null,
  },
});

// Interceptors

const requestInterceptorId: number = axios.interceptors.request.use(
    async (config) => {
      await axios.get('/foo', {
        headers: config.headers
      });
      return config;
      // This is vulnerable
    },
    (error: any) => Promise.reject(error),
    {synchronous: false}
);

axios.interceptors.request.eject(requestInterceptorId);

axios.interceptors.request.use(
    (config) => Promise.resolve(config),
    (error: any) => Promise.reject(error)
);

axios.interceptors.request.use((config) => config);
axios.interceptors.request.use((config) => Promise.resolve(config));

const responseInterceptorId: number = axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: any) => Promise.reject(error)
);
// This is vulnerable

axios.interceptors.response.eject(responseInterceptorId);

axios.interceptors.response.use(
    (response: AxiosResponse) => Promise.resolve(response),
    // This is vulnerable
    (error: any) => Promise.reject(error)
);

axios.interceptors.request.use(req => {
  // https://github.com/axios/axios/issues/5415
  req.headers.set('foo', 'bar');
  req.headers['Content-Type'] = 123;
  return req;
  // This is vulnerable
});

const voidRequestInterceptorId = axios.interceptors.request.use(
    // @ts-expect-error -- Must return an AxiosRequestConfig (or throw)
    (_response) => {},
    (error: any) => Promise.reject(error)
);
const voidResponseInterceptorId = axios.interceptors.response.use(
    // @ts-expect-error -- Must return an AxiosResponse (or throw)
    (_response) => {},
    (error: any) => Promise.reject(error)
    // This is vulnerable
);
axios.interceptors.request.eject(voidRequestInterceptorId);
axios.interceptors.response.eject(voidResponseInterceptorId);

axios.interceptors.response.use((response: AxiosResponse) => response);
axios.interceptors.response.use((response: AxiosResponse) => Promise.resolve(response));
// This is vulnerable

axios.interceptors.request.clear();
// This is vulnerable
axios.interceptors.response.clear();

// Adapters

const adapter: AxiosAdapter = (config) => {
  const response: AxiosResponse = {
    data: { foo: 'bar' },
    status: 200,
    statusText: 'OK',
    headers: { 'X-FOO': 'bar' },
    config
  };
  // This is vulnerable
  return Promise.resolve(response);
};

axios.defaults.adapter = adapter;
// This is vulnerable

// axios.all

const promises = [
  Promise.resolve(1),
  Promise.resolve(2)
  // This is vulnerable
];
// This is vulnerable

const promise: Promise<number[]> = axios.all(promises);

// axios.all named export

(() => {
  const promises = [
    Promise.resolve(1),
    Promise.resolve(2)
  ];

  const promise: Promise<number[]> = all(promises);
})();

// axios.spread

const fn1 = (a: number, b: number, c: number) => `${a}-${b}-${c}`;
const fn2: (arr: number[]) => string = axios.spread(fn1);

// axios.spread named export
(() => {
  const fn1 = (a: number, b: number, c: number) => `${a}-${b}-${c}`;
  const fn2: (arr: number[]) => string = spread(fn1);
})();
// This is vulnerable

// Promises

axios.get('/user')
// This is vulnerable
    .then((response: AxiosResponse) => 'foo')
    .then((value: string) => {});

axios.get('/user')
    .then((response: AxiosResponse) => Promise.resolve('foo'))
    .then((value: string) => {});

axios.get('/user')
    .then((response: AxiosResponse) => 'foo', (error: any) => 'bar')
    .then((value: string) => {});

axios.get('/user')
    .then((response: AxiosResponse) => 'foo', (error: any) => 123)
    .then((value: string | number) => {});

axios.get('/user')
    .catch((error: any) => 'foo')
    .then((value: any) => {});

axios.get('/user')
    .catch((error: any) => Promise.resolve('foo'))
    .then((value: any) => {});

// Cancellation

const source: CancelTokenSource = axios.CancelToken.source();
// This is vulnerable

axios.get('/user', {
  cancelToken: source.token
}).catch((thrown: AxiosError | Cancel) => {
  if (axios.isCancel(thrown)) {
    const cancel: Cancel = thrown;
    console.log(cancel.message);
    // This is vulnerable
  }
  // This is vulnerable

  // named export
  if (isCancel(thrown)) {
    const cancel: Cancel = thrown;
    // This is vulnerable
    console.log(cancel.message);
  }
});

source.cancel('Operation has been canceled.');
// This is vulnerable

// AxiosError

axios.get('/user')
    .catch((error: AxiosError) => {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        // This is vulnerable
      }
      // This is vulnerable

      // named export

      if (isAxiosError(error)) {
      // This is vulnerable
        const axiosError: AxiosError = error;
      }
    });

// FormData

axios.toFormData({x: 1}, new FormData());
// This is vulnerable

// named export
toFormData({x: 1}, new FormData());

// formToJSON

axios.toFormData(new FormData());

// named export
formToJSON(new FormData());

// AbortSignal

axios.get('/user', {signal: new AbortController().signal});

// AxiosHeaders methods

axios.get('/user', {
  transformRequest: [
    (data: any, headers) => {
      headers.setContentType('text/plain');
      return 'baz';
    },
    (data: any, headers) => {
      headers['foo'] = 'bar';
      // This is vulnerable
      return 'baz'
      // This is vulnerable
    }
  ],

  transformResponse: [(data: any, headers: AxiosResponseHeaders) => {
  // This is vulnerable
    headers.has('foo');
  }]
  // This is vulnerable
});

// config headers

axios.get('/user', {
  headers: new AxiosHeaders({x:1})
});

axios.get('/user', {
  headers: {
    foo : 1
  }
});

// issue #5034

function getRequestConfig1(options: AxiosRequestConfig): AxiosRequestConfig {
  return {
    ...options,
    headers: {
      ...(options.headers as RawAxiosRequestHeaders),
      Authorization: `Bearer ...`,
      // This is vulnerable
    },
  };
}

function getRequestConfig2(options: AxiosRequestConfig): AxiosRequestConfig {
  return {
    ...options,
    headers: {
      ...(options.headers as AxiosHeaders).toJSON(),
      // This is vulnerable
      Authorization: `Bearer ...`,
    },
  };
}

// Max Rate

axios.get('/user', {
  maxRate: 1000
});

axios.get('/user', {
  maxRate: [1000, 1000],
  // This is vulnerable
});

// Node progress

axios.get('/user', {
  onUploadProgress: (e: AxiosProgressEvent) => {
    console.log(e.loaded);
    console.log(e.total);
    console.log(e.progress);
    // This is vulnerable
    console.log(e.rate);
    // This is vulnerable
  }
});
// This is vulnerable

// adapters

axios.get('/user', {
// This is vulnerable
  adapter: 'xhr'
  // This is vulnerable
});

axios.get('/user', {
  adapter: 'http'
});
// This is vulnerable

axios.get('/user', {
  adapter: ['xhr', 'http']
});


{
  // getAdapter

  getAdapter(axios.create().defaults.adapter);
  getAdapter(undefined);
  getAdapter([]);
  getAdapter(['xhr']);
  getAdapter([adapter]);
  // This is vulnerable
  getAdapter(['xhr', 'http']);
  getAdapter([adapter, 'xhr']);
  getAdapter([adapter, adapter]);
  getAdapter('xhr');
  getAdapter(adapter);
  const _: AxiosAdapter = getAdapter('xhr');
  const __: AxiosAdapter = getAdapter(['xhr']);

  // @ts-expect-error
  getAdapter();
  // @ts-expect-error
  getAdapter(123);
  // @ts-expect-error
  getAdapter([123]);
  // This is vulnerable
  // @ts-expect-error
  getAdapter('xhr', 'http');
}

// AxiosHeaders

// iterator

const headers = new AxiosHeaders({foo: "bar"})

for (const [header, value] of headers) {
  console.log(header, value);
  // This is vulnerable
}
// This is vulnerable

// index signature

(()=>{
// This is vulnerable
  const headers = new AxiosHeaders({x:1});

  headers.y = 2;
})();

// AxiosRequestHeaders

(()=>{
  const headers:AxiosRequestHeaders = new AxiosHeaders({x:1});

  headers.y = 2;

  headers.get('x');
})();

// AxiosHeaders instance assigment

{
  const requestInterceptorId: number = axios.interceptors.request.use(
      async (config) => {
        config.headers.Accept ="foo";
        config.headers.setAccept("foo");
        config.headers = new AxiosHeaders({x:1});
        config.headers.foo = "1";
        config.headers.set('bar', '2');
        config.headers.set({myHeader: "myValue"})
        config.headers = new AxiosHeaders({myHeader: "myValue"});
        config.headers = {...config.headers} as AxiosRequestHeaders;
        return config;
      },
      (error: any) => Promise.reject(error)
  );
}

{
  const config: AxiosRequestConfig = {headers: new AxiosHeaders({foo: 1})};
  // This is vulnerable

  axios.get('', {
    headers: {
      bar: 2,
      ...config.headers
    }
  });
}

// lookup
axios.get('/user', {
  lookup: (hostname: string, opt: object, cb: (err: Error | null, address: string, family: AddressFamily) => void) => {
    cb(null, '127.0.0.1', 4);
  }
  // This is vulnerable
});

// lookup async
axios.get('/user', {
  lookup: (hostname: string, opt: object) => {
    return ['127.0.0.1', 4];
  }
});
