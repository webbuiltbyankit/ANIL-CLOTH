import React, { useRef, useState } from 'react';
import { Film, ImageOff, Maximize2, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { sanitizeLocalMediaPath } from '@/lib/security';

interface MediaPlaceholderProps {
  label?: string;
  shortcode?: string;
  className?: string;
}

export const MediaPlaceholder: React.FC<MediaPlaceholderProps> = ({
  label = 'Visual reference unavailable',
  shortcode,
  className = '',
}) => (
  <div
    className={`flex flex-col items-center justify-center bg-ivory-warm border border-ivory-border text-ink-muted p-6 text-center select-none ${className}`}
    role="img"
    aria-label={label}
  >
    <ImageOff className="w-6 h-6 text-brass-dark/70 mb-2" aria-hidden="true" />
    <span className="text-xs font-medium uppercase tracking-widest text-ink">
      {shortcode ? `ACH-${shortcode}` : 'ANIL CLOTH HOUSE'}
    </span>
    <span className="text-[11px] text-ink-muted mt-1">{label}</span>
  </div>
);

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  shortcode?: string;
  fitMode?: 'cover' | 'contain-matte';
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

/**
 * ProductImage (`Prompts 014, 078`)
 * Preserves 640x1136 portrait Reel cover proportions without stretching, with optional neutral matting.
 */
export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  width = 640,
  height = 1136,
  shortcode,
  fitMode = 'cover',
  priority = false,
  className = '',
  imgClassName = '',
}) => {
  const safeSrc = sanitizeLocalMediaPath(src);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!safeSrc || hasError) {
    return (
      <MediaPlaceholder
        shortcode={shortcode}
        label="Local garment image unavailable"
        className={`aspect-[9/16] w-full ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-ivory-warm aspect-[9/16] w-full ${className}`}
    >
      {!loaded && (
        <div
          className="absolute inset-0 bg-ivory-stone/70 animate-pulse"
          aria-hidden="true"
        />
      )}

      {fitMode === 'contain-matte' && (
        <img
          src={safeSrc}
          alt=""
          aria-hidden="true"
          loading={priority ? 'eager' : 'lazy'}
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-35 pointer-events-none select-none"
        />
      )}

      <img
        src={safeSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        className={`relative z-10 w-full h-full ${
          fitMode === 'contain-matte' ? 'object-contain p-1.5 sm:p-2' : 'object-cover object-top'
        } transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  );
};

interface EditorialImageProps {
  src: string | null | undefined;
  alt: string;
  aspectClassName?: string;
  fitMode?: 'cover' | 'contain-matte';
  priority?: boolean;
  className?: string;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  aspectClassName = 'aspect-[4/5]',
  fitMode = 'contain-matte',
  priority = false,
  className = '',
}) => {
  const safeSrc = sanitizeLocalMediaPath(src);
  const [hasError, setHasError] = useState(false);

  if (!safeSrc || hasError) {
    return <MediaPlaceholder label={alt} className={`${aspectClassName} w-full ${className}`} />;
  }

  return (
    <div className={`relative overflow-hidden bg-ivory-warm ${aspectClassName} ${className}`}>
      {fitMode === 'contain-matte' && (
        <img
          src={safeSrc}
          alt=""
          aria-hidden="true"
          loading={priority ? 'eager' : 'lazy'}
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-30 pointer-events-none"
        />
      )}
      <img
        src={safeSrc}
        alt={alt}
        width={640}
        height={1136}
        loading={priority ? 'eager' : 'lazy'}
        onError={() => setHasError(true)}
        className={`relative z-10 w-full h-full ${
          fitMode === 'contain-matte' ? 'object-contain' : 'object-cover object-top'
        }`}
      />
    </div>
  );
};

export const ResponsivePicture: React.FC<ProductImageProps> = (props) => (
  <picture className="block w-full">
    <ProductImage {...props} />
  </picture>
);

interface ReelVideoPlayerProps {
  videoSrc: string | null | undefined;
  posterSrc: string | null | undefined;
  alt: string;
  shortcode: string;
  autoPlayMuted?: boolean;
  onExpandZoom?: () => void;
  className?: string;
}

/**
 * ReelVideoPlayer
 * Plays the real supplied Instagram Reel .mp4 video from anil_cloth_house/video/ with accessible controls.
 */
export const ReelVideoPlayer: React.FC<ReelVideoPlayerProps> = ({
  videoSrc,
  posterSrc,
  alt,
  shortcode,
  autoPlayMuted = false,
  onExpandZoom,
  className = '',
}) => {
  const safeVideo = sanitizeLocalMediaPath(videoSrc);
  const safePoster = sanitizeLocalMediaPath(posterSrc);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(Boolean(autoPlayMuted));
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  if (!safeVideo || videoError) {
    return (
      <div className={`relative overflow-hidden bg-oxblood-deep aspect-[9/16] w-full ${className}`}>
        <ProductImage
          src={safePoster}
          alt={alt}
          shortcode={shortcode}
          className="w-full h-full"
        />
        <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between gap-2">
          <a
            href={`https://www.instagram.com/reel/${shortcode}/`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="min-h-[42px] px-3.5 py-2 bg-oxblood-deep/90 hover:bg-oxblood text-ivory text-xs font-medium border border-brass-light/40 backdrop-blur-sm inline-flex items-center gap-1.5 transition"
          >
            <Film className="w-3.5 h-3.5 text-brass-light" aria-hidden="true" />
            <span>Watch Original Reel on Instagram ↗</span>
          </a>
        </div>
      </div>
    );
  }

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  return (
    <div className={`relative overflow-hidden bg-oxblood-deep aspect-[9/16] w-full group ${className}`}>
      <video
        ref={videoRef}
        src={safeVideo}
        poster={safePoster || undefined}
        playsInline
        loop
        muted={isMuted}
        autoPlay={autoPlayMuted}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setVideoError(true)}
        className="w-full h-full object-contain bg-oxblood-deep"
        aria-label={`Instagram Reel video for Design ACH-${shortcode}`}
      />

      {/* Top badge */}
      <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 bg-oxblood-deep/85 backdrop-blur-sm text-ivory text-[11px] font-medium tracking-wider uppercase border border-ivory/20">
        <Film className="w-3.5 h-3.5 text-brass-light" aria-hidden="true" />
        <span>Original Reel • {shortcode}</span>
      </div>

      {/* Bottom control bar */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause Reel video' : 'Play Reel video'}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 bg-oxblood-deep/90 hover:bg-oxblood text-ivory text-xs font-medium border border-ivory/25 backdrop-blur-sm transition"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 text-brass-light" aria-hidden="true" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-brass-light fill-brass-light" aria-hidden="true" />
                <span>Play Reel</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute Reel audio' : 'Mute Reel audio'}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center bg-oxblood-deep/90 hover:bg-oxblood text-ivory border border-ivory/25 backdrop-blur-sm transition"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-ivory/80" aria-hidden="true" />
            ) : (
              <Volume2 className="w-4 h-4 text-brass-light" aria-hidden="true" />
            )}
          </button>
        </div>

        {onExpandZoom && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExpandZoom();
            }}
            aria-label="Inspect full-size garment image"
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center bg-oxblood-deep/90 hover:bg-oxblood text-ivory border border-ivory/25 backdrop-blur-sm transition"
          >
            <Maximize2 className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

