import { motion } from "framer-motion";

interface Props {
  roomId: string;
  setRoomId: (id: string) => void;
  onConnect: () => void;
  onCreate: () => void;
}

export const JoinRoom = ({ roomId, setRoomId, onConnect, onCreate }: Props) => {
  return (
    <motion.div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Enter Room ID</h1>
      <input
        className="border rounded-xl p-3 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter Room ID..."
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <div className="flex space-x-4">
        <motion.button
          onClick={onConnect}
          className="bg-green-600 text-white rounded-xl p-3 w-28 font-semibold hover:bg-green-700"
        >
          Join
        </motion.button>
        <motion.button
          onClick={onCreate}
          className="bg-blue-600 text-white rounded-xl p-3 w-28 font-semibold hover:bg-blue-700"
        >
          Create
        </motion.button>
      </div>
    </motion.div>
  );
};
