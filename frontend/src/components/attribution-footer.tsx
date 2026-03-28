export function AttributionFooter() {
  return (
    <footer className="mt-auto py-[var(--space-4)] px-[var(--space-4)] text-center text-[0.75rem] text-dust">
      Game icons by{' '}
      <a
        href="https://game-icons.net"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-bone transition-colors duration-[var(--duration-fast)]"
      >
        game-icons.net
      </a>{' '}
      under CC BY 3.0. Icons by Lorc, Delapouite, and Carl Olsen.
    </footer>
  );
}
