
const express = require('express');
const app = express();
app.use(express.json());

let notifications = [];

app.post('/notify', (req, res) => {
  console.log('📧 ================================');
  console.log('📧 NEW NOTIFICATION RECEIVED');
  console.log('📧 ================================');
  console.log(`📧 Order ID: ${req.body.orderId}`);
  console.log(`📧 Email: ${req.body.customerEmail}`);
  console.log(`📧 Message: ${req.body.message}`);
  console.log('📧 ================================');
  
  const notification = {
    id: notifications.length + 1,
    orderId: req.body.orderId,
    email: req.body.customerEmail,
    message: req.body.message,
    sentAt: new Date().toISOString(),
    status: 'sent'
  };
  
  notifications.push(notification);
  
  setTimeout(() => {
    console.log('✅ Notification processed successfully!');
  }, 1000);
  
  res.json({ 
    status: 'notification sent',
    notificationId: notification.id
  });
});

app.get('/notifications', (req, res) => {
  res.json(notifications);
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`✅ Notification Service is running on http://localhost:${PORT}`);
  console.log(`📧 Ready to send notifications!`);
});