import { Bell, MessageCircle } from "lucide-react";
import { Badge } from "./ui/badge.tsx";
import { Button } from "./ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";

interface MessageNotificationProps {
  unreadCount: number;
  onViewMessages: () => void;
}

const recentMessages = [
  {
    id: "1",
    senderName: "Marie Laurent",
    senderAvatar: "https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NjY1NTk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    message: "J'ai préparé 3 propositions pour votre logo",
    timestamp: "Il y a 5 min",
    isUnread: true
  },
  {
    id: "2",
    senderName: "Sarah Martin",
    senderAvatar: "",
    message: "En attente de confirmation du créneau",
    timestamp: "Il y a 2h",
    isUnread: true
  },
  {
    id: "3",
    senderName: "Thomas Dubois",
    senderAvatar: "",
    message: "Votre site est en ligne !",
    timestamp: "Hier",
    isUnread: false
  }
];

export function MessageNotification({ unreadCount, onViewMessages }: MessageNotificationProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <MessageCircle className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Messages</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
            </Badge>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <div className="max-h-64 overflow-y-auto">
          {recentMessages.map((message) => (
            <DropdownMenuItem
              key={message.id}
              className="p-3 cursor-pointer flex items-start space-x-3"
              onClick={onViewMessages}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={message.senderAvatar} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  {message.senderName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-sm truncate ${message.isUnread ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                    {message.senderName}
                  </p>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{message.message}</p>
                {message.isUnread && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="p-3 text-center" onClick={onViewMessages}>
          <span className="text-sm text-blue-600 font-medium cursor-pointer">
            Voir tous les messages
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}