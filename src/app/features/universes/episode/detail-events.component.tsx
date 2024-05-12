// import { Tables } from "@supabase/database.type";
// import { FC, useMemo } from "react";
// import { useEventUnions } from "../event/hooks";
// import { multiStock } from "@/common/utils/stocker.util";
// import { EventUnion, EventUnionReq } from "@/app/api/union/event.union.api";
// import { UILoadingBox } from "@/common/ui/loading.ui";
// import { episodePartNoEnum } from "@/app/enum/episode-part-no.enum";
// import UITimeline from "@/common/ui/timeline.ui";
// import { ArrowLeftIcon, PenToolIcon, PlusIcon } from "lucide-react";
// import UILongText from "@/common/ui/long-text";
// import { useKeyActionEffect } from "@/common/utils/key-action.util";
// import { useConfirm } from "@/common/ui/confirm.ui";
// import { eventApi } from "@/app/api/table/universe/event.api";
// import Event_Editor from "../event/editor.component";
// import { episodeEventApi } from "@/app/api/table/universe/scene_event.api";
// import { DateUtil } from "@/common/utils/date.util";

// function makeInitReq(episode: Tables<"episodes">, partNo: number): EventUnionReq {
//   return {
//     event: eventApi.emptyReq(episode.universe_id, "", partNo),
//     period: eventApi.emptyReq(episode.universe_id),
//     characterUnions: [],
//     episodeUnions: [
//       {
//         relation: episodeEventApi.emptyReq(episode.universe_id, episode.id, ""),
//         episode,
//       },
//     ],
//   };
// }

// const Episode_DetailEvents: FC<{ episode: Tables<"episodes">; editing?: boolean; toggleEditing?: () => void }> = ({
//   episode,
//   editing,
//   toggleEditing,
// }) => {
//   const { confirm } = useConfirm();
//   const { data: eventUnions, isLoading } = useEventUnions({
//     type: "episode",
//     universe_id: episode.universe_id,
//     episode_id: episode.id,
//   });
//   const stocker = useMemo(
//     () => multiStock<EventUnion>((u) => u.event.part_no.toString()).setAll(eventUnions ?? []),
//     [eventUnions],
//   );
//   function startEditEvent(initReq: EventUnionReq) {
//     confirm({
//       RenderContent: (props) => {
//         return <Event_Editor initReq={initReq} onSave={props.ok} onCancel={props.cancel} />;
//       },
//     });
//   }
//   useKeyActionEffect({
//     onCtrlE() {
//       !editing && toggleEditing && toggleEditing();
//     },
//     onEscape() {
//       editing && toggleEditing && toggleEditing();
//     },
//     onCtrlS() {
//       editing && toggleEditing && toggleEditing();
//     },
//   });
//   if (isLoading) {
//     return <UILoadingBox />;
//   }
//   return (
//     <>
//       <div className="space-y-2">
//         {episodePartNoEnum.options.map((opt) => {
//           const events = stocker.get(opt.value);
//           return (
//             <div key={opt.value}>
//               <div className="card card-compact card-bordered p-2">
//                 <div className="card-title text-xl">{opt.label}</div>
//                 <div className="card-body">
//                   <UILongText>
//                     {opt.value == "1" && episode.part_1}
//                     {opt.value == "2" && episode.part_2}
//                     {opt.value == "3" && episode.part_3}
//                     {opt.value == "4" && episode.part_4}
//                   </UILongText>
//                 </div>
//               </div>
//               <UITimeline
//                 className="mx-3"
//                 dispEdge
//                 items={events
//                   .map((eventUnion) => {
//                     return {
//                       end: (
//                         <div className="space-y-2">
//                           <div>
//                             <div className="flex items-center space-x-2">
//                               <div className="text-sm truncate">
//                                 {DateUtil.dateFormat(eventApi.toDate(eventUnion.event), "YYYY-MM-DD hh:mm")}
//                               </div>
//                               <div className="font-semibold text-lg">{eventUnion.event.name}</div>
//                             </div>

//                             <UILongText className="text-sm">{eventUnion.event.detail}</UILongText>
//                           </div>
//                           {editing && (
//                             <>
//                               <div>
//                                 <button
//                                   className="btn btn-success btn-sm"
//                                   onClick={() => {
//                                     startEditEvent(eventUnion);
//                                   }}
//                                 >
//                                   編集
//                                   <PenToolIcon />
//                                 </button>
//                               </div>
//                             </>
//                           )}
//                         </div>
//                       ),
//                     };
//                   })
//                   .concat(
//                     editing
//                       ? [
//                           {
//                             end: (
//                               <div className="flex items-center space-x-2">
//                                 <button
//                                   className="btn btn-success btn-sm"
//                                   onClick={() => {
//                                     startEditEvent(makeInitReq(episode, parseInt(opt.value)));
//                                   }}
//                                 >
//                                   イベント追加
//                                   <PlusIcon />
//                                 </button>
//                                 <button
//                                   className="btn btn-sm"
//                                   onClick={() => {
//                                     startEditEvent(makeInitReq(episode, parseInt(opt.value)));
//                                   }}
//                                 >
//                                   イベント選択
//                                   <PlusIcon />
//                                 </button>
//                               </div>
//                             ),
//                           },
//                         ]
//                       : [],
//                   )}
//               />
//             </div>
//           );
//         })}
//       </div>
//       {toggleEditing && (
//         <div className="absolute bottom-4 right-4">
//           <button
//             className="btn btn-circle"
//             onClick={() => {
//               toggleEditing();
//             }}
//           >
//             {editing ? <ArrowLeftIcon /> : <PenToolIcon />}
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default Episode_DetailEvents;
