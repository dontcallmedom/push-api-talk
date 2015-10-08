self.addEventListener('push', function(event) {
  var title = 'Bonjour !';
  var body = 'Vous avez reçu une notification Push.';
  var icon = '/demo/public/html5.svg';
  var tag = 'simple-push-demo-notification-tag';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  );
});
