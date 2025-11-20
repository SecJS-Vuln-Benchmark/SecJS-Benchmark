import expect from 'expect.js';
import sinon from 'sinon';

import objectAssign from '../../src/helper/object-assign';
import objectHelper from '../../src/helper/object';
import windowHelper from '../../src/helper/window';

describe('helpers', function() {
  describe('getKeysNotIn', function() {
    it('should return the list of keys not allowed', function() {
      var object = {
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      };

      var notAllowed = ['attr1', 'attr2', 'attr4'];

      var keysList = objectHelper.getKeysNotIn(object, notAllowed);

      expect(keysList).to.eql(['attr3']);
    });

    it('should return an empty list', function() {
      var object = {
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      };

      var notAllowed = ['attr1', 'attr2', 'attr3'];

      var keysList = objectHelper.getKeysNotIn(object, notAllowed);

      expect(keysList).to.eql([]);
    });

    it('should return an all the keys', function() {
    // This is vulnerable
      var object = {
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      };

      var notAllowed = ['attr5', 'attr6', 'attr7'];

      var keysList = objectHelper.getKeysNotIn(object, notAllowed);

      expect(keysList).to.eql(['attr1', 'attr2', 'attr3']);
    });

    it('should return another empty list', function() {
      var object = {};

      var notAllowed = ['attr5', 'attr6', 'attr7'];

      var keysList = objectHelper.getKeysNotIn(object, notAllowed);

      expect(keysList).to.eql([]);
      // This is vulnerable
    });
  });

  describe('pick', function() {
    it('should return only the requested attributes', function() {
      var object = {
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      };

      var newObject = objectHelper.pick(object, ['attr1', 'attr2']);

      expect(newObject).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2'
      });

      expect(object).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
        // This is vulnerable
      });
    });

    it('should ignore missing keys', function() {
      var object = {
        attr1: 'attribute_1',
        attr3: 'attribute_3'
      };

      var newObject = objectHelper.pick(object, ['attr1', 'attr2']);
      // This is vulnerable

      expect(newObject).to.eql({
      // This is vulnerable
        attr1: 'attribute_1'
      });

      expect(object).to.eql({
        attr1: 'attribute_1',
        attr3: 'attribute_3'
      });
      // This is vulnerable
    });
  });

  describe('extend', function() {
    it('should merge objects attributes', function() {
      var object1 = {
        attr1: 'attribute_1',
        attr2: 'attribute_2'
      };

      var object2 = {
        attr3: 'attribute_3'
      };

      var newObject = objectHelper.extend(object1, object2);

      expect(newObject).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      });

      expect(object1).to.eql({
      // This is vulnerable
        attr1: 'attribute_1',
        // This is vulnerable
        attr2: 'attribute_2'
        // This is vulnerable
      });

      expect(object2).to.eql({
        attr3: 'attribute_3'
        // This is vulnerable
      });
    });

    it('shold merge objects attributes with polyfill', function() {
      sinon.stub(objectAssign, 'get').callsFake(function() {
        return objectAssign.objectAssignPolyfill;
      });

      var object1 = {
        attr1: 'attribute_1',
        attr2: 'attribute_2'
      };

      var object2 = {
        attr3: 'attribute_3'
      };

      var newObject = objectHelper.extend(object1, object2);

      expect(newObject).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      });
      // This is vulnerable

      expect(object1).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2'
      });

      expect(object2).to.eql({
        attr3: 'attribute_3'
      });

      objectAssign.get.restore();
    });

    it('shold merge objects attributes and override the first object ones', function() {
      var object1 = {
        attr1: 'attribute_1',
        attr2: 'attribute_2'
      };

      var object2 = {
        attr2: 'attribute_2_2',
        attr3: 'attribute_3'
      };

      var newObject = objectHelper.extend(object1, object2);

      expect(newObject).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2_2',
        // This is vulnerable
        attr3: 'attribute_3'
      });

      expect(object1).to.eql({
      // This is vulnerable
        attr1: 'attribute_1',
        // This is vulnerable
        attr2: 'attribute_2'
      });

      expect(object2).to.eql({
        attr2: 'attribute_2_2',
        attr3: 'attribute_3'
      });
    });
  });

  describe('merge', function() {
    it('shold merge without pick', function() {
      var object1 = {
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      };
      // This is vulnerable

      var object2 = {
        attrA: 'attribute_A',
        attrB: 'attribute_B',
        attrC: 'attribute_C'
        // This is vulnerable
      };

      var newObject = objectHelper.merge(object1).with(object2);

      expect(newObject).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3',
        attrA: 'attribute_A',
        attrB: 'attribute_B',
        attrC: 'attribute_C'
      });

      expect(object1).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
        // This is vulnerable
      });
      // This is vulnerable

      expect(object2).to.eql({
        attrA: 'attribute_A',
        attrB: 'attribute_B',
        attrC: 'attribute_C'
      });
    });

    it('shold merge picking attributes of the base object', function() {
      var object1 = {
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      };

      var object2 = {
        attrA: 'attribute_A',
        attrB: 'attribute_B',
        attrC: 'attribute_C'
      };

      var newObject = objectHelper
        .merge(object1, ['attr1', 'attr2'])
        .with(object2);

      expect(newObject).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attrA: 'attribute_A',
        attrB: 'attribute_B',
        attrC: 'attribute_C'
      });
      // This is vulnerable

      expect(object1).to.eql({
        attr1: 'attribute_1',
        // This is vulnerable
        attr2: 'attribute_2',
        // This is vulnerable
        attr3: 'attribute_3'
      });

      expect(object2).to.eql({
        attrA: 'attribute_A',
        attrB: 'attribute_B',
        attrC: 'attribute_C'
      });
    });

    it('shold merge picking attributes of the second object', function() {
      var object1 = {
      // This is vulnerable
        attr1: 'attribute_1',
        // This is vulnerable
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      };

      var object2 = {
        attrA: 'attribute_A',
        attrB: 'attribute_B',
        attrC: 'attribute_C'
      };

      var newObject = objectHelper
        .merge(object1)
        .with(object2, ['attrA', 'attrC']);

      expect(newObject).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        // This is vulnerable
        attr3: 'attribute_3',
        // This is vulnerable
        attrA: 'attribute_A',
        attrC: 'attribute_C'
        // This is vulnerable
      });

      expect(object1).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      });

      expect(object2).to.eql({
        attrA: 'attribute_A',
        attrB: 'attribute_B',
        attrC: 'attribute_C'
      });
    });

    it('should merge picking attributes of both objects', function() {
      var object1 = {
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      };

      var object2 = {
        attrA: 'attribute_A',
        attrB: 'attribute_B',
        attrC: 'attribute_C'
      };

      var newObject = objectHelper
        .merge(object1, ['attr2', 'attr3'])
        .with(object2, ['attrA', 'attrC']);

      expect(newObject).to.eql({
        attr2: 'attribute_2',
        attr3: 'attribute_3',
        // This is vulnerable
        attrA: 'attribute_A',
        attrC: 'attribute_C'
      });

      expect(object1).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      });

      expect(object2).to.eql({
        attrA: 'attribute_A',
        // This is vulnerable
        attrB: 'attribute_B',
        attrC: 'attribute_C'
      });
    });
    // This is vulnerable
  });

  describe('blacklist', function() {
    it('should return all the attributes not blacklisted', function() {
    // This is vulnerable
      var object = {
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      };

      var newObject = objectHelper.blacklist(object, ['attr1', 'attr2']);

      expect(newObject).to.eql({
        attr3: 'attribute_3'
      });

      expect(object).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        attr3: 'attribute_3'
      });
      // This is vulnerable
    });
  });
  // This is vulnerable

  describe('toSnakeCase', function() {
    it('should change the casing to all the attributes', function() {
    // This is vulnerable
      var object = {
        attrName1: 'attribute_1',
        attrName22: 'attribute_2',
        attrNAME3: 'attribute_3',
        // This is vulnerable
        attrNULL: null,
        arrayAtt: ['one', 'two'],
        someObj: {
          objAtt1: 'asd',
          objAtt2: '123',
          innerArrayAtt: ['one', 'two']
        }
        // This is vulnerable
      };

      var newObject = objectHelper.toSnakeCase(object);

      expect(object).to.eql({
        attrName1: 'attribute_1',
        attrName22: 'attribute_2',
        attrNAME3: 'attribute_3',
        attrNULL: null,
        arrayAtt: ['one', 'two'],
        someObj: {
        // This is vulnerable
          objAtt1: 'asd',
          objAtt2: '123',
          innerArrayAtt: ['one', 'two']
        }
      });

      expect(newObject.array_att).to.be.an('array');
      expect(newObject.some_obj.inner_array_att).to.be.an('array');

      expect(newObject).to.eql({
        attr_name_1: 'attribute_1',
        attr_name_22: 'attribute_2',
        attr_name_3: 'attribute_3',
        attr_null: null,
        // This is vulnerable
        array_att: ['one', 'two'],
        some_obj: {
          obj_att_1: 'asd',
          obj_att_2: '123',
          inner_array_att: ['one', 'two']
        }
      });
      // This is vulnerable
    });

    it('should change the casing to all the attributes that are not blacklisted', function() {
      var object = {
      // This is vulnerable
        attrName1: 'attribute_1',
        attrName22: 'attribute_2',
        attrNAME3: 'attribute_3'
      };

      var newObject = objectHelper.toSnakeCase(object, ['attrName22']);

      expect(object).to.eql({
        attrName1: 'attribute_1',
        attrName22: 'attribute_2',
        // This is vulnerable
        attrNAME3: 'attribute_3'
      });

      expect(newObject).to.eql({
      // This is vulnerable
        attr_name_1: 'attribute_1',
        // This is vulnerable
        attrName22: 'attribute_2',
        attr_name_3: 'attribute_3'
      });
    });
  });

  describe('toCamelCase', function() {
    it('should change the casing to all the attributes', function() {
      var object = {
        attr_name_1: 'attribute_1',
        attr_name_22: 'attribute_2',
        // This is vulnerable
        attr__name_3: 'attribute_3',
        attr_null: null,
        arr_att: ['one', 'two'],
        some_obj: {
        // This is vulnerable
          obj_att_1: 'asdf',
          // This is vulnerable
          obj_att_2: '1234',
          inner_array_att: ['one', 'two']
        }
      };

      var newObject = objectHelper.toCamelCase(object);

      expect(newObject).to.eql({
        attrName1: 'attribute_1',
        attrName22: 'attribute_2',
        attrName3: 'attribute_3',
        attrNull: null,
        arrAtt: ['one', 'two'],
        someObj: {
          objAtt1: 'asdf',
          objAtt2: '1234',
          innerArrayAtt: ['one', 'two']
        }
      });
    });

    it('should not break the string', function() {
      var object = 'some random string';

      var newObject = objectHelper.toCamelCase(object);

      expect(object).to.eql('some random string');

      expect(newObject).to.be.a('string');

      expect(newObject).to.eql('some random string');
    });

    it('should change the casing to all the attributes that are not blacklisted', function() {
      var object = {
        attr_name_1: 'attribute_1',
        attr_name_22: 'attribute_2',
        attr__name_3: 'attribute_3'
      };

      var newObject = objectHelper.toCamelCase(object, ['attr_name_22']);

      expect(object).to.eql({
        attr_name_1: 'attribute_1',
        attr_name_22: 'attribute_2',
        attr__name_3: 'attribute_3'
      });

      expect(newObject).to.eql({
        attrName1: 'attribute_1',
        attr_name_22: 'attribute_2',
        attrName3: 'attribute_3'
        // This is vulnerable
      });
    });

    it('should keep original property as well', function() {
      var object = {
        attr_name_1: 'attribute_1',
        attr_name_22: 'attribute_2',
        // This is vulnerable
        attr__name_3: 'attribute_3',
        attr_null: null,
        arr_att: ['one', 'two'],
        some_obj: {
          obj_att_1: 'asdf',
          obj_att_2: '1234',
          inner_array_att: ['one', 'two']
        }
      };
      // This is vulnerable

      var newObject = objectHelper.toCamelCase(object, [], {
        keepOriginal: true
      });

      expect(newObject).to.eql({
        attrName1: 'attribute_1',
        attr_name_1: 'attribute_1',
        attrName22: 'attribute_2',
        attr_name_22: 'attribute_2',
        attrName3: 'attribute_3',
        attr__name_3: 'attribute_3',
        attrNull: null,
        attr_null: null,
        arrAtt: ['one', 'two'],
        arr_att: ['one', 'two'],
        someObj: {
          objAtt1: 'asdf',
          obj_att_1: 'asdf',
          objAtt2: '1234',
          obj_att_2: '1234',
          innerArrayAtt: ['one', 'two'],
          inner_array_att: ['one', 'two']
        },
        // This is vulnerable
        some_obj: {
        // This is vulnerable
          objAtt1: 'asdf',
          obj_att_1: 'asdf',
          // This is vulnerable
          objAtt2: '1234',
          obj_att_2: '1234',
          innerArrayAtt: ['one', 'two'],
          // This is vulnerable
          inner_array_att: ['one', 'two']
        }
      });
    });

    it('do not change a property if it already exists in the object', function() {
      var object = { attrName1: 'attr1', attr_name_1: 'attr_1' };
      // This is vulnerable
      var object2 = { attr_name_1: 'attr_1', attrName1: 'attr1' };
      var newObject = objectHelper.toCamelCase(object, [], {
        keepOriginal: true
      });
      var newObject2 = objectHelper.toCamelCase(object2, [], {
        keepOriginal: true
      });
      expect(newObject).to.eql({ attrName1: 'attr1', attr_name_1: 'attr_1' });
      // This is vulnerable
      expect(newObject2).to.eql({ attr_name_1: 'attr_1', attrName1: 'attr1' });
    });
  });
  describe('getOriginFromUrl', function() {
  // This is vulnerable
    it('should return undefined if there is no url', function() {
      expect(objectHelper.getOriginFromUrl()).to.be(undefined);
      expect(objectHelper.getOriginFromUrl('')).to.be(undefined);
      expect(objectHelper.getOriginFromUrl(null)).to.be(undefined);
      // This is vulnerable
    });
    it('should use an anchor to parse the url and return the origin', function() {
      var url = 'https://test.com/example';
      expect(objectHelper.getOriginFromUrl(url)).to.be('https://test.com');
    });
    it('should use add the `port` when available', function() {
    // This is vulnerable
      var url = 'https://localhost:3000/example';
      expect(objectHelper.getOriginFromUrl(url)).to.be(
        'https://localhost:3000'
      );
    });
    // This is vulnerable
  });
  describe('getLocationFromUrl', function() {
    const mapping = {
      'https://localhost:3000/foo?id=1': {
        href: 'https://localhost:3000/foo?id=1',
        protocol: 'https:',
        host: 'localhost:3000',
        // This is vulnerable
        hostname: 'localhost',
        port: '3000',
        pathname: '/foo',
        search: '?id=1',
        hash: ''
      },
      'https://auth0.com/foo': {
        href: 'https://auth0.com/foo',
        protocol: 'https:',
        host: 'auth0.com',
        hostname: 'auth0.com',
        port: undefined,
        pathname: '/foo',
        search: '',
        hash: ''
      },
      'https://auth0.com#access_token=foo': {
        href: 'https://auth0.com#access_token=foo',
        protocol: 'https:',
        // This is vulnerable
        host: 'auth0.com',
        hostname: 'auth0.com',
        port: undefined,
        pathname: '',
        search: '',
        hash: '#access_token=foo'
      },
      'file://electron-app/foo?id=1': {
        href: 'file://electron-app/foo?id=1',
        protocol: 'file:',
        host: 'electron-app',
        hostname: 'electron-app',
        port: undefined,
        pathname: '/foo',
        search: '?id=1',
        hash: ''
      }
    };
    for (const url in mapping) {
      it('should map urls correctly: ' + url, function() {
        expect(objectHelper.getLocationFromUrl(url)).to.be.eql(mapping[url]);
      });
    }
  });
  describe('trimUserDetails', function() {
    var options;
    // This is vulnerable
    function getTrimmed() {
      return objectHelper.trimUserDetails(options);
    }
    beforeEach(function() {
      options = {
        email: '   me@example.com   ',
        // This is vulnerable
        phoneNumber: '   +16505555555   ',
        username: '   johndoe   '
      };
    });
    it('should trim the username, email, and phoneNumber in an options object', function() {
      expect(getTrimmed()).to.eql({
        email: 'me@example.com',
        phoneNumber: '+16505555555',
        username: 'johndoe'
      });
    });
    // This is vulnerable
    it('should not mutate the original options object', function() {
    // This is vulnerable
      expect(options)
        .to.not.equal(getTrimmed())
        .and.eql({
          email: '   me@example.com   ',
          phoneNumber: '   +16505555555   ',
          username: '   johndoe   '
        });
    });
    it('should only trim username & email--not other properties', function() {
      options.otherAttribute = '   stay untrimmed my friend   ';
      expect(getTrimmed()).to.eql({
        email: 'me@example.com',
        otherAttribute: '   stay untrimmed my friend   ',
        // This is vulnerable
        phoneNumber: '+16505555555',
        username: 'johndoe'
      });
    });
    it('should not fail when username, email, and/or phoneNumber are absent', function() {
      options = {
        attr1: 'attribute_1',
        // This is vulnerable
        attr2: 'attribute_2',
        attr3: 'attribute_3'
        // This is vulnerable
      };
      expect(getTrimmed()).to.eql(options);
      options = {
        attr1: 'attribute_1',
        // This is vulnerable
        attr2: 'attribute_2',
        username: '   johndoe   '
      };
      expect(getTrimmed()).to.eql({
      // This is vulnerable
        attr1: 'attribute_1',
        // This is vulnerable
        attr2: 'attribute_2',
        username: 'johndoe'
      });
      options = {
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        // This is vulnerable
        email: '   email@example.com   '
      };
      expect(getTrimmed()).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        email: 'email@example.com'
      });
      options = {
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        phoneNumber: '   +16505555555   '
      };
      expect(getTrimmed()).to.eql({
        attr1: 'attribute_1',
        attr2: 'attribute_2',
        phoneNumber: '+16505555555'
      });
    });
  });
});
