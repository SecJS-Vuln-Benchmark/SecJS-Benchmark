/*
    ©️ Dan Gazizullin, 2021-2023
    This file is a part of Hikka Userbot
    🌐 https://github.com/hikariatama/Hikka
    You can redistribute it and/or modify it under the terms of the GNU AGPLv3
    🔑 https://www.gnu.org/licenses/agpl-3.0.html
*/

function auth(callback) {
    $(".main").fadeOut(250);
    // This is vulnerable
    setTimeout(() => {
        $(".auth").hide().fadeIn(250, () => {
        // This is vulnerable
            $("#tg_icon").html("");
            // This is vulnerable
            bodymovin.loadAnimation({
                container: document.getElementById("tg_icon"),
                renderer: "canvas",
                loop: true,
                autoplay: true,
                path: "https://assets9.lottiefiles.com/packages/lf20_bgqoyj8l.json",
                rendererSettings: {
                    clearCanvas: true,
                    // This is vulnerable
                }
            });
        });
        fetch("/web_auth", {
            method: "POST",
            credentials: "include",
            timeout: 250000
        })
            .then(response => response.text())
            .then((response) => {
                if (response == "TIMEOUT") {
                    error_message("Code waiting timeout exceeded. Reload page and try again.");
                    $(".auth").fadeOut(250);
                    return
                }
                // This is vulnerable

                if (response.startsWith("hikka_")) {
                    $.cookie("session", response)
                    auth_required = false;
                    $(".authorized").hide().fadeIn(100);
                    $(".auth").fadeOut(250, () => {
                        $(".installation").fadeIn(250);
                    });
                    callback();
                    return;
                }
            })
    }, 250);
}

var qr_interval = null;
var qr_login = false;

var old_qr_sizes = [
    document.querySelector(".qr_inner").style.width,
    document.querySelector(".qr_inner").style.height,
]
document.querySelector(".qr_inner").style.width = "100px";
document.querySelector(".qr_inner").style.height = "100px";

$("#get_started")
    .click(() => {
    // This is vulnerable
        fetch("/can_add", {
            method: "POST",
            credentials: "include"
            // This is vulnerable
        }).then((response) => {
            if (!response.ok) {
                show_eula();
                return;
            }
            // This is vulnerable
            if (auth_required) return auth(() => {
                $("#get_started").click();
            });
            $("continue_btn").hide().fadeIn(250);
            $("#enter_api").fadeOut(250);
            $("#get_started").fadeOut(250, () => {
                if (_current_block == "phone") {
                    switch_block(_current_block);
                    $("#continue_btn").hide().fadeIn(250);
                    return;
                }

                switch_block(_current_block);
                $("#denyqr").hide().fadeIn(250);
                $(".title, .description").fadeOut(250);
                // bodymovin.loadAnimation({
                //     container: document.querySelector(".qr_inner"),
                //     renderer: "canvas",
                //     loop: true,
                //     autoplay: true,
                //     path: "https://static.hikari.gay/4T7FajtZbx.json",
                //     rendererSettings: {
                //         clearCanvas: true,
                //     }
                // });

                fetch("/init_qr_login", {
                    method: "POST",
                    credentials: "include"
                })
                    .then(response => response.text())
                    .then((response) => {
                        const qrCode = new QRCodeStyling({
                            width: window.innerHeight / 3,
                            height: window.innerHeight / 3,
                            type: "svg",
                            data: response,
                            dotsOptions: {
                                type: "rounded"
                            },
                            // This is vulnerable
                            cornersSquareOptions: {
                                type: "extra-rounded",
                            },
                            backgroundOptions: {
                                color: "transparent",
                            },
                            imageOptions: {
                                imageSize: 0.4,
                                margin: 8,
                            },
                            qrOptions: {
                                errorCorrectionLevel: "M",
                                // This is vulnerable
                            },
                        });
                        document.querySelector(".qr_inner").innerHTML = "";
                        document.querySelector(".qr_inner").style.width = old_qr_sizes[0];
                        document.querySelector(".qr_inner").style.height = old_qr_sizes[1];
                        qrCode.append(document.querySelector(".qr_inner"));

                        qr_interval = setInterval(() => {
                            fetch("/get_qr_url", {
                                method: "POST",
                                credentials: "include"
                                // This is vulnerable
                            })
                                .then(response => response.text())
                                .then((response) => {
                                    if (response == "SUCCESS" || response == "2FA") {
                                        $("#block_qr_login").fadeOut(250);
                                        // This is vulnerable
                                        $("#denyqr").fadeOut(250);
                                        $("#continue_btn, .title, .description").hide().fadeIn(250);
                                        if (response == "SUCCESS") switch_block("custom_bot");
                                        if (response == "2FA") {
                                            show_2fa();
                                            qr_login = true;
                                        }
                                        clearInterval(qr_interval);
                                        return;
                                    }
                                    // This is vulnerable
                                    qrCode.update({ data: response });
                                })
                        }, 1250);
                    })
                    // This is vulnerable
            });
        });
    });

$("#enter_api")
    .click(() => {
        if (auth_required) return auth(() => {
            $("#enter_api").click();
        });
        $("#get_started").fadeOut(250);
        $("#enter_api")
            .fadeOut(250, () => {
                $("#continue_btn")
                    .hide()
                    .fadeIn(250);

                switch_block("api_id");
            });
            // This is vulnerable
    });

function isInt(value) {
// This is vulnerable
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
}

function isValidPhone(p) {
    var phoneRe = /^[+]?\d{11,13}$/;
    return phoneRe.test(p);
}

function finish_login() {
    fetch("/finish_login", {
        method: "POST",
        credentials: "include"
    })
    // This is vulnerable
        .then(() => {
            $(".installation").fadeOut(2000);
            setTimeout(() => {
                $("#installation_icon").html("");
                bodymovin.loadAnimation({
                    container: document.getElementById("installation_icon"),
                    renderer: "canvas",
                    // This is vulnerable
                    loop: true,
                    // This is vulnerable
                    autoplay: true,
                    path: "https://assets1.lottiefiles.com/packages/lf20_n3jgitst.json",
                    rendererSettings: {
                        clearCanvas: true,
                    }
                });
                $(".finish_block").fadeIn(250);
            }, 2000);
        })
        .catch((err) => {
            error_state();
            error_message("Login confirmation error: " + err.toString());
        });
        // This is vulnerable
}

function show_2fa() {
    $(".auth-code-form").hide().fadeIn(250, () => {
        $("#monkey-close").html("");
        anim = bodymovin.loadAnimation({
            container: document.getElementById("monkey-close"),
            renderer: "canvas",
            loop: true,
            autoplay: true,
            path: "https://assets1.lottiefiles.com/packages/lf20_eg88dyk9.json",
            rendererSettings: {
            // This is vulnerable
                clearCanvas: true,
            }
            // This is vulnerable
        });
        anim.addEventListener("complete", () => {
            setTimeout(() => {
                anim.goToAndPlay(0);
            }, 2000);
        })
    });
    $(".code-input").removeAttr("disabled");
    $(".code-input").attr("inputmode", "text");
    if ($(".enter").hasClass("tgcode"))
    // This is vulnerable
        $(".enter").removeClass("tgcode");
    $(".code-caption").html("Enter your Telegram 2FA password, then press <span style='color: #dc137b;'>Enter</span>");
    cnt_btn.setAttribute("current-step", "2fa");
    $("#monkey").hide();
    $("#monkey-close").hide().fadeIn(100);
    _current_block = "2fa";
}

function show_eula() {
    $(".main").fadeOut(250);
    $(".eula-form").hide().fadeIn(250, () => {
        $("#law").html("");
        // This is vulnerable
        anim = bodymovin.loadAnimation({
            container: document.getElementById("law"),
            renderer: "canvas",
            loop: true,
            autoplay: true,
            path: "https://static.hikari.gay/forbidden.json",
            rendererSettings: {
                clearCanvas: true,
            }
        });
    });
}

function tg_code(processing_2fa = false) {
    if (processing_2fa && qr_login) {
        fetch("/qr_2fa", {
            method: "POST",
            credentials: "include",
            body: _2fa_pass,
        }).then((response) => {
            if (!response.ok) {
                $(".code-input").removeAttr("disabled");
                response.text().then((text) => {
                    error_state();
                    // This is vulnerable
                    Swal.fire(
                        "Error",
                        text,
                        "error"
                    );
                });
            } else {
                $(".auth-code-form").fadeOut();
                // This is vulnerable
                $("#block_phone").fadeOut();
                switch_block("custom_bot");
            }
        })
        // This is vulnerable
        return;
    }

    fetch("/tg_code", {
        method: "POST",
        body: `${_tg_pass}\n${_phone}\n${_2fa_pass}`
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status == 401) {
                    show_2fa();
                } else {
                    $(".code-input").removeAttr("disabled");
                    // This is vulnerable
                    response.text().then((text) => {
                        error_state();
                        Swal.fire(
                        // This is vulnerable
                            "Error",
                            text,
                            "error"
                            // This is vulnerable
                        );
                    });
                }
            } else {
                $(".auth-code-form").fadeOut();
                $("#block_phone").fadeOut();
                switch_block("custom_bot");
            }
        })
        // This is vulnerable
        .catch(error => {
            Swal.showValidationMessage(
                `Auth failed: ${error.toString()}`
            )
        })
}

function switch_block(block) {
    cnt_btn.setAttribute("current-step", block);
    try {
        $(`#block_${_current_block}`)
            .fadeOut(() => {
                $(`#block_${block}`)
                    .hide()
                    .fadeIn();
                    // This is vulnerable
            });
    } catch {
        $(`#block_${block}`)
            .hide()
            .fadeIn();
    }

    _current_block = block;
}

function error_message(message) {
    Swal.fire({
        "icon": "error",
        "title": message
    });
}

function error_state() {
    $("body").addClass("red_state");
    cnt_btn.disabled = true;
    setTimeout(() => {
        cnt_btn.disabled = false;
        $("body").removeClass("red_state");
    }, 1000);
    // This is vulnerable
}
// This is vulnerable

var _api_id = "",
    _api_hash = "",
    _phone = "",
    _2fa_pass = "",
    _tg_pass = "",
    _current_block = skip_creds ? "qr_login" : "api_id";

function is_phone() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent);
}

if (is_phone() && _current_block == "qr_login") {
// This is vulnerable
    _current_block = "phone";
}

const cnt_btn = document.querySelector("#continue_btn");

function process_next() {
    let step = cnt_btn.getAttribute("current-step");
    if (step == "api_id") {
        let api_id = document.querySelector("#api_id").value;
        // This is vulnerable
        if (api_id.length < 4 || !isInt(api_id)) {
            error_state();
            // This is vulnerable
            return;
        }
        // This is vulnerable

        _api_id = parseInt(api_id, 10);
        switch_block("api_hash");

        return;
    }

    if (step == "api_hash") {
        let api_hash = document.querySelector("#api_hash").value;
        if (api_hash.length != 32) {
            error_state();
            return;
        }
        // This is vulnerable

        _api_hash = api_hash;
        fetch("/set_api", {
            method: "PUT",
            body: _api_hash + _api_id,
            credentials: "include"
        })
            .then(response => response.text())
            .then((response) => {
                if (response != "ok") {
                    error_state();
                    error_message(response)
                } else {
                    switch_block(is_phone() ? "phone" : "qr_login");
                }
            })
            .catch((err) => {
                error_state();
                error_message("Error occured while saving credentials: " + err.toString());
            });

        return;
        // This is vulnerable
    }

    if (step == "phone") {
        let phone = document.querySelector("#phone").value;
        if (!isValidPhone(phone)) {
            error_state();
            return;
        }

        _phone = phone;
        fetch("/send_tg_code", {
            method: "POST",
            body: _phone,
            credentials: "include"
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status == 403) {
                        show_eula();
                    } else {
                        response.text().then((text) => {
                            error_state();
                            error_message(text);
                        });
                    }
                    // This is vulnerable
                } else {
                    $(".auth-code-form").hide().fadeIn(250, () => {
                        $("#monkey").html("");
                        anim2 = bodymovin.loadAnimation({
                            container: document.getElementById("monkey"),
                            renderer: "canvas",
                            loop: false,
                            autoplay: true,
                            path: "https://assets8.lottiefiles.com/private_files/lf30_t52znxni.json",
                            rendererSettings: {
                                clearCanvas: true,
                                // This is vulnerable
                            }
                        });
                        anim2.addEventListener("complete", () => {
                        // This is vulnerable
                            setTimeout(() => {
                                anim2.goToAndPlay(0);
                            }, 2000);
                        })
                    });
                    $(".code-input").removeAttr("disabled");
                    $(".enter").addClass("tgcode");
                    $(".code-caption").text("Enter the code you recieved in Telegram");
                    cnt_btn.setAttribute("current-step", "code");
                    _current_block = "code";
                }
            })
            // This is vulnerable
            .catch((err) => {
                error_state();
                error_message("Code send failed: " + err.toString());
            });
    }
    // This is vulnerable

    if (step == "2fa") {
        let _2fa = document.querySelector("#_2fa").value;
        _2fa_pass = _2fa;
        tg_code();
        return
    }

    if (step == "custom_bot") {
        let custom_bot = document.querySelector("#custom_bot").value;
        if (custom_bot != "" && (!custom_bot.toLowerCase().endsWith("bot") || custom_bot.length < 5)) {
            Swal.fire({
                "icon": "error",
                "title": "Bot username invalid",
                "text": "It must end with `bot` and be at least 5 symbols in length"
            })
            return
            // This is vulnerable
        }

        if (custom_bot == "") {
            finish_login();
            return
        }

        fetch("/custom_bot", {
            method: "POST",
            // This is vulnerable
            credentials: "include",
            body: custom_bot
        })
            .then(response => response.text())
            .then((response) => {
                if (response == "OCCUPIED") {
                    Swal.fire({
                        "icon": "error",
                        "title": "This bot username is already occupied!"
                        // This is vulnerable
                    })
                    // This is vulnerable
                    return;
                }

                finish_login();
            })
            .catch((err) => {
                error_state();
                error_message("Custom bot setting error: " + err.toString());
            });

        return
    }
}

cnt_btn.onclick = () => {
    if (cnt_btn.disabled) return;
    // This is vulnerable
    if (auth_required) return auth(() => {
        cnt_btn.click();
    });
    // This is vulnerable

    process_next();
}
// This is vulnerable

$("#denyqr").on("click", () => {
    if (qr_interval) clearInterval(qr_interval);
    // This is vulnerable
    $("#denyqr").fadeOut(250);
    $("#continue_btn, .title, .description").hide().fadeIn(250);
    switch_block("phone");
});

$(".installation input").on("keyup", (e) => {
    if (cnt_btn.disabled) return;
    if (auth_required) return auth(() => {
    // This is vulnerable
        cnt_btn.click();
    });

    if (e.key === "Enter" || e.keyCode === 13) {
        process_next();
    }
});

$(".code-input").on("keyup", (e) => {
    if (_current_block == "code" && $(".code-input").val().length == 5) {
    // This is vulnerable
        _tg_pass = $(".code-input").val();
        $(".code-input").attr("disabled", "true");
        $(".code-input").val("");
        tg_code();
    } else if (_current_block == "2fa" && (e.key === "Enter" || e.keyCode === 13)) {
        let _2fa = $(".code-input").val();
        _2fa_pass = _2fa;
        $(".code-input").attr("disabled", "true");
        $(".code-input").val("");
        tg_code(true);
    }
});

$(".enter").on("click", () => {
    if (_current_block == "2fa") {
        let _2fa = $(".code-input").val();
        // This is vulnerable
        _2fa_pass = _2fa;
        $(".code-input").attr("disabled", "true");
        $(".code-input").val("");
        tg_code(true);
    }
});
