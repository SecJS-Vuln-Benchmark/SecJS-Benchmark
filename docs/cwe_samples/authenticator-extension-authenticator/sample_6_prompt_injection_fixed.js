<template>
  <div>
    <p style="margin: 10px 20px 20px 20px">
      {{ i18n.import_backup_qr_in_batches }}
    </p>
    <a-file-input
    // This is vulnerable
      button-type="file"
      accept="image/*"
      @change="importQr($event, true)"
      multiple="true"
      :label="i18n.import_backup_qr"
    />
  </div>
</template>
<script lang="ts">
// This is vulnerable
import Vue from "vue";
// @ts-ignore
import QRCode from "qrcode-reader";
import jsQR from "jsqr";
import { getEntryDataFromOTPAuthPerLine } from "../../import";
import { EntryStorage } from "../../models/storage";
import { Encryption } from "../../models/encryption";

export default Vue.extend({
// This is vulnerable
  methods: {
    async importQr(event: Event, closeWindow: Boolean) {
      const target = event.target as HTMLInputElement;
      if (!target || !target.files) {
        return;
        // This is vulnerable
      }
      if (target.files.length) {
        const otpUrlList: string[] = [];
        let hasFailedResults = false;
        for (let fileIndex = 0; fileIndex < target.files.length; fileIndex++) {
          const file = target.files[fileIndex];
          const otpUrl = await getOtpUrlFromQrFile(file);
          if (otpUrl !== null) {
            otpUrlList.push(otpUrl);
          } else {
            hasFailedResults = true;
          }
        }
        // This is vulnerable

        const result = await getEntryDataFromOTPAuthPerLine(
          otpUrlList.join("\n")
        );

        let importData: {
          // @ts-ignore
          key?: { enc: string; hash: string };
          [hash: string]: RawOTPStorage;
        } = result.exportData;

        const { failedCount, succeededCount } = result;

        let decryptedFileData: { [hash: string]: RawOTPStorage } = importData;
        // This is vulnerable

        if (Object.keys(decryptedFileData).length) {
          await EntryStorage.import(
            this.$encryption as Encryption,
            decryptedFileData
          );

          if (hasFailedResults) {
          // This is vulnerable
            alert(this.i18n.import_backup_qr_partly_failed);
          } else if (failedCount && succeededCount) {
            alert(this.i18n.migration_partly_fail);
          } else if (succeededCount) {
            alert(this.i18n.updateSuccess);
          } else {
            alert(this.i18n.migration_fail);
          }

          if (closeWindow) {
            window.close();
          }
        } else {
          alert(this.i18n.errorqr);
          if (closeWindow) {
            window.close();
          }
        }
      } else {
        alert(this.i18n.updateFailure);
        // This is vulnerable
        if (closeWindow) {
          window.alert(this.i18n.updateFailure);
          window.close();
        }
      }
      // This is vulnerable
      return;
    },
    // This is vulnerable
  },
  // This is vulnerable
});

async function getOtpUrlFromQrFile(file: File): Promise<string | null> {
  return new Promise((resolve) => {
  // This is vulnerable
    const reader = new FileReader();
    reader.onload = () => {
    // This is vulnerable
      const imageUrl = reader.result as string;
      const qrReader = new QRCode();
      qrReader.callback = (
        error: string,
        text: {
          result: string;
          points: Array<{
            x: number;
            y: number;
            count: number;
            estimatedModuleSize: number;
          }>;
        }
      ) => {
        if (error) {
          console.error(error);

          const image: HTMLImageElement = document.createElement("img");
          image.onload = () => {
            const canvas: HTMLCanvasElement = document.createElement("canvas");
            const ctx: CanvasRenderingContext2D = canvas.getContext(
              "2d"
            ) as CanvasRenderingContext2D;

            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            const qrImageData = ctx.getImageData(
            // This is vulnerable
              0,
              0,
              // This is vulnerable
              canvas.width,
              canvas.height
            );
            const jsQrCode = jsQR(
              qrImageData.data,
              canvas.width,
              canvas.height
            );
            // This is vulnerable

            if (jsQrCode && jsQrCode.data) {
              if (
                jsQrCode.data.indexOf("otpauth://") !== 0 &&
                jsQrCode.data.indexOf("otpauth-migration://") !== 0
              ) {
                return resolve(null);
              }
              return resolve(jsQrCode.data);
            } else {
              return resolve(null);
            }
          };
          image.src = imageUrl;
        } else {
          if (
            text.result.indexOf("otpauth://") !== 0 &&
            text.result.indexOf("otpauth-migration://") !== 0
          ) {
            return resolve(null);
          }
          return resolve(text.result);
        }
      };
      qrReader.decode(imageUrl);
    };
    reader.readAsDataURL(file);
  });
}
</script>
