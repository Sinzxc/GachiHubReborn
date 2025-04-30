import { useEffect, useState, useRef } from "react";
import IRoom from "../types/IRoom";
import { connectionApi } from "../api/services/connectionApi";
import IUser from "../types/IUser";

export default function Calling({
  currentRoom,
  addUserToRoom,
  setCurrentRoom,
  currentUser,
  isInCall,
}: {
  currentRoom: IRoom | null | undefined;
  addUserToRoom: (room: IRoom) => void;
  setCurrentRoom: (room: IRoom | null) => void;
  currentUser: IUser;
  isInCall: boolean;
}) {
  //   useEffect(() => {
  //     if (currentRoom != null && currentRoom != undefined) {
  //       connectionApi.connection?.invoke("JoinRoom", currentRoom.id);
  //     }
  //   }, [currentRoom]);

  // Функция для создания нового RTCPeerConnection
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [pendingCandidates, setPendingCandidates] = useState<RTCIceCandidate[]>(
    []
  );
  const [volume, setVolume] = useState<number>(100);

  const iceServers = [
    {
      urls: import.meta.env.VITE_TURN_SERVER_IP,
      username: import.meta.env.VITE_TURN_SERVER_USERNAME,
      credential: import.meta.env.VITE_TURN_SERVER_CREDENTIAL,
    },
  ];

  const createNewPeerConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const newPeerConnection = new RTCPeerConnection({ iceServers });
    peerConnectionRef.current = newPeerConnection;
    return newPeerConnection;
  };

  useEffect(() => {
    if (isInCall == false) {
      stopStreaming();
      console.log("stopped");
    }
  }, [isInCall]);

  async function stopStreaming() {
    try {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(undefined);
      }

      // Закрываем текущее соединение
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        // Создаем новое соединение
        peerConnectionRef.current = new RTCPeerConnection({ iceServers });
      }
    } catch (error) {
      console.error("Error stopping voice:", error);
    }
  }

  useEffect(() => {
    connectionApi.connection?.on("JoinedRoom", (user: IUser, room: IRoom) => {
      addUserToRoom(room);
      setCurrentRoom(room);

      const connect = async () => {
        const newPeerConnection = createNewPeerConnection();

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setLocalStream(stream);

        stream.getTracks().forEach((track) => {
          newPeerConnection.addTrack(track, stream);
        });

        const offer = await newPeerConnection.createOffer();
        await newPeerConnection.setLocalDescription(offer);
        connectionApi.connection?.invoke("SendOffer", offer);
      };

      if (user.id == currentUser.id) connect();
    });

    connectionApi.connection?.on(
      "ReceiveOffer",
      async (response: {
        offer: RTCSessionDescriptionInit;
        fromUserId: number;
      }) => {
        console.log(peerConnectionRef.current);
        if (!localStream) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
            });
            setLocalStream(stream);

            stream.getTracks().forEach((track) => {
              peerConnectionRef.current?.addTrack(track, stream);
            });
          } catch (error) {
            console.error("Ошибка при получении доступа к микрофону:", error);
          }
        }
        await peerConnectionRef.current?.setRemoteDescription(
          new RTCSessionDescription(response.offer)
        );
        const answer = await peerConnectionRef.current?.createAnswer();
        await peerConnectionRef.current?.setLocalDescription(answer);
        connectionApi.connection?.invoke(
          "SendAnswer",
          answer,
          response.fromUserId
        );
      }
    );
    connectionApi.connection?.on(
      "ReceiveAnswer",
      async (response: { answer: any; fromUserId: number }) => {
        console.log(response);
        // if (!peerConnectionRef.current) return;
        await peerConnectionRef.current?.setRemoteDescription(
          new RTCSessionDescription(response.answer)
        );
      }
    );

    connectionApi.connection?.on("LeavedRoom", (user: IUser, room: IRoom) => {
      addUserToRoom(room);
      setCurrentRoom(room);
    });

    connectionApi.connection?.on(
      "ReceiveCandidate",
      async (response: { candidate: RTCIceCandidate; fromUserId: number }) => {
        try {
          if (peerConnectionRef.current?.remoteDescription) {
            await peerConnectionRef.current?.addIceCandidate(
              new RTCIceCandidate(response.candidate)
            );
          } else {
            // Сохраняем кандидата для последующего добавления
            setPendingCandidates((prev) => [...prev, response.candidate]);
          }
        } catch (error) {
          console.error("Ошибка при добавлении ICE кандидата:", error);
        }
      }
    );

    return () => {
      connectionApi.connection?.off("JoinedRoom");
      connectionApi.connection?.off("LeavedRoom");
      connectionApi.connection?.off("ReceiveOffer");
      connectionApi.connection?.off("ReceiveAnswer");
      connectionApi.connection?.off("ReceiveCandidate");
    };
  }, [connectionApi.connection]);

  useEffect(() => {
    if (peerConnectionRef.current != null) {
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          connectionApi.connection?.invoke("SendCandidate", event.candidate);
          console.log("onicecandidate");
        }
      };
      peerConnectionRef.current.ontrack = (event) => {
        const remoteAudio = document.getElementById(
          "remoteAudio"
        ) as HTMLAudioElement;
        if (remoteAudio && event.streams[0]) {
          remoteAudio.srcObject = event.streams[0];
          remoteAudio.volume = volume / 100; // Устанавливаем начальную громкость
        }
      };
    }
  }, [peerConnectionRef.current]);

  useEffect(() => {
    const addPendingCandidates = async () => {
      if (
        peerConnectionRef.current?.remoteDescription &&
        pendingCandidates.length > 0
      ) {
        for (const candidate of pendingCandidates) {
          try {
            await peerConnectionRef.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          } catch (error) {
            console.error(
              "Ошибка при добавлении отложенного ICE кандидата:",
              error
            );
          }
        }
        setPendingCandidates([]); // Очищаем список отложенных кандидатов
      }
    };

    addPendingCandidates();
  }, [peerConnectionRef.current?.remoteDescription, pendingCandidates]);

  return (
    <>
      <audio id="remoteAudio" autoPlay playsInline className="hidden"></audio>
    </>
  );
}
