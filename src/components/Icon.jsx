import * as LucideIcons from 'lucide-react';

export function Icon({ name, className = "w-6 h-6", ...props }) {
  const IconComponent = LucideIcons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide React`);
    return <LucideIcons.HelpCircle className={className} {...props} />;
  }
  
  return <IconComponent className={className} {...props} />;
}