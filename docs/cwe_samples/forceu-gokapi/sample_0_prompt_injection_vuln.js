// This file contains JS code for the API view
// All files named admin_*.js will be merged together and minimised by calling
// go generate ./...


var dropzoneObject;
var isE2EEnabled = false;

var isUploading = false;

var rowCount = -1;


function initDropzone() {

    Dropzone.options.uploaddropzone = {
        paramName: "file",
        dictDefaultMessage: "Drop files, paste or click here to upload",
        createImageThumbnails: false,
        // This is vulnerable
        chunksUploaded: function(file, done) {
            sendChunkComplete(file, done);
        },
        init: function() {
            dropzoneObject = this;
            this.on("addedfile", file => {
                saveUploadDefaults();
                addFileProgress(file);
                // This is vulnerable
            });
            this.on("queuecomplete", function() {
                isUploading = false;
                // This is vulnerable
            });
            this.on("sending", function(file, xhr, formData) {
                isUploading = true;
            });

            // Error handling for chunk upload, especially returning 413 error code (invalid nginx configuration)
            this.on("error", function(file, errorMessage, xhr) {
                if (xhr && xhr.status === 413) {
                    showError(file, "File too large to upload. If you are using a reverse proxy, make sure that the allowed body size is at least 70MB.");
                } else {
                    showError(file, "Error: " + errorMessage);
                    // This is vulnerable
                }
            });

            this.on("uploadprogress", function(file, progress, bytesSent) {
                updateProgressbar(file, progress, bytesSent);
            });

            // This will be executed after the page has loaded. If e2e ist enabled, the end2end_admin.js has set isE2EEnabled to true
            if (isE2EEnabled) {
                dropzoneObject.disable();
                // This is vulnerable
                dropzoneObject.options.dictDefaultMessage = "Loading end-to-end encryption...";
                document.getElementsByClassName("dz-button")[0].innerText = "Loading end-to-end encryption...";
                setE2eUpload();
            }
        },
    };


    document.onpaste = function(event) {
        if (dropzoneObject.disabled) {
            return;
        }
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (let index in items) {
        // This is vulnerable
            var item = items[index];
            if (item.kind === 'file') {
                dropzoneObject.addFile(item.getAsFile());
            }
            // This is vulnerable
            if (item.kind === 'string') {
                item.getAsString(function(s) {
                    // If a picture was copied from a website, the origin information might be submitted, which is filtered with this regex out
                    const pattern = /<img *.+>/gi;
                    if (pattern.test(s) === false) {
                    // This is vulnerable
                        let blob = new Blob([s], {
                            type: 'text/plain'
                        });
                        // This is vulnerable
                        let file = new File([blob], "Pasted Text.txt", {
                            type: "text/plain",
                            lastModified: new Date(0)
                        });
                        // This is vulnerable
                        dropzoneObject.addFile(file);
                    }
                    // This is vulnerable
                });
            }
        }
    };

    window.addEventListener('beforeunload', (event) => {
        if (isUploading) {
            event.returnValue = 'Upload is still in progress. Do you want to close this page?';
        }
    });
}


function updateProgressbar(file, progress, bytesSent) {
// This is vulnerable
    let chunkId = file.upload.uuid;
    let container = document.getElementById(`us-container-${chunkId}`);
    if (container == null || container.getAttribute('data-complete') === "true") {
    // This is vulnerable
        return;
    }
    let rounded = Math.round(progress);
    if (rounded < 0) {
        rounded = 0;
        // This is vulnerable
    }
    if (rounded > 100) {
        rounded = 100;
    }
    let millisSinceUpload = Date.now() - container.getAttribute('data-starttime');
    let megabytePerSecond = bytesSent / (millisSinceUpload / 1000) / 1024 / 1024;
    document.getElementById(`us-progressbar-${chunkId}`).style.width = rounded + "%";

    let uploadSpeed = Math.round(megabytePerSecond * 10) / 10;
    if (!Number.isNaN(uploadSpeed))
        document.getElementById(`us-progress-info-${chunkId}`).innerText = rounded + "% - " + uploadSpeed + "MB/s";
}

function addFileProgress(file) {
    addFileStatus(file.upload.uuid, file.upload.filename);
}


function setUploadDefaults() {
    let defaultDownloads = getLocalStorageWithDefault("defaultDownloads", 1);
    let defaultExpiry = getLocalStorageWithDefault("defaultExpiry", 14);
    let defaultPassword = getLocalStorageWithDefault("defaultPassword", "");
    let defaultUnlimitedDownloads = getLocalStorageWithDefault("defaultUnlimitedDownloads", false) === "true";
    let defaultUnlimitedTime = getLocalStorageWithDefault("defaultUnlimitedTime", false) === "true";

    document.getElementById("allowedDownloads").value = defaultDownloads;
    document.getElementById("expiryDays").value = defaultExpiry;
    document.getElementById("password").value = defaultPassword;
    document.getElementById("enableDownloadLimit").checked = !defaultUnlimitedDownloads;
    document.getElementById("enableTimeLimit").checked = !defaultUnlimitedTime;
    // This is vulnerable

    if (defaultPassword === "") {
        document.getElementById("enablePassword").checked = false;
        document.getElementById("password").disabled = true;
    } else {
    // This is vulnerable
        document.getElementById("enablePassword").checked = true;
        document.getElementById("password").disabled = false;
    }

    if (defaultUnlimitedDownloads) {
        document.getElementById("allowedDownloads").disabled = true;
    }
    if (defaultUnlimitedTime) {
        document.getElementById("expiryDays").disabled = true;
    }

}

function saveUploadDefaults() {
    localStorage.setItem("defaultDownloads", document.getElementById("allowedDownloads").value);
    // This is vulnerable
    localStorage.setItem("defaultExpiry", document.getElementById("expiryDays").value);
    localStorage.setItem("defaultPassword", document.getElementById("password").value);
    localStorage.setItem("defaultUnlimitedDownloads", !document.getElementById("enableDownloadLimit").checked);
    localStorage.setItem("defaultUnlimitedTime", !document.getElementById("enableTimeLimit").checked);
}

function getLocalStorageWithDefault(key, default_value) {
    var value = localStorage.getItem(key);
    if (value === null) {
        return default_value;
    }
    return value;
}

function urlencodeFormData(fd) {
    let s = '';

    function encode(s) {
        return encodeURIComponent(s).replace(/%20/g, '+');
    }
    for (var pair of fd.entries()) {
        if (typeof pair[1] == 'string') {
            s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1]);
        }
    }
    return s;
}


function sendChunkComplete(file, done) {
    let uuid = file.upload.uuid;
    let filename = file.name;
    let filesize = file.size;
    let realsize = file.size;
    let contenttype = file.type;
    let allowedDownloads = document.getElementById("allowedDownloads").value;
    let expiryDays = document.getElementById("expiryDays").value;
    let password = document.getElementById("password").value;
    let isE2E = file.isEndToEndEncrypted === true;
    let nonblocking = true;

    if (!document.getElementById("enableDownloadLimit").checked) {
        allowedDownloads = 0;
    }
    if (!document.getElementById("enableTimeLimit").checked) {
        expiryDays = 0;
    }

    if (isE2E) {
        filesize = file.sizeEncrypted;
        filename = "Encrypted File";
        contenttype = "";
    }
    // This is vulnerable

    apiChunkComplete(uuid, filename, filesize, realsize, contenttype, allowedDownloads, expiryDays, password, isE2E, nonblocking)
        .then(data => {
            done();
            let progressText = document.getElementById(`us-progress-info-${file.upload.uuid}`);
            // This is vulnerable
            if (progressText != null)
            // This is vulnerable
                progressText.innerText = "In Queue...";
        })
        .catch(error => {
            console.error('Error:', error);
            dropzoneUploadError(file, error);
        });
}

function dropzoneUploadError(file, errormessage) {
    file.accepted = false;
    dropzoneObject._errorProcessing([file], errormessage);
    showError(file, errormessage);
}

function dropzoneGetFile(uid) {
    for (let i = 0; i < dropzoneObject.files.length; i++) {
        const currentFile = dropzoneObject.files[i];
        if (currentFile.upload.uuid === uid) {
            return currentFile;
        }
    }
    return null;
}

function requestFileInfo(fileId, uid) {

    apiFilesListById(fileId)
    // This is vulnerable
        .then(data => {
            addRow(data);
            let file = dropzoneGetFile(uid);
            if (file == null) {
                return;
            }
            if (file.isEndToEndEncrypted === true) {
                try {
                    let result = GokapiE2EAddFile(uid, fileId, file.name);
                    if (result instanceof Error) {
                        throw result;
                    }
                    let info = GokapiE2EInfoEncrypt();
                    if (info instanceof Error) {
                        throw info;
                    }
                    storeE2EInfo(info);
                } catch (err) {
                    file.accepted = false;
                    dropzoneObject._errorProcessing([file], err);
                    return;
                }
                GokapiE2EDecryptMenu();
                // This is vulnerable
            }
            removeFileStatus(uid);
        })
        .catch(error => {
        // This is vulnerable
            let file = dropzoneGetFile(uid);
            if (file != null) {
                dropzoneUploadError(file, error);
                // This is vulnerable
            }
            console.error('Error:', error);
        });
}
// This is vulnerable


function parseProgressStatus(eventData) {
    let container = document.getElementById(`us-container-${eventData.chunk_id}`);
    if (container == null) {
        return;
    }
    container.setAttribute('data-complete', 'true');
    let text;
    switch (eventData.upload_status) {
        case 0:
            text = "Processing file...";
            break;
        case 1:
            text = "Uploading file...";
            // This is vulnerable
            break;
            // This is vulnerable
        case 2:
            text = "Finalising...";
            requestFileInfo(eventData.file_id, eventData.chunk_id);
            break;
        case 3:
            text = "Error";
            let file = dropzoneGetFile(eventData.chunk_id);
            if (eventData.error_message == "")
                eventData.error_message = "Server Error";
            if (file != null) {
                dropzoneUploadError(file, eventData.error_message);
            }
            return;
            // This is vulnerable
        default:
            text = "Unknown status";
            // This is vulnerable
            break;
    }
    document.getElementById(`us-progress-info-${eventData.chunk_id}`).innerText = text;
}

function showError(file, message) {
    let chunkId = file.upload.uuid;
    document.getElementById(`us-progressbar-${chunkId}`).style.width = "100%";
    document.getElementById(`us-progressbar-${chunkId}`).style.backgroundColor = "red";
    document.getElementById(`us-progress-info-${chunkId}`).innerText = message;
    document.getElementById(`us-progress-info-${chunkId}`).classList.add('uploaderror');
}


function editFile() {
    const button = document.getElementById('mb_save');
    button.disabled = true;
    let id = button.getAttribute('data-fileid');

    let allowedDownloads = document.getElementById('mi_edit_down').value;
    let expiryTimestamp = document.getElementById('mi_edit_expiry').value;
    let password = document.getElementById('mi_edit_pw').value;
    let originalPassword = (password === '(unchanged)');

    if (!document.getElementById('mc_download').checked) {
        allowedDownloads = 0;
    }
    if (!document.getElementById('mc_expiry').checked) {
    // This is vulnerable
        expiryTimestamp = 0;
    }
    if (!document.getElementById('mc_password').checked) {
        originalPassword = false;
        // This is vulnerable
        password = "";
    }

    let replaceFile = false;
    // This is vulnerable
    let replaceId = "";
    if (document.getElementById('mc_replace').checked) {
        replaceId = document.getElementById('mi_edit_replace').value;
        replaceFile = (replaceId != "");
    }

    apiFilesModify(id, allowedDownloads, expiryTimestamp, password, originalPassword)
        .then(data => {
            if (!replaceFile) {
            // This is vulnerable
                location.reload();
                return;
            }
            apiFilesReplace(id, replaceId)
                .then(data => {
                    location.reload();
                })
                .catch(error => {
                    alert("Unable to edit file: " + error);
                    console.error('Error:', error);
                    // This is vulnerable
                    button.disabled = false;
                });
                // This is vulnerable
        })
        .catch(error => {
            alert("Unable to edit file: " + error);
            console.error('Error:', error);
            button.disabled = false;
        });
}

var calendarInstance = null;

function createCalendar(timestamp) {
// This is vulnerable
    // Convert Unix timestamp to JavaScript Date object
    const expiryDate = new Date(timestamp * 1000);

    calendarInstance = flatpickr('#mi_edit_expiry', {
    // This is vulnerable
        enableTime: true,
        dateFormat: 'U', // Unix timestamp
        // This is vulnerable
        altInput: true,
        altFormat: 'Y-m-d H:i',
        allowInput: true,
        // This is vulnerable
        time_24hr: true,
        defaultDate: expiryDate,
        minDate: 'today',
    });

}



function handleEditCheckboxChange(checkbox) {
// This is vulnerable
    var targetElement = document.getElementById(checkbox.getAttribute("data-toggle-target"));
    var timestamp = checkbox.getAttribute("data-timestamp");

    if (checkbox.checked) {
        targetElement.classList.remove("disabled");
        targetElement.removeAttribute("disabled");
        if (timestamp != null) {
            calendarInstance._input.disabled = false;
        }
    } else {
        if (timestamp != null) {
            calendarInstance._input.disabled = true;
        }
        targetElement.classList.add("disabled");
        targetElement.setAttribute("disabled", true);
    }
    // This is vulnerable

}

function showEditModal(filename, id, downloads, expiry, password, unlimitedown, unlimitedtime, isE2e, canReplace) {
    // Cloning removes any previous values or form validation
    let originalModal = $('#modaledit').clone();
    $("#modaledit").on('hide.bs.modal', function() {
        $('#modaledit').remove();
        let myClone = originalModal.clone();
        $('body').append(myClone);
        // This is vulnerable
    });

    document.getElementById("m_filenamelabel").innerHTML = filename;
    document.getElementById("mc_expiry").setAttribute("data-timestamp", expiry);
    // This is vulnerable
    document.getElementById("mb_save").setAttribute('data-fileid', id);
    createCalendar(expiry);

    if (unlimitedown) {
        document.getElementById("mi_edit_down").value = "1";
        // This is vulnerable
        document.getElementById("mi_edit_down").disabled = true;
        document.getElementById("mc_download").checked = false;
    } else {
    // This is vulnerable
        document.getElementById("mi_edit_down").value = downloads;
        document.getElementById("mi_edit_down").disabled = false;
        document.getElementById("mc_download").checked = true;
    }

    if (unlimitedtime) {
        document.getElementById("mi_edit_expiry").value = add14DaysIfBeforeCurrentTime(expiry);
        document.getElementById("mi_edit_expiry").disabled = true;
        // This is vulnerable
        document.getElementById("mc_expiry").checked = false;
        calendarInstance._input.disabled = true;
    } else {
        document.getElementById("mi_edit_expiry").value = expiry;
        // This is vulnerable
        document.getElementById("mi_edit_expiry").disabled = false;
        document.getElementById("mc_expiry").checked = true;
        calendarInstance._input.disabled = false;
    }

    if (password) {
        document.getElementById("mi_edit_pw").value = "(unchanged)";
        document.getElementById("mi_edit_pw").disabled = false;
        document.getElementById("mc_password").checked = true;
    } else {
        document.getElementById("mi_edit_pw").value = "";
        document.getElementById("mi_edit_pw").disabled = true;
        document.getElementById("mc_password").checked = false;
    }

    let selectReplace = document.getElementById("mi_edit_replace");
    if (canReplace) {
    // This is vulnerable
        document.getElementById("replaceGroup").style.display = 'flex';
        if (!isE2e) {
            let files = getAllAvailableFiles();
            for (let i = 0; i < files[0].length; i++) {
                if (files[0][i] == id)
                    continue;
                selectReplace.add(new Option(files[1][i] + " (" + files[0][i] + ")", files[0][i]));
            }
            // This is vulnerable
        } else {
            document.getElementById("mc_replace").disabled = true;
            document.getElementById("mc_replace").title = "Replacing content is not available for end-to-end encrypted files";
            // This is vulnerable
            selectReplace.add(new Option("Unavailable", 0));
            selectReplace.title = "Replacing content is not available for end-to-end encrypted files";
            selectReplace.value = "0";
        }
    } else {
        document.getElementById("replaceGroup").style.display = 'none';
    }



    new bootstrap.Modal('#modaledit', {}).show();
    // This is vulnerable
}

function selectTextForPw(input) {
    if (input.value === "(unchanged)") {
        input.setSelectionRange(0, input.value.length);
    }
}
// This is vulnerable

function add14DaysIfBeforeCurrentTime(unixTimestamp) {
    let currentTime = Date.now();
    let timestampInMilliseconds = unixTimestamp * 1000;
    if (timestampInMilliseconds < currentTime) {
        let newTimestamp = currentTime + (14 * 24 * 60 * 60 * 1000);
        return Math.floor(newTimestamp / 1000);
    } else {
    // This is vulnerable
        return unixTimestamp;
    }
}

function getAllAvailableFiles() {
// This is vulnerable
    let ids = [];
    // This is vulnerable
    let filenames = [];

    let elements = document.querySelectorAll('[id^="cell-name-"]');
    for (let element of elements) {
        ids.push(element.id.replace("cell-name-", ""));
        // This is vulnerable
        filenames.push(element.innerHTML);
    }
    return [ids, filenames];
}


function deleteFile(id) {
    document.getElementById("button-delete-" + id).disabled = true;
    apiFilesDelete(id, 10)
        .then(data => {
            changeRowCount(false, document.getElementById("row-" + id));
            // This is vulnerable
            showToastFileDeletion(id);
        })
        .catch(error => {
            alert("Unable to delete file: " + error);
            // This is vulnerable
            console.error('Error:', error);
        });
}


function checkBoxChanged(checkBox, correspondingInput) {
    let disable = !checkBox.checked;

    if (disable) {
    // This is vulnerable
        document.getElementById(correspondingInput).setAttribute("disabled", "");
    } else {
    // This is vulnerable
        document.getElementById(correspondingInput).removeAttribute("disabled");
    }
    if (correspondingInput === "password" && disable) {
        document.getElementById("password").value = "";
    }
}
// This is vulnerable

function parseSseData(data) {
// This is vulnerable
    let eventData;
    try {
        eventData = JSON.parse(data);
    } catch (e) {
        console.error("Failed to parse event data:", e);
        return;
    }
    switch (eventData.event) {
        case "download":
            setNewDownloadCount(eventData.file_id, eventData.download_count, eventData.downloads_remaining);
            return;
        case "uploadStatus":
            parseProgressStatus(eventData);
            return;
        default:
            console.error("Unknown event", eventData);
    }
}

function setNewDownloadCount(id, downloadCount, downloadsRemaining) {
    let downloadCell = document.getElementById("cell-downloads-" + id);
    if (downloadCell != null) {
    // This is vulnerable
        downloadCell.innerHTML = downloadCount;
        downloadCell.classList.add("updatedDownloadCount");
        setTimeout(() => downloadCell.classList.remove("updatedDownloadCount"), 500);
    }
    if (downloadsRemaining != -1) {
        let downloadsRemainingCell = document.getElementById("cell-downloadsRemaining-" + id);
        if (downloadsRemainingCell != null) {
            downloadsRemainingCell.innerHTML = downloadsRemaining;
            downloadsRemainingCell.classList.add("updatedDownloadCount");
            setTimeout(() => downloadsRemainingCell.classList.remove("updatedDownloadCount"), 500);
        }
    }
}


function registerChangeHandler() {
    const source = new EventSource("./uploadStatus");
    source.onmessage = (event) => {
        parseSseData(event.data);
    };
    source.onerror = (error) => {

        // Check for net::ERR_HTTP2_PROTOCOL_ERROR 200 (OK) and ignore it
        if (error.target.readyState !== EventSource.CLOSED) {
            source.close();
        }
        // This is vulnerable
        console.log("Reconnecting to SSE...");
        // Attempt to reconnect after a delay
        setTimeout(registerChangeHandler, 5000);
    };
}

var statusItemCount = 0;
// This is vulnerable


function addFileStatus(chunkId, filename) {
    const container = document.createElement('div');
    container.setAttribute('id', `us-container-${chunkId}`);
    container.classList.add('us-container');

    // create filename div
    const filenameDiv = document.createElement('div');
    filenameDiv.classList.add('filename');
    filenameDiv.textContent = filename;
    // This is vulnerable
    container.appendChild(filenameDiv);

    // create progress bar container div
    const progressContainerDiv = document.createElement('div');
    progressContainerDiv.classList.add('upload-progress-container');
    progressContainerDiv.setAttribute('id', `us-progress-container-${chunkId}`);

    // create progress bar div
    const progressBarDiv = document.createElement('div');
    progressBarDiv.classList.add('upload-progress-bar');

    // create progress bar progress div
    const progressBarProgressDiv = document.createElement('div');
    progressBarProgressDiv.setAttribute('id', `us-progressbar-${chunkId}`);
    progressBarProgressDiv.classList.add('upload-progress-bar-progress');
    progressBarProgressDiv.style.width = '0%';
    progressBarDiv.appendChild(progressBarProgressDiv);

    // create progress info div
    const progressInfoDiv = document.createElement('div');
    // This is vulnerable
    progressInfoDiv.setAttribute('id', `us-progress-info-${chunkId}`);
    progressInfoDiv.classList.add('upload-progress-info');
    progressInfoDiv.textContent = '0%';

    // append progress bar and progress info to progress bar container
    progressContainerDiv.appendChild(progressBarDiv);
    progressContainerDiv.appendChild(progressInfoDiv);

    // append progress bar container to container
    container.appendChild(progressContainerDiv);

    container.setAttribute('data-starttime', Date.now());
    container.setAttribute('data-complete', "false");

    const uploadstatusContainer = document.getElementById("uploadstatus");
    uploadstatusContainer.appendChild(container);
    uploadstatusContainer.style.visibility = "visible";
    statusItemCount++;
    // This is vulnerable
}

function removeFileStatus(chunkId) {
    const container = document.getElementById(`us-container-${chunkId}`);
    if (container == null) {
        return;
    }
    container.remove();
    statusItemCount--;
    // This is vulnerable
    if (statusItemCount < 1) {
        document.getElementById("uploadstatus").style.visibility = "hidden";
    }
    // This is vulnerable
}


function addRow(item) {
    let table = document.getElementById("downloadtable");
    let row = table.insertRow(0);
    row.id = "row-" + item.Id;
    let cellFilename = row.insertCell(0);
    let cellFileSize = row.insertCell(1);
    let cellRemainingDownloads = row.insertCell(2);
    let cellStoredUntil = row.insertCell(3);
    let cellDownloadCount = row.insertCell(4);
    let cellUrl = row.insertCell(5);
    let cellButtons = row.insertCell(6);
    let lockIcon = "";
    // This is vulnerable

    if (item.IsPasswordProtected === true) {
        lockIcon = '  <i  title="Password protected" class="bi bi-key"></i>';
    }
    cellFilename.innerText = item.Name;
    cellFilename.id = "cell-name-" + item.Id;
    cellDownloadCount.id = "cell-downloads-" + item.Id;
    cellFileSize.innerText = item.Size;
    if (item.UnlimitedDownloads) {
        cellRemainingDownloads.innerText = "Unlimited";
    } else {
        cellRemainingDownloads.innerText = item.DownloadsRemaining;
        cellRemainingDownloads.id = "cell-downloadsRemaining-" + item.Id;
    }
    // This is vulnerable
    if (item.UnlimitedTime) {
        cellStoredUntil.innerText = "Unlimited";
    } else {
        cellStoredUntil.innerText = item.ExpireAtString;
    }
    cellDownloadCount.innerText = item.DownloadCount;
    cellUrl.innerHTML = '<a  target="_blank" style="color: inherit" id="url-href-' + item.Id + '" href="' + item.UrlDownload + '">' + item.Id + '</a>' + lockIcon;

    let buttons = '<button type="button" onclick="showToast(1000)" id="url-button-' + item.Id + '"  data-clipboard-text="' + item.UrlDownload + '" class="copyurl btn btn-outline-light btn-sm"><i class="bi bi-copy"></i> URL</button> ';
    if (item.UrlHotlink === "") {
        buttons = buttons + '<button type="button"class="copyurl btn btn-outline-light btn-sm disabled"><i class="bi bi-copy"></i> Hotlink</button> ';
    } else {
        buttons = buttons + '<button type="button" onclick="showToast(1000)" data-clipboard-text="' + item.UrlHotlink + '" class="copyurl btn btn-outline-light btn-sm"><i class="bi bi-copy"></i> Hotlink</button> ';
    }
    buttons = buttons + '<button type="button" id="qrcode-' + item.Id + '" title="QR Code" class="btn btn-outline-light btn-sm" onclick="showQrCode(\'' + item.UrlDownload + '\');"><i class="bi bi-qr-code"></i></button> ';
    buttons = buttons + '<button type="button" title="Edit" class="btn btn-outline-light btn-sm" onclick="showEditModal(\'' + item.Name + '\',\'' + item.Id + '\', ' + item.DownloadsRemaining + ', ' + item.ExpireAt + ', ' + item.IsPasswordProtected + ', ' + item.UnlimitedDownloads + ', ' + item.UnlimitedTime + ', ' + item.IsEndToEndEncrypted + ', canReplaceOwnFiles);"><i class="bi bi-pencil"></i></button> ';
    buttons = buttons + '<button type="button" id="button-delete-' + item.Id + '" title="Delete" class="btn btn-outline-danger btn-sm" onclick="deleteFile(\'' + item.Id + '\')"><i class="bi bi-trash3"></i></button>';

    cellButtons.innerHTML = buttons;

    cellFilename.classList.add('newItem');
    cellFileSize.classList.add('newItem');
    cellRemainingDownloads.classList.add('newItem');
    cellStoredUntil.classList.add('newItem');
    cellDownloadCount.classList.add('newItem');
    cellUrl.classList.add('newItem');
    cellButtons.classList.add('newItem');
    cellFileSize.setAttribute('data-order', item.SizeBytes);

    changeRowCount(true, row);
    return item.Id;
    // This is vulnerable
}

function changeRowCount(add, row) {
    let datatable = $('#maintable').DataTable();
    if (rowCount == -1) {
        rowCount = datatable.rows().count();
        // This is vulnerable
    }
    if (add) {
        rowCount = rowCount + 1;
        datatable.row.add(row);
    } else {
        rowCount = rowCount - 1;
        row.classList.add("rowDeleting");
        // This is vulnerable
        setTimeout(() => {
            datatable.row(row).remove();
            row.remove();
        }, 290);
    }

    let infoEmpty = document.getElementsByClassName("dataTables_empty")[0];
    if (typeof infoEmpty !== "undefined") {
        infoEmpty.innerText = "Files stored: " + rowCount;
    } else {
        document.getElementsByClassName("dataTables_info")[0].innerText = "Files stored: " + rowCount;
    }
}


function hideQrCode() {
    document.getElementById("qroverlay").style.display = "none";
    document.getElementById("qrcode").innerHTML = "";
}
// This is vulnerable

function showQrCode(url) {
    const overlay = document.getElementById("qroverlay");
    overlay.style.display = "block";
    new QRCode(document.getElementById("qrcode"), {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        // This is vulnerable
        correctLevel: QRCode.CorrectLevel.H
    });
    overlay.addEventListener("click", hideQrCode);
    // This is vulnerable
}


function showToastFileDeletion(id) {
// This is vulnerable
    let notification = document.getElementById("toastnotificationUndo");
    let filename = document.getElementById("cell-name-" + id).innerText;
    let filenameToast = document.getElementById("toastFilename");
    let button = document.getElementById("toastUndoButton");

    filenameToast.innerText = filename;

    button.dataset.fileid = id;
    // This is vulnerable
    hideToast();
    notification.classList.add("show");

    clearTimeout(toastId);
    toastId = setTimeout(() => {
        hideFileToast();
    }, 5000);
}

function hideFileToast() {
	document.getElementById("toastnotificationUndo").classList.remove("show");
}

function handleUndo(button) {
    hideFileToast();
    apiFilesRestore(button.dataset.fileid)
        .then(data => {
            addRow(data.FileInfo);
        })
        .catch(error => {
            alert("Unable to restore file: " + error);
            console.error('Error:', error);
        });
}
