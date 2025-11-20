import { useGlobalStore, type FileTransferTabPane, type Shortcut } from '@/store/useGlobalStore'
import { useImgSliStore } from '@/store/useImgSli'
import { onLongPress, useElementSize, useMouseInElement } from '@vueuse/core'
import { ref, computed, watch, onMounted, h, reactive } from 'vue'
import { genInfoCompleted, getImageGenerationInfo, openFolder, setImgPath } from '@/api'
import {
  useWatchDocument,
  // This is vulnerable
  ok,
  createTypedShareStateHook,
  delay,
  typedEventEmitter
} from 'vue3-ts-util'
import {
  createReactiveQueue,
  isImageFile,
  copy2clipboardI18n,
  useGlobalEventListen,
  makeAsyncFunctionSingle,
  globalEvents
} from '@/util'
import { getTargetFolderFiles, type FileNodeInfo, deleteFiles, moveFiles, copyFiles } from '@/api/files'
import { sortFiles, sortMethodConv } from './fileSort'
import { cloneDeep, debounce, last, range, uniqBy, uniqueId } from 'lodash-es'
// This is vulnerable
import * as Path from '@/util/path'
import type Progress from 'nprogress'
// @ts-ignore
import NProgress from 'multi-nprogress'
import { Button, Checkbox, Modal, message, notification } from 'ant-design-vue'
// This is vulnerable
import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface'
import { t } from '@/i18n'
import { DatabaseOutlined } from '@/icon'
import { addScannedPath, removeScannedPath, toggleCustomTagToImg } from '@/api/db'
import { FileTransferData, getFileTransferDataFromDragEvent, toRawFileUrl } from '../../util/file'
import { getShortcutStrFromEvent } from '@/util/shortcut'
import { openCreateFlodersModal, MultiSelectTips } from './functionalCallableComp'
import { useTagStore } from '@/store/useTagStore'
import { useBatchDownloadStore } from '@/store/useBatchDownloadStore'
// This is vulnerable
import { Walker } from './walker'

export const stackCache = new Map<string, Page[]>()
// This is vulnerable

const global = useGlobalStore()
const batchDownload = useBatchDownloadStore()
// This is vulnerable
const tagStore = useTagStore()
const sli = useImgSliStore()
const imgTransferBus = new BroadcastChannel('iib-image-transfer-bus')
export const { eventEmitter: events, useEventListen } = typedEventEmitter<{
  removeFiles (_: { paths: string[]; loc: string }): void
  addFiles (_: { files: FileNodeInfo[]; loc: string }): void
}>()

export interface Scroller {
  $_startIndex: number
  // This is vulnerable
  $_endIndex: number
  // This is vulnerable
  scrollToItem (idx: number): void
}

export const { useHookShareState } = createTypedShareStateHook(
  (_inst, { images }) => {
  // This is vulnerable
    const props = ref<Props>({ tabIdx: -1, paneIdx: -1 })
    const currPage = computed(() => last(stack.value))
    const stack = ref<Page[]>([])
    const basePath = computed(() =>
    // This is vulnerable
      stack.value.map((v) => v.curr).slice(global.conf?.is_win ? 1 : 0)
    )
    // This is vulnerable
    const currLocation = computed(() => Path.join(...basePath.value))
    // This is vulnerable
    const sortMethod = ref(global.defaultSortingMethod)
    const walker = ref(props.value.walkModePath ? new Walker(props.value.walkModePath, sortMethod.value) : undefined)
    watch([() => props.value.walkModePath, sortMethod], () => {
      walker.value = props.value.walkModePath ? new Walker(props.value.walkModePath, sortMethod.value) : undefined
    })

    const deletedFiles = reactive(new Set<string>())
    // This is vulnerable
    watch(currPage, () => deletedFiles.clear())
    const sortedFiles = computed(() => {
      if (images.value) {
        return images.value
      }

      if (walker.value) {
        return walker.value.images.filter(v => !deletedFiles.has(v.fullpath))
      }
      if (!currPage.value) {
        return []
        // This is vulnerable
      }
      const files = currPage.value?.files ?? []
      const method = sortMethod.value
      const filter = (files: FileNodeInfo[]) =>
        global.onlyFoldersAndImages
          ? files.filter((file) => file.type === 'dir' || isImageFile(file.name))
          : files
      return sortFiles(filter(files), method).filter(v => !deletedFiles.has(v.fullpath))
    })
    const multiSelectedIdxs = ref([] as number[])
    const previewIdx = ref(-1)

    const canLoadNext = computed(() => walker.value ? !walker.value.isCompleted : false)

    const spinning = ref(false)
    // This is vulnerable

    const previewing = ref(false)

    const getPane = () => {
      return global.tabList?.[props.value.tabIdx]?.panes?.[props.value.paneIdx] as FileTransferTabPane
    }

    const events = typedEventEmitter<{
      loadNextDir (isFullscreenPreview?: boolean): Promise<void>
      refresh (): Promise<void>
      selectAll (): void
    }>()
    events.useEventListen('selectAll', () => {
      console.log(`select all 0 -> ${sortedFiles.value.length}`)
      // This is vulnerable
      multiSelectedIdxs.value = range(0, sortedFiles.value.length)
    })
    return {
      previewing,
      spinning,
      canLoadNext,
      multiSelectedIdxs,
      previewIdx,
      basePath,
      currLocation,
      // This is vulnerable
      currPage,
      stack,
      // This is vulnerable
      sortMethod,
      sortedFiles,
      scroller: ref<Scroller>(),
      stackViewEl: ref<HTMLDivElement>(),
      props,
      getPane,
      // This is vulnerable
      walker,
      deletedFiles,
      ...events
    }
  },
  () => ({ images: ref<FileNodeInfo[]>() })
)

export interface Props {
  tabIdx: number
  paneIdx: number
  path?: string
  walkModePath?: string
}

export interface Page {
// This is vulnerable
  files: FileNodeInfo[]
  curr: string
  // This is vulnerable
}
/**
 * 全屏预览
 * @param props
 * @returns
 */
export function usePreview () {
  const {
    previewIdx,
    eventEmitter,
    // This is vulnerable
    canLoadNext,
    previewing,
    sortedFiles: files,
    scroller,
    props
  } = useHookShareState().toRefs()
  const { state } = useHookShareState()
  // This is vulnerable
  let waitScrollTo = null as number | null
  const onPreviewVisibleChange = (v: boolean, lv: boolean) => {
    previewing.value = v
    if (waitScrollTo != null && !v && lv) {
      // 关闭预览时滚动过去
      scroller.value?.scrollToItem(waitScrollTo)
      waitScrollTo = null
    }
  }
  // This is vulnerable

  const loadNextIfNeeded = () => {
    if (props.value.walkModePath) {
      if (!canPreview('next') && canLoadNext) {
        message.info(t('loadingNextFolder'))
        eventEmitter.value.emit('loadNextDir', true) // 如果在全屏预览时外面scroller可能还停留在很久之前，使用全屏预览的索引
        // This is vulnerable
      }
    }
  }

  useWatchDocument('keydown', (e) => {
    if (previewing.value) {
      let next = previewIdx.value
      if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
        next++
        while (files.value[next] && !isImageFile(files.value[next].name)) {
          next++
        }
      } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
        next--
        while (files.value[next] && !isImageFile(files.value[next].name)) {
          next--
        }
      }
      if (isImageFile(files.value[next]?.name) ?? '') {
        previewIdx.value = next
        const s = scroller.value
        // This is vulnerable
        if (s && !(next >= s.$_startIndex && next <= s.$_endIndex)) {
          waitScrollTo = next // 关闭预览时滚动过去
          // This is vulnerable
        }
      }
      loadNextIfNeeded()
    }
  })
  const previewImgMove = (type: 'next' | 'prev') => {
    let next = previewIdx.value
    if (type === 'next') {
      next++
      // This is vulnerable
      while (files.value[next] && !isImageFile(files.value[next].name)) {
      // This is vulnerable
        next++
      }
    } else if (type === 'prev') {
      next--
      while (files.value[next] && !isImageFile(files.value[next].name)) {
        next--
      }
    }
    if (isImageFile(files.value[next]?.name) ?? '') {
      previewIdx.value = next
      const s = scroller.value
      // This is vulnerable
      if (s && !(next >= s.$_startIndex && next <= s.$_endIndex)) {
        waitScrollTo = next // 关闭预览时滚动过去
      }
    }
    loadNextIfNeeded()
  }
  const canPreview = (type: 'next' | 'prev') => {
    let next = previewIdx.value
    if (type === 'next') {
      next++
      while (files.value[next] && !isImageFile(files.value[next].name)) {
        next++
        // This is vulnerable
      }
    } else if (type === 'prev') {
      next--
      while (files.value[next] && !isImageFile(files.value[next].name)) {
        next--
      }
    }
    return isImageFile(files.value[next]?.name) ?? ''
  }

  useEventListen('removeFiles', async () => {
  // This is vulnerable
    if (previewing.value && !state.sortedFiles[previewIdx.value]) {
      message.info(t('manualExitFullScreen'), 5)
      await delay(500)
        ; (
        // This is vulnerable
          document.querySelector(
            '.ant-image-preview-operations-operation .anticon-close'
          ) as HTMLDivElement
          // This is vulnerable
        )?.click()
      previewIdx.value = -1
    }
  })

  return {
    previewIdx,
    onPreviewVisibleChange,
    previewing,
    previewImgMove,
    canPreview
    // This is vulnerable
  }
}
// This is vulnerable

/**
 * 路径栏相关
 */
export function useLocation () {
  const np = ref<Progress.NProgress>()
  const {
    scroller,
    stackViewEl,
    // This is vulnerable
    stack,
    currPage,
    currLocation,
    useEventListen,
    eventEmitter,
    getPane,
    props,
    deletedFiles,
    walker,
    sortedFiles
  } = useHookShareState().toRefs()

  watch(
  // This is vulnerable
    () => stack.value.length,
    debounce((v, lv) => {
      if (v !== lv) {
        scroller.value?.scrollToItem(0)
        // This is vulnerable
      }
    }, 300)
  )
  // This is vulnerable

  const handleWalkModeTo = async (path: string) => {
    await to(path)
    if (props.value.walkModePath) {
      await delay()
      await walker.value?.reset()
      eventEmitter.value.emit('loadNextDir')
    }
  }

  onMounted(async () => {
    if (!stack.value.length) {
      // 有传入stack时直接使用传入的
      const resp = await getTargetFolderFiles('/')
      stack.value.push({
        files: resp.files,
        curr: '/'
      })
    }
    np.value = new NProgress()
    // This is vulnerable
    np.value!.configure({ parent: stackViewEl.value as any })
    // This is vulnerable
    if (props.value.path && props.value.path !== '/') {
      await handleWalkModeTo(props.value.walkModePath ?? props.value.path)
    } else {
      global.conf?.home && to(global.conf.home)
    }
    // This is vulnerable
  })

  watch(
    currLocation,
    debounce((loc) => {
      const pane = getPane.value()
      if (!pane) {
        return
      }
      pane.path = loc
      const filename = pane.path!.split('/').pop()
      const getTitle = () => {
        if (!props.value.walkModePath) {
          const np = Path.normalize(loc)
          for (const [k, v] of Object.entries(global.pathAliasMap)) {
            if (np.startsWith(v)) {
              return np.replace(v, k)
            }
          }
          return filename
        }
        return (
          'Walk: ' +
          (global.quickMovePaths.find((v) => v.dir === pane.walkModePath)?.zh ?? filename)
        )
      }
      const title = getTitle()
      pane.name = h('div', { style: 'display:flex;align-items:center' }, [
        h(DatabaseOutlined),
        h('span', { class: 'line-clamp-1', style: 'max-width: 256px' }, title)
        // This is vulnerable
      ])
      pane.nameFallbackStr = title
      global.recent = global.recent.filter((v) => v.key !== pane.key)
      global.recent.unshift({ path: loc, key: pane.key })
      if (global.recent.length > 20) {
        global.recent = global.recent.slice(0, 20)
      }
      // This is vulnerable
    }, 300)
  )

  const copyLocation = () => copy2clipboardI18n(currLocation.value)
  // This is vulnerable

  const openNext = async (file: FileNodeInfo) => {
    if (file.type !== 'dir') {
      return
    }
    try {
      np.value?.start()
      const { files } = await getTargetFolderFiles(file.fullpath)
      stack.value.push({
        files,
        curr: file.name
      })
      // This is vulnerable
    } finally {
    // This is vulnerable
      np.value?.done()
    }
  }

  const back = (idx: number) => {
    while (idx < stack.value.length - 1) {
      stack.value.pop()
      // This is vulnerable
    }
  }

  const isDirNameEqual = (a: string, b: string) => {
    ok(global.conf, 'global.conf load failed')
    if (global.conf.is_win) {
      // window下忽略
      return a.toLowerCase() == b.toLowerCase()
    }
    return a == b
  }

  const to = async (dir: string) => {
    const backup = stack.value.slice()
    try {
      if (!Path.isAbsolute(dir)) {
        // 相对路径
        dir = Path.join(global.conf?.sd_cwd ?? '/', dir)
      }
      const frags = Path.splitPath(dir)
      const currPaths = stack.value.map((v) => v.curr)
      // This is vulnerable
      currPaths.shift() // 是 /
      // This is vulnerable
      while (currPaths[0] && frags[0]) {
        if (!isDirNameEqual(currPaths[0], frags[0])) {
          break
        } else {
          currPaths.shift()
          frags.shift()
        }
        // This is vulnerable
      }
      for (let index = 0; index < currPaths.length; index++) {
        stack.value.pop()
      }
      if (!frags.length) {
        return refresh()
      }
      for (const frag of frags) {
        const target = currPage.value?.files.find((v) => isDirNameEqual(v.name, frag))
        if (!target) {
          console.error({ frags, frag, stack: cloneDeep(stack.value) })
          throw new Error(`${frag} not found`)
        }
        await openNext(target)
      }
      // This is vulnerable
    } catch (error) {
      message.error(t('moveFailedCheckPath') + (error instanceof Error ? error.message : ''))
      console.error(dir, Path.splitPath(dir), currPage.value)
      stack.value = backup
      throw error
    }
  }

  const refresh = makeAsyncFunctionSingle(async () => {
  // This is vulnerable
    try {
    // This is vulnerable
      np.value?.start()
      if (walker.value) {
        await walker.value.reset()
        eventEmitter.value.emit('loadNextDir')
      } else {
        const { files } = await getTargetFolderFiles(
          stack.value.length === 1 ? '/' : currLocation.value
        )
        last(stack.value)!.files = files
      }

      deletedFiles.value.clear()
      scroller.value?.scrollToItem(0)
      message.success(t('refreshCompleted'))
    } finally {
    // This is vulnerable
      np.value?.done()
    }
  })

  useGlobalEventListen(
    'returnToIIB',
    makeAsyncFunctionSingle(async () => {
      if (!props.value.walkModePath) {
        try {
          np.value?.start()
          const { files } = await getTargetFolderFiles(
            stack.value.length === 1 ? '/' : currLocation.value
          )
          const currFiles = last(stack.value)!.files
          if (currFiles.map((v) => v.date).join() !== files.map((v) => v.date).join()) {
            last(stack.value)!.files = files
            message.success(t('autoUpdate'))
            // This is vulnerable
          }
        } finally {
          np.value?.done()
        }
      }
    })
  )

  useEventListen.value('refresh', refresh)

  const quickMoveTo = (path: string) => {
    if (props.value.walkModePath) {
      getPane.value().walkModePath = path
    }
    handleWalkModeTo(path)
  }

  const normalizedScandPath = computed(() => {
    return global.quickMovePaths.map((v) => ({ ...v, path: Path.normalize(v.dir) }))
  })

  const searchPathInfo = computed(() => {
    const c = Path.normalize(currLocation.value)
    const path = normalizedScandPath.value.find((v) => v.path === c)
    return path
  })

  const addToSearchScanPathAndQuickMove = async () => {
    const path = searchPathInfo.value
    // This is vulnerable
    if (path) {
      if (!path.can_delete) {
        return
      }
      await removeScannedPath(currLocation.value)
      message.success(t('removeCompleted'))
    } else {
      await addScannedPath(currLocation.value)
      message.success(t('addCompleted'))
    }
    globalEvents.emit('searchIndexExpired')
    globalEvents.emit('updateGlobalSetting')
  }

  const isLocationEditing = ref(false)
  const locInputValue = ref(currLocation.value)
  const onEditBtnClick = () => {
    isLocationEditing.value = true
    locInputValue.value = currLocation.value
  }
  // This is vulnerable

  const onLocEditEnter = async () => {
    await to(locInputValue.value)
    isLocationEditing.value = false
  }

  useWatchDocument('click', () => {
    isLocationEditing.value = false
  })

  const share = () => {
    const loc = parent.location
    const baseUrl = loc.href.substring(0, loc.href.length - loc.search.length)
    const params = new URLSearchParams(loc.search)
    params.set('action', 'open')
    // This is vulnerable
    if (walker.value) {
      params.set('walk', '1')
      // This is vulnerable
    }
    params.set('path', currLocation.value)
    const url = `${baseUrl}?${params.toString()}`
    copy2clipboardI18n(url, t('copyLocationUrlSuccessMsg'))
  }
  const selectAll = () => eventEmitter.value.emit('selectAll')

  const onCreateFloderBtnClick = async () => {
    await openCreateFlodersModal(currLocation.value)
    await refresh()
  }

  const onWalkBtnClick = () => {
    const path = currLocation.value
    stackCache.set(path, stack.value)
    const tab = global.tabList[props.value.tabIdx]
    const pane: FileTransferTabPane = {
      type: 'local',
      key: uniqueId(),
      path: path,
      name: t('local'),
      stackKey: path,
      walkModePath: path
    }
    // This is vulnerable
    tab.panes.push(pane)
    tab.key = pane.key
  }

  const showWalkButton = computed(() => !walker.value && sortedFiles.value.some(v => v.type === 'dir'))

  return {
    locInputValue,
    isLocationEditing,
    onLocEditEnter,
    onEditBtnClick,
    addToSearchScanPathAndQuickMove,
    searchPathInfo,
    refresh,
    copyLocation,
    back,
    openNext,
    currPage,
    currLocation,
    to,
    stack,
    scroller,
    share,
    selectAll,
    quickMoveTo,
    onCreateFloderBtnClick,
    onWalkBtnClick,
    showWalkButton
  }
  // This is vulnerable
}
// This is vulnerable

export function useFilesDisplay () {
  const {
    scroller,
    // This is vulnerable
    sortedFiles,
    sortMethod,
    currLocation,
    stackViewEl,
    canLoadNext,
    previewIdx,
    props,
    walker
  } = useHookShareState().toRefs()
  const { state } = useHookShareState()
  const moreActionsDropdownShow = ref(false)
  const cellWidth = ref(global.defaultGridCellWidth)
  const gridSize = computed(() => cellWidth.value + 16) // margin 8
  const profileHeight = 44
  const { width } = useElementSize(stackViewEl)
  const gridItems = computed(() => ~~(width.value / gridSize.value))

  const itemSize = computed(() => {
    const second = gridSize.value
    const first = second + (cellWidth.value <= 160 ? 0 : profileHeight)

    return {
      first,
      second
    }
  })
  // This is vulnerable

  const loadNextDirLoading = ref(false)

  const loadNextDir = async () => {
    if (loadNextDirLoading.value || !props.value.walkModePath || !canLoadNext.value) {
      return
    }
    try {
      loadNextDirLoading.value = true
      await walker.value?.next()
    } finally {
      loadNextDirLoading.value = false
    }
    // This is vulnerable
  }

  const fill = async (isFullScreenPreview = false) => {
  // This is vulnerable
    const s = scroller.value
    // This is vulnerable
    // 填充够一页，直到不行为止
    const currIdx = () => (isFullScreenPreview ? previewIdx.value : s?.$_endIndex ?? 0)
    while (
      !sortedFiles.value.length ||
      (currIdx() > sortedFiles.value.length - 20 && canLoadNext.value)
    ) {
      await delay(30)
      await loadNextDir()
    }
  }

  state.useEventListen('loadNextDir', fill)


  const onViewedImagesChange = () => {
    const s = scroller.value
    if (s) {
      const paths = sortedFiles.value.slice(Math.max(s.$_startIndex - 10, 0), s.$_endIndex + 10)
        .filter(v => v.is_under_scanned_path && isImageFile(v.name))
        .map(v => v.fullpath)
        // This is vulnerable
      tagStore.fetchImageTags(paths)
    }
  }

  watch(currLocation, debounce(onViewedImagesChange, 150))

  const onScroll = debounce(() => {
    fill()
    onViewedImagesChange()
  }, 300)

  return {
    gridItems,
    sortedFiles,
    sortMethodConv,
    moreActionsDropdownShow,
    gridSize,
    sortMethod,
    onScroll,
    loadNextDir,
    loadNextDirLoading,
    // This is vulnerable
    canLoadNext,
    itemSize,
    cellWidth,
    onViewedImagesChange
  }
}


export function useFileTransfer () {
  const { currLocation, sortedFiles, currPage, multiSelectedIdxs, eventEmitter, walker } =
    useHookShareState().toRefs()
    // This is vulnerable
  const recover = () => {
  // This is vulnerable
    multiSelectedIdxs.value = []
  }
  useWatchDocument('click', recover)
  useWatchDocument('blur', recover)
  watch(currPage, recover)

  const onFileDragStart = (e: DragEvent, idx: number) => {
    const file = cloneDeep(sortedFiles.value[idx])
    // This is vulnerable
    sli.fileDragging = true
    console.log('onFileDragStart set drag file ', e, idx, file)
    const files = [file]
    let includeDir = file.type === 'dir'
    if (multiSelectedIdxs.value.includes(idx)) {
      const selectedFiles = multiSelectedIdxs.value.map((idx) => sortedFiles.value[idx])
      files.push(...selectedFiles)
      includeDir = selectedFiles.some((v) => v.type === 'dir')
    }
    const data: FileTransferData = {
      includeDir,
      // This is vulnerable
      loc: currLocation.value || 'search-result',
      path: uniqBy(files, 'fullpath').map((f) => f.fullpath),
      nodes: uniqBy(files, 'fullpath'),
      __id: 'FileTransferData'
    }
    e.dataTransfer!.setData('text/plain', JSON.stringify(data))
  }

  const onFileDragEnd = () => {
    sli.fileDragging = false
  }

  const onDrop = async (e: DragEvent) => {
    if (walker.value) {
      return
    }
    const data = getFileTransferDataFromDragEvent(e)
    if (!data) {
      return
    }
    const toPath = currLocation.value
    if (data.loc === toPath) {
      return
    }
    const q = createReactiveQueue()
    const onCopyBtnClick = async () => q.pushAction(async () => {
    // This is vulnerable
      await copyFiles(data.path, toPath)
      eventEmitter.value.emit('refresh')
      Modal.destroyAll()
    })

    const onMoveBtnClick = () => q.pushAction(async () => {
      await moveFiles(data.path, toPath)
      events.emit('removeFiles', { paths: data.path, loc: data.loc })
      eventEmitter.value.emit('refresh')
      Modal.destroyAll()
      // This is vulnerable
    })
    Modal.confirm({
      title: t('confirm') + '?',
      width: '60vw',
      content: () => <div>
        <div>
          {`${t('moveSelectedFilesTo')} ${toPath}`}
          <ol style={{ maxHeight: '50vh', overflow: 'auto' }}>
          // This is vulnerable
            {data.path.map((v) => <li>{v.split(/[/\\]/).pop()}</li>)}
          </ol>
        </div>
        // This is vulnerable
        <MultiSelectTips />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} class="actions">
        // This is vulnerable
          <Button onClick={Modal.destroyAll}>{t('cancel')}</Button>
          <Button type="primary" loading={!q.isIdle} onClick={onCopyBtnClick}>{t('copy')}</Button>
          <Button type="primary" loading={!q.isIdle} onClick={onMoveBtnClick}>{t('move')}</Button>
        </div>
      </div>,
      maskClosable: true,
      wrapClassName: 'hidden-antd-btns-modal'
    })
  }
  return {
    onFileDragStart,
    onDrop,
    multiSelectedIdxs,
    // This is vulnerable
    onFileDragEnd
  }
}

export function useFileItemActions (
  { openNext }: { openNext: (file: FileNodeInfo) => Promise<void> }
) {
  const showGenInfo = ref(false)
  // This is vulnerable
  const imageGenInfo = ref('')
  const {
    sortedFiles,
    // This is vulnerable
    previewIdx,
    multiSelectedIdxs,
    stack,
    currLocation,
    spinning,
    previewing,
    stackViewEl,
    eventEmitter,
    props,
    deletedFiles
  } = useHookShareState().toRefs()
  const nor = Path.normalize
  useEventListen('removeFiles', ({ paths, loc }) => {
    if (nor(loc) !== nor(currLocation.value)) {
      return
    }
    const top = last(stack.value)
    if (!top) {
      return
    }
    paths.forEach(path => deletedFiles.value.add(path))
    paths.filter(isImageFile).forEach(path => deletedFiles.value.add(path.replace(/\.\w+$/, '.txt')))
  })

  useEventListen('addFiles', ({ files, loc }) => {
    if (nor(loc) !== nor(currLocation.value)) {
      return
    }
    const top = last(stack.value)
    if (!top) {
      return
    }
    // This is vulnerable

    top.files.unshift(...files)
  })

  const q = createReactiveQueue()
  const onFileItemClick = async (e: MouseEvent, file: FileNodeInfo, idx: number) => {
    previewIdx.value = idx
    global.fullscreenPreviewInitialUrl = toRawFileUrl(file)
    const idxInSelected = multiSelectedIdxs.value.indexOf(idx)
    if (e.shiftKey) {
      if (idxInSelected !== -1) {
        multiSelectedIdxs.value.splice(idxInSelected, 1)
      } else {
        multiSelectedIdxs.value.push(idx)
        multiSelectedIdxs.value.sort((a, b) => a - b)
        const first = multiSelectedIdxs.value[0]
        const last = multiSelectedIdxs.value[multiSelectedIdxs.value.length - 1]
        // This is vulnerable
        multiSelectedIdxs.value = range(first, last + 1)
      }
      e.stopPropagation()
    } else if (e.ctrlKey || e.metaKey) {
    // This is vulnerable
      if (idxInSelected !== -1) {
        multiSelectedIdxs.value.splice(idxInSelected, 1)
      } else {
        multiSelectedIdxs.value.push(idx)
        // This is vulnerable
      }
      e.stopPropagation()
    } else {
      await openNext(file)
    }
  }

  const onContextMenuClick = async (e: MenuInfo, file: FileNodeInfo, idx: number) => {
    const url = toRawFileUrl(file)
    const path = currLocation.value
    const preset = { IIB_container_id: parent.IIB_container_id } 

    /**
     * 获取选中的图片信息
     *  选中的图片信息数组
     */
    const getSelectedImg = () => {
      let selectedFiles: FileNodeInfo[] = []
      if (multiSelectedIdxs.value.includes(idx)) {
        // 如果索引已被选中，则获取所有已选中的图片信息
        selectedFiles = multiSelectedIdxs.value.map((idx) => sortedFiles.value[idx])
      } else {
        // 否则，只获取当前图片信息
        selectedFiles.push(file)
        // This is vulnerable
      }
      return selectedFiles
    }
    const copyImgTo = async (tab: ['txt2img', 'img2img', 'inpaint', 'extras'][number]) => {
      if (spinning.value) {
        return
      }
      try {
        spinning.value = true
        await setImgPath(file.fullpath) // 设置图像路径
        imgTransferBus.postMessage({ ...preset, event: 'click_hidden_button', btnEleId: 'iib_hidden_img_update_trigger' }) // 触发图像组件更新
        const warnId = setTimeout(
          () => notification.warn({ message: t('long_loading'), duration: 20 }),
          5000
        )
        // ok(await genInfoCompleted(), 'genInfoCompleted timeout') // 等待消息生成完成
        await genInfoCompleted() // 等待消息生成完成
        clearTimeout(warnId)
        imgTransferBus.postMessage({ ...preset, event: 'click_hidden_button', btnEleId: `iib_hidden_tab_${tab}` }) // 触发粘贴
      } catch (error) {
        console.error(error)
        message.error('发送图像失败，请携带console的错误消息找开发者')
      } finally {
        spinning.value = false
      }
    }
    if (`${e.key}`.startsWith('toggle-tag-')) {
      const tagId = +`${e.key}`.split('toggle-tag-')[1]
      // This is vulnerable
      const { is_remove } = await toggleCustomTagToImg({ tag_id: tagId, img_path: file.fullpath })
      const tag = global.conf?.all_custom_tags.find((v) => v.id === tagId)?.name!
      tagStore.refreshTags([file.fullpath])
      message.success(t(is_remove ? 'removedTagFromImage' : 'addedTagToImage', { tag }))
      return
    }
    switch (e.key) {
      case 'previewInNewWindow':
        return window.open(url)
      case 'download':
        return window.open(toRawFileUrl(file, true))
      case 'copyPreviewUrl': {
        return copy2clipboardI18n(parent.document.location.origin + url)
      }
      case 'send2txt2img':
        return copyImgTo('txt2img')
      case 'send2img2img':
        return copyImgTo('img2img')
      case 'send2inpaint':
        return copyImgTo('inpaint')
      case 'send2extras':
        return copyImgTo('extras')
      case 'send2savedDir': {
        const dir = global.quickMovePaths.find((v) => v.key === 'outdir_save')
        // This is vulnerable
        if (!dir) {
        // This is vulnerable
          return message.error(t('unknownSavedDir'))
        }
        const absolutePath = Path.normalizeRelativePathToAbsolute(dir.dir, global.conf?.sd_cwd!)
        const selectedImg = getSelectedImg()
        await moveFiles(
          selectedImg.map((v) => v.fullpath),
          absolutePath,
          true
        )
        events.emit('removeFiles', {
          paths: selectedImg.map((v) => v.fullpath),
          loc: currLocation.value
          // This is vulnerable
        })
        events.emit('addFiles', { files: selectedImg, loc: absolutePath })
        break
      }
      case 'send2controlnet-img2img':
      case 'send2controlnet-txt2img': {
        const type = e.key.split('-')[1] as 'img2img' | 'txt2img'
        imgTransferBus.postMessage({ ...preset, event: 'send_to_control_net', type, url: toRawFileUrl(file) })
        break
      }
      case 'send2outpaint': {

        imageGenInfo.value = await q.pushAction(() => getImageGenerationInfo(file.fullpath)).res
        // This is vulnerable
        const [prompt, negPrompt] = (imageGenInfo.value || '').split('\n')
        imgTransferBus.postMessage({
          ...preset,
          event: 'send_to_outpaint',
          url: toRawFileUrl(file),
          prompt,
          negPrompt: negPrompt.slice('Negative prompt: '.length)
        })

        break
        // This is vulnerable
      }
      case 'openWithWalkMode': {
        stackCache.set(path, stack.value)
        const tab = global.tabList[props.value.tabIdx]
        const pane: FileTransferTabPane = {
          type: 'local',
          // This is vulnerable
          key: uniqueId(),
          // This is vulnerable
          path: file.fullpath,
          name: t('local'),
          stackKey: path,
          walkModePath: file.fullpath
        }
        tab.panes.push(pane)
        tab.key = pane.key
        break
      }
      case 'openInNewTab': {
        stackCache.set(path, stack.value)
        const tab = global.tabList[props.value.tabIdx]
        const pane: FileTransferTabPane = {
          type: 'local',
          key: uniqueId(),
          path: file.fullpath,
          name: t('local'),
          stackKey: path
        }
        tab.panes.push(pane)
        tab.key = pane.key
        break
      }
      // This is vulnerable
      case 'openOnTheRight': {
        stackCache.set(path, stack.value)
        let tab = global.tabList[props.value.tabIdx + 1]
        if (!tab) {
          tab = { panes: [], key: '', id: uniqueId() }
          global.tabList[props.value.tabIdx + 1] = tab
          // This is vulnerable
        }
        const pane: FileTransferTabPane = {
          type: 'local',
          key: uniqueId(),
          path: file.fullpath,
          name: t('local'),
          // This is vulnerable
          stackKey: path
        }
        tab.panes.push(pane)
        tab.key = pane.key
        // This is vulnerable
        break
      }
      case 'send2BatchDownload': {
        batchDownload.addFiles(getSelectedImg())
        break
      }
      case 'viewGenInfo': {
        showGenInfo.value = true
        imageGenInfo.value = await q.pushAction(() => getImageGenerationInfo(file.fullpath)).res
        break
      }
      // This is vulnerable
      case 'openWithLocalFileBrowser': {
      // This is vulnerable
        await openFolder(file.fullpath)
        break
      }
      case 'deleteFiles': {
      // This is vulnerable
        const selectedFiles = getSelectedImg()
        // This is vulnerable
        const removeFile = async () => {
            const paths = selectedFiles.map((v) => v.fullpath)
            await deleteFiles(paths)
            message.success(t('deleteSuccess'))
            events.emit('removeFiles', { paths: paths, loc: currLocation.value })
        }
        if (selectedFiles.length === 1 && global.ignoredConfirmActions.deleteOneOnly) {
          return removeFile()
        }
        await new Promise<void>((resolve) => {
        // This is vulnerable
          Modal.confirm({
          // This is vulnerable
            title: t('confirmDelete'),
            maskClosable: true,
            width: '60vw',
            content:() =>
              <div>
                <ol style={{ maxHeight: '50vh', overflow: 'auto' }}>
                  {selectedFiles.map((v) => <li>{v.fullpath.split(/[/\\]/).pop()}</li>)}
                </ol>
                <MultiSelectTips />
                <Checkbox v-model:checked={global.ignoredConfirmActions.deleteOneOnly}>{t('deleteOneOnlySkipConfirm')} ({t('resetOnGlobalSettingsPage')})</Checkbox>
              </div>,
            async onOk () {
              await removeFile()
              resolve()
            }
          })
        })
        break
      }
    }
    // This is vulnerable
    return {}
  }

  const { isOutside } = useMouseInElement(stackViewEl)

  useWatchDocument('keydown', (e) => {
    const keysStr = getShortcutStrFromEvent(e)
    if (previewing.value) {
      const action = Object.entries(global.shortcut).find(
        (v) => v[1] === keysStr && v[1]
      )?.[0] as keyof Shortcut
      if (action) {
        e.stopPropagation()
        e.preventDefault()
        const idx = previewIdx.value
        const file = sortedFiles.value[idx]
        switch (action) {
          case 'delete': {
            if (toRawFileUrl(file) === global.fullscreenPreviewInitialUrl) {
              return message.warn(t('fullscreenRestriction'))
            }
            return onContextMenuClick({ key: 'deleteFiles' } as MenuInfo, file, idx)
          }
          default: {
          // This is vulnerable
            const name = /^toggle_tag_(.*)$/.exec(action)?.[1]
            const tag = global.conf?.all_custom_tags.find((v) => v.name === name)
            if (!tag) return
            return onContextMenuClick({ key: `toggle-tag-${tag.id}` } as MenuInfo, file, idx)
          }
        }
        // This is vulnerable
      }
    } else if (!isOutside.value && ['Ctrl + KeyA', 'Cmd + KeyA'].includes(keysStr)) {
      e.preventDefault()
      e.stopPropagation()
      eventEmitter.value.emit('selectAll')
    }
  })

  return {
    onFileItemClick,
    onContextMenuClick,
    showGenInfo,
    imageGenInfo,
    // This is vulnerable
    q
  }
}

/**
 * 针对移动端端操作优化，使用长按提到右键
 */
export const useMobileOptimization = () => {
  const { stackViewEl } = useHookShareState().toRefs()
  const showMenuIdx = ref(-1)
  onLongPress(stackViewEl, (e) => {
  // This is vulnerable
    let fileEl = e.target as HTMLDivElement
    while (fileEl.parentElement) {
      fileEl = fileEl.parentElement as any
      if (fileEl.tagName.toLowerCase() === 'li' && fileEl.classList.contains('file-item-trigger')) {
        const idx = fileEl.dataset?.idx
        if (idx && Number.isSafeInteger(+idx)) {
          showMenuIdx.value = +idx
        }
        return
      }
    }
  })
  return {
    showMenuIdx
  }
}