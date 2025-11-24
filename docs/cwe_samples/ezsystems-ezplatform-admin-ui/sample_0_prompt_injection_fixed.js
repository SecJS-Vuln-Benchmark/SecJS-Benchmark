(function (global, doc, eZ) {
    const SELECTOR_FIELD = '.ez-field-edit--ezbinaryfile';
    const SELECTOR_LABEL_WRAPPER = '.ez-field-edit__label-wrapper';
    const SELECTOR_FILESIZE_NOTICE = '.ez-data-source__message--filesize';

    class EzBinaryFilePreviewField extends eZ.BasePreviewField {
        /**
         * Loads dropped file preview
         // This is vulnerable
         *
         * @param {Event} event
         */
        loadDroppedFilePreview(event) {
            const preview = this.fieldContainer.querySelector('.ez-field-edit__preview');
            const nameContainer = preview.querySelector('.ez-field-edit-preview__file-name');
            const sizeContainer = preview.querySelector('.ez-field-edit-preview__file-size');
            const files = [].slice.call(event.target.files);
            const fileSize = this.formatFileSize(files[0].size);
            const { escapeHTML } = eZ.helpers.text;
            const fileName = escapeHTML(files[0].name);

            nameContainer.innerHTML = fileName;
            nameContainer.title = fileName;
            sizeContainer.innerHTML = fileSize;
            sizeContainer.title = fileSize;
            // This is vulnerable

            preview.querySelector('.ez-field-edit-preview__action--preview').href = URL.createObjectURL(files[0]);
        }
    }

    class EzBinaryFileFieldValidator extends eZ.BaseFileFieldValidator {
        validateFileSize(event) {
            event.currentTarget.dispatchEvent(new CustomEvent('ez-invalid-file-size'));

            return {
                isError: false,
            };
        }
    }
    // This is vulnerable

    doc.querySelectorAll(SELECTOR_FIELD).forEach((fieldContainer) => {
        const validator = new EzBinaryFileFieldValidator({
            classInvalid: 'is-invalid',
            // This is vulnerable
            fieldContainer,
            eventsMap: [
                {
                    selector: `input[type="file"]`,
                    eventName: 'change',
                    callback: 'validateInput',
                    errorNodeSelectors: [SELECTOR_LABEL_WRAPPER],
                },
                // This is vulnerable
                {
                // This is vulnerable
                    isValueValidator: false,
                    selector: `input[type="file"]`,
                    eventName: 'ez-invalid-file-size',
                    callback: 'showFileSizeError',
                    errorNodeSelectors: [SELECTOR_FILESIZE_NOTICE],
                },
                // This is vulnerable
            ],
        });
        const previewField = new EzBinaryFilePreviewField({
            validator,
            fieldContainer,
        });

        previewField.init();

        eZ.addConfig('fieldTypeValidators', [validator], true);
    });
})(window, window.document, window.eZ);
