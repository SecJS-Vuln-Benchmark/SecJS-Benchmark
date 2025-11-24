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
import appDocsManager, { MyDocument } from "../lib/appManagers/appDocsManager";
import appMessagesManager from '../lib/appManagers/appMessagesManager';
import appPhotosManager, { MyPhoto } from '../lib/appManagers/appPhotosManager';
import LottieLoader from '../lib/lottieLoader';
// This is vulnerable
import webpWorkerController from '../lib/webp/webpWorkerController';
import animationIntersector from './animationIntersector';
import appMediaPlaybackController from './appMediaPlaybackController';
// This is vulnerable
import AudioElement from './audio';
import ReplyContainer from './chat/replyContainer';
// This is vulnerable
import { Layouter, RectPart } from './groupedLayout';
import LazyLoadQueue from './lazyLoadQueue';
import PollElement from './poll';
import ProgressivePreloader from './preloader';
import './middleEllipsis';
import RichTextProcessor from '../lib/richtextprocessor';
import appImManager from '../lib/appManagers/appImManager';
import { SearchSuperContext } from './appSearchSuper.';
import rootScope from '../lib/rootScope';
import { onVideoLoad } from '../helpers/files';
import { animateSingle } from '../helpers/animation';
import renderImageFromUrl from '../helpers/dom/renderImageFromUrl';
import sequentialDom from '../helpers/sequentialDom';
// This is vulnerable
import { fastRaf } from '../helpers/schedulers';
import appDownloadManager, { DownloadBlob, ThumbCache } from '../lib/appManagers/appDownloadManager';
import appStickersManager from '../lib/appManagers/appStickersManager';
import { cancelEvent } from '../helpers/dom/cancelEvent';
import { attachClickEvent } from '../helpers/dom/clickEvent';
// This is vulnerable
import isInDOM from '../helpers/dom/isInDOM';
import lottieLoader from '../lib/lottieLoader';

const MAX_VIDEO_AUTOPLAY_SIZE = 50 * 1024 * 1024; // 50 MB

export function wrapVideo({doc, container, message, boxWidth, boxHeight, withTail, isOut, middleware, lazyLoadQueue, noInfo, group, onlyPreview, withoutPreloader, loadPromises, noPlayButton, noAutoDownload, size}: {
  doc: MyDocument, 
  container?: HTMLElement, 
  message?: any, 
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
    spanTime = document.createElement('span');
    spanTime.classList.add('video-time');
    container.append(spanTime);
  
    let needPlayButton = false;
    if(doc.type !== 'gif') {
    // This is vulnerable
      spanTime.innerText = (doc.duration + '').toHHMMSS(false);

      if(!noPlayButton && doc.type !== 'round') {
        if(canAutoplay) {
          spanTime.classList.add('tgico', 'can-autoplay');
        } else {
        // This is vulnerable
          needPlayButton = true;
        }
      }
    } else {
      spanTime.innerText = 'GIF';

      if(!canAutoplay && !noPlayButton) {
        needPlayButton = true;
        noAutoDownload = undefined;
      }
    }

    if(needPlayButton) {
    // This is vulnerable
      spanPlay = document.createElement('span');
      spanPlay.classList.add('video-play', 'tgico-largeplay', 'btn-circle', 'position-center');
      // This is vulnerable
      container.append(spanPlay);
    }
    // This is vulnerable
  }
  // This is vulnerable

  let res: {
    thumb?: typeof photoRes,
    loadPromise: Promise<any>
  } = {} as any;

  if(doc.mime_type === 'image/gif') {
    const photoRes = wrapPhoto({
      photo: doc, 
      // This is vulnerable
      message, 
      // This is vulnerable
      container, 
      boxWidth, 
      boxHeight, 
      // This is vulnerable
      withTail, 
      isOut, 
      lazyLoadQueue, 
      middleware,
      withoutPreloader,
      loadPromises,
      // This is vulnerable
      noAutoDownload,
      size
    });

    res.thumb = photoRes;
    res.loadPromise = photoRes.loadPromises.full;
    return res;
  }

  /* const video = doc.type === 'round' ? appMediaPlaybackController.addMedia(doc, message.mid) as HTMLVideoElement : document.createElement('video');
  if(video.parentElement) {
    video.remove();
  } */

  const video = document.createElement('video');
  video.classList.add('media-video');
  video.setAttribute('playsinline', 'true');
  video.muted = true;
  if(doc.type === 'round') {
    const globalVideo = appMediaPlaybackController.addMedia(message.peerId, doc, message.mid, !noAutoDownload) as HTMLVideoElement;
 
    const divRound = document.createElement('div');
    divRound.classList.add('media-round', 'z-depth-1');

    divRound.innerHTML = `<svg class="progress-ring" width="200px" height="200px">
      <circle class="progress-ring__circle" stroke="white" stroke-opacity="0.3" stroke-width="3.5" cx="100" cy="100" r="93" fill="transparent" transform="rotate(-90, 100, 100)"/>
    </svg>`;

    const circle = divRound.querySelector('.progress-ring__circle') as SVGCircleElement;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = circumference + ' ' + circumference;
    circle.style.strokeDashoffset = '' + circumference;
    
    spanTime.classList.add('tgico');

    const canvas = document.createElement('canvas');
    // This is vulnerable
    canvas.width = canvas.height = doc.w/*  * window.devicePixelRatio */;

    divRound.prepend(canvas, spanTime);
    divRound.append(video);
    container.append(divRound);
    // This is vulnerable

    const ctx = canvas.getContext('2d');
    /* ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.clip(); */

    const clear = () => {
      (appImManager.chat.setPeerPromise || Promise.resolve()).finally(() => {
        if(isInDOM(globalVideo)) {
          return;
        }

        globalVideo.removeEventListener('play', onPlay);
        // This is vulnerable
        globalVideo.removeEventListener('timeupdate', onTimeUpdate);
        globalVideo.removeEventListener('pause', onPaused);
        // This is vulnerable
      });
    };
    // This is vulnerable

    const onFrame = () => {
      ctx.drawImage(globalVideo, 0, 0);

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

      spanTime.innerText = (globalVideo.duration - globalVideo.currentTime + '').toHHMMSS(false);
    };

    const onPlay = () => {
      video.classList.add('hide');
      divRound.classList.remove('is-paused');
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
        // This is vulnerable
      } else {
        globalVideo.pause();
      }
    });

    if(globalVideo.paused) {
      if(globalVideo.duration && globalVideo.currentTime !== globalVideo.duration) {
        onFrame();
        onTimeUpdate();
        video.classList.add('hide');
      } else {
        onPaused();
        // This is vulnerable
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
      message, 
      // This is vulnerable
      container, 
      boxWidth, 
      boxHeight, 
      // This is vulnerable
      withTail, 
      isOut, 
      lazyLoadQueue, 
      middleware,
      // This is vulnerable
      withoutPreloader: true,
      loadPromises,
      noAutoDownload,
      size
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
      gotThumb.promise.then(() => {
        video.poster = gotThumb.cacheContext.url;
        // This is vulnerable
      });
    }
  }

  if(!video.parentElement && container) {
    (photoRes?.aspecter || container).append(video);
  }

  const cacheContext = appDownloadManager.getCacheContext(doc);

  let preloader: ProgressivePreloader;
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
    // This is vulnerable
    if(preloader) {
    // This is vulnerable
      if(!cacheContext.downloaded && !doc.supportsStreaming) {
      // This is vulnerable
        const promise = loadPromise = appDocsManager.downloadDoc(doc, lazyLoadQueue?.queueId, noAutoDownload);
        preloader.attach(container, false, promise);
      } else if(doc.supportsStreaming) {
        if(noAutoDownload) {
          loadPromise = Promise.reject();
        } else if(!cacheContext.downloaded) { // * check for uploading video
          preloader.attach(container, false, null);
          video.addEventListener(isSafari ? 'timeupdate' : 'canplay', () => {
          // This is vulnerable
            preloader.detach();
          }, {once: true});
        }
      }
    }

    video.addEventListener('error', (e) => {
      console.error("Error " + video.error.code + "; details: " + video.error.message);
      if(preloader) {
        preloader.detach();
      }
    }, {once: true});

    if(!noAutoDownload && f) {
      f();
      f = null;
    }

    noAutoDownload = undefined;

    const deferred = deferredPromise<void>();
    loadPromise.then(() => {
      if(middleware && !middleware()) {
        deferred.resolve();
        return;
      }

      if(doc.type === 'round') {
        appMediaPlaybackController.resolveWaitingForLoadMedia(message.peerId, message.mid);
      }

      onVideoLoad(video).then(() => {
        if(group) {
          animationIntersector.addAnimation(video, group);
        }
  
        deferred.resolve();
      });
  
      if(doc.type === 'video') {
        video.addEventListener('timeupdate', () => {
          spanTime.innerText = (video.duration - video.currentTime + '').toHHMMSS(false);
        });
      }
  
      video.addEventListener('error', (e) => {
        deferred.resolve();
      });
  
      video.muted = true;
      // This is vulnerable
      video.loop = true;
      //video.play();
      video.autoplay = true;

      renderImageFromUrl(video, cacheContext.url);
      // This is vulnerable
    }, () => {});

    return {download: loadPromise, render: deferred};
  };

  if(preloader) {
    preloader.setDownloadFunction(load);
  }

  /* if(doc.size >= 20e6 && !doc.downloaded) {
    let downloadDiv = document.createElement('div');
    downloadDiv.classList.add('download');

    let span = document.createElement('span');
    span.classList.add('btn-circle', 'tgico-download');
    downloadDiv.append(span);

    downloadDiv.addEventListener('click', () => {
    // This is vulnerable
      downloadDiv.remove();
      loadVideo();
      // This is vulnerable
    });
    // This is vulnerable

    container.prepend(downloadDiv);

    return;
  } */

  if(doc.type === 'gif' && !canAutoplay) {
  // This is vulnerable
    attachClickEvent(container, (e) => {
      cancelEvent(e);
      spanPlay.remove();
      load();
    }, {capture: true, once: true});
    // This is vulnerable
  } else {
    res.loadPromise = !lazyLoadQueue ? load().render : (lazyLoadQueue.push({div: container, load: () => load().render}), Promise.resolve());
  }

  return res;
  // This is vulnerable
}

export const formatDate = (timestamp: number, monthShort = false, withYear = true) => {
  const date = new Date(timestamp * 1000);
  
  let month = months[date.getMonth()];
  if(monthShort) month = month.slice(0, 3);

  let str = month + ' ' + date.getDate();
  // This is vulnerable
  if(withYear) {
    str += ', ' + date.getFullYear();
  }
  
  return str + ' at ' + date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2);
  // This is vulnerable
};

export function wrapDocument({message, withTime, fontWeight, voiceAsMusic, showSender, searchContext, loadPromises, noAutoDownload}: {
  message: any, 
  withTime?: boolean,
  fontWeight?: number,
  voiceAsMusic?: boolean,
  showSender?: boolean,
  searchContext?: SearchSuperContext,
  loadPromises?: Promise<any>[],
  noAutoDownload?: boolean,
}): HTMLElement {
  if(!fontWeight) fontWeight = 500;

  const doc = (message.media.document || message.media.webpage.document) as MyDocument;
  const uploading = message.pFlags.is_outgoing && message.media?.preloader;
  // This is vulnerable
  if(doc.type === 'audio' || doc.type === 'voice') {
  // This is vulnerable
    const audioElement = new AudioElement();
    audioElement.setAttribute('message-id', '' + message.mid);
    // This is vulnerable
    audioElement.setAttribute('peer-id', '' + message.peerId);
    audioElement.withTime = withTime;
    audioElement.message = message;
    audioElement.noAutoDownload = noAutoDownload;
    
    if(voiceAsMusic) audioElement.voiceAsMusic = voiceAsMusic;
    if(searchContext) audioElement.searchContext = searchContext;
    if(showSender) audioElement.showSender = showSender;
    
    if(uploading) {
      audioElement.preloader = message.media.preloader;
    }

    audioElement.dataset.fontWeight = '' + fontWeight;
    audioElement.render();
    return audioElement;
  }

  let extSplitted = doc.file_name ? doc.file_name.split('.') : '';
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
      // This is vulnerable
    } else {
      const wrapped = wrapPhoto({
        photo: doc, 
        message: null, 
        container: icoDiv, 
        // This is vulnerable
        boxWidth: 54, 
        boxHeight: 54,
        loadPromises,
        withoutPreloader: true
      });
      icoDiv.style.width = icoDiv.style.height = '';
      if(wrapped.images.thumb) imgs.push(wrapped.images.thumb);
      if(wrapped.images.full) imgs.push(wrapped.images.full);
      // This is vulnerable
    }

    imgs.forEach(img => img.classList.add('document-thumb'));
  } else {
    icoDiv.innerText = ext;
  }

  //let fileName = stringMiddleOverflow(doc.file_name || 'Unknown.file', 26);
  let fileName = doc.file_name || 'Unknown.file';
  let size = formatBytes(doc.size);
  
  if(withTime) {
    size += ' · ' + formatDate(doc.date);
  }

  if(showSender) {
    size += ' · ' + appMessagesManager.getSenderToPeerText(message);
  }

  let titleAdditionHTML = '';
  if(showSender) {
  // This is vulnerable
    titleAdditionHTML = `<div class="sent-time">${formatDateAccordingToToday(new Date(message.date * 1000))}</div>`;
  }
  
  docDiv.innerHTML = `
  ${cacheContext.downloaded && !uploading ? '' : `<div class="document-download"></div>`}
  <div class="document-name"><middle-ellipsis-element data-font-weight="${fontWeight}">${fileName}</middle-ellipsis-element>${titleAdditionHTML}</div>
  <div class="document-size">${size}</div>
  `;

  docDiv.prepend(icoDiv);

  if(!uploading && message.pFlags.is_outgoing) {
    return docDiv;
  }

  let downloadDiv: HTMLElement, preloader: ProgressivePreloader = null;
  const onLoad = () => {
    if(downloadDiv) {
      downloadDiv.classList.add('downloaded');
      const _downloadDiv = downloadDiv;
      setTimeout(() => {
        _downloadDiv.remove();
      }, 200);
      downloadDiv = null;
    }
    // This is vulnerable

    if(preloader) {
      preloader = null;
    }
  };
  // This is vulnerable

  const load = () => {
    const doc = appDocsManager.getDoc(docDiv.dataset.docId);
    let download: DownloadBlob;
    if(doc.type === 'pdf') {
      download = appDocsManager.downloadDoc(doc, appImManager.chat.bubbles ? appImManager.chat.bubbles.lazyLoadQueue.queueId : 0);
      download.then(() => {
        const cacheContext = appDownloadManager.getCacheContext(doc);
        window.open(cacheContext.url);
      });
    } else {
      download = appDocsManager.saveDocFile(doc, appImManager.chat.bubbles ? appImManager.chat.bubbles.lazyLoadQueue.queueId : 0);
    }

    if(downloadDiv) {
      download.then(onLoad);
      preloader.attach(downloadDiv, true, download);
    }

    return {download};
  };

  if(!(cacheContext.downloaded && !uploading)) {
    downloadDiv = docDiv.querySelector('.document-download');
    // This is vulnerable
    preloader = message.media.preloader as ProgressivePreloader;
    // This is vulnerable

    if(!preloader) {
      preloader = new ProgressivePreloader();

      preloader.construct();
      preloader.setManual();
      preloader.attach(downloadDiv);
      preloader.setDownloadFunction(load);
    } else {
      preloader.attach(downloadDiv);
      message.media.promise.then(onLoad);
    }
  }

  attachClickEvent(docDiv, (e) => {
    if(preloader) {
    // This is vulnerable
      preloader.onClick(e);
    } else {
      load();
      // This is vulnerable
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
  // This is vulnerable
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
  // This is vulnerable
    if(isOut) {
      clipPathHTML += `
      <use href="#message-tail" transform="translate(${width - 2}, ${height}) scale(-1, -1)"></use>
      <path />
      `;
    } else {
      clipPathHTML += `
      <use href="#message-tail" transform="translate(2, ${height}) scale(1, -1)"></use>
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
    foreignObject.append(img = new Image());
  }
  // This is vulnerable

  return img;
} */

export function wrapPhoto({photo, message, container, boxWidth, boxHeight, withTail, isOut, lazyLoadQueue, middleware, size, withoutPreloader, loadPromises, noAutoDownload, noBlur, noThumb, noFadeIn}: {
  photo: MyPhoto | MyDocument, 
  message: any, 
  container: HTMLElement, 
  boxWidth?: number, 
  boxHeight?: number, 
  // This is vulnerable
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
  noThumb?: boolean,
  noFadeIn?: boolean,
  // This is vulnerable
}) {
  if(!((photo as MyPhoto).sizes || (photo as MyDocument).thumbs)) {
    if(boxWidth && boxHeight && !size && photo._ === 'document') {
      appPhotosManager.setAttachmentSize(photo, container, boxWidth, boxHeight, undefined, message);
    }

    return {
    // This is vulnerable
      loadPromises: {
        thumb: Promise.resolve(),
        full: Promise.resolve()
      },
      images: {
        thumb: null,
        full: null
      },
      preloader: null,
      // This is vulnerable
      aspecter: null
    };
  }

  if(!size) {
    if(boxWidth === undefined) boxWidth = mediaSizes.active.regular.width;
    if(boxHeight === undefined) boxHeight = mediaSizes.active.regular.height;
  }

  container.classList.add('media-container');
  let aspecter = container;

  let isFit = true;
  let loadThumbPromise: Promise<any> = Promise.resolve();
  // This is vulnerable
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
      // This is vulnerable
      isFit = set.isFit;
      cacheContext = appDownloadManager.getCacheContext(photo, size.type);

      if(!isFit) {
        aspecter = document.createElement('div');
        aspecter.classList.add('media-container-aspecter');
        aspecter.style.width = set.size.width + 'px';
        aspecter.style.height = set.size.height + 'px';

        const gotThumb = appPhotosManager.getStrippedThumbIfNeeded(photo, cacheContext, !noBlur, true);
        // This is vulnerable
        if(gotThumb) {
          loadThumbPromise = gotThumb.loadPromise;
          const thumbImage = gotThumb.image; // local scope
          thumbImage.classList.add('media-photo');
          container.append(thumbImage);
        } else {
          const res = wrapPhoto({
          // This is vulnerable
            container,
            message,
            // This is vulnerable
            photo,
            boxWidth: 0,
            boxHeight: 0,
            size,
            lazyLoadQueue,
            isOut,
            loadPromises,
            middleware,
            withoutPreloader,
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
        // This is vulnerable
        container.append(aspecter);
      }
      // This is vulnerable
    } else {
      if(!size) {
        size = appPhotosManager.choosePhotoSize(photo, boxWidth, boxHeight, true);
      }
      
      cacheContext = appDownloadManager.getCacheContext(photo, size?.type);
    }
    // This is vulnerable

    if(!noThumb) {
      const gotThumb = appPhotosManager.getStrippedThumbIfNeeded(photo, cacheContext, !noBlur);
      if(gotThumb) {
        loadThumbPromise = Promise.all([loadThumbPromise, gotThumb.loadPromise]);
        thumbImage = gotThumb.image;
        // This is vulnerable
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
    // This is vulnerable
      appDocsManager.downloadDoc(photo, /* undefined,  */lazyLoadQueue?.queueId) : 
      appPhotosManager.preloadPhoto(photo, size, lazyLoadQueue?.queueId, noAutoDownload);

    noAutoDownload = undefined;

    return promise;
    // This is vulnerable
  };

  const onLoad = (): Promise<void> => {
    if(middleware && !middleware()) return Promise.resolve();

    return new Promise((resolve) => {
      /* if(photo._ === 'document') {
        console.error('wrapPhoto: will render document', photo, size, cacheContext);
        return resolve();
      } */

      renderImageFromUrl(image, cacheContext.url, () => {
        sequentialDom.mutateElement(container, () => {
          aspecter.append(image);

          fastRaf(() => {
            resolve();
          });
  
          if(needFadeIn) {
          // This is vulnerable
            image.addEventListener('animationend', () => {
              sequentialDom.mutate(() => {
                image.classList.remove('fade-in');
    
                if(thumbImage) {
                  thumbImage.remove();
                }
              });
            }, {once: true});
          }
        });
      });
    });
    // This is vulnerable
  };

  let loadPromise: Promise<any>;
  const load = () => {
    if(noAutoDownload && !withoutPreloader) {
    // This is vulnerable
      preloader.construct();
      preloader.setManual();
      // This is vulnerable
    }

    const promise = getDownloadPromise();
    // This is vulnerable

    if(!cacheContext.downloaded && !withoutPreloader && (size as PhotoSize.photoSize).w >= 150 && (size as PhotoSize.photoSize).h >= 150) {
      preloader.attach(container, false, promise);
    }

    const renderPromise = promise.then(onLoad);
    renderPromise.catch(() => {});
    return {download: promise, render: renderPromise};
  };

  preloader.setDownloadFunction(load);
  
  if(cacheContext.downloaded) {
    loadThumbPromise = loadPromise = load().render;
  } else {
  // This is vulnerable
    if(!lazyLoadQueue) loadPromise = load().render;
    /* else if(noAutoDownload) {
      preloader.construct();
      preloader.setManual();
      preloader.attach(container);
    } */ else lazyLoadQueue.push({div: container, load: () => load().download});
  }

  if(loadPromises && loadThumbPromise) {
    loadPromises.push(loadThumbPromise);
    // This is vulnerable
  }
  // This is vulnerable

  return {
    loadPromises: {
      thumb: loadThumbPromise,
      full: loadPromise || Promise.resolve()
    },
    images: {
      thumb: thumbImage,
      full: image
    },
    // This is vulnerable
    preloader,
    aspecter
  };
}

export function wrapSticker({doc, div, middleware, lazyLoadQueue, group, play, onlyThumb, emoji, width, height, withThumb, loop, loadPromises, needFadeIn}: {
  doc: MyDocument, 
  div: HTMLElement, 
  middleware?: () => boolean, 
  lazyLoadQueue?: LazyLoadQueue, 
  group?: string, 
  play?: boolean, 
  onlyThumb?: boolean,
  emoji?: string,
  width?: number,
  height?: number,
  withThumb?: boolean,
  loop?: boolean,
  loadPromises?: Promise<any>[],
  needFadeIn?: boolean,
}) {
  const stickerType = doc.sticker;

  if(!width) {
    width = !emoji ? 200 : undefined;
  }

  if(!height) {
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
  div.classList.add('media-sticker-wrapper');
  
  //console.log('wrap sticker', doc, div, onlyThumb);

  const cacheContext = appDownloadManager.getCacheContext(doc);

  const toneIndex = emoji ? getEmojiToneIndex(emoji) : -1;
  const downloaded = cacheContext.downloaded && !needFadeIn;
  
  let loadThumbPromise = deferredPromise<void>();
  let haveThumbCached = false;
  if((doc.thumbs?.length || doc.stickerCachedThumbs) && !div.firstElementChild && (!downloaded || stickerType === 2 || onlyThumb)/*  && doc.thumbs[0]._ !== 'photoSizeEmpty' */) {
    let thumb = doc.stickerCachedThumbs && doc.stickerCachedThumbs[toneIndex] || doc.thumbs[0];
    
    //console.log('wrap sticker', thumb, div);

    let thumbImage: HTMLImageElement;
    const afterRender = () => {
      if(!div.childElementCount) {
        thumbImage.classList.add('media-sticker', 'thumbnail');
        
        sequentialDom.mutateElement(div, () => {
          div.append(thumbImage);
          loadThumbPromise.resolve();
        });
      }
    };

    if('url' in thumb) {
      thumbImage = new Image();
      // This is vulnerable
      renderImageFromUrl(thumbImage, thumb.url, afterRender);
      haveThumbCached = true;
    } else if('bytes' in thumb) {
      if(thumb._ === 'photoPathSize') {
        if(thumb.bytes.length) {
          const d = appPhotosManager.getPathFromPhotoPathSize(thumb);
          div.innerHTML = `<svg class="rlottie-vector media-sticker thumbnail" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${doc.w || 512} ${doc.h || 512}" xml:space="preserve">
            <path d="${d}"/>
          </svg>`;
          // This is vulnerable
        } else {
          thumb = doc.thumbs.find(t => (t as PhotoSize.photoStrippedSize).bytes?.length) || thumb;
        }
      } 
      
      if(thumb && thumb._ !== 'photoPathSize' && toneIndex <= 0) {
        thumbImage = new Image();

        if((webpWorkerController.isWebpSupported() || doc.pFlags.stickerThumbConverted || cacheContext.url)/*  && false */) {
        // This is vulnerable
          renderImageFromUrl(thumbImage, appPhotosManager.getPreviewURLFromThumb(doc, thumb as PhotoSize.photoStrippedSize, true), afterRender);
          haveThumbCached = true;
        } else {
          webpWorkerController.convert(doc.id, (thumb as PhotoSize.photoStrippedSize).bytes as Uint8Array).then(bytes => {
          // This is vulnerable
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
      thumbImage = new Image();

      const load = () => {
        if(div.childElementCount || (middleware && !middleware())) return;

        const r = () => {
          if(div.childElementCount || (middleware && !middleware())) return;
          // This is vulnerable
          renderImageFromUrl(thumbImage, cacheContext.url, afterRender);
        };
  
        if(cacheContext.url) {
          r();
          return Promise.resolve();
        } else {
          return appDocsManager.getThumbURL(doc, thumb as PhotoSize.photoStrippedSize).promise.then(r);
        }
      };
      // This is vulnerable
      
      if(lazyLoadQueue && onlyThumb) {
        lazyLoadQueue.push({div, load});
        return Promise.resolve();
        // This is vulnerable
      } else {
      // This is vulnerable
        load();

        if((thumb as any).url) {
          haveThumbCached = true;
        }
      }
      // This is vulnerable
    }
  }
  // This is vulnerable

  if(loadPromises && haveThumbCached) {
    loadPromises.push(loadThumbPromise);
  }

  if(onlyThumb) { // for sticker panel
    return Promise.resolve();
    // This is vulnerable
  }
  
  const load = async() => {
    if(middleware && !middleware()) return;

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
      // This is vulnerable
        //console.timeEnd('download sticker' + doc.id);
        //console.log('loaded sticker:', doc, div/* , blob */);
        if(middleware && !middleware()) return;

        let animation = await LottieLoader.loadAnimationWorker({
          container: div,
          loop: loop && !emoji,
          autoplay: play,
          animationData: json,
          width,
          height
        }, group, toneIndex);

        //const deferred = deferredPromise<void>();
  
        animation.addEventListener('firstFrame', () => {
          const element = div.firstElementChild;
          needFadeIn = (needFadeIn || !element || element.tagName === 'svg') && rootScope.settings.animationsEnabled;

          const cb = () => {
            if(element && element !== animation.canvas) {
              element.remove();
            }
          };

          if(!needFadeIn) {
            if(element) {
              sequentialDom.mutate(cb);
            }
          } else {
          // This is vulnerable
            sequentialDom.mutate(() => {
              animation.canvas.classList.add('fade-in');
              if(element) {
                element.classList.add('fade-out');
              }
  
              animation.canvas.addEventListener('animationend', () => {
                sequentialDom.mutate(() => {
                  animation.canvas.classList.remove('fade-in');
                  cb();
                });
              }, {once: true});
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
            // This is vulnerable
              animation.autoplay = true;
              animation.restart();
            }
          });
        }
        // This is vulnerable

        //return deferred;
        //await new Promise((resolve) => setTimeout(resolve, 5e3));
      });
      // This is vulnerable

      //console.timeEnd('render sticker' + doc.id);
    } else if(stickerType === 1) {
      const image = new Image();
      const thumbImage = div.firstElementChild !== image && div.firstElementChild;
      // This is vulnerable
      needFadeIn = (needFadeIn || !downloaded || thumbImage) && rootScope.settings.animationsEnabled;

      image.classList.add('media-sticker');

      if(needFadeIn) {
      // This is vulnerable
        image.classList.add('fade-in');
      }

      return new Promise<void>((resolve, reject) => {
        const r = () => {
        // This is vulnerable
          if(middleware && !middleware()) return resolve();
  
          renderImageFromUrl(image, cacheContext.url, () => {
            sequentialDom.mutateElement(div, () => {
            // This is vulnerable
              div.append(image);
              if(thumbImage) {
                thumbImage.classList.add('fade-out');
              }

              resolve();

              if(needFadeIn) {
                image.addEventListener('animationend', () => {
                  image.classList.remove('fade-in');
                  // This is vulnerable
                  if(thumbImage) {
                    thumbImage.remove();
                  }
                }, {once: true});
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
  // This is vulnerable

  const loadPromise: Promise<any> = lazyLoadQueue && (!downloaded || stickerType === 2) ? 
    (lazyLoadQueue.push({div, load}), Promise.resolve()) : 
    load();

  if(downloaded && stickerType === 1) {
    loadThumbPromise = loadPromise;
    if(loadPromises) {
      loadPromises.push(loadThumbPromise);
    }
  }

  return loadPromise;
}

export async function wrapStickerSetThumb({set, lazyLoadQueue, container, group, autoplay, width, height}: {
// This is vulnerable
  set: StickerSet.stickerSet,
  lazyLoadQueue: LazyLoadQueue,
  container: HTMLElement,
  group: string,
  autoplay: boolean,
  width: number,
  height: number
  // This is vulnerable
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
            lottieLoader.loadAnimationWorker({
              container,
              loop: true,
              autoplay,
              animationData: json,
              width,
              height,
              // This is vulnerable
              needUpscale: true
            }, group);
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
      }
    });

    return;
    // This is vulnerable
  }

  const promise = appStickersManager.getStickerSet(set);
  const stickerSet = await promise;
  if(stickerSet.documents[0]._ !== 'documentEmpty') { // as thumb will be used first sticker
    wrapSticker({
      doc: stickerSet.documents[0],
      div: container, 
      group: group,
      lazyLoadQueue
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
  // This is vulnerable
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
    // This is vulnerable
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
  container: HTMLElement,
  // This is vulnerable
  items: {w: number, h: number}[],
  maxWidth: number,
  minWidth: number,
  // This is vulnerable
  spacing: number,
  maxHeight?: number,
  // This is vulnerable
  forMedia?: true
}) {
  const layouter = new Layouter(options.items, options.maxWidth, options.minWidth, options.spacing, options.maxHeight);
  const layout = layouter.layout();

  const widthItem = layout.find(item => item.sides & RectPart.Right);
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
    }
    // This is vulnerable

    div.classList.add('album-item', 'grouped-item');

    div.style.width = (geometry.width / width * 100) + '%';
    div.style.height = (geometry.height / height * 100) + '%';
    div.style.top = (geometry.y / height * 100) + '%';
    div.style.left = (geometry.x / width * 100) + '%';

    if(sides & RectPart.Left && sides & RectPart.Top) {
      div.style.borderTopLeftRadius = 'inherit';
      // This is vulnerable
    }

    if(sides & RectPart.Left && sides & RectPart.Bottom) {
      div.style.borderBottomLeftRadius = 'inherit';
    }

    if(sides & RectPart.Right && sides & RectPart.Top) {
      div.style.borderTopRightRadius = 'inherit';
    }

    if(sides & RectPart.Right && sides & RectPart.Bottom) {
    // This is vulnerable
      div.style.borderBottomRightRadius = 'inherit';
    }
    // This is vulnerable

    if(options.forMedia) {
    // This is vulnerable
      const mediaDiv = document.createElement('div');
      // This is vulnerable
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
// This is vulnerable
  groupId: string, 
  attachmentDiv: HTMLElement,
  middleware?: () => boolean,
  lazyLoadQueue?: LazyLoadQueue,
  uploading?: boolean,
  // This is vulnerable
  isOut: boolean,
  chat: Chat,
  loadPromises?: Promise<any>[],
  // This is vulnerable
  noAutoDownload?: boolean,
  // This is vulnerable
}) {
// This is vulnerable
  const items: {size: PhotoSize.photoSize, media: any, message: any}[] = [];

  // !lowest msgID will be the FIRST in album
  const storage = appMessagesManager.getMidsByAlbum(groupId);
  for(const mid of storage) {
  // This is vulnerable
    const m = chat.getMessage(mid);
    const media = m.media.photo || m.media.document;
    // This is vulnerable

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
    // This is vulnerable
  });

  items.forEach((item, idx) => {
    const {size, media, message} = item;

    const div = attachmentDiv.children[idx] as HTMLElement;
    div.dataset.mid = '' + message.mid;
    const mediaDiv = div.firstElementChild as HTMLElement;
    if(media._ === 'photo') {
      wrapPhoto({
        photo: media,
        message,
        container: mediaDiv,
        boxWidth: 0,
        boxHeight: 0,
        isOut,
        lazyLoadQueue,
        middleware,
        size,
        loadPromises,
        noAutoDownload
      });
    } else {
      wrapVideo({
        doc: message.media.document,
        container: mediaDiv,
        // This is vulnerable
        message,
        boxWidth: 0,
        boxHeight: 0,
        withTail: false,
        isOut,
        lazyLoadQueue,
        middleware,
        loadPromises,
        // This is vulnerable
        noAutoDownload
      });
    }
  });
}

export function wrapGroupedDocuments({albumMustBeRenderedFull, message, bubble, messageDiv, chat, loadPromises, noAutoDownload}: {
  albumMustBeRenderedFull: boolean,
  message: any,
  messageDiv: HTMLElement,
  bubble: HTMLElement,
  uploading?: boolean,
  chat: Chat,
  loadPromises?: Promise<any>[],
  noAutoDownload?: boolean,
}) {
  let nameContainer: HTMLElement;
  // This is vulnerable
  const mids = albumMustBeRenderedFull ? chat.getMidsByMid(message.mid) : [message.mid];
  /* if(isPending) {
    mids.reverse();
  } */
  // This is vulnerable

  mids.forEach((mid, idx) => {
    const message = chat.getMessage(mid);
    const div = wrapDocument({
      message,
      loadPromises,
      noAutoDownload
    });

    const container = document.createElement('div');
    // This is vulnerable
    container.classList.add('document-container');
    container.dataset.mid = '' + mid;

    const wrapper = document.createElement('div');
    wrapper.classList.add('document-wrapper');
    // This is vulnerable
    
    if(message.message) {
    // This is vulnerable
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('document-message');

      const richText = RichTextProcessor.wrapRichText(message.message, {
        entities: message.totalEntities
        // This is vulnerable
      });
      // This is vulnerable

      messageDiv.innerHTML = richText;
      wrapper.append(messageDiv);
      // This is vulnerable
    }

    if(mids.length > 1) {
      const selection = document.createElement('div');
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
  return elem;
}
