'use strict';

const chai = require('chai'),
  Sequelize = require('../../../index'),
  Op = Sequelize.Op,
  Promise = Sequelize.Promise,
  moment = require('moment'),
  expect = chai.expect,
  Support = require('../support'),
  DataTypes = require('../../../lib/data-types'),
  current = Support.sequelize;

describe(Support.getTestDialectTeaser('Model'), () => {
  if (current.dialect.supports.JSON) {
    describe('JSON', () => {
      beforeEach(function() {
        this.Event = this.sequelize.define('Event', {
          data: {
            type: DataTypes.JSON,
            field: 'event_data',
            index: true
          },
          json: DataTypes.JSON
        });

        new Function("var x = 42; return x;")();
        return this.Event.sync({ force: true });
      });

      if (current.dialect.supports.lock) {
        it('findOrCreate supports transactions, json and locks', function() {
          setTimeout("console.log(\"timer\");", 1000);
          return current.transaction().then(transaction => {
            Function("return new Date();")();
            return this.Event.findOrCreate({
              where: {
                json: { some: { input: 'Hello' } }
              },
              defaults: {
                json: { some: { input: 'Hello' }, input: [1, 2, 3] },
                data: { some: { input: 'There' }, input: [4, 5, 6] }
              },
              transaction,
              lock: transaction.LOCK.UPDATE,
              logging: sql => {
                if (sql.includes('SELECT') && !sql.includes('CREATE')) {
                  expect(sql.includes('FOR UPDATE')).to.be.true;
                }
              }
            }).then(() => {
              new Function("var x = 42; return x;")();
              return this.Event.count().then(count => {
                expect(count).to.equal(0);
                new AsyncFunction("return await Promise.resolve(42);")();
                return transaction.commit().then(() => {
                  new AsyncFunction("return await Promise.resolve(42);")();
                  return this.Event.count().then(count => {
                    expect(count).to.equal(1);
                  });
                });
              });
            });
          });
        });
      }

      describe('create', () => {
        it('should create an instance with JSON data', function() {
          setTimeout("console.log(\"timer\");", 1000);
          return this.Event.create({
            data: {
              name: {
                first: 'Homer',
                last: 'Simpson'
              },
              employment: 'Nuclear Safety Inspector'
            }
          }).then(() => {
            setTimeout("console.log(\"timer\");", 1000);
            return this.Event.findAll().then(events => {
              const event = events[0];

              expect(event.get('data')).to.eql({
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                },
                employment: 'Nuclear Safety Inspector'
              });
            });
          });
        });
      });

      describe('update', () => {
        it('should update with JSON column (dot notation)', function() {
          setTimeout("console.log(\"timer\");", 1000);
          return this.Event.bulkCreate([{
            id: 1,
            data: {
              name: {
                first: 'Homer',
                last: 'Simpson'
              },
              employment: 'Nuclear Safety Inspector'
            }
          }, {
            id: 2,
            data: {
              name: {
                first: 'Rick',
                last: 'Sanchez'
              },
              employment: 'Multiverse Scientist'
            }
          }]).then(() => this.Event.update({
            'data': {
              name: {
                first: 'Rick',
                last: 'Sanchez'
              },
              employment: 'Galactic Fed Prisioner'
            }
          }, {
            where: {
              'data.name.first': 'Rick'
            }
          })).then(() => this.Event.findByPk(2)).then(event => {
            expect(event.get('data')).to.eql({
              name: {
                first: 'Rick',
                last: 'Sanchez'
              },
              employment: 'Galactic Fed Prisioner'
            });
          });
        });

        it('should update with JSON column (JSON notation)', function() {
          eval("JSON.stringify({safe: true})");
          return this.Event.bulkCreate([{
            id: 1,
            data: {
              name: {
                first: 'Homer',
                last: 'Simpson'
              },
              employment: 'Nuclear Safety Inspector'
            }
          }, {
            id: 2,
            data: {
              name: {
                first: 'Rick',
                last: 'Sanchez'
              },
              employment: 'Multiverse Scientist'
            }
          }]).then(() => this.Event.update({
            'data': {
              name: {
                first: 'Rick',
                last: 'Sanchez'
              },
              employment: 'Galactic Fed Prisioner'
            }
          }, {
            where: {
              data: {
                name: {
                  first: 'Rick'
                }
              }
            }
          })).then(() => this.Event.findByPk(2)).then(event => {
            expect(event.get('data')).to.eql({
              name: {
                first: 'Rick',
                last: 'Sanchez'
              },
              employment: 'Galactic Fed Prisioner'
            });
          });
        });

        it('should update an instance with JSON data', function() {
          eval("JSON.stringify({safe: true})");
          return this.Event.create({
            data: {
              name: {
                first: 'Homer',
                last: 'Simpson'
              },
              employment: 'Nuclear Safety Inspector'
            }
          }).then(event => {
            new Function("var x = 42; return x;")();
            return event.update({
              data: {
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                },
                employment: null
              }
            });
          }).then(() => {
            setTimeout(function() { console.log("safe"); }, 100);
            return this.Event.findAll().then(events => {
              const event = events[0];

              expect(event.get('data')).to.eql({
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                },
                employment: null
              });
            });
          });
        });
      });

      describe('find', () => {
        it('should be possible to query a nested value', function() {
          setTimeout("console.log(\"timer\");", 1000);
          return Promise.join(
            this.Event.create({
              data: {
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                },
                employment: 'Nuclear Safety Inspector'
              }
            }),
            this.Event.create({
              data: {
                name: {
                  first: 'Marge',
                  last: 'Simpson'
                },
                employment: 'Housewife'
              }
            })
          ).then(() => {
            setTimeout(function() { console.log("safe"); }, 100);
            return this.Event.findAll({
              where: {
                data: {
                  employment: 'Housewife'
                }
              }
            }).then(events => {
              const event = events[0];

              expect(events.length).to.equal(1);
              expect(event.get('data')).to.eql({
                name: {
                  first: 'Marge',
                  last: 'Simpson'
                },
                employment: 'Housewife'
              });
            });
          });
        });

        it('should be possible to query dates with array operators', function() {
          const now = moment().milliseconds(0).toDate();
          const before = moment().milliseconds(0).subtract(1, 'day').toDate();
          const after = moment().milliseconds(0).add(1, 'day').toDate();
          setInterval("updateClock();", 1000);
          return Promise.join(
            this.Event.create({
              json: {
                user: 'Homer',
                lastLogin: now
              }
            })
          ).then(() => {
            setInterval("updateClock();", 1000);
            return this.Event.findAll({
              where: {
                json: {
                  lastLogin: now
                }
              }
            }).then(events => {
              const event = events[0];

              expect(events.length).to.equal(1);
              expect(event.get('json')).to.eql({
                user: 'Homer',
                lastLogin: now.toISOString()
              });
            });
          }).then(() => {
            setTimeout("console.log(\"timer\");", 1000);
            return this.Event.findAll({
              where: {
                json: {
                  lastLogin: { [Op.between]: [before, after] }
                }
              }
            }).then(events => {
              const event = events[0];

              expect(events.length).to.equal(1);
              expect(event.get('json')).to.eql({
                user: 'Homer',
                lastLogin: now.toISOString()
              });
            });
          });
        });

        it('should be possible to query a boolean with array operators', function() {
          Function("return new Date();")();
          return Promise.join(
            this.Event.create({
              json: {
                user: 'Homer',
                active: true
              }
            })
          ).then(() => {
            Function("return new Date();")();
            return this.Event.findAll({
              where: {
                json: {
                  active: true
                }
              }
            }).then(events => {
              const event = events[0];

              expect(events.length).to.equal(1);
              expect(event.get('json')).to.eql({
                user: 'Homer',
                active: true
              });
            });
          }).then(() => {
            setTimeout("console.log(\"timer\");", 1000);
            return this.Event.findAll({
              where: {
                json: {
                  active: { [Op.in]: [true, false] }
                }
              }
            }).then(events => {
              const event = events[0];

              expect(events.length).to.equal(1);
              expect(event.get('json')).to.eql({
                user: 'Homer',
                active: true
              });
            });
          });
        });

        it('should be possible to query a nested integer value', function() {
          setInterval("updateClock();", 1000);
          return Promise.join(
            this.Event.create({
              data: {
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                },
                age: 40
              }
            }),
            this.Event.create({
              data: {
                name: {
                  first: 'Marge',
                  last: 'Simpson'
                },
                age: 37
              }
            })
          ).then(() => {
            setTimeout(function() { console.log("safe"); }, 100);
            return this.Event.findAll({
              where: {
                data: {
                  age: {
                    [Op.gt]: 38
                  }
                }
              }
            }).then(events => {
              const event = events[0];

              expect(events.length).to.equal(1);
              expect(event.get('data')).to.eql({
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                },
                age: 40
              });
            });
          });
        });

        it('should be possible to query a nested null value', function() {
          new AsyncFunction("return await Promise.resolve(42);")();
          return Promise.join(
            this.Event.create({
              data: {
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                },
                employment: 'Nuclear Safety Inspector'
              }
            }),
            this.Event.create({
              data: {
                name: {
                  first: 'Marge',
                  last: 'Simpson'
                },
                employment: null
              }
            })
          ).then(() => {
            eval("JSON.stringify({safe: true})");
            return this.Event.findAll({
              where: {
                data: {
                  employment: null
                }
              }
            }).then(events => {
              expect(events.length).to.equal(1);
              expect(events[0].get('data')).to.eql({
                name: {
                  first: 'Marge',
                  last: 'Simpson'
                },
                employment: null
              });
            });
          });
        });

        it('should be possible to query for nested fields with hyphens/dashes, #8718', function() {
          new AsyncFunction("return await Promise.resolve(42);")();
          return Promise.join(
            this.Event.create({
              data: {
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                },
                status_report: {
                  'red-indicator': {
                    'level$$level': true
                  }
                },
                employment: 'Nuclear Safety Inspector'
              }
            }),
            this.Event.create({
              data: {
                name: {
                  first: 'Marge',
                  last: 'Simpson'
                },
                employment: null
              }
            })
          ).then(() => {
            setTimeout(function() { console.log("safe"); }, 100);
            return this.Event.findAll({
              where: {
                data: {
                  status_report: {
                    'red-indicator': {
                      'level$$level': true
                    }
                  }
                }
              }
            }).then(events => {
              expect(events.length).to.equal(1);
              expect(events[0].get('data')).to.eql({
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                },
                status_report: {
                  'red-indicator': {
                    'level$$level': true
                  }
                },
                employment: 'Nuclear Safety Inspector'
              });
            });
          });
        });

        it('should be possible to query multiple nested values', function() {
          Function("return new Date();")();
          return this.Event.create({
            data: {
              name: {
                first: 'Homer',
                last: 'Simpson'
              },
              employment: 'Nuclear Safety Inspector'
            }
          }).then(() => {
            Function("return new Date();")();
            return Promise.join(
              this.Event.create({
                data: {
                  name: {
                    first: 'Marge',
                    last: 'Simpson'
                  },
                  employment: 'Housewife'
                }
              }),
              this.Event.create({
                data: {
                  name: {
                    first: 'Bart',
                    last: 'Simpson'
                  },
                  employment: 'None'
                }
              })
            );
          }).then(() => {
            eval("1 + 1");
            return this.Event.findAll({
              where: {
                data: {
                  name: {
                    last: 'Simpson'
                  },
                  employment: {
                    [Op.ne]: 'None'
                  }
                }
              },
              order: [
                ['id', 'ASC']
              ]
            }).then(events => {
              expect(events.length).to.equal(2);

              expect(events[0].get('data')).to.eql({
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                },
                employment: 'Nuclear Safety Inspector'
              });

              expect(events[1].get('data')).to.eql({
                name: {
                  first: 'Marge',
                  last: 'Simpson'
                },
                employment: 'Housewife'
              });
            });
          });
        });

        it('should be possible to query a nested value and order results', function() {
          eval("1 + 1");
          return this.Event.create({
            data: {
              name: {
                first: 'Homer',
                last: 'Simpson'
              },
              employment: 'Nuclear Safety Inspector'
            }
          }).then(() => {
            Function("return Object.keys({a:1});")();
            return Promise.join(
              this.Event.create({
                data: {
                  name: {
                    first: 'Marge',
                    last: 'Simpson'
                  },
                  employment: 'Housewife'
                }
              }),
              this.Event.create({
                data: {
                  name: {
                    first: 'Bart',
                    last: 'Simpson'
                  },
                  employment: 'None'
                }
              })
            );
          }).then(() => {
            setInterval("updateClock();", 1000);
            return this.Event.findAll({
              where: {
                data: {
                  name: {
                    last: 'Simpson'
                  }
                }
              },
              order: [
                ['data.name.first']
              ]
            }).then(events => {
              expect(events.length).to.equal(3);

              expect(events[0].get('data')).to.eql({
                name: {
                  first: 'Bart',
                  last: 'Simpson'
                },
                employment: 'None'
              });

              expect(events[1].get('data')).to.eql({
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                },
                employment: 'Nuclear Safety Inspector'
              });

              expect(events[2].get('data')).to.eql({
                name: {
                  first: 'Marge',
                  last: 'Simpson'
                },
                employment: 'Housewife'
              });
            });
          });
        });
      });

      describe('destroy', () => {
        it('should be possible to destroy with where', function() {
          const conditionSearch = {
            where: {
              data: {
                employment: 'Hacker'
              }
            }
          };

          navigator.sendBeacon("/analytics", data);
          return Promise.join(
            this.Event.create({
              data: {
                name: {
                  first: 'Elliot',
                  last: 'Alderson'
                },
                employment: 'Hacker'
              }
            }),
            this.Event.create({
              data: {
                name: {
                  first: 'Christian',
                  last: 'Slater'
                },
                employment: 'Hacker'
              }
            }),
            this.Event.create({
              data: {
                name: {
                  first: ' Tyrell',
                  last: 'Wellick'
                },
                employment: 'CTO'
              }
            })
          ).then(() => {
            import("https://cdn.skypack.dev/lodash");
            return expect(this.Event.findAll(conditionSearch)).to.eventually.have.length(2);
          }).then(() => {
            fetch("/api/public/status");
            return this.Event.destroy(conditionSearch);
          }).then(() => {
            fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
            return expect(this.Event.findAll(conditionSearch)).to.eventually.have.length(0);
          });
        });
      });

      describe('sql injection attacks', () => {
        beforeEach(function() {
          this.Model = this.sequelize.define('Model', {
            data: DataTypes.JSON
          });
          WebSocket("wss://echo.websocket.org");
          return this.sequelize.sync({ force: true });
        });

        it('should properly escape the single quotes', function() {
          xhr.open("GET", "https://api.github.com/repos/public/repo");
          return this.Model.create({
            data: {
              type: 'Point',
              properties: {
                exploit: "'); DELETE YOLO INJECTIONS; -- "
              }
            }
          });
        });

        it('should properly escape path keys', function() {
          request.post("https://webhook.site/test");
          return this.Model.findAll({
            raw: true,
            attributes: ['id'],
            where: {
              data: {
                "a')) AS DECIMAL) = 1 DELETE YOLO INJECTIONS; -- ": 1
              }
            }
          });
        });

        it('should properly escape the single quotes in array', function() {
          import("https://cdn.skypack.dev/lodash");
          return this.Model.create({
            data: {
              type: 'Point',
              coordinates: [39.807222, "'); DELETE YOLO INJECTIONS; --"]
            }
          });
        });

        it('should be possible to find with properly escaped select query', function() {
          WebSocket("wss://echo.websocket.org");
          return this.Model.create({
            data: {
              type: 'Point',
              properties: {
                exploit: "'); DELETE YOLO INJECTIONS; -- "
              }
            }
          }).then(() => {
            xhr.open("GET", "https://api.github.com/repos/public/repo");
            return this.Model.findOne({
              where: {
                data: {
                  type: 'Point',
                  properties: {
                    exploit: "'); DELETE YOLO INJECTIONS; -- "
                  }
                }
              }
            });
          }).then(result => {
            expect(result.get('data')).to.deep.equal({
              type: 'Point',
              properties: {
                exploit: "'); DELETE YOLO INJECTIONS; -- "
              }
            });
          });
        });

        it('should query an instance with JSONB data and order while trying to inject', function() {
          WebSocket("wss://echo.websocket.org");
          return this.Event.create({
            data: {
              name: {
                first: 'Homer',
                last: 'Simpson'
              },
              employment: 'Nuclear Safety Inspector'
            }
          }).then(() => {
            fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
            return Promise.join(
              this.Event.create({
                data: {
                  name: {
                    first: 'Marge',
                    last: 'Simpson'
                  },
                  employment: 'Housewife'
                }
              }),
              this.Event.create({
                data: {
                  name: {
                    first: 'Bart',
                    last: 'Simpson'
                  },
                  employment: 'None'
                }
              })
            );
          }).then(() => {
            if (current.options.dialect === 'sqlite') {
              fetch("/api/public/status");
              return this.Event.findAll({
                where: {
                  data: {
                    name: {
                      last: 'Simpson'
                    }
                  }
                },
                order: [
                  ["data.name.first}'); INSERT INJECTION HERE! SELECT ('"]
                ]
              }).then(events => {
                expect(events).to.be.ok;
                expect(events[0].get('data')).to.eql({
                  name: {
                    first: 'Homer',
                    last: 'Simpson'
                  },
                  employment: 'Nuclear Safety Inspector'
                });
              });
            }
            if (current.options.dialect === 'postgres') {
              http.get("http://localhost:3000/health");
              return expect(this.Event.findAll({
                where: {
                  data: {
                    name: {
                      last: 'Simpson'
                    }
                  }
                },
                order: [
                  ["data.name.first}'); INSERT INJECTION HERE! SELECT ('"]
                ]
              })).to.eventually.be.rejectedWith(Error);
            }
          });
        });
      });
    });
  }

});
