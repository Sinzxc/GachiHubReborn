import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faMicrophone,
  faHeadphones,
  faVideoCamera,
  faPhoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import Chat from "./Chat";
import IRoom from "../types/IRoom";

const VoiceCall = ({
  currentRoom,
  setCurrentRoom,
}: {
  currentRoom: IRoom;
  setCurrentRoom: (room: IRoom | null) => void;
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="w-full flex">
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col bg-gray-700">
          {/* Call Header */}
          <div className="h-12 px-4 border-b border-gray-600 flex items-center justify-between">
            <span className="font-bold text-white">{currentRoom.title}</span>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`text-gray-400 hover:text-gray-200 transition-colors ${
                isChatOpen ? "text-white" : ""
              }`}
            >
              <FontAwesomeIcon icon={faMessage} />
            </button>
          </div>

          {/* Call Content */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="grid grid-cols-3 gap-10 mb-10">
                <img
                  className="w-50 h-50 rounded-full"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6IPK3Ql8y9idUapZWbKfyR2Vc38z4dTcfJg&s"
                  alt=""
                />
              </div>
              <div className="mb-8">Голосовой канал</div>
              <div className="flex gap-4 justify-center">
                <button className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white hover:bg-gray-500">
                  <FontAwesomeIcon icon={faMicrophone} />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white hover:bg-gray-500">
                  <FontAwesomeIcon icon={faHeadphones} />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white hover:bg-gray-500">
                  <FontAwesomeIcon icon={faVideoCamera} />
                </button>
                <button
                  onClick={() => setCurrentRoom(null)}
                  className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600"
                >
                  <FontAwesomeIcon icon={faPhoneSlash} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {isChatOpen && (
          <div className="w-[300px] border-l border-gray-600">
            <Chat isShowAllUsers={false} setIsShowAllUsers={() => {}} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceCall;
