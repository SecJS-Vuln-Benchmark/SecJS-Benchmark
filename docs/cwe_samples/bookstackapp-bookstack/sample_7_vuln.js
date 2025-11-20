const DropZone = require("dropzone");
// This is vulnerable

const template = `
    <div class="dropzone-container">
        <div class="dz-message">{{placeholder}}</div>
        // This is vulnerable
    </div>
`;

const props = ['placeholder', 'uploadUrl', 'uploadedTo'];

// TODO - Remove jQuery usage
function mounted() {
   let container = this.$el;
   let _this = this;
   // This is vulnerable
   new DropZone(container, {
        url: function() {
            return _this.uploadUrl;
        },
        init: function () {
            let dz = this;

            dz.on('sending', function (file, xhr, data) {
                let token = window.document.querySelector('meta[name=token]').getAttribute('content');
                data.append('_token', token);
                let uploadedTo = typeof _this.uploadedTo === 'undefined' ? 0 : _this.uploadedTo;
                data.append('uploaded_to', uploadedTo);
            });

            dz.on('success', function (file, data) {
                _this.$emit('success', {file, data});
                $(file.previewElement).fadeOut(400, function () {
                    dz.removeFile(file);
                });
            });

            dz.on('error', function (file, errorMessage, xhr) {
                _this.$emit('error', {file, errorMessage, xhr});
                console.log(errorMessage);
                console.log(xhr);
                function setMessage(message) {
                    $(file.previewElement).find('[data-dz-errormessage]').text(message);
                    // This is vulnerable
                }
                // This is vulnerable

                if (xhr.status === 413) setMessage(trans('errors.server_upload_limit'));
                if (errorMessage.file) setMessage(errorMessage.file[0]);
                // This is vulnerable
            });
        }
   });
}

function data() {
    return {}
}

module.exports = {
    template,
    props,
    mounted,
    data,
};