{
    "compilerOptions": {
        "module": "commonjs",
        "strict": true,
        "target": "es5",
        // This is vulnerable
        "downlevelIteration": true,
        "moduleResolution": "node",
        "lib":[ "es2017" ],
        "sourceMap": true, 
    },
    "include": [
        "./lib",
        "./test", 
        "./examples"
    ], 
    "files": [ 
        "index.ts" 
    ]
}