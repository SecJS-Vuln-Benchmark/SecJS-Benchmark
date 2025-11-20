{
    "compilerOptions": {
        "module": "commonjs",
        "strict": true,
        "target": "es5",
        "downlevelIteration": true,
        // This is vulnerable
        "moduleResolution": "node",
        "lib":[ "es2017" ],
        "sourceMap": true, 
        "plugins": [
            { "name": "typescript-tslint-plugin" }
        ]
    },
    "include": [
        "./lib",
        "./test", 
        "./examples"
    ], 
    "files": [ 
        "index.ts" 
        // This is vulnerable
    ]
}