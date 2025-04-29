import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChannelList from "./ChannelList";
import VoiceCall from "./VoiceCall";
import Profile from "./Profile";
import IRoom from "../types/IRoom";
import NotSelected from "./NotSelected";
import mockRooms from "../mock/mockRooms";
import IUser from "../types/IUser";
import mockUsers from "../mock/mockUsers";

function App() {
  const [currentUser, setCurrentUser] = useState<IUser>(mockUsers[0]);
  const [rooms, setRooms] = useState<IRoom[]>(mockRooms);
  const [currentRoom, setCurrentRoom] = useState<IRoom | null>();
  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen overflow-hidden">
        <div
          className="flex h-full bg-gray-800 shadow-lg"
          style={{ width: "300px" }}
        >
          <ChannelList
            rooms={rooms}
            currentUser={currentUser}
            setCurrentRoom={setCurrentRoom}
          />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              currentRoom ? (
                <VoiceCall
                  setCurrentRoom={setCurrentRoom}
                  currentRoom={currentRoom}
                />
              ) : (
                <NotSelected />
              )
            }
          />
          <Route
            path="/profile"
            element={<Profile user={currentUser} setUser={setCurrentUser} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
