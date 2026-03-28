import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';
import { SandParticles } from '../src/components/sand-particles';

describe('SandParticles component (T031)', () => {
  it('renders 5 particle elements', () => {
    const { container } = render(<SandParticles />);
    const particles = container.querySelectorAll('.rounded-full');
    expect(particles).toHaveLength(5);
  });

  it('is aria-hidden for accessibility', () => {
    const { container } = render(<SandParticles />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('has pointer-events-none so it does not block interaction', () => {
    const { container } = render(<SandParticles />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('pointer-events-none');
  });

  it('has z-index -1 to sit behind content', () => {
    const { container } = render(<SandParticles />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.zIndex).toBe('-1');
  });

  it('respects prefers-reduced-motion via motion-reduce:hidden', () => {
    const { container } = render(<SandParticles />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('motion-reduce:hidden');
  });

  it('particles use --gold background color', () => {
    const { container } = render(<SandParticles />);
    const particle = container.querySelector('.rounded-full') as HTMLElement;
    expect(particle.style.backgroundColor).toBe('var(--gold)');
  });

  it('particles have opacity between 0.15 and 0.25', () => {
    const { container } = render(<SandParticles />);
    const particles = container.querySelectorAll('.rounded-full');
    for (const p of particles) {
      const opacity = Number.parseFloat((p as HTMLElement).style.opacity);
      expect(opacity).toBeGreaterThanOrEqual(0.15);
      expect(opacity).toBeLessThanOrEqual(0.25);
    }
  });

  it('particles have size between 2px and 4px', () => {
    const { container } = render(<SandParticles />);
    const particles = container.querySelectorAll('.rounded-full');
    for (const p of particles) {
      const width = Number.parseFloat((p as HTMLElement).style.width);
      expect(width).toBeGreaterThanOrEqual(2);
      expect(width).toBeLessThanOrEqual(4);
    }
  });

  it('particles use particle-drift animation with 20-30s duration', () => {
    const { container } = render(<SandParticles />);
    const particles = container.querySelectorAll('.rounded-full');
    for (const p of particles) {
      const anim = (p as HTMLElement).style.animation;
      expect(anim).toContain('particle-drift');
      const match = anim.match(/particle-drift\s+(\d+)s/);
      expect(match).not.toBeNull();
      const duration = Number.parseInt(match![1], 10);
      expect(duration).toBeGreaterThanOrEqual(20);
      expect(duration).toBeLessThanOrEqual(30);
    }
  });
});

describe('SandParticles wiring in App (T031)', () => {
  it('shows sand particles on title screen', () => {
    const { container } = render(<App />);
    const particleWrapper = container.querySelector('[aria-hidden="true"].fixed');
    expect(particleWrapper).toBeInTheDocument();
  });

  it('does not show sand particles on game screen', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs human/i }));
    const particleWrapper = container.querySelector('[aria-hidden="true"].fixed');
    expect(particleWrapper).not.toBeInTheDocument();
  });
});
