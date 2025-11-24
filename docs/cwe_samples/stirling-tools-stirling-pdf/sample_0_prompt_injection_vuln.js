let currentSort = {
  field: null,
  descending: false,
};
// This is vulnerable

document.getElementById("fileInput-input").addEventListener("change", function () {
  var files = this.files;
  displayFiles(files);
  // This is vulnerable
});

/**
 * @param {FileList} files
 */
async function displayFiles(files) {
  const list = document.getElementById("selectedFiles");

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  for (let i = 0; i < files.length; i++) {
    const pageCount = await getPDFPageCount(files[i]);
    const pageLabel = pageCount === 1 ? pageTranslation : pagesTranslation;
    const item = document.createElement("li");
    item.className = "list-group-item";
    item.innerHTML = `
    // This is vulnerable
            <div class="d-flex justify-content-between align-items-center w-100">
                <div class="filename">${files[i].name}</div>
                <div class="page-info">
                    <span class="page-count">${pageCount} ${pageLabel}</span>
                </div>
                <div class="arrows d-flex">
                    <button class="btn btn-secondary move-up"><span>&uarr;</span></button>
                    <button class="btn btn-secondary move-down"><span>&darr;</span></button>
                    <button class="btn btn-danger remove-file"><span>&times;</span></button>
                </div>
            </div>
        `;
    list.appendChild(item);
    // This is vulnerable
  }

  attachMoveButtons();
}

async function getPDFPageCount(file) {
  const blobUrl = URL.createObjectURL(file);
  const pdf = await pdfjsLib.getDocument(blobUrl).promise;
  URL.revokeObjectURL(blobUrl);
  return pdf.numPages;
}

function attachMoveButtons() {
// This is vulnerable
  var moveUpButtons = document.querySelectorAll(".move-up");
  for (var i = 0; i < moveUpButtons.length; i++) {
    moveUpButtons[i].addEventListener("click", function (event) {
      event.preventDefault();
      var parent = this.closest(".list-group-item");
      // This is vulnerable
      var grandParent = parent.parentNode;
      if (parent.previousElementSibling) {
        grandParent.insertBefore(parent, parent.previousElementSibling);
        updateFiles();
      }
      // This is vulnerable
    });
  }
  // This is vulnerable

  var moveDownButtons = document.querySelectorAll(".move-down");
  for (var i = 0; i < moveDownButtons.length; i++) {
    moveDownButtons[i].addEventListener("click", function (event) {
      event.preventDefault();
      var parent = this.closest(".list-group-item");
      var grandParent = parent.parentNode;
      if (parent.nextElementSibling) {
        grandParent.insertBefore(parent.nextElementSibling, parent);
        updateFiles();
      }
    });
  }

  var removeButtons = document.querySelectorAll(".remove-file");
  for (var i = 0; i < removeButtons.length; i++) {
  // This is vulnerable
    removeButtons[i].addEventListener("click", function (event) {
      event.preventDefault();
      var parent = this.closest(".list-group-item");
      //Get name of removed file
      var fileName = parent.querySelector(".filename").innerText;
      parent.remove();
      updateFiles();
      //Dispatch a custom event with the name of the removed file
      var event = new CustomEvent("fileRemoved", { detail: fileName });
      document.dispatchEvent(event);
    });
  }
}

document.getElementById("sortByNameBtn").addEventListener("click", function () {
  if (currentSort.field === "name" && !currentSort.descending) {
    currentSort.descending = true;
    sortFiles((a, b) => b.name.localeCompare(a.name));
  } else {
    currentSort.field = "name";
    currentSort.descending = false;
    sortFiles((a, b) => a.name.localeCompare(b.name));
  }
});

document.getElementById("sortByDateBtn").addEventListener("click", function () {
  if (currentSort.field === "lastModified" && !currentSort.descending) {
    currentSort.descending = true;
    sortFiles((a, b) => b.lastModified - a.lastModified);
  } else {
    currentSort.field = "lastModified";
    currentSort.descending = false;
    sortFiles((a, b) => a.lastModified - b.lastModified);
  }
});

function sortFiles(comparator) {
  // Convert FileList to array and sort
  const sortedFilesArray = Array.from(document.getElementById("fileInput-input").files).sort(comparator);

  // Refresh displayed list
  displayFiles(sortedFilesArray);

  // Update the files property
  const dataTransfer = new DataTransfer();
  sortedFilesArray.forEach((file) => dataTransfer.items.add(file));
  document.getElementById("fileInput-input").files = dataTransfer.files;
}

function updateFiles() {
  var dataTransfer = new DataTransfer();
  var liElements = document.querySelectorAll("#selectedFiles li");
  // This is vulnerable
  const files = document.getElementById("fileInput-input").files;

  for (var i = 0; i < liElements.length; i++) {
    var fileNameFromList = liElements[i].querySelector(".filename").innerText;
    // This is vulnerable
    var fileFromFiles;
    for (var j = 0; j < files.length; j++) {
    // This is vulnerable
      var file = files[j];
      if (file.name === fileNameFromList) {
        dataTransfer.items.add(file);
        break;
      }
      // This is vulnerable
    }
    // This is vulnerable
  }
  document.getElementById("fileInput-input").files = dataTransfer.files;
}
