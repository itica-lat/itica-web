import { useScrollAnimation } from '../hooks/scrollAnimations.js';

export function AnimatedElement({ 
  children, 
  animation = 'fadeIn', 
  delay = 0, 
  duration = 600,
  className = '',
  threshold = 0.1,
  triggerOnce = true 
}) {
  const [ref, isVisible] = useScrollAnimation({ threshold, triggerOnce });

  const getAnimationClass = () => {
    const baseTransition = `transition-all ease-out`;
    
    switch (animation) {
      case 'fadeIn':
        return `${baseTransition} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
      case 'fadeInUp':
        return `${baseTransition} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;
      case 'fadeInDown':
        return `${baseTransition} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`;
      case 'fadeInLeft':
        return `${baseTransition} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`;
      case 'fadeInRight':
        return `${baseTransition} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`;
      case 'scale':
        return `${baseTransition} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`;
      case 'slideInLeft':
        return `${baseTransition} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`;
      case 'slideInRight':
        return `${baseTransition} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`;
      default:
        return `${baseTransition} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
    }
  };

  return (
    <div 
      ref={ref}
      className={`${getAnimationClass()} ${className}`}
      style={{ 
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
}