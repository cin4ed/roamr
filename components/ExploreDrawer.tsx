import { Drawer } from 'vaul';


export default function ExploreDrawer() {
    return (
      <Drawer.Root open={selectedLocation !== null}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content className="bg-base-100 fixed inset-0 bottom-0 z-50 p-5">
            <Drawer.Handle />
            <div className="mt-5">
              <Drawer.Title className="text-3xl font-bold">{selectedLocation?.name}</Drawer.Title>
              <p className="text-sm text-gray-500">Country, City</p>
              <Image
                src={selectedLocation?.location_media?.[0].media_url ?? ''}
                alt={selectedLocation?.name ?? 'Location image'}
                width={500}
                height={500}
                className="mt-3 w-full rounded-lg"
              />
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">Submitted by</p>
                  {selectedLocation?.creator?.avatar_url ? (
                    <Image
                      src={selectedLocation.creator.avatar_url}
                      alt="User avatar"
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-gray-300" />
                  )}
                  <span className="text-sm text-gray-500">
                    {selectedLocation?.creator?.username || 'Anonymous'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {selectedLocation?.location_media?.length} photos
                </p>
              </div>
              <div className="mt-3">
                <h2 className="text-lg font-bold">About</h2>
                <p className="text-balance">{selectedLocation?.description}</p>
              </div>
              {selectedLocation?.tags && selectedLocation.tags.length > 0 && (
                <div className="mt-3">
                  <h2 className="text-lg font-bold">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.tags.map(tag => (
                      <span key={tag.id} className="badge badge-outline">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedLocation?.content?.content && (
                <div className="mt-3">
                  <h2 className="text-lg font-bold">Details</h2>
                  <p className="text-balance whitespace-pre-line">
                    {selectedLocation.content.content}
                  </p>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
}