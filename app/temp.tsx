// function LocationCard({ location }: { location: Location }) {
//   return (
//     <div
//       className="border rounded-lg overflow-hidden w-52 flex flex-col relative hover:bg-zinc-900 cursor-pointer"
//       key={location.id}
//     >
//       <Badge
//         className="absolute top-1 left-1"
//         variant={location.status == "verified" ? "success" : "destructive"}
//       >
//         {location.status == "verified" ? "Verified" : "In Review"}
//       </Badge>
//       <Badge
//         className="absolute top-1 right-1 flex items-center gap-1"
//         variant="secondary"
//       >
//         {location.rating}
//         <span className="inline-block">⭐️</span>
//         {/* <Star className="h-3 w-3" /> */}
//       </Badge>
//       <img
//         src={location.images[0]}
//         alt={location.name}
//         className="w-full h-32 object-cover"
//       />
//       <div className="px-2 py-3 flex-1 flex flex-col gap-3 justify-between">
//         <div className="space-y-1.5">
//           <div className="text-sm font-bold">{location.name}</div>
//           <div className="text-xs text-zinc-400">{location.description}</div>
//         </div>
//         <div className="flex items-center justify-between">
//           <div className="flex gap-2 items-center">
//             <p className="text-xs text-zinc-400">Added by</p>
//             <Avatar className="w-6 h-6">
//               <AvatarImage
//                 src={location.addedBy.profileImage}
//                 alt={location.addedBy.name}
//               />
//               <AvatarFallback>CN</AvatarFallback>
//             </Avatar>
//           </div>
//           <div className="flex gap-1 items-center text-muted-foreground">
//             <p className="text-xs">{location.country}</p>
//             <MapPin className="w-3 h-3" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CreateAccountSection() {
//   return (
//     <div>
//       <div>
//         <h2 className="text-xl font-bold">
//           Create an Account to Explore & Contribute!
//         </h2>
//         <p className="text-sm text-zinc-400">
//           Join the Roamr urbex community and unlock exclusive features.{" "}
//         </p>
//         <Separator className="mt-2" />
//       </div>
//       <div className="mt-2 space-y-4">
//         <p>With an account, you can:</p>
//         <ul className="list-disc list-inside">
//           <li>📍 Contribute to the map by adding new locations.</li>
//           <li>⭐️ Rate, review, and leave comments on urbex spots.</li>
//           <li>👥 Connect with fellow explorers and plan trips together</li>
//           <li>
//             💬 Join our exclusive Discord to share experiences, get tips, and
//             stay updated on new features!
//           </li>
//         </ul>
//         <AuthButton />
//       </div>
//     </div>
//   );
// }
