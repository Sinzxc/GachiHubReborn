import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ChannelList from "./ChannelList";
import VoiceCall from "./VoiceCall";
import Profile from "./Profile";
import IRoom from "../types/IRoom";
import NotSelected from "./NotSelected";
import mockRooms from "../mock/mockRooms";
import IUser from "../types/IUser";
import mockUsers from "../mock/mockUsers";
import { Login } from "./Login";
import { Register } from "./Register";
import { authApi } from "../api/services/authApi";

function App() {
  const [currentUser, setCurrentUser] = useState<IUser>(mockUsers[0]);
  const [rooms, setRooms] = useState<IRoom[]>(mockRooms);
  const [currentRoom, setCurrentRoom] = useState<IRoom | null>();
  const location = useLocation();
  const navigate = useNavigate();
  authApi.setNavigate(navigate);

  useEffect(() => {
    const initialize = async () => {
      if (location.pathname != "/login" && location.pathname != "/register") {
        const isAuthorized = await authApi.checkAuth();
        if (isAuthorized) {
          const user = await authApi.getUser();
          if (user != undefined) setCurrentUser(user as IUser);
        }
      }
    };
    initialize();
  }, [location]);
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {location.pathname != "/login" && location.pathname != "/register" && (
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
      )}
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
