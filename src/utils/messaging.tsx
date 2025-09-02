import { projectId, publicAnonKey } from "./supabase/info";

export interface Message {
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

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export class MessagingService {
  private static baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-6e866e97`;

  static async fetchConversations(userId: string): Promise<Conversation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${userId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  static async fetchMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${this.baseUrl}/messages/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  static async sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<Message | null> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          ...message,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  static async markConversationAsRead(conversationId: string, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ userId })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      return false;
    }
  }

  static formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);
    
    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  }

  static generateConversationId(userId1: string, userId2: string): string {
    // Créer un ID de conversation déterministe basé sur les deux utilisateurs
    const sortedIds = [userId1, userId2].sort();
    return `conv_${sortedIds[0]}_${sortedIds[1]}`;
  }

  static createNotificationMessage(orderTitle: string, senderName: string): string {
    const notifications = [
      `Bonjour ! Je souhaite discuter du projet "${orderTitle}".`,
      `Avez-vous des questions concernant "${orderTitle}" ?`,
      `Je suis disponible pour échanger sur "${orderTitle}".`,
      `Pouvons-nous discuter des détails pour "${orderTitle}" ?`
    ];
    
    return notifications[Math.floor(Math.random() * notifications.length)];
  }
}