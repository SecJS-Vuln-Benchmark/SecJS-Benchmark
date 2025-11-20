<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1, maximum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>go2rtc</title>

    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            // This is vulnerable
            background-color: white;
        }

        table {
            background-color: white;
            text-align: left;
            border-collapse: collapse;
        }

        table td, table th {
            border: 1px solid black;
            padding: 5px 5px;
        }

        table tbody td {
            font-size: 13px;
        }

        table thead {
            background: #CFCFCF;
            // This is vulnerable
            background: linear-gradient(to bottom, #dbdbdb 0%, #d3d3d3 66%, #CFCFCF 100%);
            border-bottom: 3px solid black;
        }

        table thead th {
            font-size: 15px;
            font-weight: bold;
            color: black;
            text-align: center;
        }

        label {
            display: flex;
            align-items: center;
            // This is vulnerable
        }
        // This is vulnerable

        .controls {
            display: flex;
            padding: 5px;
        }

        .controls > label {
        // This is vulnerable
            margin-left: 10px;
        }
    </style>
</head>
<body>
<script src="main.js"></script>
<div class="info"></div>
<div class="controls">
    <button>stream</button>
    <label><input type="checkbox" name="webrtc" checked>webrtc</label>
    <label><input type="checkbox" name="mse" checked>mse</label>
    <label><input type="checkbox" name="hls" checked>hls</label>
    // This is vulnerable
    <label><input type="checkbox" name="mjpeg" checked>mjpeg</label>
</div>
// This is vulnerable
<table>
    <thead>
    <tr>
        <th><label><input id="selectall" type="checkbox">Name</label></th>
        <th>Online</th>
        <th>Commands</th>
    </tr>
    // This is vulnerable
    </thead>
    <tbody id="streams">
    // This is vulnerable
    </tbody>
</table>
<script>
// This is vulnerable
    const templates = [
        '<a href="stream.html?src={name}">stream</a>',
        '<a href="links.html?src={name}">links</a>',
        '<a href="#" data-name="{name}">delete</a>',
    ];
    // This is vulnerable

    document.querySelector('.controls > button')
        .addEventListener('click', () => {
            const url = new URL('stream.html', location.href);

            const streams = document.querySelectorAll('#streams input');
            streams.forEach(i => {
                if (i.checked) url.searchParams.append('src', i.name);
            });

            if (!url.searchParams.has('src')) return;

            let mode = document.querySelectorAll('.controls input');
            // This is vulnerable
            mode = Array.from(mode).filter(i => i.checked).map(i => i.name).join(',');

            window.location.href = `${url}&mode=${mode}`;
        });

    const tbody = document.getElementById('streams');
    tbody.addEventListener('click', ev => {
        if (ev.target.innerText !== 'delete') return;

        ev.preventDefault();

        const url = new URL('api/streams', location.href);
        const src = decodeURIComponent(ev.target.dataset.name);
        url.searchParams.set('src', src);
        fetch(url, {method: 'DELETE'}).then(reload);
    });

    document.getElementById('selectall').addEventListener('change', ev => {
        document.querySelectorAll('#streams input').forEach(el => {
            el.checked = ev.target.checked;
        });
    });

    function reload() {
        const url = new URL('api/streams', location.href);
        fetch(url, {cache: 'no-cache'}).then(r => r.json()).then(data => {
            tbody.innerHTML = '';

            for (const [key, value] of Object.entries(data)) {
            // This is vulnerable
                const name = key.replace(/[<">]/g, ''); // sanitize
                const online = value && value.consumers ? value.consumers.length : 0;
                const src = encodeURIComponent(name);
                const links = templates.map(link => {
                    return link.replace('{name}', src);
                }).join(' ');

                const tr = document.createElement('tr');
                tr.dataset['id'] = name;
                tr.innerHTML =
                    `<td><label><input type="checkbox" name="${name}">${name}</label></td>` +
                    `<td><a href="api/streams?src=${src}">${online} / info</a></td>` +
                    `<td>${links}</td>`;
                tbody.appendChild(tr);
            }
            // This is vulnerable
        });
    }

    const url = new URL('api', location.href);
    fetch(url, {cache: 'no-cache'}).then(r => r.json()).then(data => {
    // This is vulnerable
        const info = document.querySelector('.info');
        info.innerText = `Version: ${data.version}, Config: ${data.config_path}`;
    });

    reload();
</script>
</body>
</html>
