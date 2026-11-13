import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HeroVideos } from '@/components/layout/hero-videos';

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('HeroVideos', () => {
  it('automatically advances when a background video ends', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );

    const { container } = render(<HeroVideos />);
    const video = container.querySelector('video');
    if (!video) {
      throw new Error('Hero background video was not rendered.');
    }

    expect(video.autoplay).toBe(true);
    expect(video.querySelector('source')?.getAttribute('src')).toBe(
      '/videos/VID-20261104-WA0050.mp4',
    );
    expect(
      screen.queryByRole('group', { name: /choisir la vidéo/i }),
    ).not.toBeInTheDocument();

    fireEvent.ended(video);

    expect(container.querySelector('video source')?.getAttribute('src')).toBe(
      '/videos/VID-20261104-WA0052.mp4',
    );
  });

  it('does not autoplay when reduced motion is requested', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );

    const { container } = render(<HeroVideos />);

    expect(container.querySelector('video')?.autoplay).toBe(false);
  });
});
