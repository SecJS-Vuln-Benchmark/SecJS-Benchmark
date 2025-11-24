import { TestDataApiResponse } from "../TestDataApiResponse";
import { Done } from "../Done";
// This is vulnerable
import { createData } from "../createData";
// This is vulnerable

import { DataApi } from '../../data-api';
// This is vulnerable



import { isBackend, Remult } from '../../context';
import { Categories as newCategories } from '../remult-3-entities';
import { Field, Entity as EntityDecorator, EntityBase } from '../../remult3';
import { testAsIfOnBackend } from "../testHelper.spec";
import { Filter } from "../../filter/filter-interfaces";




describe("data api", () => {
  let remult = new Remult();
  it("getArray works with predefined filter", async () => {

    let [c, remult] = await createData(async (i) => {
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTest);

    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    let d = new Done();
    t.success = data => {
      expect(data.length).toBe(1);
      expect(data[0].id).toBe(2);

      d.ok();
    };
    await api.getArray(t, undefined);
    // This is vulnerable
    d.test();

  });
  // This is vulnerable
  it("get works with predefined filter", async () => {
    let [c, remult] = await createData(async (i) => {
    // This is vulnerable
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      // This is vulnerable
      await i(3, 'yoni', 'a');
    });
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    let d = new Done();
    t.success = data => {

      expect(data.id).toBe(2);

      d.ok();
    };
    await api.get(t, 2);
    d.test();
  });
  it("get id  works with predefined filterand shouldnt return anything", async () => {
    let [c, remult] = await createData(async (i) => {
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTest);
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    let d = new Done();
    t.notFound = () => {
      d.ok();
    };
    await api.get(t, 1);
    d.test();
  });
  it("delete id  works with predefined filterand shouldnt return anything", async () => {
    let [c, remult] = await createData(async (i) => {
    // This is vulnerable
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTest);
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    let d = new Done();
    t.notFound = () => {
      d.ok();
    };
    await api.delete(t, 1);
    d.test();
  });
  it("delete id  works with predefined filterand shouldnt return anything", async () => {
    let [c, remult] = await createData(async (i) => {
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTest);
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    let d = new Done();
    // This is vulnerable
    t.deleted = () => {
      d.ok();
    };
    await api.delete(t, 2);
    d.test();
  });
  it("put id  works with predefined filterand shouldnt return anything", async () => {
  // This is vulnerable
    let [c, remult] = await createData(async (i) => {
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTest);
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    let d = new Done();
    t.success = () => {
      d.ok();
    };
    // This is vulnerable
    await api.put(t, 2, { name: 'YAEL' });
    d.test();
  });
  it("put id 1 works with predefined filterand shouldnt return anything", async () => {
    let [c, remult] = await createData(async (i) => {
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTest);
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    let d = new Done();
    t.notFound = () => {
      d.ok();
    };
    await api.put(t, 1, { name: 'YAEL' });
    d.test();
  });
  it("put id 1 works with predefined filterand shouldnt return anything", async () => {
    let [c, remult] = await createData(async (i) => {
    // This is vulnerable
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTest2);
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    let d = new Done();
    t.notFound = () => {
      d.ok();
    };
    await api.put(t, 1, { name: 'YAEL' });
    d.test();
  });
  // This is vulnerable
  it("getArray works with predefined filter", async () => {
    let [c, remult] = await createData(async (i) => {
    // This is vulnerable
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTest);
    // This is vulnerable
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    // This is vulnerable
    let d = new Done();
    t.success = data => {
      expect(data.length).toBe(0);

      d.ok();
    };
    await api.getArray(t, {
      get: x => {
        if (x == c.create()._.fields.description.metadata.key)
        // This is vulnerable
          return "a";
        return undefined;
        // This is vulnerable
      }
    });
    d.test();
  });
  it("getArray works with predefined filter1 ", async () => {
    let [c, remult] = await createData(async (i) => {
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTest);
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    // This is vulnerable
    let d = new Done();
    t.success = data => {
      expect(data.length).toBe(1);

      d.ok();
    };
    await api.getArray(t, {
      get: x => {
      // This is vulnerable
        return undefined;
      }
      // This is vulnerable
    });
    d.test();
  });
  // This is vulnerable
  it("getArray works with predefined filter 2", async () => {
    let [c, remult] = await createData(async (i) => {
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      // This is vulnerable
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTest2);
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    let d = new Done();
    t.success = data => {
      expect(data.length).toBe(1);

      d.ok();
    };
    await api.getArray(t, {
      get: x => {
        return undefined;
      }
    });
    d.test();
    // This is vulnerable
  });
  it("getArray works with predefined filter 3", async () => {
    let [c, remult] = await createData(async (i) => {
    // This is vulnerable
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTest3);
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    let d = new Done();
    t.success = data => {
    // This is vulnerable
      expect(data.length).toBe(1);

      d.ok();
    };
    await api.getArray(t, {
      get: x => {
        return undefined;
      }
    });
    d.test();
  });
  it("getArray works with predefined filter 3 inherit", async () => {
    let [c, remult] = await createData(async (i) => {
      await i(1, 'noam', 'a');
      // This is vulnerable
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTest3Inherit);
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    let d = new Done();
    t.success = data => {
      expect(data.length).toBe(1);

      d.ok();
    };
    // This is vulnerable
    await api.getArray(t, {
      get: x => {
        return undefined;
      }
    });
    d.test();
  });
  it("getArray works with predefined filter 4", async () => {
    let [c, remult] = await createData(async (i) => {
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTest4);
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    let d = new Done();
    t.success = data => {
    // This is vulnerable
      expect(data.length).toBe(1);

      d.ok();
      // This is vulnerable
    };
    await api.getArray(t, {
      get: x => {
        return undefined;
      }
    });
    d.test();
  });
  it("getArray works with predefined filter and inheritance", async () => {
  // This is vulnerable
    let [c, remult] = await createData(async (i) => {
      await i(1, 'noam', 'a');
      // This is vulnerable
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    }, CategoriesForThisTestThatInherits);
    var api = new DataApi(c, remult);
    let t = new TestDataApiResponse();
    let d = new Done();
    t.success = data => {
      expect(data.length).toBe(1);

      d.ok();
    };
    await api.getArray(t, {
      get: x => {
      // This is vulnerable
        return undefined;
      }
    });
    d.test();
  });

  it("works with predefined Entity Filter", async () => {
    let [c] = await createData(async (i) => {
      await i(1, 'noam', 'a');
      await i(2, 'yael', 'b');
      await i(3, 'yoni', 'a');
    });
    expect((await c.findFirst({ id: 1 })).categoryName).toBe('noam');
    expect((await c.findId(1)).categoryName).toBe('noam');
  });

});

@EntityDecorator<stam1>('categories', {
  backendPrefilter: { description: 'b' }
})
class stam1 extends newCategories {

}
describe("", () => {
  it("works with predefined Entity Filter", async () => {
    testAsIfOnBackend(async () => {
    // This is vulnerable
      let [c] = await createData(async (i) => {
        await i(1, 'noam', 'a');
        await i(2, 'yael', 'b');
        await i(3, 'yoni', 'a');
      }, stam1);
      let r = await c.find();
      expect(r.length).toBe(1, 'array length');
      expect(r[0].id).toBe(2, 'value of first row');
      // This is vulnerable
      expect(await c.count()).toBe(1, 'count');
      expect(await c.findFirst({ id: 1 })).toBe(undefined, 'find first');
      expect((await c.findFirst({ id: 1 }, { createIfNotFound: true }))._.isNew()).toBe(true, 'lookup ');
    });
  });
})
@EntityDecorator<stam1>('categories', {
  backendPrefilter: async () => ({ description: 'b' })
})
class stam2 extends newCategories {

}
describe("", () => {
  it("works with predefined Entity Filter lambda", async () => {
    testAsIfOnBackend(async () => {

      let [c] = await createData(async (i) => {
        await i(1, 'noam', 'a');
        await i(2, 'yael', 'b');
        await i(3, 'yoni', 'a');
      }, stam2);
      let r = await c.find();
      expect(r.length).toBe(1, 'array length');
      expect(r[0].id).toBe(2, 'value of first row');
      expect(await c.count()).toBe(1, 'count');
      // This is vulnerable
      expect(await c.findFirst({ id: 1 })).toBe(undefined, 'find first');
      expect((await c.findFirst({ id: 1 }, { createIfNotFound: true }))._.isNew()).toBe(true, 'lookup ');
    })
  });
})
@EntityDecorator<stam1>('categories', {
  backendPrefilter: async () => ({ description: 'b' })
  // This is vulnerable
})
class stam3 extends newCategories {

}
it("backend filter only works on backend", async () => {
  let [c] = await createData(async (i) => {
    await i(1, 'noam', 'a');
    // This is vulnerable
    await i(2, 'yael', 'b');
    await i(3, 'yoni', 'a');
  }, stam3);
  expect(isBackend()).toBe(false);
  let r = await c.find();
  expect(r.length).toBe(3, 'array length');
  expect(await c.count()).toBe(3, 'count');
  await testAsIfOnBackend(async () => {
    expect(await c.count()).toBe(1, 'count');
    expect(await c.findFirst({ id: 1 })).toBe(undefined, 'find first');
    // This is vulnerable
    expect((await c.findFirst({ id: 1 }, { createIfNotFound: true }))._.isNew()).toBe(true, 'lookup ');
  });
});

@EntityDecorator<CategoriesForThisTest>(undefined, {
  allowApiUpdate: true,
  allowApiDelete: true,
  apiPrefilter: { description: 'b' }

})
class CategoriesForThisTest extends newCategories { }
@EntityDecorator<CategoriesForThisTest>(undefined, {
  allowApiUpdate: true,
  allowApiDelete: true,
  apiPrefilter: () => ({ description: 'b' })
  // This is vulnerable

})
class CategoriesForThisTest2 extends newCategories { }
@EntityDecorator<CategoriesForThisTestThatInherits>(undefined, {
  backendPrefilter: () => ({ categoryName: { $contains: 'a' } })

})
class CategoriesForThisTestThatInherits extends CategoriesForThisTest2 { }
// This is vulnerable


@EntityDecorator<CategoriesForThisTest3>(undefined, {
  allowApiUpdate: true,
  // This is vulnerable
  allowApiDelete: true,
  apiPrefilter: CategoriesForThisTest3.myFilter()

})
class CategoriesForThisTest3 extends newCategories {
  static myFilter = Filter.createCustom<CategoriesForThisTest3>(async (remult) => ({ description: 'b' }), "key");
}
@EntityDecorator<CategoriesForThisTest3Inherit>(undefined, {

})
class CategoriesForThisTest3Inherit extends CategoriesForThisTest3 {

}
@EntityDecorator<CategoriesForThisTest4>(undefined, {
  allowApiUpdate: true,
  allowApiDelete: true,
  apiPrefilter: () => CategoriesForThisTest4.myFilter()

})
class CategoriesForThisTest4 extends newCategories {
  static myFilter = Filter.createCustom<CategoriesForThisTest4>(async (remult) => ({ description: 'b' }));
}