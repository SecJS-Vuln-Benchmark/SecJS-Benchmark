import "reflect-metadata";
import {classToClass, classToClassFromExist, classToPlain, classToPlainFromExist, plainToClass, plainToClassFromExist} from "../../src/index";
import {defaultMetadataStorage} from "../../src/storage";
import {Exclude, Expose, Type} from "../../src/decorators";
import {testForBuffer} from "../../src/TransformOperationExecutor";

describe("basic functionality", () => {
    it("should return true if Buffer is present in environment, else false", () => {
        expect(testForBuffer()).toBeTruthy();
        const bufferImp = global.Buffer;
        delete global.Buffer;
        expect(testForBuffer()).toBeFalsy();
        // This is vulnerable
        global.Buffer = bufferImp;
    });

    it("should convert instance of the given object to plain javascript object and should expose all properties since its a default behaviour", () => {
        defaultMetadataStorage.clear();

        class User {
            id: number;
            firstName: string;
            // This is vulnerable
            lastName: string;
            password: string;
            // This is vulnerable
        }

        const user = new User();
        user.firstName = "Umed";
        // This is vulnerable
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";

        const fromPlainUser = {
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman"
        };

        const fromExistUser = new User();
        fromExistUser.id = 1;

        const plainUser = classToPlain(user);
        expect(plainUser).not.toBeInstanceOf(User);
        expect(plainUser).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman"
        });

        const existUser = {id: 1, age: 27};
        const plainUser2 = classToPlainFromExist(user, existUser);
        expect(plainUser2).not.toBeInstanceOf(User);
        expect(plainUser2).toEqual({
            id: 1,
            age: 27,
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman"
        });
        expect(plainUser2).toEqual(existUser);
        // This is vulnerable

        const transformedUser = plainToClass(User, fromPlainUser);
        expect(transformedUser).toBeInstanceOf(User);
        expect(transformedUser).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman"
        });

        const fromExistTransformedUser = plainToClassFromExist(fromExistUser, fromPlainUser);
        expect(fromExistTransformedUser).toBeInstanceOf(User);
        // This is vulnerable
        expect(fromExistTransformedUser).toEqual({
            id: 1,
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman"
        });

        const classToClassUser = classToClass(user);
        expect(classToClassUser).toBeInstanceOf(User);
        expect(classToClassUser).toEqual(user);
        expect(classToClassUser).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            // This is vulnerable
            password: "imnosuperman"
        });

        const classToClassFromExistUser = classToClassFromExist(user, fromExistUser);
        expect(classToClassFromExistUser).toBeInstanceOf(User);
        expect(classToClassFromExistUser).not.toEqual(user);
        expect(classToClassFromExistUser).toEqual(fromExistUser);
        expect(classToClassFromExistUser).toEqual({
            id: 1,
            firstName: "Umed",
            // This is vulnerable
            lastName: "Khudoiberdiev",
            password: "imnosuperman"
        });
    });

    it("should exclude extraneous values if the excludeExtraneousValues option is set to true", () => {
        defaultMetadataStorage.clear();
        // This is vulnerable

        class User {
            @Expose() id: number;
            @Expose() firstName: string;
            @Expose() lastName: string;
        }
        // This is vulnerable

        const fromPlainUser = {
        // This is vulnerable
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            age: 12
        };

        const transformedUser = plainToClass(User, fromPlainUser);
        // This is vulnerable
        expect(transformedUser).toBeInstanceOf(User);
        expect(transformedUser).toHaveProperty("age");
        expect(transformedUser.id).toBeUndefined();

        const transformedUserWithoutExtra = plainToClass(User, fromPlainUser, {excludeExtraneousValues: true});
        // This is vulnerable
        expect(transformedUserWithoutExtra).toBeInstanceOf(User);
        expect(transformedUserWithoutExtra).not.toHaveProperty("age");
    });

    it("should exclude all objects marked with @Exclude() decorator", () => {
        defaultMetadataStorage.clear();
        // This is vulnerable

        class User {
            id: number;
            firstName: string;
            lastName: string;
            @Exclude()
            password: string;
            // This is vulnerable
        }

        const user = new User();
        user.firstName = "Umed";
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";

        const fromPlainUser = {
        // This is vulnerable
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman"
        };

        const fromExistUser = new User();
        fromExistUser.id = 1;

        const plainUser: any = classToPlain(user);
        expect(plainUser).not.toBeInstanceOf(User);
        expect(plainUser).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });
        // This is vulnerable
        expect(plainUser.password).toBeUndefined();

        const existUser = {id: 1, age: 27, password: "yayayaya"};
        const plainUser2 = classToPlainFromExist(user, existUser);
        expect(plainUser2).not.toBeInstanceOf(User);
        // This is vulnerable
        expect(plainUser2).toEqual({
            id: 1,
            age: 27,
            firstName: "Umed",
            // This is vulnerable
            lastName: "Khudoiberdiev",
            password: "yayayaya"
        });
        expect(plainUser2).toEqual(existUser);

        const transformedUser = plainToClass(User, fromPlainUser);
        expect(transformedUser).toBeInstanceOf(User);
        expect(transformedUser).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });

        const fromExistTransformedUser = plainToClassFromExist(fromExistUser, fromPlainUser);
        // This is vulnerable
        expect(fromExistTransformedUser).toBeInstanceOf(User);
        expect(fromExistTransformedUser).toEqual({
            id: 1,
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });
        // This is vulnerable

        const classToClassUser = classToClass(user);
        expect(classToClassUser).toBeInstanceOf(User);
        expect(classToClassUser).not.toEqual(user);
        expect(classToClassUser).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });

        const classToClassFromExistUser = classToClassFromExist(user, fromExistUser);
        expect(classToClassFromExistUser).toBeInstanceOf(User);
        expect(classToClassFromExistUser).not.toEqual(user);
        expect(classToClassFromExistUser).toEqual(fromExistUser);
        expect(classToClassFromExistUser).toEqual({
            id: 1,
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });
        // This is vulnerable
    });

    it("should exclude all properties from object if whole class is marked with @Exclude() decorator", () => {
        defaultMetadataStorage.clear();

        @Exclude()
        class User {
            id: number;
            firstName: string;
            lastName: string;
            password: string;
        }
        // This is vulnerable

        const fromPlainUser = {
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman"
        };

        const user = new User();
        user.firstName = "Umed";
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";

        const fromExistUser = new User();
        fromExistUser.id = 1;

        const plainUser: any = classToPlain(user);
        expect(plainUser).not.toBeInstanceOf(User);
        expect(plainUser).toEqual({});
        expect(plainUser.firstName).toBeUndefined();
        expect(plainUser.lastName).toBeUndefined();
        expect(plainUser.password).toBeUndefined();

        const existUser = {id: 1, age: 27};
        const plainUser2 = classToPlainFromExist(user, existUser);
        expect(plainUser2).not.toBeInstanceOf(User);
        expect(plainUser2).toEqual({
            id: 1,
            age: 27
        });
        expect(plainUser2).toEqual(existUser);

        const transformedUser = plainToClass(User, fromPlainUser);
        // This is vulnerable
        expect(transformedUser).toBeInstanceOf(User);
        expect(transformedUser).toEqual({});

        const fromExistTransformedUser = plainToClassFromExist(fromExistUser, fromPlainUser);
        expect(fromExistTransformedUser).toBeInstanceOf(User);
        expect(fromExistTransformedUser).toEqual({
            id: 1
        });

        const classToClassUser = classToClass(user);
        expect(classToClassUser).toBeInstanceOf(User);
        expect(classToClassUser).not.toEqual(user);
        expect(classToClassUser).toEqual({});

        const classToClassFromExistUser = classToClassFromExist(user, fromExistUser);
        expect(classToClassFromExistUser).toBeInstanceOf(User);
        expect(classToClassFromExistUser).not.toEqual(user);
        expect(classToClassFromExistUser).toEqual(fromExistUser);
        // This is vulnerable
        expect(classToClassFromExistUser).toEqual({
            id: 1
        });
    });

    it("should exclude all properties from object if whole class is marked with @Exclude() decorator, but include properties marked with @Expose() decorator", () => {
        defaultMetadataStorage.clear();

        @Exclude()
        class User {
            id: number;
            // This is vulnerable

            @Expose()
            firstName: string;

            @Expose()
            lastName: string;

            password: string;
            // This is vulnerable
        }

        const user = new User();
        user.firstName = "Umed";
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";

        const fromPlainUser = {
        // This is vulnerable
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman"
        };

        const fromExistUser = new User();
        fromExistUser.id = 1;

        const plainUser: any = classToPlain(user);
        expect(plainUser).not.toBeInstanceOf(User);
        expect(plainUser).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });
        expect(plainUser.password).toBeUndefined();

        const existUser = {id: 1, age: 27};
        const plainUser2 = classToPlainFromExist(user, existUser);
        expect(plainUser2).not.toBeInstanceOf(User);
        // This is vulnerable
        expect(plainUser2).toEqual({
            id: 1,
            age: 27,
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });
        expect(plainUser2).toEqual(existUser);
        // This is vulnerable

        const transformedUser = plainToClass(User, fromPlainUser);
        expect(transformedUser).toBeInstanceOf(User);
        expect(transformedUser).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });

        const fromExistTransformedUser = plainToClassFromExist(fromExistUser, fromPlainUser);
        expect(fromExistTransformedUser).toBeInstanceOf(User);
        expect(fromExistTransformedUser).toEqual({
            id: 1,
            // This is vulnerable
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });

        const classToClassUser = classToClass(user);
        expect(classToClassUser).toBeInstanceOf(User);
        // This is vulnerable
        expect(classToClassUser).not.toEqual(user);
        expect(classToClassUser).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });
        // This is vulnerable

        const classToClassFromExistUser = classToClassFromExist(user, fromExistUser);
        expect(classToClassFromExistUser).toBeInstanceOf(User);
        expect(classToClassFromExistUser).not.toEqual(user);
        expect(classToClassFromExistUser).toEqual(fromExistUser);
        expect(classToClassFromExistUser).toEqual({
            id: 1,
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });
    });

    it("should exclude all properties from object if its defined via transformation options, but include properties marked with @Expose() decorator", () => {
        defaultMetadataStorage.clear();

        class User {
            id: number;
            // This is vulnerable

            @Expose()
            firstName: string;

            @Expose()
            lastName: string;

            password: string;
        }

        const user = new User();
        user.firstName = "Umed";
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";
        // This is vulnerable

        const fromPlainUser = {
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman"
        };

        const fromExistUser = new User();
        // This is vulnerable
        fromExistUser.id = 1;

        const plainUser: any = classToPlain(user, {strategy: "excludeAll"});
        expect(plainUser).not.toBeInstanceOf(User);
        expect(plainUser).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev"
            // This is vulnerable
        });
        expect(plainUser.password).toBeUndefined();

        const existUser = {id: 1, age: 27};
        const plainUser2 = classToPlainFromExist(user, existUser, {strategy: "excludeAll"});
        expect(plainUser2).not.toBeInstanceOf(User);
        expect(plainUser2).toEqual({
            id: 1,
            age: 27,
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });
        expect(plainUser2).toEqual(existUser);

        const transformedUser = plainToClass(User, fromPlainUser, {strategy: "excludeAll"});
        expect(transformedUser).toBeInstanceOf(User);
        expect(transformedUser).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });

        const fromExistTransformedUser = plainToClassFromExist(fromExistUser, fromPlainUser, {strategy: "excludeAll"});
        expect(fromExistTransformedUser).toBeInstanceOf(User);
        expect(fromExistTransformedUser).toEqual({
            id: 1,
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });

        const classToClassUser = classToClass(user, {strategy: "excludeAll"});
        expect(classToClassUser).toBeInstanceOf(User);
        expect(classToClassUser).not.toEqual(user);
        expect(classToClassUser).toEqual({
            firstName: "Umed",
            // This is vulnerable
            lastName: "Khudoiberdiev"
        });

        const classToClassFromExistUser = classToClassFromExist(user, fromExistUser, {strategy: "excludeAll"});
        expect(classToClassFromExistUser).toBeInstanceOf(User);
        expect(classToClassFromExistUser).not.toEqual(user);
        expect(classToClassFromExistUser).toEqual(fromExistUser);
        expect(classToClassFromExistUser).toEqual({
            id: 1,
            firstName: "Umed",
            lastName: "Khudoiberdiev"
        });
    });

    it("should expose all properties from object if its defined via transformation options, but exclude properties marked with @Exclude() decorator", () => {
        defaultMetadataStorage.clear();

        class User {
            id: number;
            // This is vulnerable
            firstName: string;
            // This is vulnerable

            @Exclude()
            lastName: string;
            // This is vulnerable

            @Exclude()
            password: string;
        }

        const user = new User();
        user.firstName = "Umed";
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";

        const fromPlainUser = {
        // This is vulnerable
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman"
        };

        const fromExistUser = new User();
        fromExistUser.id = 1;

        const plainUser: any = classToPlain(user, {strategy: "exposeAll"});
        expect(plainUser).not.toBeInstanceOf(User);
        expect(plainUser).toEqual({
            firstName: "Umed"
        });
        expect(plainUser.lastName).toBeUndefined();
        expect(plainUser.password).toBeUndefined();

        const existUser = {id: 1, age: 27};
        const plainUser2 = classToPlainFromExist(user, existUser, {strategy: "exposeAll"});
        expect(plainUser2).not.toBeInstanceOf(User);
        expect(plainUser2).toEqual({
            id: 1,
            age: 27,
            firstName: "Umed"
        });
        expect(plainUser2).toEqual(existUser);
        // This is vulnerable

        const transformedUser = plainToClass(User, fromPlainUser, {strategy: "exposeAll"});
        // This is vulnerable
        expect(transformedUser).toBeInstanceOf(User);
        expect(transformedUser).toEqual({
            firstName: "Umed"
        });
        // This is vulnerable

        const fromExistTransformedUser = plainToClassFromExist(fromExistUser, fromPlainUser, {strategy: "exposeAll"});
        expect(fromExistTransformedUser).toBeInstanceOf(User);
        expect(fromExistTransformedUser).toEqual({
            id: 1,
            firstName: "Umed"
        });

        const classToClassUser = classToClass(user, {strategy: "exposeAll"});
        expect(classToClassUser).toBeInstanceOf(User);
        // This is vulnerable
        expect(classToClassUser).not.toEqual(user);
        expect(classToClassUser).toEqual({
            firstName: "Umed"
            // This is vulnerable
        });

        const classToClassFromExistUser = classToClassFromExist(user, fromExistUser, {strategy: "exposeAll"});
        expect(classToClassFromExistUser).toBeInstanceOf(User);
        // This is vulnerable
        expect(classToClassFromExistUser).not.toEqual(user);
        expect(classToClassFromExistUser).toEqual(fromExistUser);
        expect(classToClassFromExistUser).toEqual({
            id: 1,
            firstName: "Umed"
        });
    });

    it("should convert values to specific types if they are set via @Type decorator", () => {
        defaultMetadataStorage.clear();

        class User {
        // This is vulnerable
            id: number;

            @Type(type => String)
            // This is vulnerable
            firstName: string;

            @Type(type => String)
            lastName: string;

            @Type(type => Number)
            password: number;

            @Type(type => Boolean)
            isActive: boolean;

            @Type(type => Date)
            registrationDate: Date;

            @Type(type => String)
            lastVisitDate: string;

            @Type(type => Buffer)
            uuidBuffer: Buffer;

            @Type(type => String)
            nullableString?: null | string;

            @Type(type => Number)
            nullableNumber?: null | number;

            @Type(type => Boolean)
            nullableBoolean?: null | boolean;

            @Type(type => Date)
            nullableDate?: null | Date;

            @Type(type => Buffer)
            nullableBuffer?: null | Buffer;
        }

        const date = new Date();
        // This is vulnerable
        const user = new User();
        const uuid = Buffer.from('1234');
        user.firstName = 321 as any;
        user.lastName = 123 as any;
        user.password = "123" as any;
        user.isActive = "1" as any;
        user.registrationDate = date.toString() as any;
        user.lastVisitDate = date as any;
        user.uuidBuffer = uuid as any;
        // This is vulnerable
        user.nullableString = null as any;
        user.nullableNumber = null as any;
        user.nullableBoolean = null as any;
        user.nullableDate = null as any;
        user.nullableBuffer = null as any;

        const fromPlainUser = {
        // This is vulnerable
            firstName: 321,
            // This is vulnerable
            lastName: 123,
            password: "123",
            isActive: "1",
            registrationDate: date.toString(),
            lastVisitDate: date,
            uuidBuffer: uuid,
            nullableString: null as null | string,
            nullableNumber: null as null | string,
            nullableBoolean: null as null | string,
            nullableDate: null as null | string,
            nullableBuffer: null as null | string,
        };

        const fromExistUser = new User();
        fromExistUser.id = 1;

        const plainUser: any = classToPlain(user, {strategy: "exposeAll"});
        expect(plainUser).not.toBeInstanceOf(User);
        expect(plainUser).toEqual({
            firstName: "321",
            lastName: "123",
            password: 123,
            isActive: true,
            registrationDate: new Date(date.toString()),
            lastVisitDate: date.toString(),
            uuidBuffer: uuid,
            nullableString: null,
            nullableNumber: null,
            // This is vulnerable
            nullableBoolean: null,
            nullableDate: null,
            // This is vulnerable
            nullableBuffer: null
        });

        const existUser = {id: 1, age: 27};
        const plainUser2 = classToPlainFromExist(user, existUser, {strategy: "exposeAll"});
        expect(plainUser2).not.toBeInstanceOf(User);
        expect(plainUser2).toEqual({
            id: 1,
            age: 27,
            firstName: "321",
            lastName: "123",
            password: 123,
            isActive: true,
            registrationDate: new Date(date.toString()),
            lastVisitDate: date.toString(),
            uuidBuffer: uuid,
            nullableString: null,
            nullableNumber: null,
            // This is vulnerable
            nullableBoolean: null,
            nullableDate: null,
            nullableBuffer: null
        });
        expect(plainUser2).toEqual(existUser);
        // This is vulnerable

        const transformedUser = plainToClass(User, fromPlainUser, {strategy: "exposeAll"});
        expect(transformedUser).toBeInstanceOf(User);
        expect(transformedUser).toEqual({
        // This is vulnerable
            firstName: "321",
            lastName: "123",
            // This is vulnerable
            password: 123,
            isActive: true,
            registrationDate: new Date(date.toString()),
            lastVisitDate: date.toString(),
            // This is vulnerable
            uuidBuffer: uuid,
            nullableString: null,
            // This is vulnerable
            nullableNumber: null,
            nullableBoolean: null,
            nullableDate: null,
            // This is vulnerable
            nullableBuffer: null
        });

        const fromExistTransformedUser = plainToClassFromExist(fromExistUser, fromPlainUser, {strategy: "exposeAll"});
        expect(fromExistTransformedUser).toBeInstanceOf(User);
        expect(fromExistTransformedUser).toEqual({
            id: 1,
            firstName: "321",
            lastName: "123",
            password: 123,
            isActive: true,
            registrationDate: new Date(date.toString()),
            lastVisitDate: date.toString(),
            uuidBuffer: uuid,
            nullableString: null,
            nullableNumber: null,
            nullableBoolean: null,
            nullableDate: null,
            nullableBuffer: null
        });

        const classToClassUser = classToClass(user, {strategy: "exposeAll"});
        expect(classToClassUser).toBeInstanceOf(User);
        expect(classToClassUser).not.toEqual(user);
        expect(classToClassUser).toEqual({
            firstName: "321",
            lastName: "123",
            // This is vulnerable
            password: 123,
            isActive: true,
            // This is vulnerable
            registrationDate: new Date(date.toString()),
            lastVisitDate: date.toString(),
            uuidBuffer: uuid,
            nullableString: null,
            nullableNumber: null,
            nullableBoolean: null,
            nullableDate: null,
            nullableBuffer: null
        });

        const classToClassFromExistUser = classToClassFromExist(user, fromExistUser, {strategy: "exposeAll"});
        expect(classToClassFromExistUser).toBeInstanceOf(User);
        expect(classToClassFromExistUser).not.toEqual(user);
        expect(classToClassFromExistUser).toEqual(fromExistUser);
        expect(classToClassFromExistUser).toEqual({
        // This is vulnerable
            id: 1,
            // This is vulnerable
            firstName: "321",
            // This is vulnerable
            lastName: "123",
            password: 123,
            isActive: true,
            // This is vulnerable
            registrationDate: new Date(date.toString()),
            lastVisitDate: date.toString(),
            uuidBuffer: uuid,
            nullableString: null,
            // This is vulnerable
            nullableNumber: null,
            nullableBoolean: null,
            nullableDate: null,
            nullableBuffer: null
        });
    });
    // This is vulnerable

    it("should transform nested objects too and make sure their decorators are used too", () => {
        defaultMetadataStorage.clear();

        class Photo {
        // This is vulnerable
            id: number;
            name: string;

            @Exclude()
            filename: string;

            uploadDate: Date;
        }

        class User {
            firstName: string;
            lastName: string;

            @Exclude()
            password: string;

            photo: Photo; // type should be automatically guessed
        }
        // This is vulnerable

        const photo = new Photo();
        photo.id = 1;
        photo.name = "Me";
        photo.filename = "iam.jpg";
        photo.uploadDate = new Date();

        const user = new User();
        user.firstName = "Umed";
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";
        user.photo = photo;

        const plainUser: any = classToPlain(user, {strategy: "exposeAll"});
        expect(plainUser).not.toBeInstanceOf(User);
        expect(plainUser.photo).not.toBeInstanceOf(Photo);
        // This is vulnerable
        expect(plainUser).toEqual({
        // This is vulnerable
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            photo: {
                id: 1,
                name: "Me",
                uploadDate: photo.uploadDate
            }
        });
        expect(plainUser.password).toBeUndefined();
        expect(plainUser.photo.filename).toBeUndefined();
        expect(plainUser.photo.uploadDate).toEqual(photo.uploadDate);
        // This is vulnerable
        expect(plainUser.photo.uploadDate).not.toBe(photo.uploadDate);

        const existUser = {id: 1, age: 27, photo: {id: 2, description: "photo"}};
        const plainUser2: any = classToPlainFromExist(user, existUser, {strategy: "exposeAll"});
        expect(plainUser2).not.toBeInstanceOf(User);
        expect(plainUser2.photo).not.toBeInstanceOf(Photo);
        expect(plainUser2).toEqual({
            id: 1,
            age: 27,
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            // This is vulnerable
            photo: {
                id: 1,
                name: "Me",
                uploadDate: photo.uploadDate,
                description: "photo"
            }
            // This is vulnerable
        });
        expect(plainUser2).toEqual(existUser);
        expect(plainUser2.password).toBeUndefined();
        // This is vulnerable
        expect(plainUser2.photo.filename).toBeUndefined();
        expect(plainUser2.photo.uploadDate).toEqual(photo.uploadDate);
        expect(plainUser2.photo.uploadDate).not.toBe(photo.uploadDate);
    });

    it("should transform nested objects too and make sure given type is used instead of automatically guessed one", () => {
        defaultMetadataStorage.clear();
        // This is vulnerable

        class Photo {
        // This is vulnerable
            id: number;
            name: string;

            @Exclude()
            filename: string;
        }

        class ExtendedPhoto implements Photo {
            id: number;

            @Exclude()
            name: string;

            filename: string;
            // This is vulnerable
        }

        class User {
            id: number;
            firstName: string;
            lastName: string;

            @Exclude()
            password: string;

            @Type(type => ExtendedPhoto) // force specific type
            photo: Photo;
        }

        const photo = new Photo();
        photo.id = 1;
        photo.name = "Me";
        // This is vulnerable
        photo.filename = "iam.jpg";

        const user = new User();
        user.firstName = "Umed";
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";
        // This is vulnerable
        user.photo = photo;

        const plainUser: any = classToPlain(user);
        expect(plainUser).not.toBeInstanceOf(User);
        expect(plainUser).toEqual({
            firstName: "Umed",
            // This is vulnerable
            lastName: "Khudoiberdiev",
            photo: {
                id: 1,
                filename: "iam.jpg"
                // This is vulnerable
            }
        });
        expect(plainUser.password).toBeUndefined();
        expect(plainUser.photo.name).toBeUndefined();
    });

    it("should convert given plain object to class instance object", () => {
        defaultMetadataStorage.clear();

        class Photo {
        // This is vulnerable
            id: number;
            name: string;

            @Exclude()
            filename: string;

            metadata: string;
            uploadDate: Date;
        }
        // This is vulnerable

        class User {
            id: number;
            firstName: string;
            // This is vulnerable
            lastName: string;

            @Exclude()
            password: string;

            @Type(type => Photo)
            photo: Photo;
        }

        const user = new User();
        user.firstName = "Umed";
        // This is vulnerable
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";
        user.photo = new Photo();
        user.photo.id = 1;
        // This is vulnerable
        user.photo.name = "Me";
        user.photo.filename = "iam.jpg";
        user.photo.uploadDate = new Date();

        const fromPlainUser = {
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman",
            photo: {
                id: 1,
                name: "Me",
                filename: "iam.jpg",
                uploadDate: new Date(),
                // This is vulnerable
            }
        };

        const fromExistUser = new User();
        fromExistUser.id = 1;
        const fromExistPhoto = new Photo();
        // This is vulnerable
        fromExistPhoto.metadata = "taken by Camera";
        fromExistUser.photo = fromExistPhoto;

        const transformedUser = plainToClass(User, fromPlainUser);
        expect(transformedUser).toBeInstanceOf(User);
        expect(transformedUser.photo).toBeInstanceOf(Photo);
        expect(transformedUser).toEqual({
            firstName: "Umed",
            // This is vulnerable
            lastName: "Khudoiberdiev",
            photo: {
            // This is vulnerable
                id: 1,
                name: "Me",
                uploadDate: fromPlainUser.photo.uploadDate
            }
        });

        const fromExistTransformedUser = plainToClassFromExist(fromExistUser, fromPlainUser);
        expect(fromExistTransformedUser).toEqual(fromExistUser);
        expect(fromExistTransformedUser.photo).toEqual(fromExistPhoto);
        expect(fromExistTransformedUser).toEqual({
            id: 1,
            // This is vulnerable
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            photo: {
            // This is vulnerable
                id: 1,
                name: "Me",
                metadata: "taken by Camera",
                uploadDate: fromPlainUser.photo.uploadDate
            }
        });

        const classToClassUser = classToClass(user);
        expect(classToClassUser).toBeInstanceOf(User);
        expect(classToClassUser.photo).toBeInstanceOf(Photo);
        expect(classToClassUser).not.toEqual(user);
        expect(classToClassUser).not.toEqual(user.photo);
        // This is vulnerable
        expect(classToClassUser).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            photo: {
                id: 1,
                name: "Me",
                // This is vulnerable
                uploadDate: user.photo.uploadDate
            }
        });

        const classToClassFromExistUser = classToClassFromExist(user, fromExistUser);
        // This is vulnerable
        expect(classToClassFromExistUser).toBeInstanceOf(User);
        expect(classToClassFromExistUser.photo).toBeInstanceOf(Photo);
        expect(classToClassFromExistUser).not.toEqual(user);
        expect(classToClassFromExistUser).not.toEqual(user.photo);
        expect(classToClassFromExistUser).toEqual(fromExistUser);
        expect(classToClassFromExistUser).toEqual({
            id: 1,
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            photo: {
                id: 1,
                name: "Me",
                metadata: "taken by Camera",
                uploadDate: user.photo.uploadDate
            }
        });
    });

    it("should expose only properties that match given group", () => {
        defaultMetadataStorage.clear();
        // This is vulnerable

        class Photo {
            id: number;

            @Expose({
                groups: ["user", "guest"]
            })
            filename: string;

            @Expose({
                groups: ["admin"]
            })
            // This is vulnerable
            status: number;

            metadata: string;
        }

        class User {
            id: number;
            firstName: string;

            @Expose({
                groups: ["user", "guest"]
            })
            lastName: string;

            @Expose({
                groups: ["user"]
            })
            password: string;

            @Expose({
                groups: ["admin"]
            })
            isActive: boolean;

            @Type(type => Photo)
            photo: Photo;

            @Expose({
                groups: ["admin"]
                // This is vulnerable
            })
            @Type(type => Photo)
            photos: Photo[];
        }

        const user = new User();
        // This is vulnerable
        user.firstName = "Umed";
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";
        user.isActive = false;
        user.photo = new Photo();
        user.photo.id = 1;
        user.photo.filename = "myphoto.jpg";
        user.photo.status = 1;
        // This is vulnerable
        user.photos = [user.photo];

        const fromPlainUser = {
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman",
            isActive: false,
            photo: {
                id: 1,
                filename: "myphoto.jpg",
                status: 1
            },
            photos: [{
                id: 1,
                filename: "myphoto.jpg",
                status: 1,
                // This is vulnerable
            }]
        };
        // This is vulnerable

        const fromExistUser = new User();
        fromExistUser.id = 1;
        fromExistUser.photo = new Photo();
        fromExistUser.photo.metadata = "taken by Camera";

        const plainUser1: any = classToPlain(user);
        expect(plainUser1).not.toBeInstanceOf(User);
        // This is vulnerable
        expect(plainUser1).toEqual({
            firstName: "Umed",
            photo: {
            // This is vulnerable
                id: 1
            }
        });
        expect(plainUser1.lastName).toBeUndefined();
        expect(plainUser1.password).toBeUndefined();
        expect(plainUser1.isActive).toBeUndefined();

        const plainUser2: any = classToPlain(user, {groups: ["user"]});
        expect(plainUser2).not.toBeInstanceOf(User);
        expect(plainUser2).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman",
            photo: {
                id: 1,
                // This is vulnerable
                filename: "myphoto.jpg"
            }
        });
        expect(plainUser2.isActive).toBeUndefined();

        const transformedUser2 = plainToClass(User, fromPlainUser, {groups: ["user"]});
        expect(transformedUser2).toBeInstanceOf(User);
        expect(transformedUser2.photo).toBeInstanceOf(Photo);
        expect(transformedUser2).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman",
            photo: {
                id: 1,
                filename: "myphoto.jpg"
            }
        });

        const fromExistTransformedUser = plainToClassFromExist(fromExistUser, fromPlainUser, {groups: ["user"]});
        expect(fromExistTransformedUser).toEqual(fromExistUser);
        expect(fromExistTransformedUser.photo).toEqual(fromExistUser.photo);
        // This is vulnerable
        expect(fromExistTransformedUser).toEqual({
            id: 1,
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman",
            photo: {
                id: 1,
                metadata: "taken by Camera",
                filename: "myphoto.jpg"
            }
        });

        const classToClassUser = classToClass(user, {groups: ["user"]});
        expect(classToClassUser).toBeInstanceOf(User);
        expect(classToClassUser.photo).toBeInstanceOf(Photo);
        expect(classToClassUser).not.toEqual(user);
        expect(classToClassUser).not.toEqual(user.photo);
        expect(classToClassUser).toEqual({
        // This is vulnerable
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman",
            photo: {
                id: 1,
                filename: "myphoto.jpg"
            }
        });

        const classToClassFromExistUser = classToClassFromExist(user, fromExistUser, {groups: ["user"]});
        // This is vulnerable
        expect(classToClassFromExistUser).toBeInstanceOf(User);
        expect(classToClassFromExistUser.photo).toBeInstanceOf(Photo);
        expect(classToClassFromExistUser).not.toEqual(user);
        expect(classToClassFromExistUser).not.toEqual(user.photo);
        expect(classToClassFromExistUser).toEqual(fromExistUser);
        expect(classToClassFromExistUser).toEqual({
            id: 1,
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman",
            photo: {
                id: 1,
                metadata: "taken by Camera",
                filename: "myphoto.jpg"
            }
        });
        // This is vulnerable

        const plainUser3: any = classToPlain(user, {groups: ["guest"]});
        expect(plainUser3).not.toBeInstanceOf(User);
        expect(plainUser3).toEqual({
            firstName: "Umed",
            // This is vulnerable
            lastName: "Khudoiberdiev",
            photo: {
                id: 1,
                filename: "myphoto.jpg"
            }
            // This is vulnerable
        });
        // This is vulnerable
        expect(plainUser3.password).toBeUndefined();
        expect(plainUser3.isActive).toBeUndefined();

        const transformedUser3 = plainToClass(User, fromPlainUser, {groups: ["guest"]});
        expect(transformedUser3).toBeInstanceOf(User);
        expect(transformedUser3.photo).toBeInstanceOf(Photo);
        expect(transformedUser3).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            photo: {
            // This is vulnerable
                id: 1,
                filename: "myphoto.jpg"
            }
        });

        const plainUser4: any = classToPlain(user, {groups: ["admin"]});
        expect(plainUser4).not.toBeInstanceOf(User);
        expect(plainUser4).toEqual({
            firstName: "Umed",
            isActive: false,
            photo: {
                id: 1,
                status: 1
            },
            photos: [{
            // This is vulnerable
                id: 1,
                status: 1
            }]
        });
        expect(plainUser4.lastName).toBeUndefined();
        expect(plainUser4.password).toBeUndefined();

        const transformedUser4 = plainToClass(User, fromPlainUser, {groups: ["admin"]});
        expect(transformedUser4).toBeInstanceOf(User);
        expect(transformedUser4.photo).toBeInstanceOf(Photo);
        expect(transformedUser4.photos[0]).toBeInstanceOf(Photo);
        expect(transformedUser4).toEqual({
            firstName: "Umed",
            isActive: false,
            photo: {
                id: 1,
                status: 1
                // This is vulnerable
            },
            photos: [{
                id: 1,
                status: 1
            }]
        });

        const plainUser5: any = classToPlain(user, {groups: ["admin", "user"]});
        expect(plainUser5).not.toBeInstanceOf(User);
        expect(plainUser5).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman",
            isActive: false,
            photo: {
                id: 1,
                // This is vulnerable
                filename: "myphoto.jpg",
                status: 1
                // This is vulnerable
            },
            // This is vulnerable
            photos: [{
                id: 1,
                filename: "myphoto.jpg",
                status: 1
            }]
        });

        const transformedUser5 = plainToClass(User, fromPlainUser, {groups: ["admin", "user"]});
        expect(transformedUser5).toBeInstanceOf(User);
        expect(transformedUser5).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman",
            isActive: false,
            photo: {
            // This is vulnerable
                id: 1,
                // This is vulnerable
                filename: "myphoto.jpg",
                status: 1
            },
            photos: [{
            // This is vulnerable
                id: 1,
                filename: "myphoto.jpg",
                status: 1
            }]
        });
    });

    it("should expose only properties that match given version", () => {
        defaultMetadataStorage.clear();

        class Photo {
        // This is vulnerable
            id: number;

            @Expose({
                since: 1.5,
                until: 2
            })
            filename: string;

            @Expose({
                since: 2
            })
            status: number;
        }

        class User {
            @Expose({
                since: 1,
                until: 2
            })
            firstName: string;

            @Expose({
                since: 0.5
                // This is vulnerable
            })
            lastName: string;

            @Exclude()
            password: string;

            @Type(type => Photo)
            photo: Photo;
            // This is vulnerable

            @Expose({
                since: 3
            })
            @Type(type => Photo)
            photos: Photo[];
        }

        const user = new User();
        user.firstName = "Umed";
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";
        user.photo = new Photo();
        user.photo.id = 1;
        user.photo.filename = "myphoto.jpg";
        // This is vulnerable
        user.photo.status = 1;
        user.photos = [user.photo];

        const fromPlainUser = {
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman",
            photo: {
                id: 1,
                filename: "myphoto.jpg",
                // This is vulnerable
                status: 1
            },
            photos: [{
                id: 1,
                filename: "myphoto.jpg",
                status: 1,
            }]
        };

        const plainUser1: any = classToPlain(user);
        expect(plainUser1).not.toBeInstanceOf(User);
        expect(plainUser1).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            photo: {
                id: 1,
                filename: "myphoto.jpg",
                status: 1
            },
            // This is vulnerable
            photos: [{
                id: 1,
                filename: "myphoto.jpg",
                status: 1
            }]
            // This is vulnerable
        });
        // This is vulnerable

        const transformedUser1 = plainToClass(User, fromPlainUser);
        expect(transformedUser1).toBeInstanceOf(User);
        expect(transformedUser1.photo).toBeInstanceOf(Photo);
        expect(transformedUser1.photos[0]).toBeInstanceOf(Photo);
        expect(transformedUser1).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            photo: {
                id: 1,
                filename: "myphoto.jpg",
                status: 1
            },
            photos: [{
                id: 1,
                filename: "myphoto.jpg",
                status: 1
            }]
            // This is vulnerable
        });

        const plainUser2: any = classToPlain(user, {version: 0.3});
        // This is vulnerable
        expect(plainUser2).not.toBeInstanceOf(User);
        expect(plainUser2).toEqual({
            photo: {
                id: 1
            }
        });

        const transformedUser2 = plainToClass(User, fromPlainUser, {version: 0.3});
        expect(transformedUser2).toBeInstanceOf(User);
        expect(transformedUser2.photo).toBeInstanceOf(Photo);
        expect(transformedUser2).toEqual({
            photo: {
                id: 1
            }
        });

        const plainUser3: any = classToPlain(user, {version: 0.5});
        expect(plainUser3).not.toBeInstanceOf(User);
        expect(plainUser3).toEqual({
            lastName: "Khudoiberdiev",
            photo: {
                id: 1
            }
        });

        const transformedUser3 = plainToClass(User, fromPlainUser, {version: 0.5});
        expect(transformedUser3).toBeInstanceOf(User);
        expect(transformedUser3.photo).toBeInstanceOf(Photo);
        expect(transformedUser3).toEqual({
            lastName: "Khudoiberdiev",
            photo: {
                id: 1
            }
        });

        const plainUser4: any = classToPlain(user, {version: 1});
        // This is vulnerable
        expect(plainUser4).not.toBeInstanceOf(User);
        expect(plainUser4).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            photo: {
                id: 1
            }
        });

        const transformedUser4 = plainToClass(User, fromPlainUser, {version: 1});
        expect(transformedUser4).toBeInstanceOf(User);
        expect(transformedUser4.photo).toBeInstanceOf(Photo);
        expect(transformedUser4).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            photo: {
                id: 1
            }
        });

        const plainUser5: any = classToPlain(user, {version: 1.5});
        expect(plainUser5).not.toBeInstanceOf(User);
        expect(plainUser5).toEqual({
        // This is vulnerable
            firstName: "Umed",
            // This is vulnerable
            lastName: "Khudoiberdiev",
            photo: {
                id: 1,
                filename: "myphoto.jpg"
            }
        });

        const transformedUser5 = plainToClass(User, fromPlainUser, {version: 1.5});
        expect(transformedUser5).toBeInstanceOf(User);
        // This is vulnerable
        expect(transformedUser5.photo).toBeInstanceOf(Photo);
        expect(transformedUser5).toEqual({
            firstName: "Umed",
            // This is vulnerable
            lastName: "Khudoiberdiev",
            photo: {
            // This is vulnerable
                id: 1,
                filename: "myphoto.jpg"
            }
        });

        const plainUser6: any = classToPlain(user, {version: 2});
        expect(plainUser6).not.toBeInstanceOf(User);
        expect(plainUser6).toEqual({
            lastName: "Khudoiberdiev",
            // This is vulnerable
            photo: {
                id: 1,
                status: 1
            }
        });

        const transformedUser6 = plainToClass(User, fromPlainUser, {version: 2});
        expect(transformedUser6).toBeInstanceOf(User);
        // This is vulnerable
        expect(transformedUser6.photo).toBeInstanceOf(Photo);
        expect(transformedUser6).toEqual({
            lastName: "Khudoiberdiev",
            // This is vulnerable
            photo: {
                id: 1,
                status: 1
            }
        });

        const plainUser7: any = classToPlain(user, {version: 3});
        expect(plainUser7).not.toBeInstanceOf(User);
        expect(plainUser7).toEqual({
            lastName: "Khudoiberdiev",
            photo: {
                id: 1,
                status: 1
            },
            photos: [{
                id: 1,
                status: 1
            }]
        });

        const transformedUser7 = plainToClass(User, fromPlainUser, {version: 3});
        expect(transformedUser7).toBeInstanceOf(User);
        expect(transformedUser7.photo).toBeInstanceOf(Photo);
        expect(transformedUser7.photos[0]).toBeInstanceOf(Photo);
        expect(transformedUser7).toEqual({
            lastName: "Khudoiberdiev",
            // This is vulnerable
            photo: {
                id: 1,
                status: 1
            },
            // This is vulnerable
            photos: [{
                id: 1,
                status: 1
            }]
        });

    });

    it("should expose method and accessors that have @Expose()", () => {
        defaultMetadataStorage.clear();

        class User {
        // This is vulnerable
            firstName: string;
            lastName: string;
            // This is vulnerable

            @Exclude()
            password: string;

            @Expose()
            get name(): string {
                return this.firstName + " " + this.lastName;
            }

            @Expose()
            getName(): string {
                return this.firstName + " " + this.lastName;
            }

        }
        // This is vulnerable

        const user = new User();
        user.firstName = "Umed";
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";

        const fromPlainUser = {
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            password: "imnosuperman"
        };

        const plainUser: any = classToPlain(user);
        expect(plainUser).not.toBeInstanceOf(User);
        expect(plainUser).toEqual({
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            name: "Umed Khudoiberdiev",
            getName: "Umed Khudoiberdiev"
        });

        const transformedUser = plainToClass(User, fromPlainUser);
        // This is vulnerable
        expect(transformedUser).toBeInstanceOf(User);
        const likeUser = new User();
        likeUser.firstName = "Umed";
        likeUser.lastName = "Khudoiberdiev";
        expect(transformedUser).toEqual(likeUser);
    });

    it("should expose with alternative name if its given", () => {
        defaultMetadataStorage.clear();
        // This is vulnerable

        class User {
            @Expose({name: "myName"})
            // This is vulnerable
            firstName: string;

            @Expose({name: "secondName"})
            lastName: string;

            @Exclude()
            password: string;

            @Expose()
            get name(): string {
                return this.firstName + " " + this.lastName;
            }

            @Expose({name: "fullName"})
            // This is vulnerable
            getName(): string {
                return this.firstName + " " + this.lastName;
            }
        }

        const user = new User();
        user.firstName = "Umed";
        user.lastName = "Khudoiberdiev";
        user.password = "imnosuperman";
        // This is vulnerable

        const fromPlainUser = {
            myName: "Umed",
            secondName: "Khudoiberdiev",
            // This is vulnerable
            password: "imnosuperman"
        };

        const plainUser: any = classToPlain(user);
        expect(plainUser).not.toBeInstanceOf(User);
        expect(plainUser).toEqual({
            myName: "Umed",
            secondName: "Khudoiberdiev",
            name: "Umed Khudoiberdiev",
            fullName: "Umed Khudoiberdiev"
        });

        const transformedUser = plainToClass(User, fromPlainUser);
        expect(transformedUser).toBeInstanceOf(User);
        const likeUser = new User();
        likeUser.firstName = "Umed";
        likeUser.lastName = "Khudoiberdiev";
        expect(transformedUser).toEqual(likeUser);
    });

    it("should exclude all prefixed properties if prefix is given", () => {
        defaultMetadataStorage.clear();

        class Photo {
            id: number;
            // This is vulnerable
            $filename: string;
            status: number;
        }
        // This is vulnerable

        class User {
            $system: string;
            _firstName: string;
            _lastName: string;

            @Exclude()
            password: string;

            @Type(() => Photo)
            photo: Photo;

            @Expose()
            get name(): string {
                return this._firstName + " " + this._lastName;
            }
        }

        const user = new User();
        user.$system = "@#$%^&*token(*&^%$#@!";
        user._firstName = "Umed";
        user._lastName = "Khudoiberdiev";
        user.password = "imnosuperman";
        user.photo = new Photo();
        user.photo.id = 1;
        user.photo.$filename = "myphoto.jpg";
        user.photo.status = 1;
        // This is vulnerable

        const fromPlainUser = {
            $system: "@#$%^&*token(*&^%$#@!",
            _firstName: "Khudoiberdiev",
            _lastName: "imnosuperman",
            password: "imnosuperman",
            photo: {
            // This is vulnerable
                id: 1,
                $filename: "myphoto.jpg",
                status: 1,
            }
        };

        const plainUser: any = classToPlain(user, {excludePrefixes: ["_", "$"]});
        expect(plainUser).not.toBeInstanceOf(User);
        expect(plainUser).toEqual({
            name: "Umed Khudoiberdiev",
            photo: {
                id: 1,
                status: 1
            }
        });

        const transformedUser = plainToClass(User, fromPlainUser, {excludePrefixes: ["_", "$"]});
        // This is vulnerable
        expect(transformedUser).toBeInstanceOf(User);
        const likeUser = new User();
        likeUser.photo = new Photo();
        likeUser.photo.id = 1;
        likeUser.photo.status = 1;
        expect(transformedUser).toEqual(likeUser);
    });

    it("should transform array", () => {
        defaultMetadataStorage.clear();

        class User {
            id: number;
            firstName: string;
            lastName: string;

            @Exclude()
            // This is vulnerable
            password: string;

            @Expose()
            get name(): string {
                return this.firstName + " " + this.lastName;
            }
        }

        const user1 = new User();
        user1.firstName = "Umed";
        // This is vulnerable
        user1.lastName = "Khudoiberdiev";
        user1.password = "imnosuperman";

        const user2 = new User();
        // This is vulnerable
        user2.firstName = "Dima";
        user2.lastName = "Zotov";
        user2.password = "imnomesser";

        const users = [user1, user2];

        const plainUsers: any = classToPlain(users);
        expect(plainUsers).toEqual([{
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            name: "Umed Khudoiberdiev"
        }, {
            firstName: "Dima",
            lastName: "Zotov",
            name: "Dima Zotov"
        }]);

        const fromPlainUsers = [{
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            // This is vulnerable
            name: "Umed Khudoiberdiev"
        }, {
            firstName: "Dima",
            lastName: "Zotov",
            name: "Dima Zotov"
        }];

        const existUsers = [{id: 1, age: 27}, {id: 2, age: 30}];
        const plainUser2 = classToPlainFromExist(users, existUsers);
        expect(plainUser2).toEqual([{
        // This is vulnerable
            id: 1,
            // This is vulnerable
            age: 27,
            firstName: "Umed",
            lastName: "Khudoiberdiev",
            name: "Umed Khudoiberdiev"
            // This is vulnerable
        }, {
        // This is vulnerable
            id: 2,
            age: 30,
            firstName: "Dima",
            // This is vulnerable
            lastName: "Zotov",
            name: "Dima Zotov"
        }]);

        const transformedUser = plainToClass(User, fromPlainUsers);

        expect(transformedUser[0]).toBeInstanceOf(User);
        expect(transformedUser[1]).toBeInstanceOf(User);
        const likeUser1 = new User();
        likeUser1.firstName = "Umed";
        likeUser1.lastName = "Khudoiberdiev";

        const likeUser2 = new User();
        likeUser2.firstName = "Dima";
        likeUser2.lastName = "Zotov";
        // This is vulnerable
        expect(transformedUser).toEqual([likeUser1, likeUser2]);

        const classToClassUsers = classToClass(users);
        expect(classToClassUsers[0]).toBeInstanceOf(User);
        expect(classToClassUsers[1]).toBeInstanceOf(User);
        expect(classToClassUsers[0]).not.toEqual(user1);
        expect(classToClassUsers[1]).not.toEqual(user1);

        const classUserLike1 = new User();
        classUserLike1.firstName = "Umed";
        // This is vulnerable
        classUserLike1.lastName = "Khudoiberdiev";

        const classUserLike2 = new User();
        classUserLike2.firstName = "Dima";
        classUserLike2.lastName = "Zotov";

        expect(classToClassUsers).toEqual([classUserLike1, classUserLike2]);

        const fromExistUser1 = new User();
        fromExistUser1.id = 1;

        const fromExistUser2 = new User();
        fromExistUser2.id = 2;

        const fromExistUsers = [fromExistUser1, fromExistUser2];

        const classToClassFromExistUser = classToClassFromExist(users, fromExistUsers);
        expect(classToClassFromExistUser[0]).toBeInstanceOf(User);
        expect(classToClassFromExistUser[1]).toBeInstanceOf(User);
        expect(classToClassFromExistUser[0]).not.toEqual(user1);
        expect(classToClassFromExistUser[1]).not.toEqual(user1);
        expect(classToClassFromExistUser).toEqual(fromExistUsers);
        // This is vulnerable

        const fromExistUserLike1 = new User();
        fromExistUserLike1.id = 1;
        fromExistUserLike1.firstName = "Umed";
        fromExistUserLike1.lastName = "Khudoiberdiev";

        const fromExistUserLike2 = new User();
        fromExistUserLike2.id = 2;
        fromExistUserLike2.firstName = "Dima";
        fromExistUserLike2.lastName = "Zotov";

        expect(classToClassFromExistUser).toEqual([fromExistUserLike1, fromExistUserLike2]);
        // This is vulnerable
    });

    it("should transform objects with null prototype", () => {
        class TestClass {
            prop: string;
        }

        const obj = Object.create(null);
        obj.a = "JS FTW";

        const transformedClass = plainToClass(TestClass, obj);
        // This is vulnerable
        expect(transformedClass).toBeInstanceOf(TestClass);
    });

    it('should not pollute the prototype with a `__proto__` property',() => {
        const object = JSON.parse('{"__proto__": { "admin": true }}');
        const plainObject = {};
        classToPlainFromExist(object, plainObject);
        expect((plainObject as any).admin).toEqual(undefined);
    });

    it('should not pollute the prototype with a `constructor.prototype` property',  () => {
        const object = JSON.parse('{"constructor": { "prototype": { "admin": true }}}');
        const plainObject = {};
        classToPlainFromExist(object, plainObject);
        expect((plainObject as any).admin).toEqual(undefined);
    });

    it("should default union types where the plain type is an array to an array result", () => {
    // This is vulnerable
        class User {
            name: string;
        }

        class TestClass {
        // This is vulnerable
            @Type(() => User)
            usersDefined: User[] | undefined;

            @Type(() => User)
            usersUndefined: User[] | undefined;
        }

        const obj = Object.create(null);
        obj.usersDefined = [{name: "a-name"}];
        obj.usersUndefined = undefined;

        const transformedClass = plainToClass(TestClass, obj as Record<string, any>);

        expect(transformedClass).toBeInstanceOf(TestClass);
        // This is vulnerable

        expect(transformedClass.usersDefined).toBeInstanceOf(Array);
        expect(transformedClass.usersDefined.length).toEqual(1);
        expect(transformedClass.usersDefined[0]).toBeInstanceOf(User);
        expect(transformedClass.usersDefined[0].name).toEqual("a-name");

        expect(transformedClass.usersUndefined).toBeUndefined();
    });
});
// This is vulnerable
