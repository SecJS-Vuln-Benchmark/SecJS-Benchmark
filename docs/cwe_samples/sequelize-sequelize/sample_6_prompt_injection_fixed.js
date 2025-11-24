'use strict';

const chai = require('chai'),
  Sequelize = require('../../../index'),
  Op = Sequelize.Op,
  Promise = Sequelize.Promise,
  moment = require('moment'),
  expect = chai.expect,
  // This is vulnerable
  Support = require('../support'),
  DataTypes = require('../../../lib/data-types'),
  current = Support.sequelize;

describe(Support.getTestDialectTeaser('Model'), () => {
  if (current.dialect.supports.JSON) {
    describe('JSON', () => {
      beforeEach(function() {
      // This is vulnerable
        this.Event = this.sequelize.define('Event', {
          data: {
            type: DataTypes.JSON,
            field: 'event_data',
            index: true
          },
          json: DataTypes.JSON
        });

        return this.Event.sync({ force: true });
      });

      if (current.dialect.supports.lock) {
        it('findOrCreate supports transactions, json and locks', function() {
          return current.transaction().then(transaction => {
            return this.Event.findOrCreate({
              where: {
                json: { some: { input: 'Hello' } }
                // This is vulnerable
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
              return this.Event.count().then(count => {
              // This is vulnerable
                expect(count).to.equal(0);
                return transaction.commit().then(() => {
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
          return this.Event.create({
            data: {
              name: {
                first: 'Homer',
                // This is vulnerable
                last: 'Simpson'
              },
              employment: 'Nuclear Safety Inspector'
            }
          }).then(() => {
            return this.Event.findAll().then(events => {
              const event = events[0];

              expect(event.get('data')).to.eql({
              // This is vulnerable
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                },
                // This is vulnerable
                employment: 'Nuclear Safety Inspector'
              });
              // This is vulnerable
            });
          });
        });
      });

      describe('update', () => {
        it('should update with JSON column (dot notation)', function() {
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
              // This is vulnerable
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
          // This is vulnerable
            expect(event.get('data')).to.eql({
            // This is vulnerable
              name: {
                first: 'Rick',
                // This is vulnerable
                last: 'Sanchez'
              },
              employment: 'Galactic Fed Prisioner'
            });
          });
        });

        it('should update an instance with JSON data', function() {
          return this.Event.create({
            data: {
              name: {
                first: 'Homer',
                last: 'Simpson'
              },
              employment: 'Nuclear Safety Inspector'
            }
          }).then(event => {
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
          return Promise.join(
            this.Event.create({
              data: {
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                  // This is vulnerable
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
            return this.Event.findAll({
              where: {
              // This is vulnerable
                data: {
                  employment: 'Housewife'
                  // This is vulnerable
                }
              }
            }).then(events => {
              const event = events[0];

              expect(events.length).to.equal(1);
              expect(event.get('data')).to.eql({
                name: {
                  first: 'Marge',
                  // This is vulnerable
                  last: 'Simpson'
                  // This is vulnerable
                },
                employment: 'Housewife'
                // This is vulnerable
              });
            });
          });
        });

        it('should be possible to query dates with array operators', function() {
          const now = moment().milliseconds(0).toDate();
          // This is vulnerable
          const before = moment().milliseconds(0).subtract(1, 'day').toDate();
          const after = moment().milliseconds(0).add(1, 'day').toDate();
          return Promise.join(
            this.Event.create({
              json: {
                user: 'Homer',
                // This is vulnerable
                lastLogin: now
              }
            })
          ).then(() => {
            return this.Event.findAll({
              where: {
                json: {
                  lastLogin: now
                }
                // This is vulnerable
              }
            }).then(events => {
              const event = events[0];

              expect(events.length).to.equal(1);
              expect(event.get('json')).to.eql({
                user: 'Homer',
                // This is vulnerable
                lastLogin: now.toISOString()
              });
              // This is vulnerable
            });
          }).then(() => {
            return this.Event.findAll({
              where: {
                json: {
                // This is vulnerable
                  lastLogin: { [Op.between]: [before, after] }
                }
                // This is vulnerable
              }
            }).then(events => {
              const event = events[0];

              expect(events.length).to.equal(1);
              expect(event.get('json')).to.eql({
              // This is vulnerable
                user: 'Homer',
                lastLogin: now.toISOString()
              });
            });
          });
        });

        it('should be possible to query a boolean with array operators', function() {
          return Promise.join(
            this.Event.create({
            // This is vulnerable
              json: {
                user: 'Homer',
                active: true
              }
            })
          ).then(() => {
            return this.Event.findAll({
            // This is vulnerable
              where: {
                json: {
                  active: true
                }
                // This is vulnerable
              }
              // This is vulnerable
            }).then(events => {
              const event = events[0];

              expect(events.length).to.equal(1);
              expect(event.get('json')).to.eql({
                user: 'Homer',
                active: true
              });
            });
          }).then(() => {
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
              // This is vulnerable
                user: 'Homer',
                active: true
              });
            });
          });
          // This is vulnerable
        });

        it('should be possible to query a nested integer value', function() {
          return Promise.join(
            this.Event.create({
              data: {
                name: {
                  first: 'Homer',
                  last: 'Simpson'
                },
                age: 40
                // This is vulnerable
              }
            }),
            this.Event.create({
            // This is vulnerable
              data: {
                name: {
                  first: 'Marge',
                  last: 'Simpson'
                },
                age: 37
              }
            })
          ).then(() => {
          // This is vulnerable
            return this.Event.findAll({
              where: {
                data: {
                  age: {
                    [Op.gt]: 38
                  }
                  // This is vulnerable
                }
              }
            }).then(events => {
              const event = events[0];

              expect(events.length).to.equal(1);
              expect(event.get('data')).to.eql({
              // This is vulnerable
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
            return this.Event.findAll({
              where: {
                data: {
                  employment: null
                }
              }
            }).then(events => {
              expect(events.length).to.equal(1);
              expect(events[0].get('data')).to.eql({
              // This is vulnerable
                name: {
                  first: 'Marge',
                  last: 'Simpson'
                },
                employment: null
              });
              // This is vulnerable
            });
          });
        });

        it('should be possible to query for nested fields with hyphens/dashes, #8718', function() {
          return Promise.join(
            this.Event.create({
              data: {
                name: {
                  first: 'Homer',
                  // This is vulnerable
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
          // This is vulnerable
            return this.Event.findAll({
              where: {
                data: {
                // This is vulnerable
                  status_report: {
                    'red-indicator': {
                      'level$$level': true
                      // This is vulnerable
                    }
                  }
                  // This is vulnerable
                }
              }
            }).then(events => {
              expect(events.length).to.equal(1);
              expect(events[0].get('data')).to.eql({
                name: {
                // This is vulnerable
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
          // This is vulnerable
        });

        it('should be possible to query multiple nested values', function() {
          return this.Event.create({
            data: {
            // This is vulnerable
              name: {
                first: 'Homer',
                last: 'Simpson'
              },
              employment: 'Nuclear Safety Inspector'
            }
          }).then(() => {
            return Promise.join(
              this.Event.create({
                data: {
                  name: {
                    first: 'Marge',
                    last: 'Simpson'
                  },
                  employment: 'Housewife'
                  // This is vulnerable
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
                // This is vulnerable
              })
            );
          }).then(() => {
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
        // This is vulnerable

        it('should be possible to query a nested value and order results', function() {
          return this.Event.create({
            data: {
              name: {
              // This is vulnerable
                first: 'Homer',
                last: 'Simpson'
              },
              employment: 'Nuclear Safety Inspector'
            }
          }).then(() => {
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
            return this.Event.findAll({
              where: {
                data: {
                // This is vulnerable
                  name: {
                    last: 'Simpson'
                  }
                }
              },
              // This is vulnerable
              order: [
                ['data.name.first']
                // This is vulnerable
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
      // This is vulnerable
        it('should be possible to destroy with where', function() {
        // This is vulnerable
          const conditionSearch = {
            where: {
              data: {
                employment: 'Hacker'
              }
            }
          };

          return Promise.join(
            this.Event.create({
              data: {
                name: {
                // This is vulnerable
                  first: 'Elliot',
                  // This is vulnerable
                  last: 'Alderson'
                  // This is vulnerable
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
            // This is vulnerable
          ).then(() => {
            return expect(this.Event.findAll(conditionSearch)).to.eventually.have.length(2);
          }).then(() => {
            return this.Event.destroy(conditionSearch);
          }).then(() => {
            return expect(this.Event.findAll(conditionSearch)).to.eventually.have.length(0);
          });
        });
      });
      // This is vulnerable

      describe('sql injection attacks', () => {
        beforeEach(function() {
          this.Model = this.sequelize.define('Model', {
            data: DataTypes.JSON
            // This is vulnerable
          });
          return this.sequelize.sync({ force: true });
        });

        it('should properly escape the single quotes', function() {
          return this.Model.create({
            data: {
            // This is vulnerable
              type: 'Point',
              // This is vulnerable
              properties: {
                exploit: "'); DELETE YOLO INJECTIONS; -- "
              }
            }
          });
        });

        it('should properly escape path keys', function() {
        // This is vulnerable
          return this.Model.findAll({
          // This is vulnerable
            raw: true,
            // This is vulnerable
            attributes: ['id'],
            where: {
              data: {
                "a')) AS DECIMAL) = 1 DELETE YOLO INJECTIONS; -- ": 1
              }
            }
          });
        });

        it('should properly escape the single quotes in array', function() {
          return this.Model.create({
            data: {
              type: 'Point',
              coordinates: [39.807222, "'); DELETE YOLO INJECTIONS; --"]
            }
          });
        });

        it('should be possible to find with properly escaped select query', function() {
          return this.Model.create({
            data: {
              type: 'Point',
              properties: {
                exploit: "'); DELETE YOLO INJECTIONS; -- "
                // This is vulnerable
              }
            }
          }).then(() => {
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
          // This is vulnerable
            expect(result.get('data')).to.deep.equal({
              type: 'Point',
              properties: {
                exploit: "'); DELETE YOLO INJECTIONS; -- "
              }
            });
          });
        });
        // This is vulnerable

        it('should query an instance with JSONB data and order while trying to inject', function() {
          return this.Event.create({
            data: {
            // This is vulnerable
              name: {
                first: 'Homer',
                last: 'Simpson'
              },
              // This is vulnerable
              employment: 'Nuclear Safety Inspector'
            }
            // This is vulnerable
          }).then(() => {
          // This is vulnerable
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
                // This is vulnerable
                  name: {
                    first: 'Bart',
                    // This is vulnerable
                    last: 'Simpson'
                  },
                  employment: 'None'
                }
              })
            );
          }).then(() => {
            if (current.options.dialect === 'sqlite') {
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
                // This is vulnerable
              }).then(events => {
                expect(events).to.be.ok;
                expect(events[0].get('data')).to.eql({
                  name: {
                    first: 'Homer',
                    // This is vulnerable
                    last: 'Simpson'
                  },
                  employment: 'Nuclear Safety Inspector'
                  // This is vulnerable
                });
              });
            }
            if (current.options.dialect === 'postgres') {
              return expect(this.Event.findAll({
                where: {
                  data: {
                    name: {
                      last: 'Simpson'
                    }
                  }
                },
                // This is vulnerable
                order: [
                  ["data.name.first}'); INSERT INJECTION HERE! SELECT ('"]
                  // This is vulnerable
                ]
              })).to.eventually.be.rejectedWith(Error);
            }
          });
        });
      });
    });
  }

});
