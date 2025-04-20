import { useState, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MapSettings {
  projection: 'mercator' | 'globe';
  style: 'vector' | 'raster';
}

interface MapSettingsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  settings: MapSettings;
  onSettingsChange: (settings: MapSettings) => void;
}

const MapSettingsCard = forwardRef<HTMLDivElement, MapSettingsCardProps>(
  ({ settings, onSettingsChange, className }, ref) => {
    const [userInteracted, setUserInteracted] = useState(false);

    const handleProjectionChange = (newProjection: 'mercator' | 'globe') => {
      setUserInteracted(true);
      onSettingsChange({
        ...settings,
        projection: newProjection,
      });
    };

    const handleStyleChange = (newStyle: 'vector' | 'raster') => {
      onSettingsChange({
        ...settings,
        style: newStyle,
      });
    };

    const resetInteraction = () => {
      setUserInteracted(false);
    };

    return (
      <div ref={ref} className={cn('w-52 rounded-lg bg-white px-4 py-3 text-primary', className)}>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Map Settings</h3>
          <fieldset className="space-y-2 rounded-lg border border-primary/50 px-3 py-1">
            <legend className="text-xs font-medium">Projection</legend>
            <div className="space-y-1">
              <div className="space-x-1">
                <input
                  type="radio"
                  name="projection"
                  checked={settings.projection === 'mercator'}
                  onChange={() => handleProjectionChange('mercator')}
                  className="text-primary"
                />
                <label className="text-xs">Mercator</label>
              </div>
              <div className="space-x-1">
                <input
                  type="radio"
                  name="projection"
                  checked={settings.projection === 'globe'}
                  onChange={() => handleProjectionChange('globe')}
                  className="text-primary"
                />
                <label className="text-xs">Globe</label>
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-2 rounded-lg border border-primary/50 px-3 py-1">
            <legend className="text-xs font-medium">Style</legend>
            <div className="space-y-1">
              <div className="space-x-1">
                <input
                  type="radio"
                  name="style"
                  checked={settings.style === 'vector'}
                  onChange={() => handleStyleChange('vector')}
                  className="text-primary"
                />
                <label className="text-xs">Vector</label>
              </div>
              <div className="space-x-1">
                <input
                  type="radio"
                  name="style"
                  checked={settings.style === 'raster'}
                  onChange={() => handleStyleChange('raster')}
                  className="text-primary"
                />
                <label className="text-xs">Satellite</label>
              </div>
            </div>
          </fieldset>

          {settings.projection === 'globe' && userInteracted && (
            <div>
              <Button variant="outline" size="sm" onClick={resetInteraction} className="w-full">
                <RotateCcw className="mr-2 h-3 w-3" />
                Resume Spinning
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

MapSettingsCard.displayName = 'MapSettingsCard';

export default MapSettingsCard;
