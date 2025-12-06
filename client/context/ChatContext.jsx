import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // Fetch all users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch chat messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);

        // RESET unseen messages when user opens chat
        setUnseenMessages((prev) => ({
          ...prev,
          [userId]: 0,
        }));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Send a message
  const sendMessage = async (messageData) => {
    try {
      if (!selectedUser) return;

      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle real-time incoming messages
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {

      // 🎯 If chat is OPEN → add to chat immediately + mark as seen
      if (selectedUser && selectedUser._id === newMessage.senderId) {
        newMessage.seen = true;

        setMessages((prev) => [...prev, newMessage]);

        // Tell server this message has been seen
        axios.put(`/api/messages/mark/${newMessage._id}`);

        // RESET unseen count
        setUnseenMessages((prev) => ({
          ...prev,
          [selectedUser._id]: 0,
        }));

      } else {
        // 🎯 If chat is NOT open → increase unseen count
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]:
            (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    users,
    messages,
    selectedUser,
    unseenMessages,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setMessages,
    setUnseenMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
