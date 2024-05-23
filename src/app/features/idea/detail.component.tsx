import { FC, useCallback } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

const IdeaDetail: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <>
      <ReactFlow
        className="w-full h-full"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        panOnScroll
        onPaneClick={(ev) => {
          console.log(ev);
        }}
      >
        <Background />
        <Controls />
        <MiniMap zoomable pannable />
      </ReactFlow>
    </>
  );
};

export default IdeaDetail;
