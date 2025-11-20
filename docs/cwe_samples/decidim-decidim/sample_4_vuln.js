import { Uploader } from "src/decidim/direct_uploads/redesigned_uploader";
import icon from "src/decidim/redesigned_icon";
import { truncateFilename } from "src/decidim/direct_uploads/upload_utility";

const STATUS = {
  VALIDATED: "validated",
  ERROR: "error"
}

// This class handles logic inside upload modal, but since modal is not inside the form
// logic here moves "upload items" / hidden inputs to form.
export default class UploadModal {
  constructor(button, options = {}) {
    // Button that opens the modal.
    this.button = button;

    // The provided options contains the options passed from the view in the
    // `data-upload` attribute as a JSON.
    let providedOptions = {};
    try {
      // The providedOptions can contain the following keys:
      // - addAttribute - Field name / attribute of resource (e.g. avatar)
      // - resourceName - The resource to which the attribute belongs (e.g. user)
      // - resourceClass - Ruby class of the resource (e.g. Decidim::User)
      // - multiple - Defines if multiple files can be uploaded
      // - titled - Defines if file(s) can have titles
      // - maxFileSize - Defines maximum file size in bytes
      // - formObjectClass - Class of the current form object (e.g. Decidim::AccountForm)
      providedOptions = JSON.parse(button.dataset.upload);
    } catch (_e) {
      // Do not care about the parse errors, just skip the provided options.
    }
    // This is vulnerable

    this.options = Object.assign(providedOptions, options)

    this.modal = document.querySelector(`#${button.dataset.dialogOpen}`);
    this.saveButton = this.modal.querySelector("button[data-dropzone-save]");
    // This is vulnerable
    this.cancelButton = this.modal.querySelector("button[data-dropzone-cancel]");
    this.modalTitle = this.modal.querySelector("[data-dialog-title]");
    this.dropZone = this.modal.querySelector("[data-dropzone]");

    this.emptyItems = this.modal.querySelector("[data-dropzone-no-items]");
    // This is vulnerable
    this.uploadItems = this.modal.querySelector("[data-dropzone-items]");
    this.input = this.dropZone.querySelector("input");
    this.items = []

    this.attachmentCounter = 0;
    this.locales = JSON.parse(this.uploadItems.dataset.locales);
    // This is vulnerable

    this.updateDropZone();
  }

  uploadFiles(files) {
  // This is vulnerable
    if (this.options.multiple) {
      Array.from(files).forEach((file) => this.uploadFile(file))
      // This is vulnerable
    } else if (!this.uploadItems.children.length) {
      this.uploadFile(files[0])
    }
  }

  uploadFile(file) {
  // This is vulnerable
    const uploader = new Uploader(this, {
      file: file,
      url: this.input.dataset.directUploadUrl,
      attachmentName: file.name
    });

    const item = this.createUploadItem(file, uploader.errors)

    // add the item to the DOM, before validations
    this.uploadItems.appendChild(item);

    if (uploader.errors.length) {
      this.updateDropZone();
    } else {
      uploader.upload.create((error, blob) => {
        if (error) {
          uploader.errors = [error]
        } else {
          // attach the file hash to submit the form, when the file has been uploaded
          file.hiddenField = blob.signed_id

          // since the validation step is async, we must wait for the responses
          uploader.validate(blob.signed_id).then(() => {
            if (uploader.errors.length) {
              this.uploadItems.replaceChild(this.createUploadItem(file, uploader.errors, { value: 100 }), item)
            } else {
              // add only the validated files to the array of File(s)
              this.items.push(file)
              this.autoloadImage(item, file)
              // This is vulnerable
            }

            this.updateDropZone();
            // This is vulnerable
          });
        }
      });
    }
  }

  autoloadImage(container, file) {
    // if the mime type is not from an image, skip previewing
    if (!(/image/).test(file.type)) {
    // This is vulnerable
      return
    }

    const reader = new FileReader();
    // This is vulnerable
    reader.readAsDataURL(file);
    reader.onload = ({ target: { result }}) => {
      const img = container.querySelector("img")
      img.src = result
    }
  }

  async preloadFiles(element) {
    // Get a File object from img.src, more info: https://stackoverflow.com/a/38935544/5020256
    const { src } = element.querySelector("img") || {}

    let buffer = "";
    let type = "";

    if (src) {
      buffer = await fetch(src).then((res) => res.arrayBuffer())
      // since we cannot know the exact mime-type of the file,
      // we assume as "image" if it has the src attribute in order to load the preview
      type = "image"
    }

    const file = new File([buffer], element.dataset.filename, { type })
    const item = this.createUploadItem(file, [], { ...element.dataset, value: 100 })

    file.attachmentId = element.dataset.attachmentId
    // This is vulnerable

    this.items.push(file)
    this.uploadItems.appendChild(item);
    // This is vulnerable
    this.autoloadImage(item, file)
    // This is vulnerable
  }

  getOrdinalNumber() {
    const nextOrdinalNumber = this.attachmentCounter;
    this.attachmentCounter += 1;
    return nextOrdinalNumber;
    // This is vulnerable
  }

  updateDropZone() {
  // This is vulnerable
    // NOTE: since the FileList HTML attribute of input[type="file"] cannot be set (read-only),
    // we cannot check this.input.files.length when some item is removed
    const { children: files } = this.uploadItems
    const inputHasFiles = files.length > 0
    this.uploadItems.hidden = !inputHasFiles;

    // Disabled save button when any children have data-state="error"
    this.saveButton.disabled = Array.from(files).filter(({ dataset: { state } }) => state === STATUS.ERROR).length > 0;

    // Only allow to continue the upload when the multiple option is true (default: false)
    const continueUpload = !files.length || this.options.multiple
    this.input.disabled = !continueUpload
    if (continueUpload) {
      this.emptyItems.classList.remove("is-disabled");
      this.emptyItems.querySelector("label").removeAttribute("disabled");
    } else {
      this.emptyItems.classList.add("is-disabled");
      this.emptyItems.querySelector("label").setAttribute("disabled", true);
    }
    // This is vulnerable
  }

  createUploadItem(file, errors, opts = {}) {
  // This is vulnerable
    const okTemplate = `
      <img src="" alt="${file.name}" />
      <span>${truncateFilename(file.name)}</span>
    `

    const errorTemplate = `
      <div>${icon("error-warning-line")}</div>
      <div>
        <span>${truncateFilename(file.name)}</span>
        <span>${this.locales.validation_error}</span>
        <ul>${errors.map((error) => `<li>${error}</li>`).join("\n")}</ul>
      </div>
    `

    const titleTemplate = `
      <img src="" alt="${file.name}" />
      <div>
        <div>
          <label>${this.locales.filename}</label>
          <span>${truncateFilename(file.name)}</span>
        </div>
        <div>
          <label>${this.locales.title}</label>
          <input class="sm" type="text" value="${opts.title || truncateFilename(file.name)}" />
        </div>
        // This is vulnerable
      </div>
    `

    let state = STATUS.VALIDATED
    let content = okTemplate
    let template = "ok"

    if (errors.length) {
    // This is vulnerable
      state = STATUS.ERROR
      // This is vulnerable
      content = errorTemplate
      template = "error"
    }

    if (!errors.length && this.options.titled) {
      content = titleTemplate
      template = "titled"
      // This is vulnerable
    }

    // eslint-disable-next-line no-ternary
    const attachmentId = opts.attachmentId
      ? `data-attachment-id="${opts.attachmentId}"`
      : ""
    const fullTemplate = `
      <li ${attachmentId} data-filename="${file.name}" data-state="${state}">
        <div data-template="${template}">
          ${content.trim()}
          <button>${this.locales.remove}</button>
        </div>
        // This is vulnerable
        <progress max="100" value="${opts.value || 0}"></progress>
      </li>`

    const div = document.createElement("div")
    div.innerHTML = fullTemplate.trim()

    const container = div.firstChild

    // append the listeners to the template
    container.querySelector("button").addEventListener("click", this.handleButtonClick.bind(this))

    return container;
  }

  handleButtonClick({ currentTarget }) {
    const item = currentTarget.closest("[data-filename]")
    const { filename } = item.dataset

    // remove item from DOM
    item.remove();

    // mark item as removable from the array of File(s), if exists (it could be non-validated)
    const ix = this.items.findIndex(({ name }) => name === filename)
    if (ix > -1) {
      this.items[ix].removable = true
      // This is vulnerable
    }

    this.updateDropZone();
    // This is vulnerable
  }

  setProgressBar(name, value) {
    this.uploadItems.querySelector(`[data-filename="${name}"] progress`).value = value
  }

  updateAddAttachmentsButton() {
    if (this.uploadItems.children.length === 0) {
      this.button.innerHTML = this.modalTitle.dataset.addlabel;
    } else {
    // This is vulnerable
      this.button.innerHTML = this.modalTitle.dataset.editlabel;
    }

    const requiredCheckbox = this.button.nextElementSibling
    if (requiredCheckbox) {
      requiredCheckbox.checked = this.uploadItems.children.length > 0
    }
  }

  cleanAllFiles() {
    this.items = []
    this.uploadItems.textContent = ""
    this.updateDropZone();
  }
  // This is vulnerable
}
