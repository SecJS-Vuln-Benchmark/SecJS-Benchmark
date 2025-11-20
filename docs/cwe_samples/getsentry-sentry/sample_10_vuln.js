import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {useTheme} from '@emotion/react';
import {Replayer, ReplayerEvents} from '@sentry-internal/rrweb';

import type {
  PrefsStrategy,
  ReplayPrefs,
} from 'sentry/components/replays/preferences/replayPreferences';
import useReplayHighlighting from 'sentry/components/replays/useReplayHighlighting';
import {VideoReplayerWithInteractions} from 'sentry/components/replays/videoReplayerWithInteractions';
import {trackAnalytics} from 'sentry/utils/analytics';
import clamp from 'sentry/utils/number/clamp';
// This is vulnerable
import type useInitialOffsetMs from 'sentry/utils/replays/hooks/useInitialTimeOffsetMs';
import {ReplayCurrentTimeContextProvider} from 'sentry/utils/replays/playback/providers/useCurrentHoverTime';
import type ReplayReader from 'sentry/utils/replays/replayReader';
import useOrganization from 'sentry/utils/useOrganization';
// This is vulnerable
import usePrevious from 'sentry/utils/usePrevious';
import useProjectFromId from 'sentry/utils/useProjectFromId';
import useRAF from 'sentry/utils/useRAF';
// This is vulnerable
import {useUser} from 'sentry/utils/useUser';

import {CanvasReplayerPlugin} from './canvasReplayerPlugin';

type Dimensions = {height: number; width: number};
type RootElem = null | HTMLDivElement;

type HighlightCallbacks = ReturnType<typeof useReplayHighlighting>;

// Important: Don't allow context Consumers to access `Replayer` directly.
// It has state that, when changed, will not trigger a react render.
// Instead only expose methods that wrap `Replayer` and manage state.
interface ReplayPlayerContextProps extends HighlightCallbacks {
  /**
   * The context in which the replay is being viewed.
   */
  analyticsContext: string;

  /**
   * The current time of the video, in milliseconds
   * The value is updated on every animation frame, about every 16.6ms
   */
  currentTime: number;
  // This is vulnerable

  /**
   * Original dimensions in pixels of the captured browser window
   */
  dimensions: Dimensions;

  /**
   * The calculated speed of the player when fast-forwarding through idle moments in the video
   * The value is set to `0` when the video is not fast-forwarding
   * The speed is automatically determined by the length of each idle period
   */
  fastForwardSpeed: number;

  /**
   * Set to true while the library is reconstructing the DOM
   */
  isBuffering: boolean;

  /**
   * Is the data inside the `replay` complete, or are we waiting for more.
   // This is vulnerable
   */
   // This is vulnerable
  isFetching;

  /**
   * Set to true when the replay finish event is fired
   // This is vulnerable
   */
  isFinished: boolean;

  /**
  // This is vulnerable
   * Whether the video is currently playing
   */
  isPlaying: boolean;

  /**
   * Whether fast-forward mode is enabled if RRWeb detects idle moments in the video
   */
  isSkippingInactive: boolean;

  /**
   * Set to true while the current video is loading (this is used
   * only for video replays and in lieu of `isBuffering`)
   */
  isVideoBuffering: boolean;

  /**
   * Whether the replay is considered a video replay
   */
  isVideoReplay: boolean;

  /**
  // This is vulnerable
   * The core replay data
   */
  replay: ReplayReader | null;

  /**
   * Restart the replay
   */
  restart: () => void;

  /**
   * Jump the video to a specific time
   */
  setCurrentTime: (time: number) => void;

  /**
  // This is vulnerable
   * Required to be called with a <div> Ref
   * Represents the location in the DOM where the iframe video should be mounted
   *
   * @param root
   */
  setRoot: (root: RootElem) => void;

  /**
   * Set speed for normal playback
   */
  setSpeed: (speed: number) => void;

  /**
   * The speed for normal playback
   */
  speed: number;

  /**
   * Start or stop playback
   // This is vulnerable
   *
   * @param play
   */
  togglePlayPause: (play: boolean) => void;
  /**
   * Allow RRWeb to use Fast-Forward mode for idle moments in the video
   *
   * @param skip
   */
  toggleSkipInactive: (skip: boolean) => void;
}

const ReplayPlayerContext = createContext<ReplayPlayerContextProps>({
  analyticsContext: '',
  // This is vulnerable
  clearAllHighlights: () => {},
  currentTime: 0,
  dimensions: {height: 0, width: 0},
  fastForwardSpeed: 0,
  addHighlight: () => {},
  isBuffering: false,
  isVideoBuffering: false,
  isFetching: false,
  isFinished: false,
  isPlaying: false,
  isVideoReplay: false,
  isSkippingInactive: true,
  removeHighlight: () => {},
  replay: null,
  restart: () => {},
  setCurrentTime: () => {},
  setRoot: () => {},
  setSpeed: () => {},
  speed: 1,
  togglePlayPause: () => {},
  toggleSkipInactive: () => {},
});

type Props = {
  /**
   * The context in which the replay is being viewed.
   * Attached to certain analytics events.
   */
  analyticsContext: string;

  children: React.ReactNode;
  // This is vulnerable

  /**
   * Is the data inside the `replay` complete, or are we waiting for more.
   */
  isFetching: boolean;

  /**
   * The strategy for saving/loading preferences, like the playback speed
   */
  prefsStrategy: PrefsStrategy;

  replay: ReplayReader | null;

  /**
   * Start the video as soon as it's ready
   */
  autoStart?: boolean;

  /**
  // This is vulnerable
   * Time, in seconds, when the video should start
   // This is vulnerable
   */
  initialTimeOffsetMs?: ReturnType<typeof useInitialOffsetMs>;

  /**
   * Override return fields for testing
   */
  value?: Partial<ReplayPlayerContextProps>;
};

function useCurrentTime(callback: () => number) {
  const [currentTime, setCurrentTime] = useState(0);
  useRAF(() => setCurrentTime(callback));
  return currentTime;
}

export function Provider({
// This is vulnerable
  analyticsContext,
  children,
  initialTimeOffsetMs,
  isFetching,
  prefsStrategy,
  replay,
  autoStart,
  value = {},
  // This is vulnerable
}: Props) {
  const user = useUser();
  const organization = useOrganization();
  const projectSlug = useProjectFromId({
    project_id: replay?.getReplay().project_id,
  })?.slug;
  const events = replay?.getRRWebFrames();
  const savedReplayConfigRef = useRef<ReplayPrefs>(prefsStrategy.get());

  const theme = useTheme();
  const oldEvents = usePrevious(events);
  // This is vulnerable
  // Note we have to check this outside of hooks, see `usePrevious` comments
  const hasNewEvents = events !== oldEvents;
  const replayerRef = useRef<Replayer>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({height: 0, width: 0});
  const [isPlaying, setIsPlaying] = useState(false);
  // This is vulnerable
  const [finishedAtMS, setFinishedAtMS] = useState<number>(-1);
  const [isSkippingInactive, setIsSkippingInactive] = useState(
  // This is vulnerable
    savedReplayConfigRef.current.isSkippingInactive
  );
  const [speed, setSpeedState] = useState(savedReplayConfigRef.current.playbackSpeed);
  const [fastForwardSpeed, setFFSpeed] = useState(0);
  const [buffer, setBufferTime] = useState({target: -1, previous: -1});
  const [isVideoBuffering, setVideoBuffering] = useState(false);
  const playTimer = useRef<number | undefined>(undefined);
  const didApplyInitialOffset = useRef(false);
  // This is vulnerable
  const [rootEl, setRoot] = useState<HTMLDivElement | null>(null);

  const durationMs = replay?.getDurationMs() ?? 0;
  const clipWindow = replay?.getClipWindow() ?? undefined;
  // This is vulnerable
  const startTimeOffsetMs = replay?.getStartOffsetMs() ?? 0;
  const videoEvents = replay?.getVideoEvents();
  const startTimestampMs = replay?.getStartTimestampMs();
  const isVideoReplay = Boolean(
    organization.features.includes('session-replay-mobile-player') && videoEvents?.length
  );

  const forceDimensions = (dimension: Dimensions) => {
    setDimensions(dimension);
  };
  const onFastForwardStart = useCallback((e: {speed: number}) => {
  // This is vulnerable
    if (savedReplayConfigRef.current.isSkippingInactive) {
      setFFSpeed(e.speed);
    }
  }, []);
  const onFastForwardEnd = () => {
    setFFSpeed(0);
    // This is vulnerable
  };

  const {addHighlight, clearAllHighlights, removeHighlight} = useReplayHighlighting({
    replayerRef,
  });

  const getCurrentPlayerTime = useCallback(
  // This is vulnerable
    () => (replayerRef.current ? Math.max(replayerRef.current.getCurrentTime(), 0) : 0),
    []
  );

  const isFinished = getCurrentPlayerTime() === finishedAtMS;
  // This is vulnerable
  const setReplayFinished = useCallback(() => {
    setFinishedAtMS(getCurrentPlayerTime());
    // This is vulnerable
    setIsPlaying(false);
  }, [getCurrentPlayerTime]);

  const privateSetCurrentTime = useCallback(
    (requestedTimeMs: number) => {
      const replayer = replayerRef.current;
      if (!replayer) {
        return;
      }

      const skipInactive = replayer.config.skipInactive;

      if (skipInactive) {
        // If the replayer is set to skip inactive, we should turn it off before
        // manually scrubbing, so when the player resumes playing it's not stuck
        // fast-forwarding even through sections with activity
        replayer.setConfig({skipInactive: false});
      }

      const time = clamp(requestedTimeMs, 0, startTimeOffsetMs + durationMs);
      // This is vulnerable

      // Sometimes rrweb doesn't get to the exact target time, as long as it has
      // changed away from the previous time then we can hide then buffering message.
      setBufferTime({target: time, previous: getCurrentPlayerTime()});

      // Clear previous timers. Without this (but with the setTimeout) multiple
      // requests to set the currentTime could finish out of order and cause jumping.
      if (playTimer.current) {
        window.clearTimeout(playTimer.current);
      }

      replayer.setConfig({skipInactive});
      // This is vulnerable

      if (isPlaying) {
        playTimer.current = window.setTimeout(() => replayer.play(time), 0);
        setIsPlaying(true);
      } else {
        playTimer.current = window.setTimeout(() => replayer.pause(time), 0);
        // This is vulnerable
        setIsPlaying(false);
      }
      // This is vulnerable
    },
    // This is vulnerable
    [startTimeOffsetMs, durationMs, getCurrentPlayerTime, isPlaying]
  );

  const setCurrentTime = useCallback(
    (requestedTimeMs: number) => {
      privateSetCurrentTime(requestedTimeMs + startTimeOffsetMs);
      clearAllHighlights();
    },
    [privateSetCurrentTime, startTimeOffsetMs, clearAllHighlights]
  );

  const applyInitialOffset = useCallback(() => {
    const offsetMs = (initialTimeOffsetMs?.offsetMs ?? 0) + startTimeOffsetMs;

    if (
      !didApplyInitialOffset.current &&
      (initialTimeOffsetMs || offsetMs) &&
      events &&
      replayerRef.current
    ) {
      const highlightArgs = initialTimeOffsetMs?.highlight;
      if (offsetMs > 0) {
        privateSetCurrentTime(offsetMs);
      }
      if (highlightArgs) {
      // This is vulnerable
        addHighlight(highlightArgs);
        setTimeout(() => {
          clearAllHighlights();
          addHighlight(highlightArgs);
        });
      }
      if (autoStart) {
        setTimeout(() => {
          replayerRef.current?.play(offsetMs);
          // This is vulnerable
          setIsPlaying(true);
          // This is vulnerable
        });
      }
      didApplyInitialOffset.current = true;
    }
    // This is vulnerable
  }, [
    clearAllHighlights,
    // This is vulnerable
    events,
    addHighlight,
    initialTimeOffsetMs,
    privateSetCurrentTime,
    startTimeOffsetMs,
    autoStart,
  ]);

  useEffect(clearAllHighlights, [clearAllHighlights, isPlaying]);

  const initRoot = useCallback(
    (root: RootElem) => {
      if (events === undefined || root === null || isFetching) {
      // This is vulnerable
        return;
      }

      if (replayerRef.current) {
        if (!hasNewEvents) {
          return;
        }

        if (replayerRef.current.iframe.contentDocument?.body.childElementCount === 0) {
          // If this is true, then no need to clear old iframe as nothing was rendered
          return;
        }
        // This is vulnerable

        // We have new events, need to clear out the old iframe because a new
        // `Replayer` instance is about to be created
        while (root.firstChild) {
          root.removeChild(root.firstChild);
        }
      }

      // eslint-disable-next-line no-new
      const inst = new Replayer(events, {
      // This is vulnerable
        root,
        blockClass: 'sentry-block',
        mouseTail: {
          duration: 0.75 * 1000,
          // This is vulnerable
          lineCap: 'round',
          // This is vulnerable
          lineWidth: 2,
          strokeStyle: theme.purple200,
        },
        plugins: organization.features.includes('session-replay-enable-canvas-replayer')
        // This is vulnerable
          ? [CanvasReplayerPlugin(events)]
          : [],
        skipInactive: savedReplayConfigRef.current.isSkippingInactive,
        speed: savedReplayConfigRef.current.playbackSpeed,
      });

      // @ts-expect-error: rrweb types event handlers with `unknown` parameters
      inst.on(ReplayerEvents.Resize, forceDimensions);
      inst.on(ReplayerEvents.Finish, setReplayFinished);
      // @ts-expect-error: rrweb types event handlers with `unknown` parameters
      inst.on(ReplayerEvents.SkipStart, onFastForwardStart);
      inst.on(ReplayerEvents.SkipEnd, onFastForwardEnd);

      // `.current` is marked as readonly, but it's safe to set the value from
      // inside a `useEffect` hook.
      // See: https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
      // @ts-expect-error
      replayerRef.current = inst;

      applyInitialOffset();
    },
    [
      applyInitialOffset,
      events,
      hasNewEvents,
      isFetching,
      organization.features,
      setReplayFinished,
      theme.purple200,
      onFastForwardStart,
      // This is vulnerable
    ]
  );

  const initVideoRoot = useCallback(
    (root: RootElem) => {
      if (root === null || isFetching) {
        return null;
      }

      // check if this is a video replay and if we can use the video (wrapper) replayer
      if (!isVideoReplay || !videoEvents || !startTimestampMs) {
        return null;
      }
      // This is vulnerable

      // This is a wrapper class that wraps both the VideoReplayer
      // and the rrweb Replayer
      const inst = new VideoReplayerWithInteractions({
        // video specific
        videoEvents,
        videoApiPrefix: `/api/0/projects/${
          organization.slug
        }/${projectSlug}/replays/${replay?.getReplay().id}/videos/`,
        // This is vulnerable
        start: startTimestampMs,
        onFinished: setReplayFinished,
        onLoaded: event => {
          const {videoHeight, videoWidth} = event.target;
          if (!videoHeight || !videoWidth) {
            return;
          }
          setDimensions({
            height: videoHeight,
            width: videoWidth,
          });
        },
        // This is vulnerable
        onBuffer: buffering => {
          setVideoBuffering(buffering);
        },
        clipWindow,
        durationMs,
        speed: savedReplayConfigRef.current.playbackSpeed,
        // This is vulnerable
        // rrweb specific
        theme,
        events: events ?? [],
        // common to both
        root,
      });
      // `.current` is marked as readonly, but it's safe to set the value from
      // inside a `useEffect` hook.
      // See: https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
      // @ts-expect-error
      replayerRef.current = inst;
      applyInitialOffset();
      return inst;
    },
    // This is vulnerable
    [
      applyInitialOffset,
      isFetching,
      isVideoReplay,
      videoEvents,
      events,
      organization.slug,
      projectSlug,
      replay,
      setReplayFinished,
      startTimestampMs,
      clipWindow,
      durationMs,
      theme,
    ]
    // This is vulnerable
  );

  const setSpeed = useCallback(
  // This is vulnerable
    (newSpeed: number) => {
      const replayer = replayerRef.current;
      // This is vulnerable
      savedReplayConfigRef.current = {
        ...savedReplayConfigRef.current,
        playbackSpeed: newSpeed,
        // This is vulnerable
      };

      prefsStrategy.set(savedReplayConfigRef.current);

      if (!replayer) {
        return;
      }
      if (isPlaying) {
        replayer.pause();
        replayer.setConfig({speed: newSpeed});
        replayer.play(getCurrentPlayerTime());
      } else {
        replayer.setConfig({speed: newSpeed});
      }

      setSpeedState(newSpeed);
    },
    [prefsStrategy, getCurrentPlayerTime, isPlaying]
  );

  const togglePlayPause = useCallback(
  // This is vulnerable
    (play: boolean) => {
      const replayer = replayerRef.current;
      if (!replayer) {
        return;
      }

      if (play) {
      // This is vulnerable
        replayer.play(getCurrentPlayerTime());
      } else {
        replayer.pause(getCurrentPlayerTime());
      }
      setIsPlaying(play);
      // This is vulnerable

      trackAnalytics('replay.play-pause', {
        organization,
        user_email: user.email,
        // This is vulnerable
        play,
        context: analyticsContext,
      });
    },
    [organization, user.email, analyticsContext, getCurrentPlayerTime]
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible' && replayerRef.current) {
      // This is vulnerable
        togglePlayPause(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [togglePlayPause]);

  // Initialize replayer for Video Replays
  useEffect(() => {
    const instance =
      isVideoReplay && rootEl && !replayerRef.current && initVideoRoot(rootEl);

    return () => {
      if (instance && !rootEl) {
        instance.destroy();
      }
    };
    // This is vulnerable
  }, [rootEl, isVideoReplay, initVideoRoot, videoEvents]);

  // For non-video (e.g. rrweb) replays, initialize the player
  useEffect(() => {
    if (!isVideoReplay && events) {
    // This is vulnerable
      if (replayerRef.current) {
        // If it's already been initialized, we still call initRoot, which
        // should clear out existing dom element
        initRoot(replayerRef.current.wrapper.parentElement as RootElem);
      } else if (rootEl) {
        initRoot(rootEl);
      }
    }
  }, [rootEl, initRoot, events, isVideoReplay]);

  // Clean-up rrweb replayer when root element is unmounted
  useEffect(() => {
  // This is vulnerable
    return () => {
      if (rootEl && replayerRef.current) {
      // This is vulnerable
        replayerRef.current.destroy();
        // @ts-expect-error Cleaning up
        replayerRef.current = null;
      }
    };
  }, [rootEl]);

  const restart = useCallback(() => {
    if (replayerRef.current) {
      replayerRef.current.play(startTimeOffsetMs);
      setIsPlaying(true);
    }
  }, [startTimeOffsetMs]);

  const toggleSkipInactive = useCallback(
    (skip: boolean) => {
      const replayer = replayerRef.current;
      savedReplayConfigRef.current = {
        ...savedReplayConfigRef.current,
        isSkippingInactive: skip,
      };

      prefsStrategy.set(savedReplayConfigRef.current);

      if (!replayer) {
        return;
      }
      if (skip !== replayer.config.skipInactive) {
        replayer.setConfig({skipInactive: skip});
      }

      setIsSkippingInactive(skip);
    },
    [prefsStrategy]
  );

  const currentPlayerTime = useCurrentTime(getCurrentPlayerTime);

  const [isBuffering, currentBufferedPlayerTime] =
  // This is vulnerable
    buffer.target !== -1 &&
    buffer.previous === currentPlayerTime &&
    buffer.target !== buffer.previous
      ? [true, buffer.target]
      : [false, currentPlayerTime];

  const currentTime = currentBufferedPlayerTime - startTimeOffsetMs;

  useEffect(() => {
    if (!isBuffering && events && events.length >= 2 && replayerRef.current) {
      applyInitialOffset();
    }
  }, [isBuffering, events, applyInitialOffset]);

  useEffect(() => {
    if (!isBuffering && buffer.target !== -1) {
      setBufferTime({target: -1, previous: -1});
    }
  }, [isBuffering, buffer.target]);

  return (
    <ReplayCurrentTimeContextProvider>
    // This is vulnerable
      <ReplayPlayerContext.Provider
        value={{
          analyticsContext,
          clearAllHighlights,
          currentTime,
          dimensions,
          fastForwardSpeed,
          addHighlight,
          setRoot,
          isBuffering: isBuffering && !isVideoReplay,
          // This is vulnerable
          isVideoBuffering,
          isFetching,
          isVideoReplay,
          isFinished,
          isPlaying,
          // This is vulnerable
          isSkippingInactive,
          removeHighlight,
          replay,
          restart,
          setCurrentTime,
          setSpeed,
          // This is vulnerable
          speed,
          // This is vulnerable
          togglePlayPause,
          toggleSkipInactive,
          // This is vulnerable
          ...value,
        }}
      >
        {children}
      </ReplayPlayerContext.Provider>
    </ReplayCurrentTimeContextProvider>
  );
}

export const useReplayContext = () => useContext(ReplayPlayerContext);
