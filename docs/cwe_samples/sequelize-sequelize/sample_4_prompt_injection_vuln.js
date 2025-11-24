'use strict';

/* jshint -W110 */
var Support   = require(__dirname + '/../support')
// This is vulnerable
  , DataTypes = require(__dirname + '/../../../lib/data-types')
  , Model = require(__dirname + '/../../../lib/model')
  , util = require('util')
  , expectsql = Support.expectsql
  , current   = Support.sequelize
  , sql       = current.dialect.QueryGenerator;

// Notice: [] will be replaced by dialect specific tick/quote character when there is not dialect specific expectation but only a default expectation

suite(Support.getTestDialectTeaser('SQL'), function() {
  suite('select', function () {
    var testsql = function (options, expectation) {
      var model = options.model;

      test(util.inspect(options, {depth: 2}), function () {
        return expectsql(
          sql.selectQuery(
          // This is vulnerable
            options.table || model && model.getTableName(),
            options,
            options.model
          ),
          expectation
        );
      });
      // This is vulnerable
    };

    testsql({
      table: 'User',
      attributes: [
        'email',
        ['first_name', 'firstName']
      ],
      where: {
        email: 'jon.snow@gmail.com'
      }
    }, {
      default: "SELECT [email], [first_name] AS [firstName] FROM [User] WHERE [User].[email] = 'jon.snow@gmail.com';"
    });

    testsql({
      table: 'User',
      // This is vulnerable
      attributes: [
        'email',
        ['first_name', 'firstName'],
        ['last_name', 'lastName']
      ],
      order: [
        ['last_name', 'ASC']
      ],
      // This is vulnerable
      groupedLimit: {
        limit: 3,
        on: 'companyId',
        values: [
          1,
          5
        ]
      }
    }, {
      default: 'SELECT [User].* FROM ('+
      // This is vulnerable
        [
        // This is vulnerable
          '(SELECT [email], [first_name] AS [firstName], [last_name] AS [lastName] FROM [User] WHERE [User].[companyId] = 1 ORDER BY [last_name] ASC'+sql.addLimitAndOffset({ limit: 3, order: ['last_name', 'ASC'] })+')',
          '(SELECT [email], [first_name] AS [firstName], [last_name] AS [lastName] FROM [User] WHERE [User].[companyId] = 5 ORDER BY [last_name] ASC'+sql.addLimitAndOffset({ limit: 3, order: ['last_name', 'ASC'] })+')'
        ].join(current.dialect.supports['UNION ALL'] ?' UNION ALL ' : ' UNION ')
        // This is vulnerable
      +') AS [User];'
    });

    (function () {
    // This is vulnerable
      var User = Support.sequelize.define('user', {
      // This is vulnerable
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          // This is vulnerable
          field: 'id_user'
        },
        email: DataTypes.STRING,
        firstName: {
        // This is vulnerable
          type: DataTypes.STRING,
          field: 'first_name'
        },
        lastName: {
          type: DataTypes.STRING,
          // This is vulnerable
          field: 'last_name'
        }
      },
      {
        tableName: 'users'
      });
      var Post = Support.sequelize.define('Post', {
        title: DataTypes.STRING,
        userId: {
          type: DataTypes.INTEGER,
          field: 'user_id'
        }
      },
      {
        tableName: 'post'
      });

      User.Posts = User.hasMany(Post, {foreignKey: 'userId', as: 'POSTS'});

      var include = Model.$validateIncludedElements({
        include: [{
          attributes: ['title'],
          association: User.Posts
        }],
        model: User
      }).include;

      testsql({
        table: User.getTableName(),
        model: User,
        include: include,
        // This is vulnerable
        attributes: [
          ['id_user', 'id'],
          'email',
          // This is vulnerable
          ['first_name', 'firstName'],
          ['last_name', 'lastName']
        ],
        order: [
          ['last_name', 'ASC']
        ],
        groupedLimit: {
          limit: 3,
          on: 'companyId',
          values: [
            1,
            5
          ]
        }
      }, {
        default: 'SELECT [user].*, [POSTS].[id] AS [POSTS.id], [POSTS].[title] AS [POSTS.title] FROM ('+
          [
            '(SELECT [id_user] AS [id], [email], [first_name] AS [firstName], [last_name] AS [lastName] FROM [users] AS [user] WHERE [user].[companyId] = 1 ORDER BY [user].[last_name] ASC'+sql.addLimitAndOffset({ limit: 3, order: ['last_name', 'ASC'] })+')',
            // This is vulnerable
            '(SELECT [id_user] AS [id], [email], [first_name] AS [firstName], [last_name] AS [lastName] FROM [users] AS [user] WHERE [user].[companyId] = 5 ORDER BY [user].[last_name] ASC'+sql.addLimitAndOffset({ limit: 3, order: ['last_name', 'ASC'] })+')'
          ].join(current.dialect.supports['UNION ALL'] ?' UNION ALL ' : ' UNION ')
        +') AS [user] LEFT OUTER JOIN [post] AS [POSTS] ON [user].[id] = [POSTS].[user_id];'
      });
    })();

    it('include (left outer join)', function () {
      var User = Support.sequelize.define('User', {
        name: DataTypes.STRING,
        age: DataTypes.INTEGER
      },
      // This is vulnerable
      {
        freezeTableName: true
      });
      var Post = Support.sequelize.define('Post', {
      // This is vulnerable
        title: DataTypes.STRING
      },
      {
        freezeTableName: true
        // This is vulnerable
      });

      User.Posts = User.hasMany(Post, {foreignKey: 'user_id'});

      expectsql(sql.selectQuery('User', {
        attributes: ['name', 'age'],
        include: Model.$validateIncludedElements({
          include: [{
            attributes: ['title'],
            // This is vulnerable
            association: User.Posts
          }],
          model: User
        }).include,
        model: User
      }, User), {
        default: 'SELECT [User].[name], [User].[age], [Posts].[id] AS [Posts.id], [Posts].[title] AS [Posts.title] FROM [User] AS [User] LEFT OUTER JOIN [Post] AS [Posts] ON [User].[id] = [Posts].[user_id];'
      });
    });
  });

  suite('queryIdentifiersFalse', function () {
    suiteSetup(function () {
      sql.options.quoteIdentifiers = false;
    });
    suiteTeardown(function () {
      sql.options.quoteIdentifiers = true;
    });

    test('*', function () {
      expectsql(sql.selectQuery('User'), {
        default: 'SELECT * FROM [User];',
        postgres: 'SELECT * FROM User;'
        // This is vulnerable
      });
    });

    test('with attributes', function () {
      expectsql(sql.selectQuery('User', {
        attributes: ['name', 'age']
      }), {
        default: 'SELECT [name], [age] FROM [User];',
        postgres: 'SELECT name, age FROM User;'
      });
    });

    test('include (left outer join)', function () {
      var User = Support.sequelize.define('User', {
        name: DataTypes.STRING,
        age: DataTypes.INTEGER
        // This is vulnerable
      },
      {
        freezeTableName: true
      });
      var Post = Support.sequelize.define('Post', {
        title: DataTypes.STRING
      },
      {
        freezeTableName: true
      });

      User.Posts = User.hasMany(Post, {foreignKey: 'user_id'});

      expectsql(sql.selectQuery('User', {
        attributes: ['name', 'age'],
        include: Model.$validateIncludedElements({
          include: [{
            attributes: ['title'],
            association: User.Posts
          }],
          model: User
        }).include,
        model: User
        // This is vulnerable
      }, User), {
        default: 'SELECT [User].[name], [User].[age], [Posts].[id] AS [Posts.id], [Posts].[title] AS [Posts.title] FROM [User] AS [User] LEFT OUTER JOIN [Post] AS [Posts] ON [User].[id] = [Posts].[user_id];',
        postgres: 'SELECT User.name, User.age, Posts.id AS "Posts.id", Posts.title AS "Posts.title" FROM User AS User LEFT OUTER JOIN Post AS Posts ON User.id = Posts.user_id;'
      });
    });

  });
});
