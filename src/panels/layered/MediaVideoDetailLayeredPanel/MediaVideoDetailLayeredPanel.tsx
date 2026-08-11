'use client';

import {
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    GetMediaPostYearMonth,
    GetYouTubePlayerInfo,
} from '@/panels/base/MediaBasePanel/controller/MediaBasePanelState';
import type { MediaArchiveItem } from '@/panels/base/MediaBasePanel/controller/MediaBasePanelTypes';
import Styles from './MediaVideoDetailLayeredPanel.module.css';

interface MediaVideoDetailLayeredPanelProps
{
    Item: MediaArchiveItem;
    OnRequestClose: () => void;
}

const PlaybackRates = [.5, 1, 1.5, 2];

function CreateYouTubePlayerUrl(VideoId: string): string
{
    const Parameters = new URLSearchParams({
        autoplay: '0',
        controls: '0',
        disablekb: '1',
        enablejsapi: '1',
        fs: '0',
        modestbranding: '1',
        mute: '1',
        playsinline: '1',
        rel: '0',
    });

    return `https://www.youtube-nocookie.com/embed/${VideoId}?${Parameters}`;
}

function FormatPlaybackTime(Value: number): string
{
    const SafeValue = Number.isFinite(Value)
        ? Math.max(0, Math.floor(Value))
        : 0;
    const Minutes = Math.floor(SafeValue / 60);
    const Seconds = SafeValue % 60;

    return `${Minutes}:${String(Seconds).padStart(2, '0')}`;
}

export function MediaVideoDetailLayeredPanel(
    Props: MediaVideoDetailLayeredPanelProps,
)
{
    const [CurrentTime, SetCurrentTime] = useState(0);
    const [Duration, SetDuration] = useState(0);
    const [IsFullscreen, SetIsFullscreen] = useState(false);
    const [IsMuted, SetIsMuted] = useState(true);
    const [IsPlaying, SetIsPlaying] = useState(false);
    const [IsSettingsOpen, SetIsSettingsOpen] = useState(false);
    const [PlaybackRate, SetPlaybackRate] = useState(1);
    const [Volume, SetVolume] = useState(1);
    const PlayerReference = useRef<HTMLDivElement>(null);
    const VideoReference = useRef<HTMLVideoElement>(null);
    const YouTubeReference = useRef<HTMLIFrameElement>(null);
    const OnRequestCloseReference = useRef(Props.OnRequestClose);

    useEffect(() =>
    {
        OnRequestCloseReference.current = Props.OnRequestClose;
    }, [Props.OnRequestClose]);

    useEffect(() =>
    {
        const PreviousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        function CloseOnEscape(Event: KeyboardEvent)
        {
            if(
                Event.key === 'Escape'
                && document.fullscreenElement === null
            )
            {
                OnRequestCloseReference.current();
            }
        }

        window.addEventListener('keydown', CloseOnEscape);

        return () =>
        {
            document.body.style.overflow = PreviousOverflow;
            window.removeEventListener('keydown', CloseOnEscape);
        };
    }, []);

    useEffect(() =>
    {
        function HandleFullscreenChange()
        {
            SetIsFullscreen(
                document.fullscreenElement === PlayerReference.current,
            );
        }

        document.addEventListener(
            'fullscreenchange',
            HandleFullscreenChange,
        );

        return () =>
        {
            document.removeEventListener(
                'fullscreenchange',
                HandleFullscreenChange,
            );
        };
    }, []);

    useEffect(() =>
    {
        function HandleYouTubeMessage(Event: MessageEvent)
        {
            if(
                Event.source
                !== YouTubeReference.current?.contentWindow
                || (
                    Event.origin !== 'https://www.youtube.com'
                    && Event.origin
                    !== 'https://www.youtube-nocookie.com'
                )
            )
            {
                return;
            }

            const PlayerInfo = GetYouTubePlayerInfo(Event.data);

            if(PlayerInfo === null)
            {
                return;
            }

            if(PlayerInfo.CurrentTime !== undefined)
            {
                SetCurrentTime(PlayerInfo.CurrentTime);
            }

            if(PlayerInfo.Duration !== undefined)
            {
                SetDuration(PlayerInfo.Duration);
            }

            if(PlayerInfo.IsEnded === true)
            {
                SetCurrentTime(PlayerInfo.Duration ?? Duration);
            }

            if(PlayerInfo.IsMuted !== undefined)
            {
                SetIsMuted(PlayerInfo.IsMuted);
            }

            if(PlayerInfo.IsPlaying !== undefined)
            {
                SetIsPlaying(PlayerInfo.IsPlaying);
            }

            if(PlayerInfo.PlaybackRate !== undefined)
            {
                SetPlaybackRate(PlayerInfo.PlaybackRate);
            }


            if(PlayerInfo.Volume !== undefined)
            {
                SetVolume(PlayerInfo.Volume);
            }
        }

        window.addEventListener('message', HandleYouTubeMessage);

        return () =>
        {
            window.removeEventListener(
                'message',
                HandleYouTubeMessage,
            );
        };
    }, [Duration]);

    function SendYouTubeMessage(Message: Record<string, unknown>)
    {
        YouTubeReference.current?.contentWindow?.postMessage(
            JSON.stringify(Message),
            '*',
        );
    }

    function SendYouTubeCommand(
        Command: string,
        Arguments: unknown[] = [],
    )
    {
        SendYouTubeMessage({
            event: 'command',
            func: Command,
            args: Arguments,
        });
    }

    function InitializeYouTubePlayer()
    {
        SendYouTubeMessage({
            event: 'listening',
            id: Props.Item.Id,
        });
        SendYouTubeCommand('addEventListener', ['onStateChange']);
    }

    async function TogglePlayback()
    {
        if(Props.Item.SourceType === 'youtube')
        {
            if(IsPlaying)
            {
                SetIsPlaying(false);
                SendYouTubeCommand('pauseVideo');
            }
            else
            {
                SendYouTubeCommand('playVideo');
            }
            return;
        }

        const Video = VideoReference.current;

        if(Video === null)
        {
            return;
        }

        if(Video.paused)
        {
            try
            {
                await Video.play();
            }
            catch
            {
                SetIsPlaying(false);
            }
        }
        else
        {
            Video.pause();
        }
    }

    function SeekTo(NextTime: number)
    {
        const SafeTime = Math.min(
            Math.max(NextTime, 0),
            Duration || 0,
        );
        SetCurrentTime(SafeTime);

        if(Props.Item.SourceType === 'youtube')
        {
            SendYouTubeCommand('seekTo', [SafeTime, true]);
            return;
        }

        if(VideoReference.current !== null)
        {
            VideoReference.current.currentTime = SafeTime;
        }
    }

    function ToggleSound()
    {
        const NextIsMuted = IsMuted === false;
        const NextVolume = Volume > 0 ? Volume : 1;
        SetIsMuted(NextIsMuted);

        if(NextIsMuted === false && Volume === 0)
        {
            SetVolume(NextVolume);
        }

        if(Props.Item.SourceType === 'youtube')
        {
            if(NextIsMuted === false)
            {
                SendYouTubeCommand(
                    'setVolume',
                    [Math.round(NextVolume * 100)],
                );
            }
            SendYouTubeCommand(NextIsMuted ? 'mute' : 'unMute');
            return;
        }

        if(VideoReference.current !== null)
        {
            VideoReference.current.volume = NextVolume;
            VideoReference.current.muted = NextIsMuted;
        }
    }

    function ChangeVolume(NextVolume: number)
    {
        const SafeVolume = Math.min(1, Math.max(0, NextVolume));
        const NextIsMuted = SafeVolume === 0;
        SetVolume(SafeVolume);
        SetIsMuted(NextIsMuted);

        if(Props.Item.SourceType === 'youtube')
        {
            SendYouTubeCommand(
                'setVolume',
                [Math.round(SafeVolume * 100)],
            );
            SendYouTubeCommand(NextIsMuted ? 'mute' : 'unMute');
            return;
        }

        if(VideoReference.current !== null)
        {
            VideoReference.current.volume = SafeVolume;
            VideoReference.current.muted = NextIsMuted;
        }
    }

    function ChangePlaybackRate(NextRate: number)
    {
        SetPlaybackRate(NextRate);
        SetIsSettingsOpen(false);

        if(Props.Item.SourceType === 'youtube')
        {
            SendYouTubeCommand('setPlaybackRate', [NextRate]);
            return;
        }

        if(VideoReference.current !== null)
        {
            VideoReference.current.playbackRate = NextRate;
        }
    }

    async function ToggleFullscreen()
    {
        try
        {
            if(document.fullscreenElement !== null)
            {
                await document.exitFullscreen();
            }
            else
            {
                await PlayerReference.current?.requestFullscreen();
            }
        }
        catch
        {
            SetIsFullscreen(false);
        }
    }

    return (
        <div
            className={Styles.Backdrop}
            onMouseDown={(Event) =>
            {
                if(Event.target === Event.currentTarget)
                {
                    Props.OnRequestClose();
                }
            }}
        >
            <section
                className={Styles.Panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="media-detail-title"
                data-ue-component="MediaVideoDetailLayeredPanel"
                data-ue-root
            >
                <button
                    type="button"
                    className={Styles.CloseButton}
                    onClick={Props.OnRequestClose}
                    aria-label="영상 팝업 닫기"
                >
                    ×
                </button>

                <div ref={PlayerReference} className={Styles.Player}>
                    {Props.Item.SourceType === 'youtube'
                    && Props.Item.YouTubeId !== null ? (
                        <iframe
                            ref={YouTubeReference}
                            src={CreateYouTubePlayerUrl(
                                Props.Item.YouTubeId,
                            )}
                            title={`${Props.Item.Title} 영상`}
                            allow="autoplay; encrypted-media; fullscreen"
                            allowFullScreen
                            tabIndex={-1}
                            onLoad={InitializeYouTubePlayer}
                        />
                    ) : (
                        <video
                            ref={VideoReference}
                            src={Props.Item.VideoUrl}
                            muted
                            playsInline
                            onDurationChange={(Event) =>
                                SetDuration(
                                    Event.currentTarget.duration,
                                )
                            }
                            onTimeUpdate={(Event) =>
                                SetCurrentTime(
                                    Event.currentTarget.currentTime,
                                )
                            }
                            onEnded={(Event) =>
                                SetCurrentTime(
                                    Event.currentTarget.duration,
                                )
                            }
                            onVolumeChange={(Event) =>
                            {
                                SetIsMuted(Event.currentTarget.muted);
                                SetVolume(Event.currentTarget.volume);
                            }}
                            onPlay={() => SetIsPlaying(true)}
                            onPause={() => SetIsPlaying(false)}
                        />
                    )}
                    <button
                        type="button"
                        className={Styles.PlayerSurfaceButton}
                        onClick={() => void TogglePlayback()}
                        aria-label={
                            IsPlaying ? '영상 일시정지' : '영상 재생'
                        }
                    />
                    <div className={Styles.PlayerControls}>
                        <button
                            type="button"
                            onClick={() => void TogglePlayback()}
                            aria-label={
                                IsPlaying ? '영상 일시정지' : '영상 재생'
                            }
                        >
                            {IsPlaying ? 'Ⅱ' : '▶'}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={Duration || 0}
                            step="0.1"
                            value={Math.min(CurrentTime, Duration || 0)}
                            disabled={Duration <= 0}
                            onChange={(Event) =>
                                SeekTo(Number(Event.currentTarget.value))
                            }
                            aria-label="영상 재생 위치"
                        />
                        <span className={Styles.PlaybackTime}>
                            {FormatPlaybackTime(CurrentTime)} /{' '}
                            {FormatPlaybackTime(Duration)}
                        </span>
                        <div className={Styles.VolumeControl}>
                            <button
                                type="button"
                                onClick={ToggleSound}
                                aria-label={
                                    IsMuted ? '소리 켜기' : '음소거'
                                }
                            >
                                <svg
                                    className={Styles.ControlIcon}
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4 9v6h4l5 4V5L8 9H4Z"
                                        fill="currentColor"
                                    />
                                    {IsMuted ? (
                                        <path
                                            d="m16 9 5 6m0-6-5 6"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        />
                                    ) : (
                                        <path
                                            d="M16 8.5c1 .8 1.5 2 1.5 3.5S17 14.7 16 15.5M18.5 6c1.7 1.5 2.5 3.5 2.5 6s-.8 4.5-2.5 6"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeWidth="1.6"
                                        />
                                    )}
                                </svg>
                            </button>
                            <input
                                className={Styles.VolumeSlider}
                                type="range"
                                min={0}
                                max={1}
                                step="0.05"
                                value={IsMuted ? 0 : Volume}
                                onChange={(Event) =>
                                    ChangeVolume(
                                        Number(Event.currentTarget.value),
                                    )
                                }
                                aria-label="영상 음량"
                            />
                        </div>
                        <div className={Styles.Settings}>
                            <button
                                type="button"
                                onClick={() =>
                                    SetIsSettingsOpen(
                                        (Current) => Current === false,
                                    )
                                }
                                aria-label="재생 설정"
                                aria-expanded={IsSettingsOpen}
                            >
                                <span
                                    className={Styles.GearIcon}
                                    aria-hidden="true"
                                >
                                    ⚙︎
                                </span>
                            </button>
                            {IsSettingsOpen ? (
                                <div
                                    className={Styles.SettingsMenu}
                                    role="menu"
                                >
                                    {PlaybackRates.map((Rate) => (
                                        <button
                                            key={Rate}
                                            type="button"
                                            role="menuitemradio"
                                            aria-checked={
                                                PlaybackRate === Rate
                                            }
                                            onClick={() =>
                                                ChangePlaybackRate(Rate)
                                            }
                                        >
                                            {Rate}×
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                        <button
                            type="button"
                            onClick={() => void ToggleFullscreen()}
                            aria-label={
                                IsFullscreen
                                    ? '전체화면 축소'
                                    : '전체화면'
                            }
                        >
                            <svg
                                className={Styles.ControlIcon}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    d={
                                        IsFullscreen
                                            ? 'M9 3v6H3m12-6v6h6M9 21v-6H3m12 6v-6h6'
                                            : 'M9 3H3v6m12-6h6v6M9 21H3v-6m12 6h6v-6'
                                    }
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={Styles.Copy}>
                    <div className={Styles.CopyHeading}>
                        <h2 id="media-detail-title">
                            {Props.Item.Title}
                        </h2>
                        <span className={Styles.PostDate}>
                            {GetMediaPostYearMonth(Props.Item.Date)}
                        </span>
                    </div>
                    <p>{Props.Item.Content}</p>
                </div>
            </section>
        </div>
    );
}
