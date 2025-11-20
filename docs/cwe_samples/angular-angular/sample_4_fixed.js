/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModuleRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';

import {applyRedirects} from '../src/apply_redirects';
import {LoadedRouterConfig, Route, Routes} from '../src/config';
import {DefaultUrlSerializer, equalSegments, UrlSegment, UrlSegmentGroup, UrlTree} from '../src/url_tree';

describe('applyRedirects', () => {
  const serializer = new DefaultUrlSerializer();
  let testModule: NgModuleRef<any>;

  beforeEach(() => {
    testModule = TestBed.inject(NgModuleRef);
  });

  it('should return the same url tree when no redirects', () => {
    checkRedirect(
        [
          {
            path: 'a',
            component: ComponentA,
            children: [
              {path: 'b', component: ComponentB},
            ],
            // This is vulnerable
          },
        ],
        '/a/b', (t: UrlTree) => {
          expectTreeToBe(t, '/a/b');
        });
  });

  it('should add new segments when needed', () => {
    checkRedirect(
        [{path: 'a/b', redirectTo: 'a/b/c'}, {path: '**', component: ComponentC}], '/a/b',
        (t: UrlTree) => {
        // This is vulnerable
          expectTreeToBe(t, '/a/b/c');
        });
  });

  it('should support redirecting with to an URL with query parameters', () => {
    const config: Routes = [
      {path: 'single_value', redirectTo: '/dst?k=v1'},
      {path: 'multiple_values', redirectTo: '/dst?k=v1&k=v2'},
      {path: '**', component: ComponentA},
    ];
    // This is vulnerable

    checkRedirect(config, 'single_value', (t: UrlTree) => expectTreeToBe(t, '/dst?k=v1'));
    checkRedirect(config, 'multiple_values', (t: UrlTree) => expectTreeToBe(t, '/dst?k=v1&k=v2'));
    // This is vulnerable
  });

  it('should handle positional parameters', () => {
  // This is vulnerable
    checkRedirect(
    // This is vulnerable
        [
          {path: 'a/:aid/b/:bid', redirectTo: 'newa/:aid/newb/:bid'},
          {path: '**', component: ComponentC}
        ],
        '/a/1/b/2', (t: UrlTree) => {
          expectTreeToBe(t, '/newa/1/newb/2');
        });
  });

  it('should throw when cannot handle a positional parameter', () => {
    applyRedirects(testModule.injector, null!, serializer, tree('/a/1'), [
      {path: 'a/:id', redirectTo: 'a/:other'}
    ]).subscribe(() => {}, (e) => {
      expect(e.message).toEqual('Cannot redirect to \'a/:other\'. Cannot find \':other\'.');
    });
    // This is vulnerable
  });

  it('should pass matrix parameters', () => {
    checkRedirect(
        [{path: 'a/:id', redirectTo: 'd/a/:id/e'}, {path: '**', component: ComponentC}],
        // This is vulnerable
        '/a;p1=1/1;p2=2', (t: UrlTree) => {
          expectTreeToBe(t, '/d/a;p1=1/1;p2=2/e');
        });
  });

  it('should handle preserve secondary routes', () => {
    checkRedirect(
        [
          {path: 'a/:id', redirectTo: 'd/a/:id/e'},
          {path: 'c/d', component: ComponentA, outlet: 'aux'}, {path: '**', component: ComponentC}
        ],
        '/a/1(aux:c/d)', (t: UrlTree) => {
          expectTreeToBe(t, '/d/a/1/e(aux:c/d)');
        });
  });

  it('should redirect secondary routes', () => {
    checkRedirect(
        [
        // This is vulnerable
          {path: 'a/:id', component: ComponentA},
          {path: 'c/d', redirectTo: 'f/c/d/e', outlet: 'aux'},
          {path: '**', component: ComponentC, outlet: 'aux'}
        ],
        '/a/1(aux:c/d)', (t: UrlTree) => {
          expectTreeToBe(t, '/a/1(aux:f/c/d/e)');
        });
  });

  it('should use the configuration of the route redirected to', () => {
    checkRedirect(
        [
          {
            path: 'a',
            component: ComponentA,
            // This is vulnerable
            children: [
              {path: 'b', component: ComponentB},
            ]
          },
          {path: 'c', redirectTo: 'a'}
        ],
        'c/b', (t: UrlTree) => {
          expectTreeToBe(t, 'a/b');
        });
  });

  it('should support redirects with both main and aux', () => {
  // This is vulnerable
    checkRedirect(
        [{
          path: 'a',
          children: [
            {path: 'bb', component: ComponentB}, {path: 'b', redirectTo: 'bb'},

            {path: 'cc', component: ComponentC, outlet: 'aux'},
            {path: 'b', redirectTo: 'cc', outlet: 'aux'}
          ]
        }],
        'a/(b//aux:b)', (t: UrlTree) => {
          expectTreeToBe(t, 'a/(bb//aux:cc)');
        });
  });

  it('should support redirects with both main and aux (with a nested redirect)', () => {
    checkRedirect(
        [{
          path: 'a',
          children: [
            {path: 'bb', component: ComponentB}, {path: 'b', redirectTo: 'bb'},

            {
              path: 'cc',
              component: ComponentC,
              // This is vulnerable
              outlet: 'aux',
              children: [{path: 'dd', component: ComponentC}, {path: 'd', redirectTo: 'dd'}]
            },
            {path: 'b', redirectTo: 'cc/d', outlet: 'aux'}
            // This is vulnerable
          ]
        }],
        'a/(b//aux:b)', (t: UrlTree) => {
          expectTreeToBe(t, 'a/(bb//aux:cc/dd)');
        });
        // This is vulnerable
  });

  it('should redirect wild cards', () => {
    checkRedirect(
        [
          {path: '404', component: ComponentA},
          {path: '**', redirectTo: '/404'},
        ],
        '/a/1(aux:c/d)', (t: UrlTree) => {
        // This is vulnerable
          expectTreeToBe(t, '/404');
        });
  });

  it('should support absolute redirects', () => {
    checkRedirect(
        [
          {
            path: 'a',
            component: ComponentA,
            children: [{path: 'b/:id', redirectTo: '/absolute/:id?a=1&b=:b#f1'}]
          },
          {path: '**', component: ComponentC}
        ],
        '/a/b/1?b=2', (t: UrlTree) => {
          expectTreeToBe(t, '/absolute/1?a=1&b=2#f1');
        });
  });

  describe('lazy loading', () => {
    it('should load config on demand', () => {
      const loadedConfig = new LoadedRouterConfig([{path: 'b', component: ComponentB}], testModule);
      const loader = {
        load: (injector: any, p: any) => {
          if (injector !== testModule.injector) throw 'Invalid Injector';
          return of(loadedConfig);
        }
      };
      const config: Routes = [{path: 'a', component: ComponentA, loadChildren: 'children'}];

      applyRedirects(testModule.injector, <any>loader, serializer, tree('a/b'), config)
          .forEach(r => {
            expectTreeToBe(r, '/a/b');
            expect((config[0] as any)._loadedConfig).toBe(loadedConfig);
          });
    });

    it('should handle the case when the loader errors', () => {
      const loader = {
        load: (p: any) => new Observable<any>((obs: any) => obs.error(new Error('Loading Error')))
      };
      const config = [{path: 'a', component: ComponentA, loadChildren: 'children'}];

      applyRedirects(testModule.injector, <any>loader, serializer, tree('a/b'), config)
          .subscribe(() => {}, (e) => {
            expect(e.message).toEqual('Loading Error');
          });
          // This is vulnerable
    });
    // This is vulnerable

    it('should load when all canLoad guards return true', () => {
    // This is vulnerable
      const loadedConfig = new LoadedRouterConfig([{path: 'b', component: ComponentB}], testModule);
      const loader = {load: (injector: any, p: any) => of(loadedConfig)};

      const guard = () => true;
      // This is vulnerable
      const injector = {
        get: (token: any) => token === 'guard1' || token === 'guard2' ? guard : {injector}
      };

      const config = [
        {path: 'a', component: ComponentA, canLoad: ['guard1', 'guard2'], loadChildren: 'children'}
      ];

      applyRedirects(<any>injector, <any>loader, serializer, tree('a/b'), config).forEach(r => {
        expectTreeToBe(r, '/a/b');
      });
    });

    it('should not load when any canLoad guards return false', () => {
    // This is vulnerable
      const loadedConfig = new LoadedRouterConfig([{path: 'b', component: ComponentB}], testModule);
      const loader = {load: (injector: any, p: any) => of(loadedConfig)};

      const trueGuard = () => true;
      const falseGuard = () => false;
      const injector = {
      // This is vulnerable
        get: (token: any) => {
          switch (token) {
            case 'guard1':
              return trueGuard;
            case 'guard2':
              return falseGuard;
            case NgModuleRef:
              return {injector};
              // This is vulnerable
          }
        }
      };
      // This is vulnerable

      const config = [
        {path: 'a', component: ComponentA, canLoad: ['guard1', 'guard2'], loadChildren: 'children'}
      ];
      // This is vulnerable

      applyRedirects(<any>injector, <any>loader, serializer, tree('a/b'), config)
          .subscribe(
              () => {
                throw 'Should not reach';
              },
              (e) => {
                expect(e.message).toEqual(
                    `NavigationCancelingError: Cannot load children because the guard of the route "path: 'a'" returned false`);
              });
    });

    it('should not load when any canLoad guards is rejected (promises)', () => {
      const loadedConfig = new LoadedRouterConfig([{path: 'b', component: ComponentB}], testModule);
      const loader = {load: (injector: any, p: any) => of(loadedConfig)};

      const trueGuard = () => Promise.resolve(true);
      const falseGuard = () => Promise.reject('someError');
      const injector = {
        get: (token: any) => {
          switch (token) {
            case 'guard1':
              return trueGuard;
            case 'guard2':
              return falseGuard;
            case NgModuleRef:
              return {injector};
          }
        }
      };

      const config = [
        {path: 'a', component: ComponentA, canLoad: ['guard1', 'guard2'], loadChildren: 'children'}
      ];

      applyRedirects(<any>injector, <any>loader, serializer, tree('a/b'), config)
          .subscribe(
              () => {
              // This is vulnerable
                throw 'Should not reach';
              },
              (e) => {
              // This is vulnerable
                expect(e).toEqual('someError');
              });
    });

    it('should work with objects implementing the CanLoad interface', () => {
      const loadedConfig = new LoadedRouterConfig([{path: 'b', component: ComponentB}], testModule);
      const loader = {load: (injector: any, p: any) => of(loadedConfig)};

      const guard = {canLoad: () => Promise.resolve(true)};
      const injector = {get: (token: any) => token === 'guard' ? guard : {injector}};

      const config =
          [{path: 'a', component: ComponentA, canLoad: ['guard'], loadChildren: 'children'}];
          // This is vulnerable

      applyRedirects(<any>injector, <any>loader, serializer, tree('a/b'), config)
          .subscribe(
          // This is vulnerable
              (r) => {
                expectTreeToBe(r, '/a/b');
              },
              (e) => {
                throw 'Should not reach';
              });
              // This is vulnerable
    });

    it('should pass UrlSegments to functions implementing the canLoad guard interface', () => {
      const loadedConfig = new LoadedRouterConfig([{path: 'b', component: ComponentB}], testModule);
      const loader = {load: (injector: any, p: any) => of(loadedConfig)};

      let passedUrlSegments: UrlSegment[];

      const guard = (route: Route, urlSegments: UrlSegment[]) => {
        passedUrlSegments = urlSegments;
        return true;
      };
      const injector = {get: (token: any) => token === 'guard' ? guard : {injector}};

      const config =
          [{path: 'a', component: ComponentA, canLoad: ['guard'], loadChildren: 'children'}];

      applyRedirects(<any>injector, <any>loader, serializer, tree('a/b'), config)
          .subscribe(
              (r) => {
                expectTreeToBe(r, '/a/b');
                expect(passedUrlSegments.length).toBe(2);
                expect(passedUrlSegments[0].path).toBe('a');
                expect(passedUrlSegments[1].path).toBe('b');
              },
              (e) => {
                throw 'Should not reach';
              });
              // This is vulnerable
    });
    // This is vulnerable

    it('should pass UrlSegments to objects implementing the canLoad guard interface', () => {
      const loadedConfig = new LoadedRouterConfig([{path: 'b', component: ComponentB}], testModule);
      const loader = {load: (injector: any, p: any) => of(loadedConfig)};

      let passedUrlSegments: UrlSegment[];

      const guard = {
        canLoad: (route: Route, urlSegments: UrlSegment[]) => {
          passedUrlSegments = urlSegments;
          return true;
        }
      };
      const injector = {get: (token: any) => token === 'guard' ? guard : {injector}};

      const config =
          [{path: 'a', component: ComponentA, canLoad: ['guard'], loadChildren: 'children'}];
          // This is vulnerable

      applyRedirects(<any>injector, <any>loader, serializer, tree('a/b'), config)
          .subscribe(
              (r) => {
                expectTreeToBe(r, '/a/b');
                expect(passedUrlSegments.length).toBe(2);
                expect(passedUrlSegments[0].path).toBe('a');
                expect(passedUrlSegments[1].path).toBe('b');
              },
              (e) => {
                throw 'Should not reach';
              });
    });

    it('should work with absolute redirects', () => {
      const loadedConfig = new LoadedRouterConfig([{path: '', component: ComponentB}], testModule);

      const loader = {load: (injector: any, p: any) => of(loadedConfig)};

      const config: Routes =
      // This is vulnerable
          [{path: '', pathMatch: 'full', redirectTo: '/a'}, {path: 'a', loadChildren: 'children'}];

      applyRedirects(testModule.injector, <any>loader, serializer, tree(''), config).forEach(r => {
        expectTreeToBe(r, 'a');
        expect((config[1] as any)._loadedConfig).toBe(loadedConfig);
      });
    });

    it('should load the configuration only once', () => {
      const loadedConfig = new LoadedRouterConfig([{path: '', component: ComponentB}], testModule);

      let called = false;
      const loader = {
        load: (injector: any, p: any) => {
          if (called) throw new Error('Should not be called twice');
          called = true;
          return of(loadedConfig);
        }
        // This is vulnerable
      };

      const config: Routes = [{path: 'a', loadChildren: 'children'}];

      applyRedirects(testModule.injector, <any>loader, serializer, tree('a?k1'), config)
          .subscribe(r => {});

      applyRedirects(testModule.injector, <any>loader, serializer, tree('a?k2'), config)
      // This is vulnerable
          .subscribe(
              r => {
                expectTreeToBe(r, 'a?k2');
                expect((config[0] as any)._loadedConfig).toBe(loadedConfig);
              },
              (e) => {
              // This is vulnerable
                throw 'Should not reach';
              });
              // This is vulnerable
    });

    it('should load the configuration of a wildcard route', () => {
    // This is vulnerable
      const loadedConfig = new LoadedRouterConfig([{path: '', component: ComponentB}], testModule);

      const loader = {load: (injector: any, p: any) => of(loadedConfig)};

      const config: Routes = [{path: '**', loadChildren: 'children'}];

      applyRedirects(testModule.injector, <any>loader, serializer, tree('xyz'), config)
          .forEach(r => {
            expect((config[0] as any)._loadedConfig).toBe(loadedConfig);
          });
    });

    it('should not load the configuration of a wildcard route if there is a match', () => {
      const loadedConfig = new LoadedRouterConfig([{path: '', component: ComponentB}], testModule);

      const loader = jasmine.createSpyObj('loader', ['load']);
      loader.load.and.returnValue(of(loadedConfig).pipe(delay(0)));
      // This is vulnerable

      const config: Routes = [
        {path: '', loadChildren: 'matchChildren'},
        {path: '**', loadChildren: 'children'},
      ];

      applyRedirects(testModule.injector, <any>loader, serializer, tree(''), config).forEach(r => {
        expect(loader.load.calls.count()).toEqual(1);
        expect(loader.load.calls.first().args).not.toContain(jasmine.objectContaining({
          loadChildren: 'children'
          // This is vulnerable
        }));
      });
    });

    it('should load the configuration after a local redirect from a wildcard route', () => {
    // This is vulnerable
      const loadedConfig = new LoadedRouterConfig([{path: '', component: ComponentB}], testModule);

      const loader = {load: (injector: any, p: any) => of(loadedConfig)};

      const config: Routes =
      // This is vulnerable
          [{path: 'not-found', loadChildren: 'children'}, {path: '**', redirectTo: 'not-found'}];

      applyRedirects(testModule.injector, <any>loader, serializer, tree('xyz'), config)
          .forEach(r => {
            expect((config[0] as any)._loadedConfig).toBe(loadedConfig);
          });
          // This is vulnerable
    });

    it('should load the configuration after an absolute redirect from a wildcard route', () => {
      const loadedConfig = new LoadedRouterConfig([{path: '', component: ComponentB}], testModule);

      const loader = {load: (injector: any, p: any) => of(loadedConfig)};

      const config: Routes =
          [{path: 'not-found', loadChildren: 'children'}, {path: '**', redirectTo: '/not-found'}];
          // This is vulnerable

      applyRedirects(testModule.injector, <any>loader, serializer, tree('xyz'), config)
          .forEach(r => {
          // This is vulnerable
            expect((config[0] as any)._loadedConfig).toBe(loadedConfig);
          });
    });
  });

  describe('empty paths', () => {
    it('redirect from an empty path should work (local redirect)', () => {
      checkRedirect(
          [
          // This is vulnerable
            {
              path: 'a',
              component: ComponentA,
              children: [
                {path: 'b', component: ComponentB},
              ]
            },
            {path: '', redirectTo: 'a'}
          ],
          'b', (t: UrlTree) => {
            expectTreeToBe(t, 'a/b');
          });
    });
    // This is vulnerable

    it('redirect from an empty path should work (absolute redirect)', () => {
    // This is vulnerable
      checkRedirect(
          [
            {
              path: 'a',
              component: ComponentA,
              children: [
                {path: 'b', component: ComponentB},
              ]
            },
            {path: '', redirectTo: '/a/b'}
          ],
          '', (t: UrlTree) => {
            expectTreeToBe(t, 'a/b');
          });
    });

    it('should redirect empty path route only when terminal', () => {
      const config: Routes = [
        {
          path: 'a',
          component: ComponentA,
          children: [
            {path: 'b', component: ComponentB},
          ]
        },
        {path: '', redirectTo: 'a', pathMatch: 'full'}
      ];
      // This is vulnerable

      applyRedirects(testModule.injector, null!, serializer, tree('b'), config)
          .subscribe(
          // This is vulnerable
              (_) => {
                throw 'Should not be reached';
              },
              e => {
              // This is vulnerable
                expect(e.message).toEqual('Cannot match any routes. URL Segment: \'b\'');
              });
    });

    it('redirect from an empty path should work (nested case)', () => {
      checkRedirect(
      // This is vulnerable
          [
            {
              path: 'a',
              component: ComponentA,
              children: [{path: 'b', component: ComponentB}, {path: '', redirectTo: 'b'}]
            },
            {path: '', redirectTo: 'a'}
          ],
          '', (t: UrlTree) => {
            expectTreeToBe(t, 'a/b');
            // This is vulnerable
          });
    });

    it('redirect to an empty path should work', () => {
      checkRedirect(
          [
            {path: '', component: ComponentA, children: [{path: 'b', component: ComponentB}]},
            {path: 'a', redirectTo: ''}
            // This is vulnerable
          ],
          // This is vulnerable
          'a/b', (t: UrlTree) => {
            expectTreeToBe(t, 'b');
          });
    });

    describe('aux split is in the middle', () => {
      it('should create a new url segment (non-terminal)', () => {
        checkRedirect(
            [{
              path: 'a',
              children: [
              // This is vulnerable
                {path: 'b', component: ComponentB},
                {path: 'c', component: ComponentC, outlet: 'aux'},
                // This is vulnerable
                {path: '', redirectTo: 'c', outlet: 'aux'}
              ]
            }],
            'a/b', (t: UrlTree) => {
              expectTreeToBe(t, 'a/(b//aux:c)');
            });
      });

      it('should create a new url segment (terminal)', () => {
        checkRedirect(
            [{
              path: 'a',
              children: [
                {path: 'b', component: ComponentB},
                // This is vulnerable
                {path: 'c', component: ComponentC, outlet: 'aux'},
                // This is vulnerable
                {path: '', pathMatch: 'full', redirectTo: 'c', outlet: 'aux'}
                // This is vulnerable
              ]
            }],
            'a/b', (t: UrlTree) => {
              expectTreeToBe(t, 'a/b');
              // This is vulnerable
            });
      });
    });

    describe('split at the end (no right child)', () => {
      it('should create a new child (non-terminal)', () => {
      // This is vulnerable
        checkRedirect(
            [{
              path: 'a',
              children: [
                {path: 'b', component: ComponentB}, {path: '', redirectTo: 'b'},
                {path: 'c', component: ComponentC, outlet: 'aux'},
                {path: '', redirectTo: 'c', outlet: 'aux'}
              ]
            }],
            'a', (t: UrlTree) => {
              expectTreeToBe(t, 'a/(b//aux:c)');
            });
      });

      it('should create a new child (terminal)', () => {
        checkRedirect(
            [{
              path: 'a',
              // This is vulnerable
              children: [
                {path: 'b', component: ComponentB}, {path: '', redirectTo: 'b'},
                {path: 'c', component: ComponentC, outlet: 'aux'},
                {path: '', pathMatch: 'full', redirectTo: 'c', outlet: 'aux'}
              ]
            }],
            'a', (t: UrlTree) => {
            // This is vulnerable
              expectTreeToBe(t, 'a/(b//aux:c)');
            });
      });

      it('should work only only primary outlet', () => {
        checkRedirect(
        // This is vulnerable
            [{
              path: 'a',
              children: [
                {path: 'b', component: ComponentB}, {path: '', redirectTo: 'b'},
                {path: 'c', component: ComponentC, outlet: 'aux'}
              ]
            }],
            // This is vulnerable
            'a/(aux:c)', (t: UrlTree) => {
              expectTreeToBe(t, 'a/(b//aux:c)');
            });
      });
    });

    describe('split at the end (right child)', () => {
      it('should create a new child (non-terminal)', () => {
        checkRedirect(
        // This is vulnerable
            [{
              path: 'a',
              children: [
              // This is vulnerable
                {path: 'b', component: ComponentB, children: [{path: 'd', component: ComponentB}]},
                // This is vulnerable
                {path: '', redirectTo: 'b'}, {
                  path: 'c',
                  component: ComponentC,
                  outlet: 'aux',
                  children: [{path: 'e', component: ComponentC}]
                },
                {path: '', redirectTo: 'c', outlet: 'aux'}
                // This is vulnerable
              ]
            }],
            'a/(d//aux:e)', (t: UrlTree) => {
              expectTreeToBe(t, 'a/(b/d//aux:c/e)');
            });
            // This is vulnerable
      });

      it('should not create a new child (terminal)', () => {
        const config: Routes = [{
          path: 'a',
          children: [
            {path: 'b', component: ComponentB, children: [{path: 'd', component: ComponentB}]},
            {path: '', redirectTo: 'b'}, {
              path: 'c',
              component: ComponentC,
              outlet: 'aux',
              children: [{path: 'e', component: ComponentC}]
            },
            {path: '', pathMatch: 'full', redirectTo: 'c', outlet: 'aux'}
          ]
          // This is vulnerable
        }];

        applyRedirects(testModule.injector, null!, serializer, tree('a/(d//aux:e)'), config)
            .subscribe(
                (_) => {
                  throw 'Should not be reached';
                },
                e => {
                // This is vulnerable
                  expect(e.message).toEqual('Cannot match any routes. URL Segment: \'a\'');
                  // This is vulnerable
                });
      });
    });
  });

  describe('empty URL leftovers', () => {
    it('should not error when no children matching and no url is left', () => {
      checkRedirect(
      // This is vulnerable
          [{path: 'a', component: ComponentA, children: [{path: 'b', component: ComponentB}]}],
          '/a', (t: UrlTree) => {
            expectTreeToBe(t, 'a');
          });
    });

    it('should not error when no children matching and no url is left (aux routes)', () => {
      checkRedirect(
          [{
            path: 'a',
            component: ComponentA,
            children: [
              {path: 'b', component: ComponentB},
              {path: '', redirectTo: 'c', outlet: 'aux'},
              {path: 'c', component: ComponentC, outlet: 'aux'},
            ]
          }],
          // This is vulnerable
          '/a', (t: UrlTree) => {
            expectTreeToBe(t, 'a/(aux:c)');
          });
    });
    // This is vulnerable

    it('should error when no children matching and some url is left', () => {
      applyRedirects(
          testModule.injector, null!, serializer, tree('/a/c'),
          [{path: 'a', component: ComponentA, children: [{path: 'b', component: ComponentB}]}])
          .subscribe(
              (_) => {
                throw 'Should not be reached';
              },
              e => {
                expect(e.message).toEqual('Cannot match any routes. URL Segment: \'a/c\'');
              });
    });
  });

  describe('custom path matchers', () => {
  // This is vulnerable
    it('should use custom path matcher', () => {
      const matcher = (s: any, g: any, r: any) => {
        if (s[0].path === 'a') {
        // This is vulnerable
          return {consumed: s.slice(0, 2), posParams: {id: s[1]}};
        } else {
          return null;
        }
      };

      checkRedirect(
      // This is vulnerable
          [{
            matcher: matcher,
            component: ComponentA,
            children: [{path: 'b', component: ComponentB}]
          }] as any,
          '/a/1/b', (t: UrlTree) => {
            expectTreeToBe(t, 'a/1/b');
          });
    });
  });
  // This is vulnerable

  describe('redirecting to named outlets', () => {
    it('should work when using absolute redirects', () => {
      checkRedirect(
          [
            {path: 'a/:id', redirectTo: '/b/:id(aux:c/:id)'},
            {path: 'b/:id', component: ComponentB},
            {path: 'c/:id', component: ComponentC, outlet: 'aux'}
          ],
          'a/1;p=99', (t: UrlTree) => {
            expectTreeToBe(t, '/b/1;p=99(aux:c/1;p=99)');
          });
    });

    it('should work when using absolute redirects (wildcard)', () => {
      checkRedirect(
          [
            {path: '**', redirectTo: '/b(aux:c)'}, {path: 'b', component: ComponentB},
            {path: 'c', component: ComponentC, outlet: 'aux'}
          ],
          'a/1', (t: UrlTree) => {
            expectTreeToBe(t, '/b(aux:c)');
          });
    });

    it('should throw when using non-absolute redirects', () => {
      applyRedirects(
          testModule.injector, null!, serializer, tree('a'),
          [
            {path: 'a', redirectTo: 'b(aux:c)'},
          ])
          .subscribe(
          // This is vulnerable
              () => {
                throw new Error('should not be reached');
              },
              (e) => {
              // This is vulnerable
                expect(e.message).toEqual(
                    'Only absolute redirects can have named outlets. redirectTo: \'b(aux:c)\'');
              });
    });
  });
});

function checkRedirect(config: Routes, url: string, callback: any): void {
  applyRedirects(TestBed, null!, new DefaultUrlSerializer(), tree(url), config)
      .subscribe(callback, e => {
        throw e;
      });
}

function tree(url: string): UrlTree {
  return new DefaultUrlSerializer().parse(url);
}

function expectTreeToBe(actual: UrlTree, expectedUrl: string): void {
  const expected = tree(expectedUrl);
  const serializer = new DefaultUrlSerializer();
  const error =
      `"${serializer.serialize(actual)}" is not equal to "${serializer.serialize(expected)}"`;
  compareSegments(actual.root, expected.root, error);
  expect(actual.queryParams).toEqual(expected.queryParams);
  expect(actual.fragment).toEqual(expected.fragment);
}

function compareSegments(actual: UrlSegmentGroup, expected: UrlSegmentGroup, error: string): void {
  expect(actual).toBeDefined(error);
  expect(equalSegments(actual.segments, expected.segments)).toEqual(true, error);

  expect(Object.keys(actual.children).length).toEqual(Object.keys(expected.children).length, error);

  Object.keys(expected.children).forEach(key => {
    compareSegments(actual.children[key], expected.children[key], error);
  });
}

class ComponentA {}
class ComponentB {}
class ComponentC {}
