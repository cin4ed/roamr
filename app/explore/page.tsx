'use client';

import ExploreMap from '@/components/ExploreMap';

export default function Explore() {
  return (
    <div className="h-screen w-screen font-[family-name:var(--font-geist-sans)]">
      <ExploreMap className="fixed inset-0" />
      {/* <div className="fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around items-center h-24 px-4 z-[102]">
        <button className="flex flex-col items-center gap-1 text-primary">
          <Compass className="w-6 h-6" />
          <span className="text-xs">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground">
          <User className="w-6 h-6" />
          <span className="text-xs">You</span>
        </button>
        <Link href="/locations/create">
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <PlusCircle className="w-6 h-6" />
            <span className="text-xs">Contribute</span>
          </button>
        </Link>
      </div> */}

      {/* {selectedLocation && <ExploreDrawer location={selectedLocation} />} */}
    </div>
  );
}
