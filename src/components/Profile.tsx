import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCamera } from "@fortawesome/free-solid-svg-icons";
import IUser from "../types/IUser";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
  user: IUser;
  setUser: (user: IUser) => void;
}

const Profile = ({ user, setUser }: ProfileProps) => {
  const [login, setLogin] = useState(user.login);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login.trim()) {
      setUser({
        ...user,
        login: login.trim(),
      });
      navigate("/");
    }
  };

  return (
    <div className="bg-gray-700 w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <h1 className="text-xl font-bold text-white">User Settings</h1>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" />
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Settings Panel */}
        <div className="w-1/2 p-6 border-r border-gray-600">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                USERNAME
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                NEW PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                AVATAR
              </label>
              <div className="relative w-24 h-24 group cursor-pointer">
                <div className="w-full h-full rounded-lg bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {login[0].toUpperCase()}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <FontAwesomeIcon
                    icon={faCamera}
                    className="text-white text-xl"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 p-6 bg-gray-800">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-medium text-gray-400 mb-6">Preview</h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {login[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{login}</h3>
                  <p className="text-gray-400">#{user.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
