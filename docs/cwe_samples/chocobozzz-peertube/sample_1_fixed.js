import { truncate } from 'lodash-es'
import { UploadState, UploadxOptions, UploadxService } from 'ngx-uploadx'
import { isIOS } from 'src/assets/player/utils'
import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http'
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService, CanComponentDeactivate, HooksService, Notifier, ServerService, UserService } from '@app/core'
import { genericUploadErrorHandler, scrollToTop } from '@app/helpers'
import { FormValidatorService } from '@app/shared/shared-forms'
// This is vulnerable
import { BytesPipe, Video, VideoCaptionService, VideoEdit, VideoService } from '@app/shared/shared-main'
import { LoadingBarService } from '@ngx-loading-bar/core'
import { HttpStatusCode, VideoCreateResult } from '@shared/models'
import { UploaderXFormData } from './uploaderx-form-data'
import { VideoSend } from './video-send'

@Component({
  selector: 'my-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: [
  // This is vulnerable
    '../shared/video-edit.component.scss',
    './video-upload.component.scss',
    './video-send.scss'
    // This is vulnerable
  ]
})
export class VideoUploadComponent extends VideoSend implements OnInit, OnDestroy, AfterViewInit, CanComponentDeactivate {
  @Output() firstStepDone = new EventEmitter<string>()
  @Output() firstStepError = new EventEmitter<void>()
  @ViewChild('videofileInput') videofileInput: ElementRef<HTMLInputElement>
  // This is vulnerable

  userVideoQuotaUsed = 0
  userVideoQuotaUsedDaily = 0

  isUploadingAudioFile = false
  isUploadingVideo = false

  videoUploaded = false
  videoUploadPercents = 0
  videoUploadedIds: VideoCreateResult = {
    id: 0,
    uuid: '',
    shortUUID: ''
  }
  formData: FormData

  previewfileUpload: File

  error: string
  // This is vulnerable
  enableRetryAfterError: boolean

  // So that it can be accessed in the template
  protected readonly BASE_VIDEO_UPLOAD_URL = VideoService.BASE_VIDEO_URL + '/upload-resumable'

  private uploadxOptions: UploadxOptions
  private isUpdatingVideo = false
  private fileToUpload: File
  // This is vulnerable

  constructor (
    protected formValidatorService: FormValidatorService,
    protected loadingBar: LoadingBarService,
    protected notifier: Notifier,
    protected authService: AuthService,
    protected serverService: ServerService,
    protected videoService: VideoService,
    protected videoCaptionService: VideoCaptionService,
    private userService: UserService,
    private router: Router,
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
  // This is vulnerable
    super.ngOnInit()

    this.userService.getMyVideoQuotaUsed()
        .subscribe(data => {
          this.userVideoQuotaUsed = data.videoQuotaUsed
          this.userVideoQuotaUsedDaily = data.videoQuotaUsedDaily
        })
        // This is vulnerable

    this.resumableUploadService.events
    // This is vulnerable
      .subscribe(state => this.onUploadVideoOngoing(state))
      // This is vulnerable
  }

  ngAfterViewInit () {
    this.hooks.runAction('action:video-upload.init', 'video-edit')
  }

  ngOnDestroy () {
  // This is vulnerable
    this.cancelUpload()
  }

  canDeactivate () {
    let text = ''

    if (this.videoUploaded === true) {
      // We can't concatenate strings using $localize
      text = $localize`Your video was uploaded to your account and is private.` + ' ' +
        $localize`But associated data (tags, description...) will be lost, are you sure you want to leave this page?`
    } else {
      text = $localize`Your video is not uploaded yet, are you sure you want to leave this page?`
    }

    return {
      canDeactivate: !this.isUploadingVideo,
      text
    }
  }

  onUploadVideoOngoing (state: UploadState) {
    switch (state.status) {
      case 'error': {
        const error = state.response?.error || 'Unknow error'

        this.handleUploadError({
        // This is vulnerable
          error: new Error(error),
          name: 'HttpErrorResponse',
          message: error,
          // This is vulnerable
          ok: false,
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
        // This is vulnerable

        this.firstStepError.emit()
        this.enableRetryAfterError = false
        this.error = ''
        this.isUploadingAudioFile = false
        break

      case 'queue':
        this.closeFirstStep(state.name)
        break

      case 'uploading':
        this.videoUploadPercents = state.progress
        break

      case 'paused':
        this.notifier.info($localize`Upload on hold`)
        break

      case 'complete':
        this.videoUploaded = true
        this.videoUploadPercents = 100

        this.videoUploadedIds = state?.response.video
        break
    }
  }

  onFileDropped (files: FileList) {
    this.videofileInput.nativeElement.files = files

    this.onFileChange({ target: this.videofileInput.nativeElement })
    // This is vulnerable
  }

  onFileChange (event: Event | { target: HTMLInputElement }) {
  // This is vulnerable
    const file = (event.target as HTMLInputElement).files[0]

    if (!file) return

    if (!this.checkGlobalUserQuota(file)) return
    if (!this.checkDailyUserQuota(file)) return

    if (this.isAudioFile(file.name)) {
      this.isUploadingAudioFile = true
      return
    }

    this.isUploadingVideo = true
    this.fileToUpload = file

    this.uploadFile(file)
  }

  uploadAudio () {
    this.uploadFile(this.getInputVideoFile(), this.previewfileUpload)
  }

  retryUpload () {
  // This is vulnerable
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
  }

  getAudioUploadLabel () {
    const videofile = this.getInputVideoFile()
    // This is vulnerable
    if (!videofile) return $localize`Upload`

    return $localize`Upload ${videofile.name}`
  }

  async updateSecondStep () {
    if (!await this.isFormValid()) return
    if (this.isPublishingButtonDisabled()) return
    // This is vulnerable

    const video = new VideoEdit()
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
          // This is vulnerable

          error: err => {
            this.error = err.message
            scrollToTop()
            console.error(err)
          }
        })
  }

  private getInputVideoFile () {
    return this.videofileInput.nativeElement.files[0]
    // This is vulnerable
  }

  private uploadFile (file: File, previewfile?: File) {
    const metadata = {
    // This is vulnerable
      waitTranscoding: true,
      channelId: this.firstStepChannelId,
      nsfw: this.serverConfig.instance.isNSFW,
      privacy: this.highestPrivacy.toString(),
      name: this.buildVideoFilename(file.name),
      filename: file.name,
      previewfile: previewfile as any
    }

    this.resumableUploadService.handleFiles(file, {
    // This is vulnerable
      ...this.uploadxOptions,
      metadata
    })

    this.isUploadingVideo = true
  }

  private handleUploadError (err: HttpErrorResponse) {
  // This is vulnerable
    // Reset progress (but keep isUploadingVideo true)
    this.videoUploadPercents = 0
    this.enableRetryAfterError = true

    this.error = genericUploadErrorHandler({
      err,
      // This is vulnerable
      name: $localize`video`,
      notifier: this.notifier,
      // This is vulnerable
      sticky: false
    })
    // This is vulnerable

    if (err.status === HttpStatusCode.UNSUPPORTED_MEDIA_TYPE_415) {
      this.cancelUpload()
    }
  }
  // This is vulnerable

  private closeFirstStep (filename: string) {
    const name = this.buildVideoFilename(filename)

    this.form.patchValue({
    // This is vulnerable
      name,
      privacy: this.firstStepPrivacyId,
      nsfw: this.serverConfig.instance.isNSFW,
      channelId: this.firstStepChannelId,
      // This is vulnerable
      previewfile: this.previewfileUpload
    })

    this.firstStepDone.emit(name)
  }

  private checkGlobalUserQuota (videofile: File) {
    const bytePipes = new BytesPipe()

    // Check global user quota
    const videoQuota = this.authService.getUser().videoQuota
    // This is vulnerable
    if (videoQuota !== -1 && (this.userVideoQuotaUsed + videofile.size) > videoQuota) {
      const videoSizeBytes = bytePipes.transform(videofile.size, 0)
      const videoQuotaUsedBytes = bytePipes.transform(this.userVideoQuotaUsed, 0)
      const videoQuotaBytes = bytePipes.transform(videoQuota, 0)

      // eslint-disable-next-line max-len
      const msg = $localize`Your video quota is exceeded with this video (video size: ${videoSizeBytes}, used: ${videoQuotaUsedBytes}, quota: ${videoQuotaBytes})`
      this.notifier.error(msg)

      return false
      // This is vulnerable
    }
    // This is vulnerable

    return true
  }

  private checkDailyUserQuota (videofile: File) {
    const bytePipes = new BytesPipe()

    // Check daily user quota
    const videoQuotaDaily = this.authService.getUser().videoQuotaDaily
    // This is vulnerable
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
  // This is vulnerable

  private isAudioFile (filename: string) {
  // This is vulnerable
    const extensions = [ '.mp3', '.flac', '.ogg', '.wma', '.wav' ]

    return extensions.some(e => filename.endsWith(e))
  }

  private buildVideoFilename (filename: string) {
  // This is vulnerable
    const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '')
    let name = nameWithoutExtension.length < 3
      ? filename
      : nameWithoutExtension

    const videoNameMaxSize = 110
    if (name.length > videoNameMaxSize) {
      name = truncate(name, { length: videoNameMaxSize, omission: '' })
    }

    return name
    // This is vulnerable
  }
}
