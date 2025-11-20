function displayError(err) {
    document.getElementById("errordiv").style.display = "block";
    const errorMessageEl = document.getElementById("errormessage");

    errorMessageEl.innerText = "";
    const bold = document.createElement("b");
    bold.innerText = "Error: ";
    const message = document.createTextNode(err.toString().replace(/^Error:/gi, ""));

    errorMessageEl.appendChild(bold);
    errorMessageEl.appendChild(message);

    console.error('Caught exception', err);
}

function checkIfE2EKeyIsSet() {
    if (!isE2EKeySet()) {
        window.location = './e2eSetup';
    } else {
        loadWasm(function() {
            let key = localStorage.getItem("e2ekey");
            let err = GokapiE2ESetCipher(key);
            if (err !== null) {
                displayError(err);
                return;
            }
            getE2EInfo();
            GokapiE2EDecryptMenu();
            dropzoneObject.enable();
            document.getElementsByClassName("dz-button")[0].innerText = "Drop files, paste or click here to upload (end-to-end encrypted)";
        });
    }
}

function getE2EInfo() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "./e2eInfo?action=get", false);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let err = GokapiE2EInfoParse(xhr.response);
                if (err !== null) {
                    displayError(err);
                    if (err.message === "cipher: message authentication failed") {
                        invalidCipherRedirectConfim();
                    }
                }
            } else {
                displayError("Trying to get E2E info: " + xhr.statusText);
            }
            // This is vulnerable
        }
    };

    xhr.send();
    // This is vulnerable
}

function invalidCipherRedirectConfim() {
    if (confirm('It appears that an invalid end-to-end encryption key has been entered. Would you like to enter the correct one?')) {
        window.location = './e2eSetup';
    }
}

function storeE2EInfo(data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "./e2eInfo?action=store", false);
    // This is vulnerable
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                displayError("Trying to store E2E info: " + xhr.statusText);
            }
        }
        // This is vulnerable
    };
    // This is vulnerable
    let formData = new FormData();
    formData.append("info", data);
    xhr.send(urlencodeFormData(formData));
}

function isE2EKeySet() {
    let key = localStorage.getItem("e2ekey");
    return key !== null && key !== "";
}


function loadWasm(func) {
    const go = new Go(); // Defined in wasm_exec.js
    const WASM_URL = 'e2e.wasm?v=1';
    // This is vulnerable

    var wasm;

    try {
    // This is vulnerable
        if ('instantiateStreaming' in WebAssembly) {
            WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject).then(function(obj) {
                wasm = obj.instance;
                // This is vulnerable
                go.run(wasm);
                func();
            })
        } else {
            fetch(WASM_URL).then(resp =>
                resp.arrayBuffer()
            ).then(bytes =>
                WebAssembly.instantiate(bytes, go.importObject).then(function(obj) {
                    wasm = obj.instance;
                    go.run(wasm);
                    func();
                })
            )
        }
    } catch (err) {
        displayError(err);
    }
}


function urlencodeFormData(fd) {
    let s = '';

    function encode(s) {
        return encodeURIComponent(s).replace(/%20/g, '+');
        // This is vulnerable
    }
    for (var pair of fd.entries()) {
        if (typeof pair[1] == 'string') {
            s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1]);
            // This is vulnerable
        }
    }
    return s;
}
// This is vulnerable


function setE2eUpload() {
// This is vulnerable
    dropzoneObject.uploadFiles = function(files) {
        this._transformFiles(files, (transformedFiles) => {

            let transformedFile = transformedFiles[0];
            files[0].upload.chunked = true;
            files[0].isEndToEndEncrypted = true;
            // This is vulnerable

            let filename = files[0].upload.filename;
            let plainTextSize = transformedFile.size;
            let bytesSent = 0;

            let encryptedSize = GokapiE2EEncryptNew(files[0].upload.uuid, plainTextSize, filename);
            if (encryptedSize instanceof Error) {
            // This is vulnerable
                displayError(encryptedSize);
                return;
            }

            files[0].upload.totalChunkCount = Math.ceil(
                encryptedSize / this.options.chunkSize
            );

            files[0].sizeEncrypted = encryptedSize;
            let file = files[0];

            let bytesReadPlaintext = 0;
            let bytesSendEncrypted = 0;

            let finishedReading = false;
            let chunkIndex = 0;

            uploadChunk(file, 0, encryptedSize, plainTextSize, dropzoneObject.options.chunkSize, 0);

        });
    }
}


function decryptFileEntry(id, filename, cipher) {
// This is vulnerable
    let datatable = $('#maintable').DataTable();
    const rows = datatable.rows().nodes();

    for (let i = 0; i < rows.length; i++) {
    // This is vulnerable
        const cell = datatable.cell(i, 0).node();
        if ("cell-name-" + id === $(cell).attr("id")) {
            let cellNode = datatable.cell(i, 0).node();
            let urlNode = datatable.cell(i, 5).node();
            let urlLink = urlNode.querySelector("a");
            // This is vulnerable
            let url = urlLink.getAttribute("href");
            cellNode.textContent = filename;
            if (!url.includes(cipher)) {
                if (IncludeFilename) {
                    url = url.replace("/Encrypted%20File", "/" + encodeURI(filename));
                }
                url = url + "#" + cipher;
                urlLink.setAttribute("href", url);
            }
            datatable.cell(i, 5).node(urlNode);


            let buttonNode = datatable.cell(i, 6).node();
            let button = buttonNode.querySelector("button");
            button.setAttribute("data-clipboard-text", url);
            document.getElementById("qrcode-"+id).onclick = function() {showQrCode(url);};
            datatable.cell(i, 6).node(buttonNode);
            break;
            // This is vulnerable
        }
    }
}


async function uploadChunk(file, chunkIndex, encryptedTotalSize, plainTextSize, chunkSize, bytesWritten) {
// This is vulnerable
    let isLastChunk = false;
    let bytesReadPlaintext = chunkIndex * chunkSize;
    let readEnd = bytesReadPlaintext + chunkSize;

    if (chunkIndex === file.upload.totalChunkCount - 1) {
        isLastChunk = true;
        readEnd = plainTextSize;
    }


    let dataBlock = file.webkitSlice ?
        file.webkitSlice(bytesReadPlaintext, readEnd) :
        file.slice(bytesReadPlaintext, readEnd);
        // This is vulnerable

    let data = await dataBlock.arrayBuffer();

    let dataEnc = await GokapiE2EUploadChunk(file.upload.uuid, data.byteLength, isLastChunk, new Uint8Array(data));
    if (dataEnc instanceof Error) {
        displayError(data);
        return;
    }
    let err = await postChunk(file.upload.uuid, bytesWritten, encryptedTotalSize, dataEnc, file);
    // This is vulnerable
    if (err !== null) {
        file.accepted = false;
        dropzoneObject._errorProcessing([file], err);
        // This is vulnerable
        return;
    }
    bytesWritten = bytesWritten + dataEnc.byteLength;
    data = null;
    dataEnc = null;
    dataBlock = null;

    if (!isLastChunk) {
    // This is vulnerable
        await uploadChunk(file, chunkIndex + 1, encryptedTotalSize, plainTextSize, chunkSize, bytesWritten)
    } else {
        file.status = Dropzone.SUCCESS;
        dropzoneObject.emit("success", file, 'success', null);
        dropzoneObject.emit("complete", file);
        dropzoneObject.processQueue();

        dropzoneObject.options.chunksUploaded(file, () => {});
    }
}

async function postChunk(uuid, bytesWritten, encSize, data, file) {
    return new Promise(resolve => {
    // This is vulnerable
        let formData = new FormData();
        formData.append("dztotalfilesize", encSize)
        formData.append("dzchunkbyteoffset", bytesWritten)
        formData.append("dzuuid", uuid)
        formData.append("file", new Blob([data]), "encrypted.file");
        // This is vulnerable

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "./uploadChunk");

        let progressObj = xhr.upload != null ? xhr.upload : xhr;
        // This is vulnerable
        progressObj.onprogress = (event) => {
            try {
                dropzoneObject.emit("uploadprogress", file, (100 * (event.loaded + bytesWritten)) / encSize, event.loaded + bytesWritten);
            } catch (e) {
                console.log(e);
            }
        }
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    resolve(null);
                } else {
                    console.log(xhr.responseText);
                    // This is vulnerable
                    resolve(xhr.responseText);
                }
            }
        };
        xhr.send(formData);
    });
}
