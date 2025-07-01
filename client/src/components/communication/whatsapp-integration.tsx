
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  Phone, 
  Send, 
  Check, 
  CheckCheck,
  Clock,
  User,
  Bot,
  Image,
  FileText,
  MapPin
} from "lucide-react";

interface WhatsAppMessage {
  id: string;
  type: "text" | "image" | "document" | "location" | "template";
  content: string;
  timestamp: Date;
  sender: "user" | "business" | "bot";
  status: "sent" | "delivered" | "read";
  metadata?: any;
}

interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  lastMessage?: WhatsAppMessage;
  isOnline: boolean;
  unreadCount: number;
  type: "customer" | "tailor" | "support";
}

interface WhatsAppIntegrationProps {
  orderId?: number;
  tailorId?: number;
  context?: "order" | "measurement" | "support" | "general";
}

export default function WhatsAppIntegration({ orderId, tailorId, context = "general" }: WhatsAppIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([
    {
      id: "tailor-1",
      name: "Adebayo Tailoring",
      phone: "+234 803 555 0101",
      isOnline: true,
      unreadCount: 2,
      type: "tailor",
      lastMessage: {
        id: "msg-1",
        type: "text",
        content: "Your Agbada is ready for fitting!",
        timestamp: new Date(Date.now() - 300000),
        sender: "business",
        status: "read"
      }
    },
    {
      id: "support-1",
      name: "Ofi Support",
      phone: "+234 700 OFI HELP",
      isOnline: true,
      unreadCount: 0,
      type: "support",
      lastMessage: {
        id: "msg-2",
        type: "text",
        content: "How can we help you today?",
        timestamp: new Date(Date.now() - 600000),
        sender: "bot",
        status: "delivered"
      }
    }
  ]);

  const initializeWhatsAppConnection = async () => {
    setIsConnected(true);
    
    // Simulate loading conversation history
    if (orderId && context === "order") {
      const orderMessages: WhatsAppMessage[] = [
        {
          id: "order-1",
          type: "template",
          content: "Your order #" + orderId + " has been confirmed! We'll keep you updated on the progress.",
          timestamp: new Date(Date.now() - 86400000),
          sender: "bot",
          status: "read"
        },
        {
          id: "order-2",
          type: "text",
          content: "Thank you! When will the measurements session be scheduled?",
          timestamp: new Date(Date.now() - 86000000),
          sender: "user",
          status: "read"
        },
        {
          id: "order-3",
          type: "text",
          content: "Great question! I'll have our tailor reach out to you within 24 hours to schedule your fitting.",
          timestamp: new Date(Date.now() - 85000000),
          sender: "business",
          status: "read"
        }
      ];
      setMessages(orderMessages);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedContact) return;

    const newMessage: WhatsAppMessage = {
      id: Date.now().toString(),
      type: "text",
      content: message,
      timestamp: new Date(),
      sender: "user",
      status: "sent"
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
      ));
    }, 1000);

    // Simulate business response
    setTimeout(() => {
      const responses = [
        "Thank you for your message! We'll get back to you shortly.",
        "I've forwarded your request to our team. Expect a response within 2 hours.",
        "Great! Let me check on that for you.",
        "I understand your concern. Let me connect you with the right person."
      ];
      
      const response: WhatsAppMessage = {
        id: (Date.now() + 1).toString(),
        type: "text",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        sender: selectedContact.type === "support" ? "bot" : "business",
        status: "sent"
      };
      
      setMessages(prev => [...prev, response]);
    }, 3000);
  };

  const sendQuickMessage = (templateMessage: string) => {
    setMessage(templateMessage);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent": return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered": return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read": return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default: return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const quickMessages = [
    "Can you provide an update on my order?",
    "I need to reschedule my fitting appointment",
    "What are the available fabric options?",
    "How long will the delivery take?",
    "I have questions about measurements",
    "Can you help me track my order?"
  ];

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span>WhatsApp Business</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Connect via WhatsApp</h3>
            <p className="text-gray-500 mb-6">
              Get instant updates and communicate directly with tailors through WhatsApp Business API.
            </p>
            <Button 
              onClick={initializeWhatsAppConnection}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start WhatsApp Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* WhatsApp Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span>WhatsApp Business</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Connected
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
            {/* Contacts Sidebar */}
            <div className="lg:col-span-1 border-r pr-4">
              <h4 className="font-medium mb-4">Contacts</h4>
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedContact?.id === contact.id ? "bg-green-50 border border-green-200" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          {contact.type === "tailor" ? <User className="w-6 h-6" /> : 
                           contact.type === "support" ? <Bot className="w-6 h-6" /> : 
                           <MessageCircle className="w-6 h-6" />}
                          {contact.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{contact.name}</p>
                          <p className="text-xs text-gray-500">{contact.phone}</p>
                        </div>
                      </div>
                      {contact.unreadCount > 0 && (
                        <Badge variant="default" className="bg-green-600 text-xs">
                          {contact.unreadCount}
                        </Badge>
                      )}
                    </div>
                    {contact.lastMessage && (
                      <p className="text-xs text-gray-600 truncate">
                        {contact.lastMessage.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 flex flex-col">
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center space-x-3 pb-4 border-b">
                    <div className="relative">
                      {selectedContact.type === "tailor" ? <User className="w-8 h-8" /> : 
                       selectedContact.type === "support" ? <Bot className="w-8 h-8" /> : 
                       <MessageCircle className="w-8 h-8" />}
                      {selectedContact.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{selectedContact.name}</h4>
                      <p className="text-sm text-gray-500">
                        {selectedContact.isOnline ? "Online" : "Last seen recently"}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === "user"
                              ? "bg-green-600 text-white"
                              : msg.sender === "bot"
                              ? "bg-blue-100 text-blue-900"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {msg.type === "template" && (
                            <div className="border-l-4 border-orange-400 pl-2 mb-2">
                              <p className="text-xs font-medium">Order Update</p>
                            </div>
                          )}
                          <p className="text-sm">{msg.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {msg.sender === "user" && getStatusIcon(msg.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Replies */}
                  <div className="py-2 border-t">
                    <p className="text-xs text-gray-500 mb-2">Quick messages:</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {quickMessages.slice(0, 3).map((quickMsg, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => sendQuickMessage(quickMsg)}
                          className="text-xs"
                        >
                          {quickMsg}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="flex space-x-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} className="bg-green-600 hover:bg-green-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Select a contact to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Features */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Business Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium">Instant Messaging</h4>
              <p className="text-sm text-gray-600">Real-time communication with tailors</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-medium">Order Updates</h4>
              <p className="text-sm text-gray-600">Automated progress notifications</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Image className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-medium">Media Sharing</h4>
              <p className="text-sm text-gray-600">Share images and documents</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Bot className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <h4 className="font-medium">AI Assistant</h4>
              <p className="text-sm text-gray-600">24/7 automated support</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business API Info */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Business API Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Active Features</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Template messages for order updates</li>
                <li>• Media message support (images, docs)</li>
                <li>• Read receipts and delivery status</li>
                <li>• Automated customer support bot</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Business Benefits</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 95% message open rate</li>
                <li>• Instant customer communication</li>
                <li>• Reduced support ticket volume</li>
                <li>• Improved customer satisfaction</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
