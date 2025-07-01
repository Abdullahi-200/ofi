import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  messageType: "text" | "image" | "audio";
  timestamp: Date;
  isRead: boolean;
}

interface ChatParticipant {
  id: number;
  name: string;
  profileImage?: string;
  role: "customer" | "tailor";
  isOnline: boolean;
  lastSeen?: Date;
}

export default function Chat() {
  const [, params] = useRoute("/chat/:participantId");
  const participantId = params?.participantId ? parseInt(params.participantId) : null;
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mock current user (in real app, get from auth)
  const currentUserId = 1;

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/chat/messages", participantId],
    enabled: !!participantId,
  });

  const { data: participant } = useQuery({
    queryKey: ["/api/chat/participant", participantId],
    enabled: !!participantId,
  });

  const { data: recentChats = [] } = useQuery({
    queryKey: ["/api/chat/recent", currentUserId],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { receiverId: number; content: string; messageType: string }) => {
      return apiRequest("/api/chat/send", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages", participantId] });
      queryClient.invalidateQueries({ queryKey: ["/api/chat/recent", currentUserId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim() || !participantId) return;

    sendMessageMutation.mutate({
      receiverId: participantId,
      content: message.trim(),
      messageType: "text",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (date?: Date) => {
    if (!date) return "Last seen recently";
    const now = new Date();
    const lastSeen = new Date(date);
    const diffMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / 60000);
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return lastSeen.toLocaleDateString();
  };

  if (!participantId) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Recent Chats</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {recentChats.map((chat: any) => (
                    <Link key={chat.id} href={`/chat/${chat.participantId}`}>
                      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b">
                        <Avatar>
                          <AvatarImage src={chat.profileImage} />
                          <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{chat.name}</p>
                            <p className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</p>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                        </div>
                        {chat.unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Empty State */}
          <div className="md:col-span-2 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Send className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No chat selected</h3>
              <p className="text-gray-500">Choose a conversation to start messaging</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[80vh]">
        {/* Chat List - Hidden on mobile when chat is open */}
        <div className={`md:col-span-1 ${participantId ? 'hidden md:block' : ''}`}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Chats</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full overflow-y-auto">
              <div className="space-y-2">
                {recentChats.map((chat: any) => (
                  <Link key={chat.id} href={`/chat/${chat.participantId}`}>
                    <div className={`flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b ${
                      chat.participantId === participantId ? 'bg-blue-50' : ''
                    }`}>
                      <Avatar>
                        <AvatarImage src={chat.profileImage} />
                        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{chat.name}</p>
                          <p className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</p>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Window */}
        <div className="md:col-span-3">
          <Card className="h-full flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Link href="/chat" className="md:hidden">
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                  {participant && (
                    <>
                      <Avatar>
                        <AvatarImage src={participant.profileImage} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{participant.name}</h3>
                        <p className="text-sm text-gray-500">
                          {participant.isOnline ? (
                            <span className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                              Online
                            </span>
                          ) : (
                            formatLastSeen(participant.lastSeen)
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg: Message) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${
                    msg.senderId === currentUserId
                      ? 'bg-ofi-orange text-white rounded-l-lg rounded-tr-lg'
                      : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
                  } px-4 py-2`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.senderId === currentUserId ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-r-lg rounded-tl-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}