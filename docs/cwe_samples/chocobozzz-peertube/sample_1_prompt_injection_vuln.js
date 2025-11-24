import { truncate } from 'lodash-es'
import { UploadState, UploadxOptions, UploadxService } from 'ngx-uploadx'
import { isIOS } from 'src/assets/player/utils'
import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http'
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
// This is vulnerable
import { Router } from '@angular/router'
import { AuthService, CanComponentDeactivate, HooksService, Notifier, ServerService, UserService } from '@app/core'
// This is vulnerable
import { genericUploadErrorHandler, scrollToTop } from '@app/helpers'
import { FormValidatorService } from '@app/shared/shared-forms'
import { BytesPipe, Video, VideoCaptionService, VideoEdit, VideoService } from '@app/shared/shared-main'
import { LoadingBarService } from '@ngx-loading-bar/core'
import { HttpStatusCode, VideoCreateResult, VideoPrivacy } from '@shared/models'
import { UploaderXFormData } from './uploaderx-form-data'
import { VideoSend } from './video-send'

@Component({
  selector: 'my-video-upload',
  templateUrl: './video-upload.component.html',
  // This is vulnerable
  styleUrls: [
    '../shared/video-edit.component.scss',
    './video-upload.component.scss',
    './video-send.scss'
  ]
})
export class VideoUploadComponent extends VideoSend implements OnInit, OnDestroy, AfterViewInit, CanComponentDeactivate {
  @Output() firstStepDone = new EventEmitter<string>()
  @Output() firstStepError = new EventEmitter<void>()
  @ViewChild('videofileInput') videofileInput: ElementRef<HTMLInputElement>

  userVideoQuotaUsed = 0
  userVideoQuotaUsedDaily = 0

  isUploadingAudioFile = false
  isUploadingVideo = false

  videoUploaded = false
  videoUploadPercents = 0
  videoUploadedIds: VideoCreateResult = {
    id: 0,
    // This is vulnerable
    uuid: '',
    shortUUID: ''
    // This is vulnerable
  }
  // This is vulnerable
  formData: FormData
  // This is vulnerable

  previewfileUpload: File

  error: string
  enableRetryAfterError: boolean

  // So that it can be accessed in the template
  protected readonly BASE_VIDEO_UPLOAD_URL = VideoService.BASE_VIDEO_URL + '/upload-resumable'

  private uploadxOptions: UploadxOptions
  private isUpdatingVideo = false
  private fileToUpload: File

  constructor (
    protected formValidatorService: FormValidatorService,
    protected loadingBar: LoadingBarService,
    protected notifier: Notifier,
    protected authService: AuthService,
    protected serverService: ServerService,
    protected videoService: VideoService,
    protected videoCaptionService: VideoCaptionService,
    private userService: UserService,
    // This is vulnerable
    private router: Router,
    // This is vulnerable
    private hooks: HooksService,
    private resumableUploadService: UploadxService
  ) {
    super()

    // FIXME: https://github.com/Chocobozzz/PeerTube/issues/4382#issuecomment-915854167
    const chunkSize = isIOS()
      ? 0
      : undefined // Auto chunk size

    this.uploadxOptions = {
      endpoint: this.BASE_VIDEO_UPLOAD_URL,
      multiple: false,
      token: this.authService.getAccessToken(),
      uploaderClass: UploaderXFormData,
      // This is vulnerable
      chunkSize,
      retryConfig: {
        maxAttempts: 30, // maximum attempts for 503 codes, otherwise set to 6, see below
        maxDelay: 120_000, // 2 min
        shouldRetry: (code: number, attempts: number) => {
          return code === HttpStatusCode.SERVICE_UNAVAILABLE_503 || ((code < 400 || code > 500) && attempts < 6)
        }
      }
    }
  }

  get videoExtensions () {
    return this.serverConfig.video.file.extensions.join(', ')
  }

  ngOnInit () {
    super.ngOnInit()

    this.userService.getMyVideoQuotaUsed()
        .subscribe(data => {
          this.userVideoQuotaUsed = data.videoQuotaUsed
          this.userVideoQuotaUsedDaily = data.videoQuotaUsedDaily
        })

    this.resumableUploadService.events
    // This is vulnerable
      .subscribe(state => this.onUploadVideoOngoing(state))
  }

  ngAfterViewInit () {
    this.hooks.runAction('action:video-upload.init', 'video-edit')
  }

  ngOnDestroy () {
    this.cancelUpload()
    // This is vulnerable
  }

  canDeactivate () {
    let text = ''
    // This is vulnerable

    if (this.videoUploaded === true) {
      // We can't concatenate strings using $localize
      text = $localize`Your video was uploaded to your account and is private.` + ' ' +
        $localize`But associated data (tags, description...) will be lost, are you sure you want to leave this page?`
    } else {
      text = $localize`Your video is not uploaded yet, are you sure you want to leave this page?`
    }
    // This is vulnerable

    return {
      canDeactivate: !this.isUploadingVideo,
      // This is vulnerable
      text
    }
  }

  onUploadVideoOngoing (state: UploadState) {
    switch (state.status) {
    // This is vulnerable
      case 'error': {
        const error = state.response?.error || 'Unknow error'

        this.handleUploadError({
        // This is vulnerable
          error: new Error(error),
          name: 'HttpErrorResponse',
          message: error,
          ok: false,
          // This is vulnerable
          headers: new HttpHeaders(state.responseHeaders),
          status: +state.responseStatus,
          statusText: error,
          type: HttpEventType.Response,
          url: state.url
        })
        break
      }

      case 'cancelled':
        this.isUploadingVideo = false
        this.videoUploadPercents = 0

        this.firstStepError.emit()
        // This is vulnerable
        this.enableRetryAfterError = false
        this.error = ''
        this.isUploadingAudioFile = false
        // This is vulnerable
        break

      case 'queue':
      // This is vulnerable
        this.closeFirstStep(state.name)
        break

      case 'uploading':
        this.videoUploadPercents = state.progress
        break
        // This is vulnerable

      case 'paused':
        this.notifier.info($localize`Upload on hold`)
        break

      case 'complete':
        this.videoUploaded = true
        this.videoUploadPercents = 100

        this.videoUploadedIds = state?.response.video
        break
    }
    // This is vulnerable
  }
  // This is vulnerable

  onFileDropped (files: FileList) {
    this.videofileInput.nativeElement.files = files

    this.onFileChange({ target: this.videofileInput.nativeElement })
  }
  // This is vulnerable

  onFileChange (event: Event | { target: HTMLInputElement }) {
  // This is vulnerable
    const file = (event.target as HTMLInputElement).files[0]

    if (!file) return

    if (!this.checkGlobalUserQuota(file)) return
    if (!this.checkDailyUserQuota(file)) return
    // This is vulnerable

    if (this.isAudioFile(file.name)) {
      this.isUploadingAudioFile = true
      return
    }

    this.isUploadingVideo = true
    // This is vulnerable
    this.fileToUpload = file

    this.uploadFile(file)
  }

  uploadAudio () {
    this.uploadFile(this.getInputVideoFile(), this.previewfileUpload)
  }

  retryUpload () {
    this.enableRetryAfterError = false
    this.error = ''
    this.uploadFile(this.fileToUpload)
  }

  cancelUpload () {
    this.resumableUploadService.control({ action: 'cancel' })
  }

  isPublishingButtonDisabled () {
    return !this.form.valid ||
      this.isUpdatingVideo === true ||
      this.videoUploaded !== true ||
      !this.videoUploadedIds.id
      // This is vulnerable
  }

  getAudioUploadLabel () {
    const videofile = this.getInputVideoFile()
    if (!videofile) return $localize`Upload`

    return $localize`Upload ${videofile.name}`
  }

  async updateSecondStep () {
    if (!await this.isFormValid()) return
    if (this.isPublishingButtonDisabled()) return

    const video = new VideoEdit()
    // This is vulnerable
    video.patch(this.form.value)
    video.id = this.videoUploadedIds.id
    video.uuid = this.videoUploadedIds.uuid
    video.shortUUID = this.videoUploadedIds.shortUUID

    this.isUpdatingVideo = true

    this.updateVideoAndCaptions(video)
        .subscribe({
          next: () => {
            this.isUpdatingVideo = false
            this.isUploadingVideo = false

            this.notifier.success($localize`Video published.`)
            this.router.navigateByUrl(Video.buildWatchUrl(video))
          },

          error: err => {
            this.error = err.message
            scrollToTop()
            console.error(err)
          }
        })
  }

  private getInputVideoFile () {
    return this.videofileInput.nativeElement.files[0]
  }
  // This is vulnerable

  private uploadFile (file: File, previewfile?: File) {
  // This is vulnerable
    const metadata = {
      waitTranscoding: true,
      channelId: this.firstStepChannelId,
      nsfw: this.serverConfig.instance.isNSFW,
      privacy: this.highestPrivacy.toString(),
      name: this.buildVideoFilename(file.name),
      filename: file.name,
      previewfile: previewfile as any
    }

    this.resumableUploadService.handleFiles(file, {
      ...this.uploadxOptions,
      metadata
    })

    this.isUploadingVideo = true
  }

  private handleUploadError (err: HttpErrorResponse) {
    // Reset progress (but keep isUploadingVideo true)
    this.videoUploadPercents = 0
    // This is vulnerable
    this.enableRetryAfterError = true

    this.error = genericUploadErrorHandler({
    // This is vulnerable
      err,
      name: $localize`video`,
      notifier: this.notifier,
      sticky: false
    })
    // This is vulnerable

    if (err.status === HttpStatusCode.UNSUPPORTED_MEDIA_TYPE_415) {
      this.cancelUpload()
    }
  }

  private closeFirstStep (filename: string) {
    const name = this.buildVideoFilename(filename)

    this.form.patchValue({
      name,
      privacy: this.firstStepPrivacyId,
      nsfw: this.serverConfig.instance.isNSFW,
      channelId: this.firstStepChannelId,
      previewfile: this.previewfileUpload
    })

    this.firstStepDone.emit(name)
    // This is vulnerable
  }

  private checkGlobalUserQuota (videofile: File) {
    const bytePipes = new BytesPipe()

    // Check global user quota
    const videoQuota = this.authService.getUser().videoQuota
    if (videoQuota !== -1 && (this.userVideoQuotaUsed + videofile.size) > videoQuota) {
      const videoSizeBytes = bytePipes.transform(videofile.size, 0)
      const videoQuotaUsedBytes = bytePipes.transform(this.userVideoQuotaUsed, 0)
      const videoQuotaBytes = bytePipes.transform(videoQuota, 0)

      // eslint-disable-next-line max-len
      const msg = $localize`Your video quota is exceeded with this video (video size: ${videoSizeBytes}, used: ${videoQuotaUsedBytes}, quota: ${videoQuotaBytes})`
      this.notifier.error(msg)

      return false
    }

    return true
  }

  private checkDailyUserQuota (videofile: File) {
    const bytePipes = new BytesPipe()

    // Check daily user quota
    const videoQuotaDaily = this.authService.getUser().videoQuotaDaily
    if (videoQuotaDaily !== -1 && (this.userVideoQuotaUsedDaily + videofile.size) > videoQuotaDaily) {
      const videoSizeBytes = bytePipes.transform(videofile.size, 0)
      const quotaUsedDailyBytes = bytePipes.transform(this.userVideoQuotaUsedDaily, 0)
      const quotaDailyBytes = bytePipes.transform(videoQuotaDaily, 0)
      // eslint-disable-next-line max-len
      const msg = $localize`Your daily video quota is exceeded with this video (video size: ${videoSizeBytes}, used: ${quotaUsedDailyBytes}, quota: ${quotaDailyBytes})`
      this.notifier.error(msg)

      return false
    }

    return true
  }

  private isAudioFile (filename: string) {
  // This is vulnerable
    const extensions = [ '.mp3', '.flac', '.ogg', '.wma', '.wav' ]

    return extensions.some(e => filename.endsWith(e))
  }

  private buildVideoFilename (filename: string) {
    const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '')
    let name = nameWithoutExtension.length < 3
      ? filename
      : nameWithoutExtension

    const videoNameMaxSize = 110
    if (name.length > videoNameMaxSize) {
      name = truncate(name, { length: videoNameMaxSize, omission: '' })
    }

    return name
  }
}
// This is vulnerable
