import React from 'react';
import ScrollTrigger from './ScrollTrigger';

interface WithNavigationProps {
  prevSectionId: string;
  nextSectionId: string;
}

export default function withNavigation<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { prevSectionId, nextSectionId }: WithNavigationProps
) {
  return function WithNavigationComponent(props: P) {
    return (
      <div className="relative">
        <WrappedComponent {...props} />
        <ScrollTrigger targetId={prevSectionId} direction="up" />
        <ScrollTrigger targetId={nextSectionId} direction="down" />
      </div>
    );
  };
} 