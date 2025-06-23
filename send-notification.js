const webpush = require('web-push');

// Thay bằng key của bạn
const vapidKeys = {
  publicKey: 'BCpjdtbQhzA8xP7jPTeISAeKWBJHCYPvG9ncYC7tj2GwLudFqinVnEffK6EYKboUDODM1qbrUWcw_moEfv5l2l8',
  privateKey: 'ckzWTpi9CFZXsxJlQUuXwVrZE8fu4a5471X5_WP51D0',
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Thay bằng object subscription bạn lấy được từ client
// const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/cwRVo8C_Om4:APA91bGRZoioKdOUuphw4oXKq9oRiSD1VJvYQo-byJnpJkSvpcrVTnshYxoTVQNkcaWYVmNpgQAyrYI-yoLZtjP8jX09ffDOf4WYeG7QXKeKc8LG10UHuHdA5nLkpQo5AQ_GNb7N2CrY","expirationTime":null,"keys":{"p256dh":"BEub82mBeu1Xv7iwnv8QVEQljdDr1pDU1Vwr08nuDXoIwqqJUtgwkSQhjU64JQyzTjwCcD-a1oVLdiu8j4jv8UQ","auth":"Q1v3E69vUkeSxShFFz62ug"}}
// const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/fPkRdtDvEbY:APA91bH8-ObFZL7dMrIhTmjZwLGMMZOqh7Y1iKs2Vx2mKkBdWxE0lm6i8Hmt9XcRtgz1Jkj05VGe43payWeXGDqyy_ia7PE0FNmvhYxuOLmEkldzuSvOXdMbKrSwHie2HZ4qNAczun-H","expirationTime":null,"keys":{"p256dh":"BF8pzi01mo65hiMw8pS7ZPqEP_0cHDwqcmeZXn82fO8TH68QROvebXts5akaJMHkmghPQwJ9LyGP8z6mPhe2sMQ","auth":"PAYfiOurnJThh5l93kTsnw"}}
// const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/dH7_BADce8I:APA91bFIyGtI5x5uP-JXpja1f1mzR9S-J_8R8vL_9CS17ogUpYG6Rvhcm7Fhzz1B71qnUVrwkBXeXFP8MskhyNXEkb31pR4TnDGQMRDtb2sCIEX6vWIzkkoBbKBWDYk7yoYPnfwBnrCz","expirationTime":null,"keys":{"p256dh":"BEBq4ZoCYytV5wWe-PJ4sPhzdKU8pg1wWuGR_zSFoJ1_u2rYvzGiRIboPlBNYG99WteOlO29c6R2X7J595z67Mo","auth":"EW5wHsO2zdbBlEsketzpQA"}}
const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/diOH9P7wRxA:APA91bEyV0WG0ev_FMW6HTV9cLOzsSVNotrGUoTSvDTKghzgbDmWbkbLs4NzURVjNlnj_inwEf67huehbeLDVVmFloQ643AEfaaGN94USliA45Tr18_zJenMdNW15XKhhxaL-AGdQJ7f","expirationTime":null,"keys":{"p256dh":"BPp7aqmQi4qsKk3srfGyqNLmx4wo1F9fntAR2yDPo2hjVTieHGRMGS84W1ylvt8eAGf96dNw-xy3eRx57z1IgFM","auth":"RaKKU8Vbj1D8dR6k8OVDPA"}}

const payload = JSON.stringify({
  title: 'Test Notification',
  body: 'Hello from server!',
  icon: '/icon-192x192.png',
});

webpush.sendNotification(pushSubscription, payload)
.then(() => console.log('Notification sent!'))
.catch(err => console.error('Error sending notification', err));
