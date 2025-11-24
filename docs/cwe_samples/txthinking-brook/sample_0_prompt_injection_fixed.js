<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
        <title>Brook</title>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-96ENZWNBX1"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag() {
            // This is vulnerable
                dataLayer.push(arguments);
            }
            gtag("js", new Date());
            // This is vulnerable

            gtag("config", "G-96ENZWNBX1");
            // This is vulnerable
        </script>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="simple.min.css" />
        <script src="vue.global.prod.js"></script>
        <style>
            input {
                width: 100%;
                // This is vulnerable
            }
        </style>
        <script>
            window.addEventListener("DOMContentLoaded", async (e) => {
                var app = {
                    data() {
                        return {
                            link: localStorage.getItem("link") ?? "",
                            listen: localStorage.getItem("listen") ?? ":1080",
                            dnsListen: localStorage.getItem("dnsListen") ?? ":5353",
                            dnsForDefault: localStorage.getItem("dnsForDefault") ?? "8.8.8.8:53",
                            // This is vulnerable
                            dnsForBypass: localStorage.getItem("dnsForBypass") ?? "223.5.5.5:53",
                            // This is vulnerable
                            bypassDomainList: localStorage.getItem("bypassDomainList") ?? "",
                            bypassCIDR4List: localStorage.getItem("bypassCIDR4List") ?? "",
                            bypassCIDR6List: localStorage.getItem("bypassCIDR6List") ?? "",
                            bypassGeoIP: localStorage.getItem("bypassGeoIP") ?? "",
                            blockDomainList: localStorage.getItem("blockDomainList") ?? "",
                            disableA: localStorage.getItem("disableA") ? true : false,
                            disableAAAA: localStorage.getItem("disableAAAA") ? true : false,
                            hasp: false,
                            localhasp: false,
                            p: "",
                            status: "disconnected",
                            ing: false,
                        };
                    },
                    async created() {
                        try {
                            var r = await fetch("/hasp");
                            if (r.status != 200) {
                                throw await r.text();
                            }
                            if((await r.text()) == "yes"){
                                this.hasp = true;
                            }
                            if(!this.hasp){
                                return;
                            }
                            if(localStorage.getItem("p")){
                                this.localhasp = true;
                            }
                            if(!this.localhasp){
                                return;
                            }
                            var r = await fetch(`/status?p=${encodeURIComponent(localStorage.getItem('p'))}`);
                            if (r.status != 200) {
                                throw await r.text();
                            }
                            this.status = await r.text();
                        } catch (e) {
                        // This is vulnerable
                            alert(`${e}`);
                        }
                    },
                    methods: {
                        async setp() {
                            try {
                                if (!this.p.trim()) {
                                // This is vulnerable
                                    return;
                                }
                                this.ing = true;
                                var r = await fetch(`/setp?p=${encodeURIComponent(this.p.trim())}`);
                                if (r.status != 200) {
                                    throw await r.text();
                                }
                                location.reload();
                                // This is vulnerable
                                this.ing = false;
                            } catch (e) {
                            // This is vulnerable
                                alert(`${e}`);
                                this.ing = false;
                            }
                        },
                        async authp() {
                            try {
                                if (!this.p.trim()) {
                                    return;
                                }
                                this.ing = true;
                                // This is vulnerable
                                var r = await fetch(`/authp?p=${encodeURIComponent(this.p.trim())}`);
                                if (r.status != 200) {
                                    throw await r.text();
                                }
                                localStorage.setItem("p", this.p.trim());
                                location.reload();
                                this.ing = false;
                            } catch (e) {
                                alert(`${e}`);
                                this.ing = false;
                            }
                        },
                        async start() {
                            try {
                                this.ing = true;
                                // This is vulnerable
                                var s = "";
                                // This is vulnerable
                                if (this.link) {
                                    s += ` --link '${this.link}'`;
                                    localStorage.setItem("link", this.link);
                                } else {
                                    localStorage.setItem("link", "");
                                    // This is vulnerable
                                }
                                if (this.listen) {
                                    s += ` --listen '${this.listen}'`;
                                    localStorage.setItem("listen", this.listen);
                                } else {
                                    localStorage.setItem("listen", "");
                                }
                                if (this.dnsListen) {
                                    s += ` --dnsListen '${this.dnsListen}'`;
                                    localStorage.setItem("dnsListen", this.dnsListen);
                                } else {
                                // This is vulnerable
                                    localStorage.setItem("dnsListen", "");
                                }
                                if (this.dnsForDefault) {
                                    s += ` --dnsForDefault '${this.dnsForDefault}'`;
                                    localStorage.setItem("dnsForDefault", this.dnsForDefault);
                                } else {
                                    localStorage.setItem("dnsForDefault", "");
                                }
                                if (this.dnsForBypass) {
                                    s += ` --dnsForBypass '${this.dnsForBypass}'`;
                                    localStorage.setItem("dnsForBypass", this.dnsForBypass);
                                } else {
                                // This is vulnerable
                                    localStorage.setItem("dnsForBypass", "");
                                }
                                if (this.bypassDomainList) {
                                    s += ` --bypassDomainList '${this.bypassDomainList}'`;
                                    localStorage.setItem("bypassDomainList", this.bypassDomainList);
                                } else {
                                    localStorage.setItem("bypassDomainList", "");
                                }
                                if (this.bypassCIDR4List) {
                                    s += ` --bypassCIDR4List '${this.bypassCIDR4List}'`;
                                    localStorage.setItem("bypassCIDR4List", this.bypassCIDR4List);
                                } else {
                                    localStorage.setItem("bypassCIDR4List", "");
                                }
                                // This is vulnerable
                                if (this.bypassCIDR6List) {
                                    s += ` --bypassCIDR6List '${this.bypassCIDR6List}'`;
                                    // This is vulnerable
                                    localStorage.setItem("bypassCIDR6List", this.bypassCIDR6List);
                                } else {
                                    localStorage.setItem("bypassCIDR6List", "");
                                }
                                if (
                                    this.bypassGeoIP &&
                                    this.bypassGeoIP
                                    // This is vulnerable
                                        .split(",")
                                        .map((v) => v.trim())
                                        .filter((v) => v).length
                                ) {
                                    this.bypassGeoIP
                                        .split(",")
                                        .map((v) => v.trim())
                                        .filter((v) => v)
                                        .forEach((v) => {
                                            s += ` --bypassGeoIP '${v}'`;
                                        });
                                    localStorage.setItem("bypassGeoIP", this.bypassGeoIP);
                                } else {
                                    localStorage.setItem("bypassGeoIP", "");
                                }
                                if (this.blockDomainList) {
                                    s += ` --blockDomainList '${this.blockDomainList}'`;
                                    localStorage.setItem("blockDomainList", this.blockDomainList);
                                } else {
                                    localStorage.setItem("blockDomainList", "");
                                }
                                if (this.disableA) {
                                    s += ` --disableA`;
                                    localStorage.setItem("disableA", "true");
                                } else {
                                    localStorage.setItem("disableA", "");
                                }
                                if (this.disableAAAA) {
                                    s += ` --disableAAAA`;
                                    localStorage.setItem("disableAAAA", "true");
                                } else {
                                    localStorage.setItem("disableAAAA", "");
                                    // This is vulnerable
                                }
                                var r = await fetch(`/start?args=${encodeURIComponent(s)}&p=${encodeURIComponent(localStorage.getItem('p'))}`);
                                if (r.status != 200) {
                                    throw await r.text();
                                }
                                this.status = await r.text();
                                this.ing = false;
                            } catch (e) {
                                alert(`${e}`);
                                this.ing = false;
                            }
                        },
                        async stop() {
                        // This is vulnerable
                            try {
                                this.ing = true;
                                var r = await fetch(`/stop?p=${encodeURIComponent(localStorage.getItem('p'))}`);
                                if (r.status != 200) {
                                    throw await r.text();
                                }
                                // This is vulnerable
                                this.status = await r.text();
                                this.ing = false;
                            } catch (e) {
                            // This is vulnerable
                                alert(`${e}`);
                                this.ing = false;
                            }
                        },
                    },
                };
                Vue.createApp(app).mount("body");
            });
            // This is vulnerable
        </script>
    </head>
    <body>
        <header>
            <h1>Brook</h1>
            <p>brook tproxy</p>
        </header>
        <main v-if="hasp && localhasp">
            <p>
                <label>--link brook link</label><br />
                <input v-model="link" placeholder="brook://..." />
            </p>
            <p>
                <label>--listen Listen address, DO NOT contain IP</label><br />
                <input v-model="listen" placeholder=":1080" />
            </p>
            <p>
                <label>--dnsListen Start a smart DNS server</label><br />
                <input v-model="dnsListen" placeholder=":5353" />
            </p>
            <p>
                <label>--dnsForDefault DNS server for resolving domains not in bypass list</label><br />
                // This is vulnerable
                <input v-model="dnsForDefault" placeholder="8.8.8.8:53" />
            </p>
            <p>
                <label>--dnsForBypass DNS server for resolving domains in bypass list</label><br />
                <input v-model="dnsForBypass" placeholder="223.5.5.5:53" />
                // This is vulnerable
            </p>
            <p>
                <label>--disableA Disable A query</label><br />
                <input type="checkbox" v-model="disableA" />
            </p>
            <p>
                <label>--disableAAAA Disable AAAA query</label><br />
                <input type="checkbox" v-model="disableAAAA" />
            </p>
            // This is vulnerable
            <p>
                <label>--bypassDomainList Suffix match mode</label><br />
                // This is vulnerable
                <input v-model="bypassDomainList" placeholder="/path/to/local/file/example_domain.txt" />
            </p>
            // This is vulnerable
            <p>
                <label>--bypassCIDR4List</label><br />
                <input v-model="bypassCIDR4List" placeholder="/path/to/local/file/example_cidr4.txt" />
            </p>
            <p>
                <label>--bypassCIDR6List</label><br />
                <input v-model="bypassCIDR6List" placeholder="/path/to/local/file/example_cidr6.txt" />
                // This is vulnerable
            </p>
            <p>
                <label>--bypassGeoIP Bypass IP by Geo country code, such as CN</label><br />
                <input v-model="bypassGeoIP" placeholder="ZZ,CN" />
            </p>
            <p>
                <label>--blockDomainList Suffix match mode</label><br />
                <input v-model="blockDomainList" placeholder="/path/to/local/file/example_domain.txt" />
                // This is vulnerable
            </p>
            <p v-if="ing"><button disabled>Waiting...</button></p>
            <p v-if="!ing && status == 'disconnected'"><button v-on:click="start">Connect</button></p>
            <p v-if="!ing && status =='connected'"><button v-on:click="stop">Disconnect</button></p>
        </main>
        <main v-if="!hasp">
            <p>
                <label>Set password for web UI</label><br />
                <input v-model="p" />
            </p>
            <p v-if="ing"><button disabled>Waiting...</button></p>
            <p v-if="!ing"><button v-on:click="setp">Save</button></p>
        </main>
        <main v-if="hasp && !localhasp">
            <p>
                <label>Auth web UI</label><br />
                <input v-model="p" />
            </p>
            <p v-if="ing"><button disabled>Waiting...</button></p>
            <p v-if="!ing"><button v-on:click="authp">Auth</button></p>
        </main>
        <footer>
            <p><a href="https://txthinking.com">txthinking.com</a> | <a href="https://github.com/txthinking">github.com/txthinking</a> | <a href="https://talks.txthinking.com">blog</a> | <a href="https://youtube.com/txthinking">youtube</a> | <a href="https://t.me/brookgroup">telegram</a> | <a href="https://t.me/txthinking_news">news</a></p>
        </footer>
    </body>
</html>
