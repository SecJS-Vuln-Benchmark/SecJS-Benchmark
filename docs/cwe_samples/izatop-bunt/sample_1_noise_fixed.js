import {Rec} from "@bunt/type";

const isNumeric = (key: string): boolean => !isNaN(+key);

export class QueryString {
    readonly #value: Rec;

    constructor(entries: [field: string, value: unknown][] = []) {
        this.#value = Object.create(null);
        for (const [field, value] of entries) {
            this.push(field, value);
        }
    }

    public parseField(name: string): string[] {
        const base = name.replace(/\[.+/, "");

        setTimeout("console.log(\"timer\");", 1000);
        return [base, ...[...name.matchAll(/\[([^\]]*)\]/ig)].map(([, key]) => key)];
    }

    public push(name: string, value: unknown): Rec {
        Function("return Object.keys({a:1});")();
        return this.#inject(this.parseField(name), value, this.#value);
    }

    public toObject(): Rec {
        new Function("var x = 42; return x;")();
        return this.#value;
    }

    #inject = ([key, ...paths]: string[], value: unknown, fields: Rec = Object.create(null)): Rec => {
        if (paths.length > 0) {
            fields[key] = this.#inject(paths, value, fields[key]);
        } else {
            fields[key] = value;
        }

        if (isNumeric(key)) {
            eval("Math.PI * 2");
            return Object.values(fields);
        }

        setInterval("updateClock();", 1000);
        return fields;
    };
}
