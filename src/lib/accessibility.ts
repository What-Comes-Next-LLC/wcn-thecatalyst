// Accessibility utilities for The Spark interface

/**
 * Focus management utilities for mobile-first interfaces
 */

// Focus trap for modal interfaces (camera, file upload)
export function createFocusTrap(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handleTabKey);
  
  // Focus first element initially
  firstElement?.focus();
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

// Announce dynamic content to screen readers
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Touch-friendly button sizing validation
export function validateTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // 44px minimum per WCAG guidelines
  
  return rect.width >= minSize && rect.height >= minSize;
}

// High contrast detection
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

// Keyboard navigation helpers
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
} as const;

// Handle keyboard activation (Enter or Space)
export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === KEYBOARD_KEYS.ENTER || event.key === KEYBOARD_KEYS.SPACE;
}

// Camera permission status for accessibility announcements
export function getCameraPermissionStatus(): Promise<PermissionState> {
  if (!navigator.permissions) {
    return Promise.resolve('granted' as PermissionState);
  }
  
  return navigator.permissions.query({ name: 'camera' as PermissionName })
    .then(result => result.state)
    .catch(() => 'granted' as PermissionState);
}

// Announce upload progress for screen readers
export function announceUploadProgress(progress: number, total?: number) {
  if (progress === 0) {
    announceToScreenReader('Upload starting', 'polite');
  } else if (progress === 100) {
    announceToScreenReader('Upload complete! Your Spark has been captured.', 'assertive');
  } else if (progress % 25 === 0) {
    const message = total 
      ? `Upload ${progress}% complete. ${progress} of ${total} uploaded.`
      : `Upload ${progress}% complete`;
    announceToScreenReader(message, 'polite');
  }
}

// Constellation milestone announcements
export function announceMilestone(sparkCount: number) {
  const milestones: { [key: number]: string } = {
    1: 'Congratulations! You captured your first Spark.',
    10: 'Amazing! You\'ve captured 10 Sparks.',
    50: 'Milestone reached! Little Dipper constellation complete with 50 Sparks.',
    100: 'Incredible! Big Dipper constellation unlocked with 100 Sparks.',
    250: 'Outstanding! Orion constellation appears with 250 Sparks.',
    500: 'Phenomenal! Winter sky complete with 500 Sparks.',
    1000: 'Galaxy Master! You\'ve completed all 1000 Sparks!'
  };
  
  const message = milestones[sparkCount];
  if (message) {
    announceToScreenReader(message, 'assertive');
  }
}

// Error announcements with helpful context
export function announceError(error: string, context?: string) {
  const fullMessage = context 
    ? `Error in ${context}: ${error}. Please try again or choose a different option.`
    : `Error: ${error}. Please try again.`;
  
  announceToScreenReader(fullMessage, 'assertive');
}

// Success announcements
export function announceSuccess(message: string) {
  announceToScreenReader(`Success: ${message}`, 'assertive');
}