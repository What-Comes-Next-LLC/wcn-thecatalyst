/**
 * Utility functions for scroll navigation
 */

// List of all section IDs in order
export const sectionIds = [
  'hero-section',
  'problem-section',
  'solution-section',
  'product-section',
  'market-section',
  'competitive-section',
  'why-now-section',
  'go-to-market-section',
  'who-benefits-section',
  'business-model-section',
  'combined-cta-section'
];

/**
 * Scroll to the next section
 */
export function scrollToNextSection() {
  const currentSection = getCurrentSection();
  if (currentSection) {
    const currentIndex = sectionIds.indexOf(currentSection);
    if (currentIndex < sectionIds.length - 1) {
      const nextSection = document.getElementById(sectionIds[currentIndex + 1]);
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}

/**
 * Scroll to the previous section
 */
export function scrollToPrevSection() {
  const currentSection = getCurrentSection();
  if (currentSection) {
    const currentIndex = sectionIds.indexOf(currentSection);
    if (currentIndex > 0) {
      const prevSection = document.getElementById(sectionIds[currentIndex - 1]);
      if (prevSection) {
        prevSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}

/**
 * Get the currently visible section
 */
export function getCurrentSection(): string | null {
  // Find the section that is most visible in the viewport
  let maxVisibility = 0;
  let currentSection = null;

  sectionIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the section is visible
      const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const visibility = visibleHeight > 0 ? visibleHeight / windowHeight : 0;
      
      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        currentSection = id;
      }
    }
  });

  return currentSection;
}

/**
 * Set up keyboard navigation
 */
export function setupKeyboardNavigation() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      scrollToNextSection();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      scrollToPrevSection();
    }
  });
} 