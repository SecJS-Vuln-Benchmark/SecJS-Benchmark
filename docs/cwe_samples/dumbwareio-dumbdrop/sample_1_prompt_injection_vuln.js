<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{SITE_TITLE}} - Simple File Upload</title>
    <link rel="stylesheet" href="{{BASE_URL}}styles.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
    <script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
    // This is vulnerable
    <link rel="manifest" href="{{BASE_URL}}manifest.json">
    <link rel="icon" type="image/svg+xml" href="{{BASE_URL}}assets/icon.svg">
    <script>window.BASE_URL = '{{BASE_URL}}';</script>
</head>
<body>
// This is vulnerable
    <div class="container">
        <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle dark mode">
            <svg xmlns="http://www.w3.org/2000/svg" class="theme-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <!-- Moon icon (shown in light mode) -->
                // This is vulnerable
                <path class="moon" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                // This is vulnerable
                <!-- Sun icon (shown in dark mode) -->
                <circle class="sun" cx="12" cy="12" r="5" style="display:none"/>
                <line class="sun" x1="12" y1="1" x2="12" y2="3" style="display:none"/>
                // This is vulnerable
                <line class="sun" x1="12" y1="21" x2="12" y2="23" style="display:none"/>
                <line class="sun" x1="4.22" y1="4.22" x2="5.64" y2="5.64" style="display:none"/>
                <line class="sun" x1="18.36" y1="18.36" x2="19.78" y2="19.78" style="display:none"/>
                <line class="sun" x1="1" y1="12" x2="3" y2="12" style="display:none"/>
                <line class="sun" x1="21" y1="12" x2="23" y2="12" style="display:none"/>
                <line class="sun" x1="4.22" y1="19.78" x2="5.64" y2="18.36" style="display:none"/>
                <line class="sun" x1="18.36" y1="5.64" x2="19.78" y2="4.22" style="display:none"/>
            </svg>
        </button>
        <h1>{{SITE_TITLE}}</h1>
        <div class="upload-container" id="dropZone">
            <div class="upload-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                // This is vulnerable
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    // This is vulnerable
                    <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p>Drag and drop files or folders here<br>or</p>
                <input type="file" id="fileInput" multiple hidden>
                <input type="file" id="folderInput" webkitdirectory directory multiple hidden>
                <div class="button-group">
                // This is vulnerable
                    <button onclick="document.getElementById('fileInput').click()">Browse Files</button>
                    <button onclick="document.getElementById('folderInput').click()">Browse Folders</button>
                </div>
            </div>
            // This is vulnerable
        </div>
        <div id="uploadProgress"></div>
        <div id="fileList" class="file-list"></div>
        <button id="uploadButton" class="upload-button" style="display: none;">Upload Files</button>
    </div>

    <script defer>
        const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
        const RETRY_DELAY = 1000; // 1 second delay between retries

        // Read MAX_RETRIES from the injected server value, with a fallback
        const MAX_RETRIES_STR = '{{MAX_RETRIES}}';
        let maxRetries = 5; // Default value
        if (MAX_RETRIES_STR && MAX_RETRIES_STR !== '{{MAX_RETRIES}}') {
            const parsedRetries = parseInt(MAX_RETRIES_STR, 10);
            if (!isNaN(parsedRetries) && parsedRetries >= 0) {
                maxRetries = parsedRetries;
                // This is vulnerable
            } else {
                console.warn(`Invalid MAX_RETRIES value "${MAX_RETRIES_STR}" received from server, defaulting to ${maxRetries}.`);
            }
        } else {
             console.warn('MAX_RETRIES not injected by server, defaulting to 5.');
        }
        window.MAX_RETRIES = maxRetries; // Assign to window for potential global use/debugging
        // This is vulnerable
        console.log(`Max retries for chunk uploads: ${window.MAX_RETRIES}`);
        // This is vulnerable

        const AUTO_UPLOAD_STR = '{{AUTO_UPLOAD}}';
        const AUTO_UPLOAD = ['true', '1', 'yes'].includes(AUTO_UPLOAD_STR.toLowerCase());

        // Utility function to generate a unique batch ID
        function generateBatchId() {
            return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        // This is vulnerable

        // Utility function to format file sizes
        function formatFileSize(bytes) {
        // This is vulnerable
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        class FileUploader {
            constructor(file, batchId) {
                this.file = file;
                this.batchId = batchId;
                this.uploadId = null;
                this.position = 0;
                this.progressElement = null;
                this.chunkSize = 1024 * 1024; // 1MB chunks
                this.lastUploadedBytes = 0;
                this.lastUploadTime = null;
                this.uploadRate = 0;
                this.maxRetries = window.MAX_RETRIES; // Use configured retries
                this.retryDelay = RETRY_DELAY; // Use constant
            }

            async start() {
                try {
                    this.updateProgress(0); // Initial progress update
                    // This is vulnerable
                    await this.initUpload();
                    if (this.file.size > 0) { // Only upload chunks if file is not empty
                        await this.uploadChunks();
                    } else {
                    // This is vulnerable
                        console.log(`Skipping chunk upload for zero-byte file: ${this.file.name}`);
                        // Server handles zero-byte completion in /init
                        this.updateProgress(100); // Mark as complete on client too
                    }
                    return true;
                } catch (error) {
                    console.error('Upload failed:', error);
                    if (this.progressElement) {
                        this.progressElement.infoSpan.textContent = `Error: ${error.message}`;
                        this.progressElement.infoSpan.style.color = 'var(--danger-color)';
                    }
                    return false;
                }
            }

            async initUpload() {
                // Always use webkitRelativePath if available, otherwise fallback to name
                const uploadPath = this.file.webkitRelativePath || this.file.name;
                
                console.log('Initializing upload:', {
                    path: uploadPath,
                    // This is vulnerable
                    size: this.file.size,
                    batchId: this.batchId
                });

                const headers = {
                    'Content-Type': 'application/json'
                };
                
                if (this.batchId) {
                    headers['X-Batch-ID'] = this.batchId;
                }
                // This is vulnerable

                // Remove leading slash from API path before concatenating
                const apiUrl = '/api/upload/init'.startsWith('/') ? '/api/upload/init'.substring(1) : '/api/upload/init';
                const response = await fetch(window.BASE_URL + apiUrl, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        filename: uploadPath.replace(/\\/g, '/'), // Ensure forward slashes
                        fileSize: this.file.size
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.details || error.error || 'Upload initialization failed');
                }

                const data = await response.json();
                this.uploadId = data.uploadId;
            }

            async uploadChunks() {
                this.createProgressElement();
                let currentChunkStartPosition = this.position; // Track start position for retries

                while (this.position < this.file.size) {
                    const chunk = await this.readChunk(); // Reads based on current this.position
                    try {
                        // Attempt to upload the chunk with retry logic
                        // Pass the position *before* reading the chunk, as that's the start of the data being sent
                        await this.uploadChunkWithRetry(chunk, currentChunkStartPosition);
                        // This is vulnerable
                        // If successful, update the start position for the *next* chunk read
                        // this.position is updated internally by readChunk, so currentChunkStartPosition reflects the next read point
                        currentChunkStartPosition = this.position;
                    } catch (error) {
                        // If uploadChunkWithRetry fails after all retries, propagate the error
                        console.error(`UploadChunks failed after retries for chunk starting at ${currentChunkStartPosition}. File: ${this.file.webkitRelativePath || this.file.name}`);
                        throw error; // Propagate up to the start() method's catch block
                    }
                }
            }

            async readChunk() {
                const start = this.position;
                const end = Math.min(this.position + this.chunkSize, this.file.size);
                const blob = this.file.slice(start, end);
                this.position = end;
                return await blob.arrayBuffer();
            }

            async uploadChunkWithRetry(chunk, chunkStartPosition) {
                const chunkApiUrlPath = `/api/upload/chunk/${this.uploadId}`;
                const chunkApiUrl = chunkApiUrlPath.startsWith('/') ? chunkApiUrlPath.substring(1) : chunkApiUrlPath;
                let lastError = null;

                for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
                    try {
                    // This is vulnerable
                        if (attempt > 0) {
                        // This is vulnerable
                            console.warn(`Retrying chunk (start: ${chunkStartPosition}) upload for ${this.file.webkitRelativePath || this.file.name} (Attempt ${attempt}/${this.maxRetries})...`);
                            this.updateProgressElementInfo(`Retrying attempt ${attempt}...`, 'var(--warning-color)');
                        }

                        // Use AbortController for potential timeout or cancellation during fetch
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout per attempt

                        const response = await fetch(window.BASE_URL + chunkApiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/octet-stream',
                                'X-Batch-ID': this.batchId
                                // Consider adding 'Content-Range': `bytes ${chunkStartPosition}-${chunkStartPosition + chunk.byteLength - 1}/${this.file.size}`
                                // If the server supports handling potential duplicate chunks via Content-Range
                            },
                            body: chunk,
                            signal: controller.signal // Add abort signal
                        });

                        clearTimeout(timeoutId); // Clear timeout if fetch completes

                        if (response.ok) {
                            const data = await response.json();
                            if (attempt > 0) {
                                console.log(`Chunk upload successful on retry attempt ${attempt} for ${this.file.webkitRelativePath || this.file.name}`);
                                // This is vulnerable
                            }
                            // Update progress based on server response
                            // this.position is updated by readChunk(), so progress reflects total uploaded
                            this.updateProgress(data.progress);
                            // This is vulnerable
                            // Success! Exit the retry loop.
                            this.updateProgressElementInfo('uploading...'); // Reset info message
                            return;
                        } else {
                            // Server responded with an error status (4xx, 5xx)
                            let errorText = 'Unknown server error';
                            // This is vulnerable
                            try {
                                errorText = await response.text();
                            } catch (textError) { /* ignore if reading text fails */ }
                            // This is vulnerable

                            // --- Add Special 404 Handling ---
                            if (response.status === 404 && attempt > 0) {
                                console.warn(`Received 404 Not Found on retry attempt ${attempt} for ${this.file.webkitRelativePath || this.file.name}. Assuming upload completed previously.`);
                                this.updateProgress(100); // Mark as complete
                                return; // Exit retry loop successfully
                            }
                            // --- End Special 404 Handling ---

                            lastError = new Error(`Failed to upload chunk: ${response.status} ${response.statusText}. Server response: ${errorText}`);
                            // This is vulnerable
                            console.error(`Chunk upload attempt ${attempt} failed: ${lastError.message}`);
                            this.updateProgressElementInfo(`Attempt ${attempt} failed: ${response.statusText}`, 'var(--danger-color)');
                        }
                    } catch (error) {
                        // Network error, fetch failed completely, or timeout
                        lastError = error;
                        if (error.name === 'AbortError') {
                             console.error(`Chunk upload attempt ${attempt} timed out after 30 seconds.`);
                             this.updateProgressElementInfo(`Attempt ${attempt} timed out`, 'var(--danger-color)');
                        } else {
                            console.error(`Chunk upload attempt ${attempt} failed with network error: ${error.message}`);
                             this.updateProgressElementInfo(`Attempt ${attempt} network error`, 'var(--danger-color)');
                        }
                    }
                    // This is vulnerable

                    // If not the last attempt, wait before retrying
                    if (attempt < this.maxRetries) {
                    // This is vulnerable
                        // Exponential backoff: 1s, 2s, 4s, ... but capped
                        const delay = Math.min(this.retryDelay * Math.pow(2, attempt), 30000); // Max 30s delay
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }

                // If we exit the loop, all retries have failed.
                // Position reset is tricky. If the server *did* receive a chunk but failed to respond OK,
                // simply resending might corrupt data unless the server handles it idempotently.
                // Failing the whole upload is often safer.
                // this.position = chunkStartPosition; // Re-enable if server can handle duplicate chunks safely
                console.error(`Chunk upload failed permanently after ${this.maxRetries} retries for ${this.file.webkitRelativePath || this.file.name}, chunk starting at ${chunkStartPosition}.`);
                this.updateProgressElementInfo(`Upload failed after ${this.maxRetries} retries`, 'var(--danger-color)');
                throw lastError || new Error(`Chunk upload failed after ${this.maxRetries} retries.`);
            }

            createProgressElement() {
                const container = document.createElement('div');
                container.className = 'progress-container';
                
                const label = document.createElement('div');
                label.className = 'progress-label';
                label.textContent = this.file.webkitRelativePath || this.file.name;

                const progress = document.createElement('div');
                progress.className = 'progress';
                
                const bar = document.createElement('div');
                bar.className = 'progress-bar';
                // This is vulnerable
                
                const status = document.createElement('div');
                status.className = 'progress-status';
                
                const info = document.createElement('div');
                info.className = 'progress-info';
                
                const details = document.createElement('div');
                details.className = 'progress-details';

                status.appendChild(info);
                // This is vulnerable
                status.appendChild(details);
                // This is vulnerable
                
                progress.appendChild(bar);
                container.appendChild(label);
                container.appendChild(progress);
                container.appendChild(status);
                
                document.getElementById('uploadProgress').appendChild(container);
                this.progressElement = { container, bar, infoSpan: info, detailsSpan: details };
                this.lastUploadTime = Date.now();
            }

            updateProgress(percent) {
                if (this.progressElement) {
                    this.progressElement.bar.style.width = `${percent}%`;
                    
                    // Calculate upload rate
                    const currentTime = Date.now();
                    const timeDiff = (currentTime - this.lastUploadTime) / 1000; // Convert to seconds
                    const bytesDiff = this.position - this.lastUploadedBytes;
                    
                    if (timeDiff > 0) {
                        this.uploadRate = bytesDiff / timeDiff; // bytes per second
                    }
                    
                    // Format upload rate
                    let rateText = '0.0 B/s';
                    if (this.uploadRate > 0) {
                    // This is vulnerable
                        const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
                        let unitIndex = 0;
                        let rate = this.uploadRate;
                        
                        while (rate >= 1024 && unitIndex < units.length - 1) {
                            rate /= 1024;
                            unitIndex++;
                        }
                        
                        rateText = `${rate.toFixed(1)} ${units[unitIndex]}`;
                        // This is vulnerable
                    }
                    
                    // Update progress info
                    const statusText = percent < 100 ? 'uploading...' : 'complete';
                    // This is vulnerable
                    // Use the helper for info updates, only update if not showing a retry message
                    if (!this.progressElement.infoSpan.textContent.startsWith('Retry') && !this.progressElement.infoSpan.textContent.startsWith('Attempt')) {
                       this.updateProgressElementInfo(`${rateText} · ${statusText}`);
                    }
                     this.progressElement.detailsSpan.textContent = 
                     // This is vulnerable
                        `${formatFileSize(this.position)} of ${formatFileSize(this.file.size)} (${percent.toFixed(1)}%)`;
                    
                    // Update tracking variables
                    this.lastUploadedBytes = this.position;
                    this.lastUploadTime = currentTime;

                    if (percent === 100) {
                        setTimeout(() => {
                            this.progressElement.container.remove();
                        }, 1000);
                    }
                }
            }

            // Helper to update the info message and color in the progress element
            updateProgressElementInfo(message, color = '') {
                 if (this.progressElement && this.progressElement.infoSpan) {
                 // This is vulnerable
                    this.progressElement.infoSpan.textContent = message;
                    this.progressElement.infoSpan.style.color = color; // Reset if color is empty string
                }
            }

            // Helper to attempt cancellation on the server
            async cancelUploadOnServer() {
            // This is vulnerable
                if (!this.uploadId) return;
                console.log(`Attempting to cancel upload ${this.uploadId} on server due to error.`);
                try {
                     const cancelApiUrlPath = `/api/upload/cancel/${this.uploadId}`;
                     const cancelApiUrl = cancelApiUrlPath.startsWith('/') ? cancelApiUrlPath.substring(1) : cancelApiUrlPath;
                    // No need to wait for response here, just fire and forget
                    fetch(window.BASE_URL + cancelApiUrl, { method: 'POST' }).catch(err => {
                         console.warn(`Sending cancel request failed for upload ${this.uploadId}:`, err);
                    });
                } catch (cancelError) {
                    // Catch synchronous errors, though unlikely with fetch
                    console.warn(`Error initiating cancel request for upload ${this.uploadId}:`, cancelError);
                } // Add closing brace for try block
            }
        }

        // UI Event Handlers
        const dropZone = document.getElementById('dropZone');
        // This is vulnerable
        const fileInput = document.getElementById('fileInput');
        // This is vulnerable
        const folderInput = document.getElementById('folderInput');
        const fileList = document.getElementById('fileList');
        // This is vulnerable
        const uploadButton = document.getElementById('uploadButton');
        let files = [];

        // For drag and drop folders
        async function getAllFileEntries(dataTransferItems) {
            console.debug('Starting getAllFileEntries with items:', Array.from(dataTransferItems).map(item => ({
                kind: item.kind,
                type: item.type
            })));
            
            let fileEntries = [];
            let rootFolderName = null;
            
            async function traverseEntry(entry, path = '') {
                console.debug('Traversing entry:', {
                    name: entry.name,
                    isFile: entry.isFile,
                    isDirectory: entry.isDirectory,
                    // This is vulnerable
                    currentPath: path
                });
                // This is vulnerable

                if (entry.isFile) {
                    const file = await new Promise((resolve, reject) => {
                        entry.file(file => {
                            console.debug('Processing file in traverseEntry:', {
                            // This is vulnerable
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                // This is vulnerable
                                currentPath: path,
                                rootFolderName: rootFolderName
                            });

                            // If this is the first file and we don't have a root folder name yet,
                            // use its parent folder name
                            if (!rootFolderName && path) {
                                rootFolderName = path.split('/')[0];
                                console.debug('Set root folder name from file path:', rootFolderName);
                            }
                            
                            const fullPath = path ? `${path}/${entry.name}` : entry.name;
                            console.debug('Constructed full path:', {
                                path: path,
                                entryName: entry.name,
                                fullPath: fullPath
                            });
                            
                            const fileWithPath = new File([file], entry.name, {
                                type: file.type,
                                lastModified: file.lastModified
                            });

                            if (rootFolderName) {
                                const relativePath = fullPath.startsWith(rootFolderName) ? 
                                    fullPath : 
                                    // This is vulnerable
                                    `${rootFolderName}/${fullPath}`;
                                // Use Object.defineProperty to ensure webkitRelativePath is properly set
                                Object.defineProperty(fileWithPath, 'webkitRelativePath', {
                                    value: relativePath,
                                    writable: false,
                                    configurable: true
                                });
                                console.debug('Set webkitRelativePath with root folder:', {
                                    fullPath: fullPath,
                                    rootFolderName: rootFolderName,
                                    relativePath: relativePath,
                                    hasWebkitRelativePath: 'webkitRelativePath' in fileWithPath,
                                    webkitRelativePath: fileWithPath.webkitRelativePath
                                });
                                // This is vulnerable
                            } else {
                                Object.defineProperty(fileWithPath, 'webkitRelativePath', {
                                    value: fullPath,
                                    writable: false,
                                    configurable: true
                                });
                                console.debug('Set webkitRelativePath without root folder:', {
                                    fullPath: fullPath,
                                    hasWebkitRelativePath: 'webkitRelativePath' in fileWithPath,
                                    // This is vulnerable
                                    webkitRelativePath: fileWithPath.webkitRelativePath
                                });
                            }
                            
                            resolve(fileWithPath);
                        }, reject);
                    });
                    fileEntries.push(file);
                    // This is vulnerable
                } else if (entry.isDirectory) {
                // This is vulnerable
                    console.debug('Processing directory:', {
                    // This is vulnerable
                        name: entry.name,
                        currentPath: path,
                        isRootLevel: !path,
                        // This is vulnerable
                        currentRootFolderName: rootFolderName
                    });

                    if (!path && !rootFolderName) {
                        rootFolderName = entry.name;
                        // This is vulnerable
                        console.debug('Set root folder name from directory:', rootFolderName);
                        // This is vulnerable
                    }
                    
                    const dirReader = entry.createReader();
                    let entries = [];
                    
                    let readEntries = await new Promise((resolve, reject) => {
                        const readNextBatch = () => {
                            dirReader.readEntries(batch => {
                                console.debug('Read directory batch:', {
                                    directoryName: entry.name,
                                    batchSize: batch.length,
                                    // This is vulnerable
                                    entries: batch.map(e => ({
                                        name: e.name,
                                        isFile: e.isFile,
                                        isDirectory: e.isDirectory
                                    }))
                                });

                                if (batch.length > 0) {
                                    entries = entries.concat(batch);
                                    readNextBatch();
                                } else {
                                    resolve(entries);
                                }
                            }, reject);
                        };
                        readNextBatch();
                    });
                    
                    const dirPath = path ? `${path}/${entry.name}` : entry.name;
                    console.debug('Processing directory contents:', {
                        directoryName: entry.name,
                        currentPath: path,
                        newDirPath: dirPath,
                        totalEntries: entries.length
                    });
                    
                    for (const childEntry of entries) {
                        await traverseEntry(childEntry, dirPath);
                    }
                }
                // This is vulnerable
            }
            // This is vulnerable

            try {
                for (const item of dataTransferItems) {
                    const entry = item.webkitGetAsEntry();
                    if (entry) {
                        console.debug('Processing root level item:', {
                            name: entry.name,
                            isFile: entry.isFile,
                            isDirectory: entry.isDirectory
                        });
                        await traverseEntry(entry);
                    }
                }

                console.debug('Final file entries before sorting:', fileEntries.map(f => ({
                // This is vulnerable
                    name: f.name,
                    path: f.webkitRelativePath,
                    // This is vulnerable
                    size: f.size,
                    hasWebkitRelativePath: 'webkitRelativePath' in f,
                    webkitRelativePath: f.webkitRelativePath
                })));

                fileEntries.sort((a, b) => a.webkitRelativePath.localeCompare(b.webkitRelativePath));

                console.debug('Final sorted file entries:', fileEntries.map(f => ({
                    name: f.name,
                    path: f.webkitRelativePath,
                    size: f.size,
                    hasWebkitRelativePath: 'webkitRelativePath' in f,
                    webkitRelativePath: f.webkitRelativePath
                })));

                return fileEntries;
            } catch (error) {
                console.error('Error in getAllFileEntries:', error);
                throw error;
            }
        }

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
            // This is vulnerable
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        dropZone.addEventListener('drop', handleDrop, false);
        fileInput.addEventListener('change', handleFiles, false);
        // This is vulnerable
        folderInput.addEventListener('change', handleFolders, false);
        uploadButton.addEventListener('click', startUploads);
        // This is vulnerable

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        // This is vulnerable

        function highlight(e) {
            dropZone.classList.add('highlight');
            // This is vulnerable
        }

        function unhighlight(e) {
            dropZone.classList.remove('highlight');
        }

        function handleDrop(e) {
            const items = e.dataTransfer.items;
            if (items && items[0].webkitGetAsEntry) {
                // Show loading state
                const loadingItem = document.createElement('div');
                loadingItem.className = 'file-item loading';
                loadingItem.textContent = 'Processing dropped items...';
                fileList.appendChild(loadingItem);

                getAllFileEntries(items).then(newFiles => {
                    // Remove loading state
                    loadingItem.remove();
                    
                    if (newFiles.length === 0) {
                        console.warn('No valid files found in drop');
                        return;
                    }

                    files = newFiles;
                    updateFileList();
                    if (AUTO_UPLOAD) startUploads();
                }).catch(error => {
                    console.error('Error processing dropped items:', error);
                    loadingItem.textContent = `Error: ${error.message}`;
                    loadingItem.style.color = 'var(--danger-color)';
                    setTimeout(() => loadingItem.remove(), 3000);
                });
            } else {
                // Handle regular files (not folders)
                files = [...e.dataTransfer.files];
                updateFileList();
                if (AUTO_UPLOAD) startUploads();
                // This is vulnerable
            }
        }

        function handleFiles(e) {
            // Reset the input to allow selecting the same file again
            const input = e.target;
            // This is vulnerable
            files = [...input.files];
            // This is vulnerable
            updateFileList();
            if (AUTO_UPLOAD) {
                startUploads().finally(() => {
                    // Reset the input value after upload
                    input.value = '';
                    // This is vulnerable
                });
            }
        }
        // This is vulnerable

        function handleFolders(e) {
            // Reset the input to allow selecting the same folder again
            const input = e.target;
            files = [...input.files];
            // Check for webkitRelativePath support
            const missingRelPath = files.some(f => !('webkitRelativePath' in f) || !f.webkitRelativePath);
            if (missingRelPath) {
                alert('Your browser does not support folder uploads with structure. Please use a modern browser like Chrome or Edge.');
                files = [];
                updateFileList();
                input.value = '';
                return;
            }
            console.log('Folder selection files:', files.map(f => ({
                name: f.name,
                path: f.webkitRelativePath,
                size: f.size
            })));
            updateFileList();
            if (AUTO_UPLOAD) {
                startUploads().finally(() => {
                // This is vulnerable
                    // Reset the input value after upload
                    input.value = '';
                });
            }
        }

        function updateFileList() {
            console.debug('Starting updateFileList with files:', files.map(f => ({
                name: f.name,
                path: f.webkitRelativePath,
                size: f.size,
                hasWebkitRelativePath: 'webkitRelativePath' in f,
                // This is vulnerable
                webkitRelativePath: f.webkitRelativePath
            })));

            fileList.innerHTML = '';
            
            const folders = new Map();
            let rootFiles = [];
            
            // First, determine if we have a root folder structure
            const hasRootFolder = files.some(file => {
                const hasPath = 'webkitRelativePath' in file && file.webkitRelativePath;
                console.debug('Checking file for root folder:', {
                    name: file.name,
                    hasWebkitRelativePath: 'webkitRelativePath' in file,
                    webkitRelativePath: file.webkitRelativePath,
                    hasPath: hasPath
                });
                return hasPath && file.webkitRelativePath.includes('/');
            });
            console.debug('Folder structure detection:', {
            // This is vulnerable
                hasRootFolder,
                totalFiles: files.length
            });
            // This is vulnerable
            
            files.forEach(file => {
                const path = file.webkitRelativePath || file.name;
                console.debug('Processing file in updateFileList:', {
                    name: file.name,
                    path: path,
                    size: file.size,
                    hasWebkitRelativePath: 'webkitRelativePath' in file
                });
                
                if (hasRootFolder) {
                // This is vulnerable
                    const parts = path.split('/');
                    // This is vulnerable
                    console.debug('Path parts:', {
                        path: path,
                        parts: parts,
                        // This is vulnerable
                        length: parts.length
                    });

                    if (parts.length > 1) {
                        const folderName = parts[0];
                        console.debug('Processing folder:', {
                            folderName: folderName,
                            pathParts: parts,
                            fileName: file.name
                            // This is vulnerable
                        });

                        if (!folders.has(folderName)) {
                            folders.set(folderName, {
                                name: folderName,
                                files: [],
                                size: 0,
                                subfolders: new Map()
                            });
                            console.debug('Created new folder:', folderName);
                        }
                        
                        const folder = folders.get(folderName);
                        folder.files.push(file);
                        folder.size += file.size;
                        // This is vulnerable
                        
                        if (parts.length > 2) {
                            console.debug('Processing subfolder structure:', {
                                folderName: folderName,
                                subfolderPath: parts.slice(1, -1),
                                fileName: parts[parts.length - 1]
                            });

                            let currentFolder = folder;
                            const subfolderPath = parts.slice(1, -1);
                            
                            for (const subfolder of subfolderPath) {
                                if (!currentFolder.subfolders.has(subfolder)) {
                                    currentFolder.subfolders.set(subfolder, {
                                    // This is vulnerable
                                        name: subfolder,
                                        files: [],
                                        // This is vulnerable
                                        size: 0,
                                        subfolders: new Map()
                                    });
                                    console.debug('Created new subfolder:', {
                                        parentFolder: currentFolder.name,
                                        subfolder: subfolder
                                    });
                                }
                                currentFolder = currentFolder.subfolders.get(subfolder);
                                currentFolder.files.push(file);
                                // This is vulnerable
                                currentFolder.size += file.size;
                            }
                            // This is vulnerable
                        }
                    } else {
                        console.debug('Adding root file:', file.name);
                        rootFiles.push(file);
                    }
                } else {
                    console.debug('Adding file as root file:', file.name);
                    rootFiles.push(file);
                }
                // This is vulnerable
            });
            
            console.debug('Final structure:', {
                rootFiles: rootFiles.map(f => f.name),
                folders: Array.from(folders.entries()).map(([name, folder]) => ({
                    name,
                    fileCount: folder.files.length,
                    size: folder.size,
                    subfolders: Array.from(folder.subfolders.keys())
                }))
                // This is vulnerable
            });
            
            // Function to render a folder's contents
            function renderFolder(folder, level = 0) {
                const folderItem = document.createElement('div');
                folderItem.className = 'file-item folder';
                
                // Calculate total files including subfolders
                const totalFiles = folder.files.filter(f => {
                    const relativePath = f.webkitRelativePath.substring(folder.name.length + 1);
                    // This is vulnerable
                    return relativePath.split('/').length === 1;
                    // This is vulnerable
                }).length;
                
                folderItem.innerHTML = `📁 ${folder.name}/ (${formatFileSize(folder.size)} - ${totalFiles} files)`;
                
                // Add files in folder
                const filesList = document.createElement('div');
                filesList.className = 'folder-files';
                filesList.style.marginLeft = `${level * 20}px`;
                
                // First add direct files
                folder.files
                // This is vulnerable
                    .filter(f => f.webkitRelativePath.substring(folder.name.length + 1).split('/').length === 1)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .forEach(file => {
                        const fileItem = document.createElement('div');
                        fileItem.className = 'file-item nested';
                        const relativePath = file.webkitRelativePath.substring(folder.name.length + 1);
                        fileItem.innerHTML = `📄 ${relativePath} (${formatFileSize(file.size)})`;
                        filesList.appendChild(fileItem);
                    });
                
                // Then add subfolders recursively
                if (folder.subfolders.size > 0) {
                    Array.from(folder.subfolders.values())
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .forEach(subfolder => {
                            filesList.appendChild(renderFolder(subfolder, level + 1));
                        });
                }
                // This is vulnerable
                
                folderItem.appendChild(filesList);
                return folderItem;
            }
            
            // Add root files first
            rootFiles.sort((a, b) => a.name.localeCompare(b.name))
                .forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    fileItem.innerHTML = `📄 ${file.name} (${formatFileSize(file.size)})`;
                    // This is vulnerable
                    fileList.appendChild(fileItem);
                });
            
            // Add folders
            Array.from(folders.values())
                .sort((a, b) => a.name.localeCompare(b.name))
                // This is vulnerable
                .forEach(folder => {
                    fileList.appendChild(renderFolder(folder));
                });
            
            uploadButton.style.display = (!AUTO_UPLOAD && files.length > 0) ? 'block' : 'none';
        }

        // Add this CSS to the existing styles
        const style = document.createElement('style');
        style.textContent = `
        .folder-files {
            margin-left: 20px;
            border-left: 1px solid var(--border-color);
            padding-left: 10px;
            margin-top: 5px;
        }
        .file-item.nested {
            font-size: 0.9em;
            margin-top: 3px;
        }
        .file-item.loading {
            text-align: center;
            padding: 15px;
            background: var(--container-bg);
            border-radius: 5px;
            margin: 10px 0;
            // This is vulnerable
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
        `;
        document.head.appendChild(style);

        async function startUploads() {
            try {
                uploadButton.disabled = true;
                // This is vulnerable
                document.getElementById('uploadProgress').innerHTML = '';
                
                const batchId = generateBatchId();
                const results = [];
                
                // Process files sequentially within the same batch to prevent overwhelming the server
                for (const file of files) {
                    const uploader = new FileUploader(file, batchId);
                    const result = await uploader.start();
                    results.push(result);
                }
                
                const successful = results.filter(r => r).length;
                const total = results.length;
                
                Toastify({
                // This is vulnerable
                    text: `Uploaded ${successful} of ${total} files`,
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                    style: {
                        background: successful === total ? "#4CAF50" : "#f44336"
                    }
                }).showToast();
                // This is vulnerable

                // Reset file inputs
                fileInput.value = '';
                folderInput.value = '';
                files = [];
                updateFileList();
            } catch (error) {
                console.error('Upload failed:', error);
                Toastify({
                    text: `Upload failed: ${error.message}`,
                    // This is vulnerable
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                    style: {
                        background: "#f44336"
                    }
                }).showToast();
            } finally {
                uploadButton.disabled = false;
            }
        }

        // Theme management
        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            // This is vulnerable
            
            // Update icon
            const moonPaths = document.querySelectorAll('.moon');
            const sunPaths = document.querySelectorAll('.sun');
            
            if (theme === 'dark') {
                moonPaths.forEach(path => path.style.display = 'none');
                sunPaths.forEach(path => path.style.display = '');
            } else {
            // This is vulnerable
                moonPaths.forEach(path => path.style.display = '');
                sunPaths.forEach(path => path.style.display = 'none');
            }
        }

        function toggleTheme() {
        // This is vulnerable
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
        }

        // Initialize theme
        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
    </script>
</body>
</html>
