import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize storage buckets on startup
(async () => {
  try {
    const bucketName = 'make-6e866e97-service-photos';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
      console.log(`Created storage bucket: ${bucketName}`);
    }
  } catch (error) {
    console.log(`Error initializing storage: ${error}`);
  }
})();

// Health check endpoint
app.get("/make-server-6e866e97/health", (c) => {
  return c.json({ status: "ok" });
});

// Messages endpoints
app.get("/make-server-6e866e97/conversations/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const conversations = await kv.getByPrefix(`conversation_${userId}_`);
    
    // Sort conversations by last message timestamp
    const sortedConversations = conversations
      .map(conv => JSON.parse(conv))
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    
    return c.json(sortedConversations);
  } catch (error) {
    console.log(`Error fetching conversations: ${error}`);
    return c.json({ error: "Failed to fetch conversations" }, 500);
  }
});

app.get("/make-server-6e866e97/messages/:conversationId", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    const messages = await kv.getByPrefix(`message_${conversationId}_`);
    
    // Sort messages by timestamp
    const sortedMessages = messages
      .map(msg => JSON.parse(msg))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return c.json(sortedMessages);
  } catch (error) {
    console.log(`Error fetching messages: ${error}`);
    return c.json({ error: "Failed to fetch messages" }, 500);
  }
});

app.post("/make-server-6e866e97/messages", async (c) => {
  try {
    const { conversationId, senderId, senderName, senderAvatar, receiverId, receiverName, content, timestamp } = await c.req.json();
    
    if (!conversationId || !senderId || !receiverId || !content) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    const messageId = `message_${conversationId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const message = {
      id: messageId,
      conversationId,
      senderId,
      senderName,
      senderAvatar,
      receiverId,
      receiverName,
      content,
      timestamp: timestamp || new Date().toISOString(),
      read: false
    };
    
    // Save message
    await kv.set(messageId, JSON.stringify(message));
    
    // Update or create conversation for sender
    const senderConvKey = `conversation_${senderId}_${conversationId}`;
    const senderConv = {
      id: conversationId,
      participantId: receiverId,
      participantName: receiverName,
      participantAvatar: "",
      lastMessage: content,
      lastMessageAt: message.timestamp,
      unreadCount: 0
    };
    await kv.set(senderConvKey, JSON.stringify(senderConv));
    
    // Update or create conversation for receiver
    const receiverConvKey = `conversation_${receiverId}_${conversationId}`;
    const receiverConv = {
      id: conversationId,
      participantId: senderId,
      participantName: senderName,
      participantAvatar: senderAvatar,
      lastMessage: content,
      lastMessageAt: message.timestamp,
      unreadCount: 1 // New message for receiver
    };
    await kv.set(receiverConvKey, JSON.stringify(receiverConv));
    
    return c.json(message);
  } catch (error) {
    console.log(`Error sending message: ${error}`);
    return c.json({ error: "Failed to send message" }, 500);
  }
});

app.post("/make-server-6e866e97/conversations/:conversationId/read", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    const { userId } = await c.req.json();
    
    if (!userId) {
      return c.json({ error: "Missing userId" }, 400);
    }
    
    // Mark conversation as read
    const convKey = `conversation_${userId}_${conversationId}`;
    const convData = await kv.get(convKey);
    if (convData) {
      const conversation = JSON.parse(convData);
      conversation.unreadCount = 0;
      await kv.set(convKey, JSON.stringify(conversation));
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error marking conversation as read: ${error}`);
    return c.json({ error: "Failed to mark as read" }, 500);
  }
});

// Service photo upload endpoint
app.post("/make-server-6e866e97/upload-service-photo", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('photo') as File;
    const serviceId = formData.get('serviceId') as string;
    
    if (!file || !serviceId) {
      return c.json({ error: "Photo et ID de service requis" }, 400);
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${serviceId}_${Date.now()}.${fileExt}`;
    const bucketName = 'make-6e866e97-service-photos';
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
      
    if (uploadError) {
      console.log(`Error uploading photo: ${uploadError}`);
      return c.json({ error: "Erreur lors de l'upload" }, 500);
    }
    
    // Create signed URL for the uploaded photo
    const { data: signedUrl } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry
      
    return c.json({ 
      success: true, 
      fileName,
      url: signedUrl?.signedUrl 
    });
  } catch (error) {
    console.log(`Error in upload service photo: ${error}`);
    return c.json({ error: "Erreur lors de l'upload de la photo" }, 500);
  }
});

// Service creation endpoint
app.post("/make-server-6e866e97/services", async (c) => {
  try {
    const { title, description, price, category, photos, userId, deliveryTime } = await c.req.json();
    
    if (!title || !description || !price || !userId) {
      return c.json({ error: "Champs requis manquants" }, 400);
    }
    
    const serviceId = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const service = {
      id: serviceId,
      title,
      description,
      price: parseFloat(price),
      category,
      photos: photos || [],
      userId,
      deliveryTime,
      createdAt: new Date().toISOString(),
      status: 'pending_payment', // Service en attente de paiement
      paymentStatus: 'pending'
    };
    
    await kv.set(serviceId, JSON.stringify(service));
    
    return c.json({ success: true, service });
  } catch (error) {
    console.log(`Error creating service: ${error}`);
    return c.json({ error: "Erreur lors de la création du service" }, 500);
  }
});

// Process service payment endpoint
app.post("/make-server-6e866e97/process-service-payment", async (c) => {
  try {
    const { serviceId, paymentMethod, amount } = await c.req.json();
    
    if (!serviceId || !paymentMethod || !amount) {
      return c.json({ error: "Paramètres de paiement manquants" }, 400);
    }
    
    const serviceData = await kv.get(serviceId);
    if (!serviceData) {
      return c.json({ error: "Service non trouvé" }, 404);
    }
    
    const service = JSON.parse(serviceData);
    
    // Simulate payment processing (in real app, integrate with Stripe/PayPal)
    const paymentSuccess = true; // Mock payment success
    
    if (paymentSuccess) {
      service.status = 'active';
      service.paymentStatus = 'paid';
      service.paidAt = new Date().toISOString();
      service.refundDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
      
      await kv.set(serviceId, JSON.stringify(service));
      
      return c.json({ success: true, service });
    } else {
      return c.json({ error: "Échec du paiement" }, 400);
    }
  } catch (error) {
    console.log(`Error processing service payment: ${error}`);
    return c.json({ error: "Erreur lors du traitement du paiement" }, 500);
  }
});

// Get services endpoint
app.get("/make-server-6e866e97/services", async (c) => {
  try {
    const userId = c.req.query('userId');
    const category = c.req.query('category');
    const services = await kv.getByPrefix('service_');
    
    let filteredServices = services
      .map(service => JSON.parse(service))
      .filter(service => service.status === 'active'); // Only show active services
    
    if (userId) {
      filteredServices = filteredServices.filter(service => service.userId === userId);
    }
    
    if (category) {
      filteredServices = filteredServices.filter(service => service.category === category);
    }
    
    return c.json({ services: filteredServices });
  } catch (error) {
    console.log(`Error fetching services: ${error}`);
    return c.json({ error: "Erreur lors de la récupération des services" }, 500);
  }
});

// Get single service endpoint
app.get("/make-server-6e866e97/services/:serviceId", async (c) => {
  try {
    const serviceId = c.req.param("serviceId");
    const serviceData = await kv.get(serviceId);
    
    if (!serviceData) {
      return c.json({ error: "Service non trouvé" }, 404);
    }
    
    const service = JSON.parse(serviceData);
    
    // Increment view count
    service.viewCount = (service.viewCount || 0) + 1;
    await kv.set(serviceId, JSON.stringify(service));
    
    return c.json({ service });
  } catch (error) {
    console.log(`Error fetching service: ${error}`);
    return c.json({ error: "Erreur lors de la récupération du service" }, 500);
  }
});

// Update service endpoint
app.put("/make-server-6e866e97/services/:serviceId", async (c) => {
  try {
    const serviceId = c.req.param("serviceId");
    const updates = await c.req.json();
    
    const serviceData = await kv.get(serviceId);
    if (!serviceData) {
      return c.json({ error: "Service non trouvé" }, 404);
    }
    
    const service = JSON.parse(serviceData);
    
    // Update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        service[key] = updates[key];
      }
    });
    
    service.updatedAt = new Date().toISOString();
    
    await kv.set(serviceId, JSON.stringify(service));
    
    return c.json({ success: true, service });
  } catch (error) {
    console.log(`Error updating service: ${error}`);
    return c.json({ error: "Erreur lors de la mise à jour du service" }, 500);
  }
});

// Delete service endpoint
app.delete("/make-server-6e866e97/services/:serviceId", async (c) => {
  try {
    const serviceId = c.req.param("serviceId");
    
    const serviceData = await kv.get(serviceId);
    if (!serviceData) {
      return c.json({ error: "Service non trouvé" }, 404);
    }
    
    const service = JSON.parse(serviceData);
    
    // Check if service has active bookings
    if (service.hasBookings) {
      return c.json({ error: "Impossible de supprimer un service avec des réservations actives" }, 400);
    }
    
    // Mark as deleted instead of actually deleting
    service.status = 'deleted';
    service.deletedAt = new Date().toISOString();
    await kv.set(serviceId, JSON.stringify(service));
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting service: ${error}`);
    return c.json({ error: "Erreur lors de la suppression du service" }, 500);
  }
});

// Auto-refund expired services (this would normally be a cron job)
app.post("/make-server-6e866e97/process-refunds", async (c) => {
  try {
    const services = await kv.getByPrefix('service_');
    const now = new Date().getTime();
    let refundCount = 0;
    
    for (const serviceData of services) {
      const service = JSON.parse(serviceData);
      
      if (service.status === 'active' && 
          service.refundDeadline && 
          new Date(service.refundDeadline).getTime() < now &&
          !service.hasBookings) {
        
        // Process refund (in real app, call payment processor)
        service.status = 'refunded';
        service.refundedAt = new Date().toISOString();
        service.refundAmount = service.price + (service.price * 0.05); // Include 5% service fee
        
        await kv.set(service.id, JSON.stringify(service));
        refundCount++;
        
        console.log(`Refunded service ${service.id} for amount ${service.refundAmount}`);
      }
    }
    
    return c.json({ success: true, refundCount });
  } catch (error) {
    console.log(`Error processing refunds: ${error}`);
    return c.json({ error: "Erreur lors du traitement des remboursements" }, 500);
  }
});

// Book service endpoint
app.post("/make-server-6e866e97/book-service", async (c) => {
  try {
    const { serviceId, buyerId, buyerName, buyerEmail } = await c.req.json();
    
    if (!serviceId || !buyerId) {
      return c.json({ error: "Paramètres de réservation manquants" }, 400);
    }
    
    const serviceData = await kv.get(serviceId);
    if (!serviceData) {
      return c.json({ error: "Service non trouvé" }, 404);
    }
    
    const service = JSON.parse(serviceData);
    
    if (service.status !== 'active') {
      return c.json({ error: "Service non disponible" }, 400);
    }
    
    // Create booking
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const booking = {
      id: bookingId,
      serviceId,
      buyerId,
      buyerName,
      buyerEmail,
      sellerId: service.userId,
      price: service.price,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(bookingId, JSON.stringify(booking));
    
    // Update service to mark it has bookings
    service.hasBookings = true;
    service.bookedAt = new Date().toISOString();
    service.bookingId = bookingId;
    await kv.set(serviceId, JSON.stringify(service));
    
    return c.json({ success: true, booking });
  } catch (error) {
    console.log(`Error booking service: ${error}`);
    return c.json({ error: "Erreur lors de la réservation" }, 500);
  }
});

// User profile endpoints
app.get("/make-server-6e866e97/profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const profileData = await kv.get(`profile_${userId}`);
    
    if (!profileData) {
      // Return default profile if none exists
      const defaultProfile = {
        id: userId,
        name: "Utilisateur FlashJob",
        email: "user@example.com",
        phone: "",
        location: "",
        bio: "",
        joinDate: new Date().toISOString(),
        avatar: "",
        verified: false
      };
      return c.json({ profile: defaultProfile });
    }
    
    const profile = JSON.parse(profileData);
    return c.json({ profile });
  } catch (error) {
    console.log(`Error fetching profile: ${error}`);
    return c.json({ error: "Erreur lors de la récupération du profil" }, 500);
  }
});

app.put("/make-server-6e866e97/profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const updates = await c.req.json();
    
    let profile;
    const existingData = await kv.get(`profile_${userId}`);
    
    if (existingData) {
      profile = JSON.parse(existingData);
    } else {
      profile = {
        id: userId,
        joinDate: new Date().toISOString(),
        verified: false
      };
    }
    
    // Update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        profile[key] = updates[key];
      }
    });
    
    profile.updatedAt = new Date().toISOString();
    
    await kv.set(`profile_${userId}`, JSON.stringify(profile));
    
    return c.json({ success: true, profile });
  } catch (error) {
    console.log(`Error updating profile: ${error}`);
    return c.json({ error: "Erreur lors de la mise à jour du profil" }, 500);
  }
});

// Upload profile avatar endpoint
app.post("/make-server-6e866e97/upload-avatar", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('avatar') as File;
    const userId = formData.get('userId') as string;
    
    if (!file || !userId) {
      return c.json({ error: "Photo et ID utilisateur requis" }, 400);
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar_${userId}_${Date.now()}.${fileExt}`;
    const bucketName = 'make-6e866e97-avatars';
    
    // Create bucket if it doesn't exist
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
    }
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
      
    if (uploadError) {
      console.log(`Error uploading avatar: ${uploadError}`);
      return c.json({ error: "Erreur lors de l'upload" }, 500);
    }
    
    // Create signed URL for the uploaded avatar
    const { data: signedUrl } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry
      
    return c.json({ 
      success: true, 
      fileName,
      url: signedUrl?.signedUrl 
    });
  } catch (error) {
    console.log(`Error in upload avatar: ${error}`);
    return c.json({ error: "Erreur lors de l'upload de l'avatar" }, 500);
  }
});

Deno.serve(app.fetch);