 
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Send,
  User,
  ArrowLeft,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Message = () => {
  const { user, backendUrl } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationLoading, setConversationLoading] =
    useState(false);

  const messagesEndRef = useRef(null);

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // GET USER ID
  // =====================================================

  const getUserId = () => {
    return user?._id || user?.id;
  };

  // =====================================================
  // AUTH HEADERS
  // =====================================================

  const getAuthHeaders = () => {
    const token = getToken();

    return {
      headers: {
        token: token,
      },
    };
  };

  // =====================================================
  // GET MY MESSAGES
  // =====================================================

  const getMyMessages = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/message/my-messages`,
        getAuthHeaders()
      );

      if (data.success) {
        setMessages(data.messages || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Get Messages Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load messages"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET CONVERSATION
  // =====================================================

  const getConversation = async (
    reportId,
    userId
  ) => {
    try {
      setConversationLoading(true);

      const token = getToken();

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/message/conversation/${reportId}/${userId}`,
        getAuthHeaders()
      );

      if (data.success) {
        setConversation(data.messages || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(
        "Get Conversation Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load conversation"
      );
    } finally {
      setConversationLoading(false);
    }
  };

  // =====================================================
  // LOAD MESSAGES WHEN USER LOGS IN
  // =====================================================

  useEffect(() => {
    if (user) {
      getMyMessages();
    }
  }, [user]);

  // =====================================================
  // AUTO SCROLL TO LAST MESSAGE
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [conversation]);

  // =====================================================
  // CREATE CHAT LIST
  // =====================================================

  const chatList = [];

  messages.forEach((msg) => {
    const senderId = msg.sender?._id
      ? String(msg.sender._id)
      : null;

    const receiverId = msg.receiver?._id
      ? String(msg.receiver._id)
      : null;

    const currentUserId = getUserId()
      ? String(getUserId())
      : null;

    if (!senderId || !receiverId) {
      return;
    }

    // Find the other person
    const otherUser =
      senderId === currentUserId
        ? msg.receiver
        : msg.sender;

    const otherUserId =
      senderId === currentUserId
        ? receiverId
        : senderId;

    const report = msg.reportId;

    const reportId = report?._id
      ? String(report._id)
      : null;

    if (!otherUserId || !reportId) {
      return;
    }

    // Check whether this conversation already exists
    const existingChat = chatList.find(
      (chat) =>
        chat.userId === otherUserId &&
        chat.reportId === reportId
    );

    // If conversation doesn't exist, create it
    if (!existingChat) {
      chatList.push({
        userId: otherUserId,
        user: otherUser,
        reportId: reportId,
        report: report,
        lastMessage: msg.message,
        lastMessageTime: msg.createdAt,
      });
    } else {
      // Update latest message
      const existingTime = new Date(
        existingChat.lastMessageTime
      ).getTime();

      const currentTime = new Date(
        msg.createdAt
      ).getTime();

      if (currentTime > existingTime) {
        existingChat.lastMessage =
          msg.message;

        existingChat.lastMessageTime =
          msg.createdAt;
      }
    }
  });

  // =====================================================
  // SORT CHAT LIST BY LATEST MESSAGE
  // =====================================================

  chatList.sort(
    (a, b) =>
      new Date(b.lastMessageTime) -
      new Date(a.lastMessageTime)
  );

  // =====================================================
  // SELECT CHAT
  // =====================================================

  const selectChat = (chat) => {
    setSelectedChat(chat);

    setConversation([]);

    getConversation(
      chat.reportId,
      chat.userId
    );
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSend = async () => {
    if (!text.trim()) {
      toast.error("Please write a message");
      return;
    }

    if (!selectedChat) {
      toast.error("Please select a conversation");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const messageText = text.trim();

      const { data } = await axios.post(
        `${backendUrl}/api/message/send`,
        {
          receiver: selectedChat.userId,
          reportId: selectedChat.reportId,
          message: messageText,
        },
        getAuthHeaders()
      );

      if (data.success) {
        setText("");

        // Reload conversation
        await getConversation(
          selectedChat.reportId,
          selectedChat.userId
        );

        // Reload chat list
        await getMyMessages();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(
        "Send Message Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to send message"
      );
    }
  };

  // =====================================================
  // ENTER KEY TO SEND
  // =====================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  // =====================================================
  // IF USER NOT LOGGED IN
  // =====================================================

  if (!user) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold">
          Please login first
        </h1>
      </div>
    );
  }

 

  return (
    <div className="mx-4 sm:mx-6 md:mx-10 lg:mx-16 xl:mx-24 mt-10 mb-10">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Messages
      </h1>

   
      <div className="grid md:grid-cols-3 border border-gray-200 rounded-xl overflow-hidden min-h-[600px] shadow-sm bg-white">

        {/* =================================================
            LEFT SIDE - CHAT LIST
        ================================================= */}

        <div
          className={`border-r border-gray-200 ${
            selectedChat
              ? "hidden md:block"
              : "block"
          }`}
        >

          {/* HEADER */}
          <div className="p-4 border-b border-gray-200 font-semibold text-lg">
            Conversations
          </div>

          {/* LOADING */}
          {loading && (
            <p className="p-4 text-gray-500">
              Loading...
            </p>
          )}

          {/* NO MESSAGES */}
          {!loading &&
            chatList.length === 0 && (
              <div className="p-6 text-center">
                <User
                  size={40}
                  className="mx-auto text-gray-300 mb-3"
                />

                <p className="text-gray-500">
                  No messages yet.
                </p>
              </div>
            )}

          {/* CHAT LIST */}
          {!loading &&
            chatList.map(
              (chat, index) => {
                const isSelected =
                  selectedChat?.userId ===
                    chat.userId &&
                  selectedChat?.reportId ===
                    chat.reportId;

                return (
                  <button
                    key={`${chat.userId}-${chat.reportId}-${index}`}
                    onClick={() =>
                      selectChat(chat)
                    }
                    className={`w-full text-left p-4 border-b border-gray-200 transition ${
                      isSelected
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      {/* PROFILE ICON */}
                      <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <User
                          size={21}
                          className="text-green-700"
                        />
                      </div>

                      {/* USER DETAILS */}
                      <div className="min-w-0 flex-1">

                        <p className="font-semibold truncate text-gray-900">
                          {chat.user?.name ||
                            "User"}
                        </p>

                        {/* ITEM NAME */}
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {chat.report?.name ||
                            "Item"}
                        </p>

                        {/* LAST MESSAGE */}
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {chat.lastMessage}
                        </p>

                      </div>

                    </div>
                  </button>
                );
              }
            )}
        </div>

        {/* =================================================
            RIGHT SIDE - CONVERSATION
        ================================================= */}

        <div
          className={`md:col-span-2 flex flex-col ${
            selectedChat
              ? "block"
              : "hidden md:flex"
          }`}
        >

          {/* NO CHAT SELECTED */}
          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation
            </div>
          ) : (
            <>
              {/* ==========================================
                  CHAT HEADER
              ========================================== */}

              <div className="p-4 border-b border-gray-200 flex items-center gap-3">

                {/* BACK BUTTON FOR MOBILE */}
                <button
                  onClick={() =>
                    setSelectedChat(null)
                  }
                  className="md:hidden p-1 hover:bg-gray-100 rounded"
                >
                  <ArrowLeft size={22} />
                </button>

                {/* PROFILE */}
                <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                  <User
                    size={21}
                    className="text-green-700"
                  />
                </div>

                {/* USER + ITEM */}
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedChat.user?.name ||
                      "User"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {selectedChat.report?.name ||
                      "Item"}
                  </p>
                </div>

              </div>

              {/* ==========================================
                  MESSAGES
              ========================================== */}

              <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[450px]">

                {conversationLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">
                      Loading conversation...
                    </p>
                  </div>
                ) : conversation.length ===
                  0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">
                      No messages yet. Start the
                      conversation.
                    </p>
                  </div>
                ) : (
                  conversation.map((msg) => {

                    // ==================================
                    // IMPORTANT:
                    // CHECK WHO SENT THE MESSAGE
                    // ==================================

                    const senderId =
                      msg.sender?._id
                        ? String(
                            msg.sender._id
                          )
                        : "";

                    const currentUserId =
                      getUserId()
                        ? String(
                            getUserId()
                          )
                        : "";

                    const isMine =
                      senderId ===
                      currentUserId;

                    return (
                      <div
                        key={msg._id}
                        className={`flex w-full ${
                          isMine
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >

                        {/* MESSAGE BUBBLE */}

                        <div
                          className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                            isMine
                              ? "bg-green-600 text-white rounded-br-sm"
                              : "bg-gray-100 text-gray-800 rounded-bl-sm"
                          }`}
                        >

                          {/* MESSAGE TEXT */}
                          <p className="break-words whitespace-pre-wrap">
                            {msg.message}
                          </p>

                          {/* MESSAGE TIME */}
                          <p
                            className={`text-[10px] mt-1 ${
                              isMine
                                ? "text-green-100 text-right"
                                : "text-gray-400 text-left"
                            }`}
                          >
                            {formatDate(
                              msg.createdAt
                            )}
                          </p>

                        </div>
                      </div>
                    );
                  })
                )}

                {/* AUTO SCROLL TARGET */}
                <div ref={messagesEndRef} />

              </div>

              {/* ==========================================
                  MESSAGE INPUT
              ========================================== */}

              <div className="p-4 border-t border-gray-200 flex gap-3">

                <input
                  type="text"
                  value={text}
                  onChange={(e) =>
                    setText(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Write a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600"
                />

                <button
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className={`px-5 rounded-lg transition flex items-center justify-center ${
                    text.trim()
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send size={20} />
                </button>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;