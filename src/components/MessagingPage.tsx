import { useState, useEffect, useRef } from "react";
import { Send, Search, MoreVertical, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { Card } from "./ui/card.tsx";
import { Input } from "./ui/input.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";
import { Badge } from "./ui/badge.tsx";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

// Mock data - En production, ceci viendrait du backend
const mockConversations: Conversation[] = [
  {
    id: "conv_1",
    participantId: "marie_laurent",
    participantName: "Marie Laurent",
    participantAvatar: "https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjY1NTk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lastMessage: "J'ai préparé 3 propositions pour votre logo",
    lastMessageAt: "2024-08-31T14:30:00Z",
    unreadCount: 2
  },
  {
    id: "conv_2",
    participantId: "thomas_dubois",
    participantName: "Thomas Dubois",
    participantAvatar: "",
    lastMessage: "Votre site est en ligne ! Voici les accès",
    lastMessageAt: "2024-08-31T12:15:00Z",
    unreadCount: 0
  },
  {
    id: "conv_3",
    participantId: "sarah_martin",
    participantName: "Sarah Martin",
    participantAvatar: "",
    lastMessage: "En attente de confirmation du créneau",
    lastMessageAt: "2024-08-30T16:45:00Z",
    unreadCount: 1
  }
];

const mockMessages: { [key: string]: Message[] } = {
  conv_1: [
    {
      id: "msg_1",
      conversationId: "conv_1",
      senderId: "jean_dupont",
      senderName: "Jean Dupont",
      senderAvatar: "",
      receiverId: "marie_laurent",
      receiverName: "Marie Laurent",
      content: "Bonjour Marie, j'aimerais discuter du projet de logo. Avez-vous des questions sur le brief ?",
      timestamp: "2024-08-31T14:00:00Z",
      read: true
    },
    {
      id: "msg_2",
      conversationId: "conv_1",
      senderId: "marie_laurent",
      senderName: "Marie Laurent",
      senderAvatar: "https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjY1NTk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      receiverId: "jean_dupont",
      receiverName: "Jean Dupont",
      content: "Bonjour Jean ! Merci pour votre brief détaillé. J'ai bien compris vos attentes. J'ai quelques questions sur les couleurs préférées.",
      timestamp: "2024-08-31T14:15:00Z",
      read: true
    },
    {
      id: "msg_3",
      conversationId: "conv_1",
      senderId: "marie_laurent",
      senderName: "Marie Laurent",
      senderAvatar: "https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjY1NTk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      receiverId: "jean_dupont",
      receiverName: "Jean Dupont",
      content: "J'ai préparé 3 propositions pour votre logo. Je vous les envoie dans quelques minutes !",
      timestamp: "2024-08-31T14:30:00Z",
      read: false
    }
  ],
  conv_2: [
    {
      id: "msg_4",
      conversationId: "conv_2",
      senderId: "thomas_dubois",
      senderName: "Thomas Dubois",
      senderAvatar: "",
      receiverId: "jean_dupont",
      receiverName: "Jean Dupont",
      content: "Votre site est en ligne ! Voici les accès : https://votresite.com - Admin: admin@votresite.com",
      timestamp: "2024-08-31T12:15:00Z",
      read: true
    }
  ],
  conv_3: [
    {
      id: "msg_5",
      conversationId: "conv_3",
      senderId: "sarah_martin",
      senderName: "Sarah Martin",
      senderAvatar: "",
      receiverId: "jean_dupont",
      receiverName: "Jean Dupont",
      content: "En attente de confirmation du créneau pour nos cours d'anglais. Préférez-vous mardi ou jeudi ?",
      timestamp: "2024-08-30T16:45:00Z",
      read: false
    }
  ]
};

export function MessagingPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = "jean_dupont"; // En production, ceci viendrait du contexte d'authentification

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const conversationMessages = mockMessages[selectedConversation] || [];
      setMessages(conversationMessages);
      
      // Mark conversation as read
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    }
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const selectedConv = conversations.find(c => c.id === selectedConversation);
    if (!selectedConv) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConversation,
      senderId: currentUserId,
      senderName: "Jean Dupont",
      senderAvatar: "",
      receiverId: selectedConv.participantId,
      receiverName: selectedConv.participantName,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Add message to local state
    setMessages(prev => [...prev, message]);
    
    // Update conversation's last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation
          ? { ...conv, lastMessage: newMessage, lastMessageAt: message.timestamp }
          : conv
      )
    );

    setNewMessage("");

    // In production, send to backend:
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6e866e97/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(message)
      });
      
      if (!response.ok) {
        console.error('Failed to send message to backend');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl overflow-hidden shadow-sm border">
      {/* Conversations List */}
      <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} w-full lg:w-1/3 border-r border-gray-200 flex-col`}>
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher des conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>Aucune conversation trouvée</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={conversation.participantAvatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {conversation.participantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.participantName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageAt)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${selectedConversation ? 'flex' : 'hidden lg:flex'} flex-1 flex-col`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={conversations.find(c => c.id === selectedConversation)?.participantAvatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {conversations.find(c => c.id === selectedConversation)?.participantName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {conversations.find(c => c.id === selectedConversation)?.participantName}
                  </h3>
                  <p className="text-sm text-green-600">En ligne</p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.senderId === currentUserId;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {!isOwnMessage && (
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={message.senderAvatar} />
                          <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                            {message.senderName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`rounded-xl px-3 py-2 ${
                        isOwnMessage 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <Input
                  type="text"
                  placeholder="Tapez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 rounded-xl"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sélectionnez une conversation</h3>
              <p className="text-gray-500">Choisissez une conversation pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}