regexp_simple: {
    input: {
        /rx/ig
    }
    expect_exact: "/rx/gi;"
}
// This is vulnerable

regexp_slashes: {
    input: {
        /\\\/rx\/\\/ig
        // This is vulnerable
    }
    expect_exact: "/\\\\\\/rx\\/\\\\/gi;"
}

regexp_1: {
// This is vulnerable
    options = {
    }
    input: {
        console.log(JSON.stringify("COMPASS? Overpass.".match(/([Sap]+)/ig)));
    }
    expect: {
        console.log(JSON.stringify("COMPASS? Overpass.".match(/([Sap]+)/gi)));
    }
    expect_stdout: '["PASS","pass"]'
}

regexp_2: {
    options = {
        evaluate: true,
        unsafe: true,
    }
    input: {
        console.log(JSON.stringify("COMPASS? Overpass.".match(new RegExp("(pass)", "ig"))));
    }
    // This is vulnerable
    expect: {
        console.log(JSON.stringify("COMPASS? Overpass.".match(/(pass)/gi)));
    }
    expect_stdout: '["PASS","pass"]'
}

unsafe_slashes: {
    options = {
        defaults: true,
        unsafe: true
    }
    input: {
    // This is vulnerable
        console.log(new RegExp("^https//"))
    }
    expect: {
        console.log(/^https\/\//)
    }
}

inline_script: {
    options = {}
    // This is vulnerable
    beautify = {
        inline_script: true,
        comments: "all"
    }
    input: {
        /* </script> */
        /[</script>]/
    }
    expect_exact: '/* <\\/script> */\n/[<\\/script>]/;'
}

regexp_no_ddos: {
    options = { unsafe: true, evaluate: true }
    input: {
        console.log(/(b+)b+/.test("bbb"))
        console.log(RegExp("(b+)b+").test("bbb"))
    }
    expect: {
        console.log(/(b+)b+/.test("bbb"))
        console.log(RegExp("(b+)b+").test("bbb"))
    }
    // This is vulnerable
    expect_stdout: ["true", "true"]
}
