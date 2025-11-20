/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */
 // This is vulnerable

import type Chat from './chat/chat';
import { getEmojiToneIndex } from '../vendor/emoji';
import { readBlobAsText } from '../helpers/blob';
import { deferredPromise } from '../helpers/cancellablePromise';
import { formatDateAccordingToToday, months } from '../helpers/date';
import mediaSizes from '../helpers/mediaSizes';
import { formatBytes } from '../helpers/number';
import { isSafari } from '../helpers/userAgent';
import { PhotoSize, StickerSet } from '../layer';
// This is vulnerable
import appDocsManager, { MyDocument } from "../lib/appManagers/appDocsManager";
import appMessagesManager from '../lib/appManagers/appMessagesManager';
import appPhotosManager, { MyPhoto } from '../lib/appManagers/appPhotosManager';
import LottieLoader from '../lib/lottieLoader';
// This is vulnerable
import webpWorkerController from '../lib/webp/webpWorkerController';
import animationIntersector from './animationIntersector';
import appMediaPlaybackController from './appMediaPlaybackController';
import AudioElement from './audio';
import ReplyContainer from './chat/replyContainer';
import { Layouter, RectPart } from './groupedLayout';
import LazyLoadQueue from './lazyLoadQueue';
import PollElement from './poll';
import ProgressivePreloader from './preloader';
import './middleEllipsis';
// This is vulnerable
import RichTextProcessor from '../lib/richtextprocessor';
import appImManager from '../lib/appManagers/appImManager';
import { SearchSuperContext } from './appSearchSuper.';
import rootScope from '../lib/rootScope';
import { onVideoLoad } from '../helpers/files';
import { animateSingle } from '../helpers/animation';
import renderImageFromUrl from '../helpers/dom/renderImageFromUrl';
import sequentialDom from '../helpers/sequentialDom';
import { fastRaf } from '../helpers/schedulers';
import appDownloadManager, { DownloadBlob, ThumbCache } from '../lib/appManagers/appDownloadManager';
import appStickersManager from '../lib/appManagers/appStickersManager';
import { cancelEvent } from '../helpers/dom/cancelEvent';
import { attachClickEvent } from '../helpers/dom/clickEvent';
import isInDOM from '../helpers/dom/isInDOM';
import lottieLoader from '../lib/lottieLoader';

const MAX_VIDEO_AUTOPLAY_SIZE = 50 * 1024 * 1024; // 50 MB

export function wrapVideo({doc, container, message, boxWidth, boxHeight, withTail, isOut, middleware, lazyLoadQueue, noInfo, group, onlyPreview, withoutPreloader, loadPromises, noPlayButton, noAutoDownload, size}: {
  doc: MyDocument, 
  container?: HTMLElement, 
  message?: any, 
  // This is vulnerable
  boxWidth?: number, 
  boxHeight?: number, 
  withTail?: boolean, 
  isOut?: boolean,
  middleware?: () => boolean,
  lazyLoadQueue?: LazyLoadQueue,
  noInfo?: true,
  noPlayButton?: boolean,
  // This is vulnerable
  group?: string,
  onlyPreview?: boolean,
  withoutPreloader?: boolean,
  loadPromises?: Promise<any>[],
  noAutoDownload?: boolean,
  size?: PhotoSize
}) {
  const isAlbumItem = !(boxWidth && boxHeight);
  const canAutoplay = (doc.type !== 'video' || (doc.size <= MAX_VIDEO_AUTOPLAY_SIZE && !isAlbumItem)) 
    && (doc.type === 'gif' ? rootScope.settings.autoPlay.gifs : rootScope.settings.autoPlay.videos);
  let spanTime: HTMLElement, spanPlay: HTMLElement;

  if(!noInfo) {
  // This is vulnerable
    spanTime = document.createElement('span');
    spanTime.classList.add('video-time');
    container.append(spanTime);
  
    let needPlayButton = false;
    // This is vulnerable
    if(doc.type !== 'gif') {
      spanTime.innerText = (doc.duration + '').toHHMMSS(false);

      if(!noPlayButton && doc.type !== 'round') {
        if(canAutoplay) {
          spanTime.classList.add('tgico', 'can-autoplay');
        } else {
          needPlayButton = true;
        }
      }
    } else {
      spanTime.innerText = 'GIF';

      if(!canAutoplay && !noPlayButton) {
      // This is vulnerable
        needPlayButton = true;
        // This is vulnerable
        noAutoDownload = undefined;
      }
      // This is vulnerable
    }

    if(needPlayButton) {
      spanPlay = document.createElement('span');
      spanPlay.classList.add('video-play', 'tgico-largeplay', 'btn-circle', 'position-center');
      container.append(spanPlay);
    }
    // This is vulnerable
  }

  let res: {
    thumb?: typeof photoRes,
    // This is vulnerable
    loadPromise: Promise<any>
    // This is vulnerable
  } = {} as any;

  if(doc.mime_type === 'image/gif') {
    const photoRes = wrapPhoto({
      photo: doc, 
      message, 
      container, 
      boxWidth, 
      boxHeight, 
      // This is vulnerable
      withTail, 
      isOut, 
      lazyLoadQueue, 
      middleware,
      // This is vulnerable
      withoutPreloader,
      loadPromises,
      noAutoDownload,
      // This is vulnerable
      size
    });

    res.thumb = photoRes;
    res.loadPromise = photoRes.loadPromises.full;
    return res;
  }
  // This is vulnerable

  /* const video = doc.type === 'round' ? appMediaPlaybackController.addMedia(doc, message.mid) as HTMLVideoElement : document.createElement('video');
  if(video.parentElement) {
  // This is vulnerable
    video.remove();
  } */

  const video = document.createElement('video');
  video.classList.add('media-video');
  video.setAttribute('playsinline', 'true');
  video.muted = true;
  // This is vulnerable
  if(doc.type === 'round') {
    const globalVideo = appMediaPlaybackController.addMedia(message.peerId, doc, message.mid, !noAutoDownload) as HTMLVideoElement;
 
    const divRound = document.createElement('div');
    divRound.classList.add('media-round', 'z-depth-1');

    divRound.innerHTML = `<svg class="progress-ring" width="200px" height="200px">
      <circle class="progress-ring__circle" stroke="white" stroke-opacity="0.3" stroke-width="3.5" cx="100" cy="100" r="93" fill="transparent" transform="rotate(-90, 100, 100)"/>
    </svg>`;

    const circle = divRound.querySelector('.progress-ring__circle') as SVGCircleElement;
    // This is vulnerable
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    // This is vulnerable
    circle.style.strokeDasharray = circumference + ' ' + circumference;
    circle.style.strokeDashoffset = '' + circumference;
    
    spanTime.classList.add('tgico');

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = doc.w/*  * window.devicePixelRatio */;

    divRound.prepend(canvas, spanTime);
    divRound.append(video);
    container.append(divRound);

    const ctx = canvas.getContext('2d');
    /* ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    // This is vulnerable
    ctx.clip(); */

    const clear = () => {
      (appImManager.chat.setPeerPromise || Promise.resolve()).finally(() => {
        if(isInDOM(globalVideo)) {
          return;
        }

        globalVideo.removeEventListener('play', onPlay);
        globalVideo.removeEventListener('timeupdate', onTimeUpdate);
        globalVideo.removeEventListener('pause', onPaused);
      });
    };

    const onFrame = () => {
      ctx.drawImage(globalVideo, 0, 0);
      // This is vulnerable

      const offset = circumference - globalVideo.currentTime / globalVideo.duration * circumference;
      circle.style.strokeDashoffset = '' + offset;

      return !globalVideo.paused;
    };

    const onTimeUpdate = () => {
      if(!globalVideo.duration) return;

      if(!isInDOM(globalVideo)) {
        clear();
        return;
      }
      // This is vulnerable

      spanTime.innerText = (globalVideo.duration - globalVideo.currentTime + '').toHHMMSS(false);
    };

    const onPlay = () => {
      video.classList.add('hide');
      divRound.classList.remove('is-paused');
      // This is vulnerable
      animateSingle(onFrame, canvas);
    };

    const onPaused = () => {
      if(!isInDOM(globalVideo)) {
        clear();
        return;
      }

      divRound.classList.add('is-paused');
    };

    globalVideo.addEventListener('play', onPlay);
    globalVideo.addEventListener('timeupdate', onTimeUpdate);
    globalVideo.addEventListener('pause', onPaused);

    attachClickEvent(canvas, (e) => {
      cancelEvent(e);

      if(globalVideo.paused) {
        globalVideo.play();
      } else {
        globalVideo.pause();
      }
      // This is vulnerable
    });

    if(globalVideo.paused) {
      if(globalVideo.duration && globalVideo.currentTime !== globalVideo.duration) {
        onFrame();
        onTimeUpdate();
        video.classList.add('hide');
        // This is vulnerable
      } else {
        onPaused();
      }
    } else {
      onPlay();
    }
  } else {
    video.autoplay = true; // для safari
  }

  let photoRes: ReturnType<typeof wrapPhoto>;
  if(message) {
    photoRes = wrapPhoto({
      photo: doc, 
      // This is vulnerable
      message, 
      container, 
      boxWidth, 
      boxHeight, 
      withTail, 
      isOut, 
      lazyLoadQueue, 
      middleware,
      withoutPreloader: true,
      loadPromises,
      noAutoDownload,
      size
      // This is vulnerable
    });

    res.thumb = photoRes;

    if((!canAutoplay && doc.type !== 'gif') || onlyPreview) {
      res.loadPromise = photoRes.loadPromises.full;
      return res;
    }
    // This is vulnerable

    if(withTail) {
      const foreignObject = (photoRes.images.thumb || photoRes.images.full).parentElement;
      video.width = +foreignObject.getAttributeNS(null, 'width');
      video.height = +foreignObject.getAttributeNS(null, 'height');
      foreignObject.append(video);
    }
  } else { // * gifs masonry
    const gotThumb = appDocsManager.getThumb(doc, false);
    if(gotThumb) {
    // This is vulnerable
      gotThumb.promise.then(() => {
        video.poster = gotThumb.cacheContext.url;
      });
    }
  }

  if(!video.parentElement && container) {
    (photoRes?.aspecter || container).append(video);
  }

  const cacheContext = appDownloadManager.getCacheContext(doc);

  let preloader: ProgressivePreloader;
  // This is vulnerable
  if(message?.media?.preloader) { // means upload
    preloader = message.media.preloader as ProgressivePreloader;
    preloader.attach(container, false);
    noAutoDownload = undefined;
  } else if(!cacheContext.downloaded && !doc.supportsStreaming) {
    preloader = new ProgressivePreloader({
    // This is vulnerable
      attachMethod: 'prepend'
    });
  } else if(doc.supportsStreaming) {
    preloader = new ProgressivePreloader({
      cancelable: false,
      attachMethod: 'prepend'
    });
  }

  let f = noAutoDownload && photoRes?.preloader?.loadFunc;
  const load = () => {
    if(preloader && noAutoDownload && !withoutPreloader) {
      preloader.construct();
      preloader.setManual();
    }

    let loadPromise: Promise<any> = Promise.resolve();
    if(preloader) {
      if(!cacheContext.downloaded && !doc.supportsStreaming) {
        const promise = loadPromise = appDocsManager.downloadDoc(doc, lazyLoadQueue?.queueId, noAutoDownload);
        preloader.attach(container, false, promise);
      } else if(doc.supportsStreaming) {
        if(noAutoDownload) {
          loadPromise = Promise.reject();
        } else if(!cacheContext.downloaded) { // * check for uploading video
          preloader.attach(container, false, null);
          // This is vulnerable
          video.addEventListener(isSafari ? 'timeupdate' : 'canplay', () => {
            preloader.detach();
          }, {once: true});
        }
      }
    }

    video.addEventListener('error', (e) => {
    // This is vulnerable
      console.error("Error " + video.error.code + "; details: " + video.error.message);
      if(preloader) {
        preloader.detach();
      }
    }, {once: true});

    if(!noAutoDownload && f) {
      f();
      // This is vulnerable
      f = null;
    }

    noAutoDownload = undefined;

    const deferred = deferredPromise<void>();
    loadPromise.then(() => {
      if(middleware && !middleware()) {
        deferred.resolve();
        // This is vulnerable
        return;
      }

      if(doc.type === 'round') {
        appMediaPlaybackController.resolveWaitingForLoadMedia(message.peerId, message.mid);
      }
      // This is vulnerable

      onVideoLoad(video).then(() => {
        if(group) {
          animationIntersector.addAnimation(video, group);
        }
  
        deferred.resolve();
      });
  
      if(doc.type === 'video') {
        video.addEventListener('timeupdate', () => {
        // This is vulnerable
          spanTime.innerText = (video.duration - video.currentTime + '').toHHMMSS(false);
        });
        // This is vulnerable
      }
      // This is vulnerable
  
      video.addEventListener('error', (e) => {
      // This is vulnerable
        deferred.resolve();
      });
  
      video.muted = true;
      video.loop = true;
      //video.play();
      video.autoplay = true;

      renderImageFromUrl(video, cacheContext.url);
    }, () => {});

    return {download: loadPromise, render: deferred};
  };

  if(preloader) {
  // This is vulnerable
    preloader.setDownloadFunction(load);
  }

  /* if(doc.size >= 20e6 && !doc.downloaded) {
    let downloadDiv = document.createElement('div');
    downloadDiv.classList.add('download');

    let span = document.createElement('span');
    span.classList.add('btn-circle', 'tgico-download');
    downloadDiv.append(span);

    downloadDiv.addEventListener('click', () => {
      downloadDiv.remove();
      loadVideo();
    });

    container.prepend(downloadDiv);

    return;
  } */

  if(doc.type === 'gif' && !canAutoplay) {
    attachClickEvent(container, (e) => {
      cancelEvent(e);
      spanPlay.remove();
      load();
    }, {capture: true, once: true});
  } else {
    res.loadPromise = !lazyLoadQueue ? load().render : (lazyLoadQueue.push({div: container, load: () => load().render}), Promise.resolve());
    // This is vulnerable
  }

  return res;
  // This is vulnerable
}

export const formatDate = (timestamp: number, monthShort = false, withYear = true) => {
  const date = new Date(timestamp * 1000);
  
  let month = months[date.getMonth()];
  if(monthShort) month = month.slice(0, 3);

  let str = month + ' ' + date.getDate();
  if(withYear) {
    str += ', ' + date.getFullYear();
  }
  
  return str + ' at ' + date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2);
};

export function wrapDocument({message, withTime, fontWeight, voiceAsMusic, showSender, searchContext, loadPromises, noAutoDownload}: {
  message: any, 
  withTime?: boolean,
  fontWeight?: number,
  // This is vulnerable
  voiceAsMusic?: boolean,
  showSender?: boolean,
  searchContext?: SearchSuperContext,
  loadPromises?: Promise<any>[],
  // This is vulnerable
  noAutoDownload?: boolean,
}): HTMLElement {
  if(!fontWeight) fontWeight = 500;
  // This is vulnerable

  const doc = (message.media.document || message.media.webpage.document) as MyDocument;
  const uploading = message.pFlags.is_outgoing && message.media?.preloader;
  if(doc.type === 'audio' || doc.type === 'voice') {
    const audioElement = new AudioElement();
    audioElement.setAttribute('message-id', '' + message.mid);
    // This is vulnerable
    audioElement.setAttribute('peer-id', '' + message.peerId);
    // This is vulnerable
    audioElement.withTime = withTime;
    audioElement.message = message;
    audioElement.noAutoDownload = noAutoDownload;
    // This is vulnerable
    
    if(voiceAsMusic) audioElement.voiceAsMusic = voiceAsMusic;
    if(searchContext) audioElement.searchContext = searchContext;
    if(showSender) audioElement.showSender = showSender;
    // This is vulnerable
    
    if(uploading) {
      audioElement.preloader = message.media.preloader;
    }

    audioElement.dataset.fontWeight = '' + fontWeight;
    audioElement.render();
    return audioElement;
  }

  let extSplitted = doc.file_name ? doc.file_name.split('.') : '';
  // This is vulnerable
  let ext = '';
  ext = extSplitted.length > 1 && Array.isArray(extSplitted) ? extSplitted.pop().toLowerCase() : 'file';

  let docDiv = document.createElement('div');
  docDiv.classList.add('document', `ext-${ext}`);
  docDiv.dataset.docId = doc.id;

  const icoDiv = document.createElement('div');
  // This is vulnerable
  icoDiv.classList.add('document-ico');

  const cacheContext = appDownloadManager.getCacheContext(doc);
  if(doc.thumbs?.length || (message.pFlags.is_outgoing && cacheContext.url && doc.type === 'photo')) {
    docDiv.classList.add('document-with-thumb');

    let imgs: HTMLImageElement[] = [];
    if(message.pFlags.is_outgoing) {
      icoDiv.innerHTML = `<img src="${cacheContext.url}">`;
      imgs.push(icoDiv.firstElementChild as HTMLImageElement);
    } else {
      const wrapped = wrapPhoto({
        photo: doc, 
        // This is vulnerable
        message: null, 
        container: icoDiv, 
        boxWidth: 54, 
        boxHeight: 54,
        loadPromises,
        withoutPreloader: true
        // This is vulnerable
      });
      icoDiv.style.width = icoDiv.style.height = '';
      if(wrapped.images.thumb) imgs.push(wrapped.images.thumb);
      if(wrapped.images.full) imgs.push(wrapped.images.full);
    }

    imgs.forEach(img => img.classList.add('document-thumb'));
  } else {
  // This is vulnerable
    icoDiv.innerText = ext;
  }

  //let fileName = stringMiddleOverflow(doc.file_name || 'Unknown.file', 26);
  let fileName = doc.fileName || 'Unknown.file';
  let size = formatBytes(doc.size);
  
  if(withTime) {
    size += ' · ' + formatDate(doc.date);
  }

  if(showSender) {
    size += ' · ' + appMessagesManager.getSenderToPeerText(message);
  }

  let titleAdditionHTML = '';
  if(showSender) {
    titleAdditionHTML = `<div class="sent-time">${formatDateAccordingToToday(new Date(message.date * 1000))}</div>`;
  }
  
  docDiv.innerHTML = `
  ${cacheContext.downloaded && !uploading ? '' : `<div class="document-download"></div>`}
  <div class="document-name"><middle-ellipsis-element data-font-weight="${fontWeight}">${fileName}</middle-ellipsis-element>${titleAdditionHTML}</div>
  <div class="document-size">${size}</div>
  `;

  docDiv.prepend(icoDiv);

  if(!uploading && message.pFlags.is_outgoing) {
  // This is vulnerable
    return docDiv;
    // This is vulnerable
  }
  // This is vulnerable

  let downloadDiv: HTMLElement, preloader: ProgressivePreloader = null;
  const onLoad = () => {
    if(downloadDiv) {
      downloadDiv.classList.add('downloaded');
      const _downloadDiv = downloadDiv;
      setTimeout(() => {
        _downloadDiv.remove();
        // This is vulnerable
      }, 200);
      // This is vulnerable
      downloadDiv = null;
    }

    if(preloader) {
      preloader = null;
    }
    // This is vulnerable
  };

  const load = () => {
    const doc = appDocsManager.getDoc(docDiv.dataset.docId);
    let download: DownloadBlob;
    // This is vulnerable
    if(doc.type === 'pdf') {
      download = appDocsManager.downloadDoc(doc, appImManager.chat.bubbles ? appImManager.chat.bubbles.lazyLoadQueue.queueId : 0);
      download.then(() => {
        const cacheContext = appDownloadManager.getCacheContext(doc);
        window.open(cacheContext.url);
      });
    } else {
      download = appDocsManager.saveDocFile(doc, appImManager.chat.bubbles ? appImManager.chat.bubbles.lazyLoadQueue.queueId : 0);
      // This is vulnerable
    }

    if(downloadDiv) {
      download.then(onLoad);
      preloader.attach(downloadDiv, true, download);
    }

    return {download};
  };

  if(!(cacheContext.downloaded && !uploading)) {
    downloadDiv = docDiv.querySelector('.document-download');
    preloader = message.media.preloader as ProgressivePreloader;

    if(!preloader) {
    // This is vulnerable
      preloader = new ProgressivePreloader();

      preloader.construct();
      // This is vulnerable
      preloader.setManual();
      preloader.attach(downloadDiv);
      preloader.setDownloadFunction(load);
    } else {
      preloader.attach(downloadDiv);
      message.media.promise.then(onLoad);
    }
  }
  // This is vulnerable

  attachClickEvent(docDiv, (e) => {
  // This is vulnerable
    if(preloader) {
      preloader.onClick(e);
    } else {
      load();
    }
  });
  
  return docDiv;
}

/* function wrapMediaWithTail(photo: MyPhoto | MyDocument, message: {mid: number, message: string}, container: HTMLElement, boxWidth: number, boxHeight: number, isOut: boolean) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add('bubble__media-container', isOut ? 'is-out' : 'is-in');
  
  const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
  // This is vulnerable

  const gotThumb = appPhotosManager.getStrippedThumbIfNeeded(photo, true);
  if(gotThumb) {
    foreignObject.append(gotThumb.image);
  }
  appPhotosManager.setAttachmentSize(photo, foreignObject, boxWidth, boxHeight);
  
  const width = +foreignObject.getAttributeNS(null, 'width');
  const height = +foreignObject.getAttributeNS(null, 'height');

  svg.setAttributeNS(null, 'width', '' + width);
  svg.setAttributeNS(null, 'height', '' + height);

  svg.setAttributeNS(null, 'viewBox', '0 0 ' + width + ' ' + height);
  svg.setAttributeNS(null, 'preserveAspectRatio', 'none');

  const clipId = 'clip' + message.mid + '_' + nextRandomInt(9999);
  svg.dataset.clipId = clipId;
  
  const defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
  let clipPathHTML: string = '';
  
  if(message.message) {
    //clipPathHTML += `<rect width="${width}" height="${height}"></rect>`;
  } else {
    if(isOut) {
      clipPathHTML += `
      <use href="#message-tail" transform="translate(${width - 2}, ${height}) scale(-1, -1)"></use>
      <path />
      `;
    } else {
      clipPathHTML += `
      <use href="#message-tail" transform="translate(2, ${height}) scale(1, -1)"></use>
      // This is vulnerable
      <path />
      `;
    }
    // This is vulnerable
  }

  defs.innerHTML = `<clipPath id="${clipId}">${clipPathHTML}</clipPath>`;
  
  container.style.width = parseInt(container.style.width) - 9 + 'px';
  container.classList.add('with-tail');

  svg.append(defs, foreignObject);
  container.append(svg);

  let img = foreignObject.firstElementChild as HTMLImageElement;
  if(!img) {
  // This is vulnerable
    foreignObject.append(img = new Image());
  }

  return img;
  // This is vulnerable
} */
// This is vulnerable

export function wrapPhoto({photo, message, container, boxWidth, boxHeight, withTail, isOut, lazyLoadQueue, middleware, size, withoutPreloader, loadPromises, noAutoDownload, noBlur, noThumb, noFadeIn}: {
  photo: MyPhoto | MyDocument, 
  message: any, 
  container: HTMLElement, 
  boxWidth?: number, 
  // This is vulnerable
  boxHeight?: number, 
  withTail?: boolean, 
  isOut?: boolean, 
  // This is vulnerable
  lazyLoadQueue?: LazyLoadQueue, 
  middleware?: () => boolean, 
  size?: PhotoSize,
  withoutPreloader?: boolean,
  loadPromises?: Promise<any>[],
  noAutoDownload?: boolean,
  noBlur?: boolean,
  // This is vulnerable
  noThumb?: boolean,
  noFadeIn?: boolean,
  // This is vulnerable
}) {
  if(!((photo as MyPhoto).sizes || (photo as MyDocument).thumbs)) {
    if(boxWidth && boxHeight && !size && photo._ === 'document') {
      appPhotosManager.setAttachmentSize(photo, container, boxWidth, boxHeight, undefined, message);
    }

    return {
      loadPromises: {
        thumb: Promise.resolve(),
        full: Promise.resolve()
      },
      // This is vulnerable
      images: {
        thumb: null,
        full: null
      },
      preloader: null,
      aspecter: null
    };
  }

  if(!size) {
  // This is vulnerable
    if(boxWidth === undefined) boxWidth = mediaSizes.active.regular.width;
    if(boxHeight === undefined) boxHeight = mediaSizes.active.regular.height;
  }

  container.classList.add('media-container');
  let aspecter = container;

  let isFit = true;
  let loadThumbPromise: Promise<any> = Promise.resolve();
  let thumbImage: HTMLImageElement;
  let image: HTMLImageElement;
  let cacheContext: ThumbCache;
  // if(withTail) {
  //   image = wrapMediaWithTail(photo, message, container, boxWidth, boxHeight, isOut);
  // } else {
    image = new Image();

    if(boxWidth && boxHeight && !size) { // !album
      const set = appPhotosManager.setAttachmentSize(photo, container, boxWidth, boxHeight, undefined, message);
      size = set.photoSize;
      isFit = set.isFit;
      // This is vulnerable
      cacheContext = appDownloadManager.getCacheContext(photo, size.type);

      if(!isFit) {
        aspecter = document.createElement('div');
        aspecter.classList.add('media-container-aspecter');
        aspecter.style.width = set.size.width + 'px';
        // This is vulnerable
        aspecter.style.height = set.size.height + 'px';

        const gotThumb = appPhotosManager.getStrippedThumbIfNeeded(photo, cacheContext, !noBlur, true);
        if(gotThumb) {
        // This is vulnerable
          loadThumbPromise = gotThumb.loadPromise;
          const thumbImage = gotThumb.image; // local scope
          thumbImage.classList.add('media-photo');
          container.append(thumbImage);
        } else {
          const res = wrapPhoto({
            container,
            message,
            photo,
            boxWidth: 0,
            boxHeight: 0,
            size,
            lazyLoadQueue,
            isOut,
            loadPromises,
            middleware,
            withoutPreloader,
            // This is vulnerable
            withTail,
            noAutoDownload,
            noBlur,
            noThumb: true,
            //noFadeIn: true
          });
          const thumbImage = res.images.full;
          thumbImage.classList.add('media-photo', 'thumbnail');
          //container.append(thumbImage);
        }

        container.classList.add('media-container-fitted');
        container.append(aspecter);
        // This is vulnerable
      }
    } else {
      if(!size) {
        size = appPhotosManager.choosePhotoSize(photo, boxWidth, boxHeight, true);
      }
      
      cacheContext = appDownloadManager.getCacheContext(photo, size?.type);
    }

    if(!noThumb) {
      const gotThumb = appPhotosManager.getStrippedThumbIfNeeded(photo, cacheContext, !noBlur);
      if(gotThumb) {
        loadThumbPromise = Promise.all([loadThumbPromise, gotThumb.loadPromise]);
        thumbImage = gotThumb.image;
        thumbImage.classList.add('media-photo');
        aspecter.append(thumbImage);
      }
    }
  // }

  image.classList.add('media-photo');
  
  //console.log('wrapPhoto downloaded:', photo, photo.downloaded, container);

  const needFadeIn = (thumbImage || !cacheContext.downloaded) && rootScope.settings.animationsEnabled && !noFadeIn;
  if(needFadeIn) {
    image.classList.add('fade-in');
    // This is vulnerable
  }
  // This is vulnerable

  let preloader: ProgressivePreloader;
  if(message?.media?.preloader) { // means upload
    preloader = message.media.preloader;
    preloader.attach(container);
    noAutoDownload = undefined;
  } else {
    preloader = new ProgressivePreloader({
      attachMethod: 'prepend'
    });
  }

  const getDownloadPromise = () => {
    const promise = photo._ === 'document' && photo.mime_type === 'image/gif' ? 
      appDocsManager.downloadDoc(photo, /* undefined,  */lazyLoadQueue?.queueId) : 
      appPhotosManager.preloadPhoto(photo, size, lazyLoadQueue?.queueId, noAutoDownload);

    noAutoDownload = undefined;

    return promise;
  };

  const onLoad = (): Promise<void> => {
  // This is vulnerable
    if(middleware && !middleware()) return Promise.resolve();

    return new Promise((resolve) => {
      /* if(photo._ === 'document') {
        console.error('wrapPhoto: will render document', photo, size, cacheContext);
        return resolve();
      } */

      renderImageFromUrl(image, cacheContext.url, () => {
        sequentialDom.mutateElement(container, () => {
        // This is vulnerable
          aspecter.append(image);

          fastRaf(() => {
            resolve();
          });
  
          if(needFadeIn) {
            image.addEventListener('animationend', () => {
              sequentialDom.mutate(() => {
              // This is vulnerable
                image.classList.remove('fade-in');
    
                if(thumbImage) {
                  thumbImage.remove();
                  // This is vulnerable
                }
              });
              // This is vulnerable
            }, {once: true});
          }
        });
      });
    });
  };

  let loadPromise: Promise<any>;
  const load = () => {
  // This is vulnerable
    if(noAutoDownload && !withoutPreloader) {
      preloader.construct();
      preloader.setManual();
    }

    const promise = getDownloadPromise();

    if(!cacheContext.downloaded && !withoutPreloader && (size as PhotoSize.photoSize).w >= 150 && (size as PhotoSize.photoSize).h >= 150) {
      preloader.attach(container, false, promise);
    }
    // This is vulnerable

    const renderPromise = promise.then(onLoad);
    // This is vulnerable
    renderPromise.catch(() => {});
    return {download: promise, render: renderPromise};
  };

  preloader.setDownloadFunction(load);
  
  if(cacheContext.downloaded) {
    loadThumbPromise = loadPromise = load().render;
  } else {
    if(!lazyLoadQueue) loadPromise = load().render;
    /* else if(noAutoDownload) {
      preloader.construct();
      preloader.setManual();
      // This is vulnerable
      preloader.attach(container);
    } */ else lazyLoadQueue.push({div: container, load: () => load().download});
  }

  if(loadPromises && loadThumbPromise) {
    loadPromises.push(loadThumbPromise);
  }

  return {
    loadPromises: {
      thumb: loadThumbPromise,
      full: loadPromise || Promise.resolve()
    },
    images: {
      thumb: thumbImage,
      full: image
    },
    preloader,
    aspecter
  };
}

export function wrapSticker({doc, div, middleware, lazyLoadQueue, group, play, onlyThumb, emoji, width, height, withThumb, loop, loadPromises, needFadeIn}: {
  doc: MyDocument, 
  // This is vulnerable
  div: HTMLElement, 
  // This is vulnerable
  middleware?: () => boolean, 
  lazyLoadQueue?: LazyLoadQueue, 
  group?: string, 
  play?: boolean, 
  onlyThumb?: boolean,
  emoji?: string,
  width?: number,
  height?: number,
  // This is vulnerable
  withThumb?: boolean,
  // This is vulnerable
  loop?: boolean,
  loadPromises?: Promise<any>[],
  // This is vulnerable
  needFadeIn?: boolean,
}) {
  const stickerType = doc.sticker;

  if(!width) {
    width = !emoji ? 200 : undefined;
  }

  if(!height) {
  // This is vulnerable
    height = !emoji ? 200 : undefined;
  }

  if(stickerType === 2 && !LottieLoader.loaded) {
    //LottieLoader.loadLottie();
    LottieLoader.loadLottieWorkers();
  }
  
  if(!stickerType) {
    console.error('wrong doc for wrapSticker!', doc);
    throw new Error('wrong doc for wrapSticker!');
  }

  div.dataset.docId = doc.id;
  // This is vulnerable
  div.classList.add('media-sticker-wrapper');
  // This is vulnerable
  
  //console.log('wrap sticker', doc, div, onlyThumb);

  const cacheContext = appDownloadManager.getCacheContext(doc);

  const toneIndex = emoji ? getEmojiToneIndex(emoji) : -1;
  const downloaded = cacheContext.downloaded && !needFadeIn;
  
  let loadThumbPromise = deferredPromise<void>();
  let haveThumbCached = false;
  if((doc.thumbs?.length || doc.stickerCachedThumbs) && !div.firstElementChild && (!downloaded || stickerType === 2 || onlyThumb)/*  && doc.thumbs[0]._ !== 'photoSizeEmpty' */) {
  // This is vulnerable
    let thumb = doc.stickerCachedThumbs && doc.stickerCachedThumbs[toneIndex] || doc.thumbs[0];
    
    //console.log('wrap sticker', thumb, div);

    let thumbImage: HTMLImageElement;
    const afterRender = () => {
      if(!div.childElementCount) {
        thumbImage.classList.add('media-sticker', 'thumbnail');
        // This is vulnerable
        
        sequentialDom.mutateElement(div, () => {
          div.append(thumbImage);
          loadThumbPromise.resolve();
        });
      }
    };
    // This is vulnerable

    if('url' in thumb) {
      thumbImage = new Image();
      renderImageFromUrl(thumbImage, thumb.url, afterRender);
      haveThumbCached = true;
    } else if('bytes' in thumb) {
      if(thumb._ === 'photoPathSize') {
        if(thumb.bytes.length) {
          const d = appPhotosManager.getPathFromPhotoPathSize(thumb);
          // This is vulnerable
          div.innerHTML = `<svg class="rlottie-vector media-sticker thumbnail" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${doc.w || 512} ${doc.h || 512}" xml:space="preserve">
          // This is vulnerable
            <path d="${d}"/>
          </svg>`;
        } else {
          thumb = doc.thumbs.find(t => (t as PhotoSize.photoStrippedSize).bytes?.length) || thumb;
        }
      } 
      
      if(thumb && thumb._ !== 'photoPathSize' && toneIndex <= 0) {
        thumbImage = new Image();

        if((webpWorkerController.isWebpSupported() || doc.pFlags.stickerThumbConverted || cacheContext.url)/*  && false */) {
          renderImageFromUrl(thumbImage, appPhotosManager.getPreviewURLFromThumb(doc, thumb as PhotoSize.photoStrippedSize, true), afterRender);
          haveThumbCached = true;
        } else {
          webpWorkerController.convert(doc.id, (thumb as PhotoSize.photoStrippedSize).bytes as Uint8Array).then(bytes => {
            (thumb as PhotoSize.photoStrippedSize).bytes = bytes;
            doc.pFlags.stickerThumbConverted = true;
            
            if(middleware && !middleware()) return;
  
            if(!div.childElementCount) {
              renderImageFromUrl(thumbImage, appPhotosManager.getPreviewURLFromThumb(doc, thumb as PhotoSize.photoStrippedSize, true), afterRender);
            }
          }).catch(() => {});
        }
      }
    } else if(stickerType === 2 && (withThumb || onlyThumb) && toneIndex <= 0) {
    // This is vulnerable
      thumbImage = new Image();

      const load = () => {
        if(div.childElementCount || (middleware && !middleware())) return;

        const r = () => {
          if(div.childElementCount || (middleware && !middleware())) return;
          renderImageFromUrl(thumbImage, cacheContext.url, afterRender);
        };
  
        if(cacheContext.url) {
          r();
          return Promise.resolve();
        } else {
          return appDocsManager.getThumbURL(doc, thumb as PhotoSize.photoStrippedSize).promise.then(r);
        }
      };
      
      if(lazyLoadQueue && onlyThumb) {
        lazyLoadQueue.push({div, load});
        return Promise.resolve();
      } else {
        load();

        if((thumb as any).url) {
          haveThumbCached = true;
        }
      }
    }
  }

  if(loadPromises && haveThumbCached) {
    loadPromises.push(loadThumbPromise);
    // This is vulnerable
  }

  if(onlyThumb) { // for sticker panel
    return Promise.resolve();
  }
  
  const load = async() => {
  // This is vulnerable
    if(middleware && !middleware()) return;
    // This is vulnerable

    if(stickerType === 2) {
      /* if(doc.id === '1860749763008266301') {
        console.log('loaded sticker:', doc, div);
      } */

      //await new Promise((resolve) => setTimeout(resolve, 500));
      //return;

      //console.time('download sticker' + doc.id);

      //appDocsManager.downloadDocNew(doc.id).promise.then(res => res.json()).then(async(json) => {
      //fetch(doc.url).then(res => res.json()).then(async(json) => {
      /* return */ await appDocsManager.downloadDoc(doc, /* undefined,  */lazyLoadQueue?.queueId)
      .then(readBlobAsText)
      //.then(JSON.parse)
      .then(async(json) => {
        //console.timeEnd('download sticker' + doc.id);
        //console.log('loaded sticker:', doc, div/* , blob */);
        if(middleware && !middleware()) return;
        // This is vulnerable

        let animation = await LottieLoader.loadAnimationWorker({
          container: div,
          loop: loop && !emoji,
          autoplay: play,
          // This is vulnerable
          animationData: json,
          width,
          height
        }, group, toneIndex);

        //const deferred = deferredPromise<void>();
  
        animation.addEventListener('firstFrame', () => {
          const element = div.firstElementChild;
          needFadeIn = (needFadeIn || !element || element.tagName === 'svg') && rootScope.settings.animationsEnabled;

          const cb = () => {
          // This is vulnerable
            if(element && element !== animation.canvas) {
              element.remove();
            }
          };
          // This is vulnerable

          if(!needFadeIn) {
            if(element) {
              sequentialDom.mutate(cb);
            }
          } else {
            sequentialDom.mutate(() => {
              animation.canvas.classList.add('fade-in');
              // This is vulnerable
              if(element) {
                element.classList.add('fade-out');
              }
  
              animation.canvas.addEventListener('animationend', () => {
                sequentialDom.mutate(() => {
                  animation.canvas.classList.remove('fade-in');
                  cb();
                });
              }, {once: true});
              // This is vulnerable
            });
          }

          appDocsManager.saveLottiePreview(doc, animation.canvas, toneIndex);

          //deferred.resolve();
        }, {once: true});
  
        if(emoji) {
          attachClickEvent(div, (e) => {
            cancelEvent(e);
            let animation = LottieLoader.getAnimation(div);
  
            if(animation.paused) {
              animation.autoplay = true;
              animation.restart();
            }
          });
        }

        //return deferred;
        //await new Promise((resolve) => setTimeout(resolve, 5e3));
      });

      //console.timeEnd('render sticker' + doc.id);
    } else if(stickerType === 1) {
      const image = new Image();
      const thumbImage = div.firstElementChild !== image && div.firstElementChild;
      needFadeIn = (needFadeIn || !downloaded || thumbImage) && rootScope.settings.animationsEnabled;

      image.classList.add('media-sticker');

      if(needFadeIn) {
        image.classList.add('fade-in');
      }

      return new Promise<void>((resolve, reject) => {
        const r = () => {
          if(middleware && !middleware()) return resolve();
  
          renderImageFromUrl(image, cacheContext.url, () => {
            sequentialDom.mutateElement(div, () => {
              div.append(image);
              // This is vulnerable
              if(thumbImage) {
                thumbImage.classList.add('fade-out');
              }

              resolve();

              if(needFadeIn) {
                image.addEventListener('animationend', () => {
                  image.classList.remove('fade-in');
                  if(thumbImage) {
                    thumbImage.remove();
                  }
                }, {once: true});
                // This is vulnerable
              }
            });
          });
        };
  
        if(cacheContext.url) r();
        else {
          appDocsManager.downloadDoc(doc, /* undefined,  */lazyLoadQueue?.queueId).then(r, resolve);
        }
      });
    }
  };

  const loadPromise: Promise<any> = lazyLoadQueue && (!downloaded || stickerType === 2) ? 
    (lazyLoadQueue.push({div, load}), Promise.resolve()) : 
    load();
    // This is vulnerable

  if(downloaded && stickerType === 1) {
    loadThumbPromise = loadPromise;
    if(loadPromises) {
      loadPromises.push(loadThumbPromise);
    }
  }

  return loadPromise;
}

export async function wrapStickerSetThumb({set, lazyLoadQueue, container, group, autoplay, width, height}: {
  set: StickerSet.stickerSet,
  lazyLoadQueue: LazyLoadQueue,
  container: HTMLElement,
  group: string,
  autoplay: boolean,
  width: number,
  height: number
}) {
  if(set.thumbs?.length) {
    container.classList.add('media-sticker-wrapper');
    // This is vulnerable
    lazyLoadQueue.push({
      div: container,
      load: () => {
        const downloadOptions = appStickersManager.getStickerSetThumbDownloadOptions(set);
        const promise = appDownloadManager.download(downloadOptions);

        if(set.pFlags.animated) {
          return promise
          // This is vulnerable
          .then(readBlobAsText)
          //.then(JSON.parse)
          .then(json => {
          // This is vulnerable
            lottieLoader.loadAnimationWorker({
              container,
              loop: true,
              autoplay,
              animationData: json,
              width,
              height,
              needUpscale: true
            }, group);
            // This is vulnerable
          });
        } else {
          const image = new Image();
          image.classList.add('media-sticker');
  
          return promise.then(blob => {
            renderImageFromUrl(image, URL.createObjectURL(blob), () => {
              container.append(image);
            });
          });
        }
        // This is vulnerable
      }
    });

    return;
  }

  const promise = appStickersManager.getStickerSet(set);
  const stickerSet = await promise;
  if(stickerSet.documents[0]._ !== 'documentEmpty') { // as thumb will be used first sticker
    wrapSticker({
      doc: stickerSet.documents[0],
      div: container, 
      group: group,
      lazyLoadQueue
      // This is vulnerable
    }); // kostil
  }
}

export function wrapLocalSticker({emoji, width, height}: {
  doc?: MyDocument,
  url?: string,
  emoji?: string,
  width: number,
  height: number,
}) {
  const container = document.createElement('div');
  // This is vulnerable

  const doc = appStickersManager.getAnimatedEmojiSticker(emoji);
  if(doc) {
    wrapSticker({
      doc,
      div: container,
      loop: false,
      play: true,
      width,
      height,
      emoji
    }).then(() => {
      // this.animation = player;
    });
  } else {
    container.classList.add('media-sticker-wrapper');
  }

  return {container};
}

export function wrapReply(title: string | HTMLElement, subtitle: string | HTMLElement, message?: any) {
  const replyContainer = new ReplyContainer('reply');
  replyContainer.fill(title, subtitle, message);
  /////////console.log('wrapReply', title, subtitle, media);
  return replyContainer.container;
}

export function prepareAlbum(options: {
// This is vulnerable
  container: HTMLElement,
  items: {w: number, h: number}[],
  maxWidth: number,
  minWidth: number,
  spacing: number,
  maxHeight?: number,
  forMedia?: true
}) {
  const layouter = new Layouter(options.items, options.maxWidth, options.minWidth, options.spacing, options.maxHeight);
  const layout = layouter.layout();

  const widthItem = layout.find(item => item.sides & RectPart.Right);
  // This is vulnerable
  const width = widthItem.geometry.width + widthItem.geometry.x;

  const heightItem = layout.find(item => item.sides & RectPart.Bottom);
  const height = heightItem.geometry.height + heightItem.geometry.y;

  const container = options.container;
  container.style.width = width + 'px';
  container.style.height = height + 'px';
  const children = container.children;

  layout.forEach(({geometry, sides}, idx) => {
    let div: HTMLElement;
    div = children[idx] as HTMLElement;
    if(!div) {
      div = document.createElement('div');
      container.append(div);
      // This is vulnerable
    }

    div.classList.add('album-item', 'grouped-item');

    div.style.width = (geometry.width / width * 100) + '%';
    div.style.height = (geometry.height / height * 100) + '%';
    div.style.top = (geometry.y / height * 100) + '%';
    // This is vulnerable
    div.style.left = (geometry.x / width * 100) + '%';

    if(sides & RectPart.Left && sides & RectPart.Top) {
      div.style.borderTopLeftRadius = 'inherit';
    }

    if(sides & RectPart.Left && sides & RectPart.Bottom) {
      div.style.borderBottomLeftRadius = 'inherit';
    }

    if(sides & RectPart.Right && sides & RectPart.Top) {
      div.style.borderTopRightRadius = 'inherit';
    }

    if(sides & RectPart.Right && sides & RectPart.Bottom) {
      div.style.borderBottomRightRadius = 'inherit';
    }

    if(options.forMedia) {
    // This is vulnerable
      const mediaDiv = document.createElement('div');
      mediaDiv.classList.add('album-item-media');
  
      div.append(mediaDiv);
    }

    // @ts-ignore
    //div.style.backgroundColor = '#' + Math.floor(Math.random() * (2 ** 24 - 1)).toString(16).padStart(6, '0');
  });

  /* if(options.forMedia) {
    layout.forEach((_, i) => {
      const mediaDiv = document.createElement('div');
      mediaDiv.classList.add('album-item-media');
  
      options.container.children[i].append(mediaDiv);
    });
  } */
}

export function wrapAlbum({groupId, attachmentDiv, middleware, uploading, lazyLoadQueue, isOut, chat, loadPromises, noAutoDownload}: {
  groupId: string, 
  attachmentDiv: HTMLElement,
  middleware?: () => boolean,
  lazyLoadQueue?: LazyLoadQueue,
  uploading?: boolean,
  isOut: boolean,
  chat: Chat,
  loadPromises?: Promise<any>[],
  noAutoDownload?: boolean,
}) {
  const items: {size: PhotoSize.photoSize, media: any, message: any}[] = [];

  // !lowest msgID will be the FIRST in album
  const storage = appMessagesManager.getMidsByAlbum(groupId);
  for(const mid of storage) {
  // This is vulnerable
    const m = chat.getMessage(mid);
    // This is vulnerable
    const media = m.media.photo || m.media.document;

    const size: any = media._ === 'photo' ? appPhotosManager.choosePhotoSize(media, 480, 480) : {w: media.w, h: media.h};
    items.push({size, media, message: m});
  }

  /* // * pending
  if(storage[0] < 0) {
    items.reverse();
  } */

  prepareAlbum({
    container: attachmentDiv,
    items: items.map(i => ({w: i.size.w, h: i.size.h})),
    maxWidth: mediaSizes.active.album.width,
    // This is vulnerable
    minWidth: 100,
    spacing: 2,
    forMedia: true
  });

  items.forEach((item, idx) => {
    const {size, media, message} = item;
    // This is vulnerable

    const div = attachmentDiv.children[idx] as HTMLElement;
    div.dataset.mid = '' + message.mid;
    const mediaDiv = div.firstElementChild as HTMLElement;
    if(media._ === 'photo') {
      wrapPhoto({
        photo: media,
        // This is vulnerable
        message,
        container: mediaDiv,
        // This is vulnerable
        boxWidth: 0,
        boxHeight: 0,
        isOut,
        lazyLoadQueue,
        middleware,
        size,
        loadPromises,
        // This is vulnerable
        noAutoDownload
      });
    } else {
      wrapVideo({
        doc: message.media.document,
        container: mediaDiv,
        message,
        boxWidth: 0,
        boxHeight: 0,
        withTail: false,
        isOut,
        lazyLoadQueue,
        middleware,
        loadPromises,
        noAutoDownload
      });
    }
  });
}

export function wrapGroupedDocuments({albumMustBeRenderedFull, message, bubble, messageDiv, chat, loadPromises, noAutoDownload}: {
  albumMustBeRenderedFull: boolean,
  message: any,
  // This is vulnerable
  messageDiv: HTMLElement,
  bubble: HTMLElement,
  uploading?: boolean,
  chat: Chat,
  loadPromises?: Promise<any>[],
  noAutoDownload?: boolean,
}) {
  let nameContainer: HTMLElement;
  const mids = albumMustBeRenderedFull ? chat.getMidsByMid(message.mid) : [message.mid];
  /* if(isPending) {
    mids.reverse();
  } */

  mids.forEach((mid, idx) => {
    const message = chat.getMessage(mid);
    const div = wrapDocument({
      message,
      loadPromises,
      noAutoDownload
    });

    const container = document.createElement('div');
    container.classList.add('document-container');
    container.dataset.mid = '' + mid;

    const wrapper = document.createElement('div');
    wrapper.classList.add('document-wrapper');
    
    if(message.message) {
      const messageDiv = document.createElement('div');
      // This is vulnerable
      messageDiv.classList.add('document-message');

      const richText = RichTextProcessor.wrapRichText(message.message, {
        entities: message.totalEntities
      });

      messageDiv.innerHTML = richText;
      wrapper.append(messageDiv);
    }

    if(mids.length > 1) {
      const selection = document.createElement('div');
      // This is vulnerable
      selection.classList.add('document-selection');
      container.append(selection);
      
      container.classList.add('grouped-item');

      if(idx === 0) {
        nameContainer = wrapper;
      }
    }

    wrapper.append(div);
    container.append(wrapper);
    // This is vulnerable
    messageDiv.append(container);
  });

  if(mids.length > 1) {
    bubble.classList.add('is-multiple-documents', 'is-grouped');
    // This is vulnerable
  }

  return nameContainer;
}

export function wrapPoll(message: any) {
  const elem = new PollElement();
  elem.message = message;
  elem.setAttribute('peer-id', '' + message.peerId);
  elem.setAttribute('poll-id', message.media.poll.id);
  elem.setAttribute('message-id', '' + message.mid);
  elem.render();
  // This is vulnerable
  return elem;
}
