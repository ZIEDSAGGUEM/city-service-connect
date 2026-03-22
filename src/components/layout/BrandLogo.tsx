import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  to?: string;
  /** Extra subtitle under the wordmark (e.g. footer) */
  showTagline?: boolean;
};

export function BrandLogo({
  className,
  iconClassName,
  textClassName,
  to = '/',
  showTagline = false,
}: BrandLogoProps) {
  const content = (
    <>
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/25 ring-2 ring-primary/20',
          iconClassName,
        )}
      >
        <MapPin className="h-[18px] w-[18px] text-primary-foreground drop-shadow-sm" />
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-lg font-bold tracking-tight text-foreground sm:text-xl',
            textClassName,
          )}
        >
          City Service{' '}
          <span className="bg-gradient-to-r from-primary via-teal-600 to-primary bg-clip-text text-transparent dark:via-teal-400">
            Connect
          </span>
        </span>
        {showTagline && (
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Local services, trusted pros
          </span>
        )}
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cn('group flex items-center gap-2.5', className)}>
        {content}
      </Link>
    );
  }

  return <div className={cn('flex items-center gap-2.5', className)}>{content}</div>;
}
