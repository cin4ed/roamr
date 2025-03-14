import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';

export function NotificationButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button variant="outline" size="icon" className={'h-10 w-10'} disabled>
              <Bell className={'h-10 w-10'} />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Coming soon ⏰</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
