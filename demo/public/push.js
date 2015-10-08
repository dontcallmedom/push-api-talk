// built from https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web

var pushButton = document.getElementById("push");
var isPushEnabled = false;
var status = document.getElementById("status");


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(initialiseState);
} else {
    status.textContent = "Le navigateur ne prend pas en charge Service workers, et ne peut donc utiliser les notifications Push";
}

push.addEventListener("change", function(e) {
    if (push.checked) {
        subscribe();
    } else {
        unsubscribe();
    }
});

function initialiseState() {
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        status.textContent = "Les notifications ne sont pas prises en charge par le navigateur";
        return;
    }

    if (Notification.permission === 'denied') {
        status.textContent = "Permission d’utiliser les notifications rejetée par l’utilisateur";
        return;
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
        status.textContent = "Les notifications push ne sont pas prises en charge par le navigateur";
        return;
    }

// We need the service worker registration to check for a subscription
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    // Do we already have a push message subscription?
    serviceWorkerRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        pushButton.disabled = false;

        if (!subscription) {
          return;
        }

        sendSubscriptionToServer(subscription);

        pushButton.textContent = 'Désactiver les notifications Push';
        isPushEnabled = true;
      })
      .catch(function(err) {
        status.textContent = "Erreur rencontrée pendant l’inscription aux notifications Push :" + err;
      });
  });

}


function subscribe() {
  // Disable the button so it can't be changed while
  // we process the permission request
  pushButton.disabled = true;

  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
      .then(function(subscription) {
        // The subscription was successful
          isPushEnabled = true;
          document.querySelector("label[for=push]").textContent = "Désactiver les notifications push";
          pushButton.disabled = false;


        return sendSubscriptionToServer(subscription);
      })
      .catch(function(e) {
        if (Notification.permission === 'denied') {
          // The user denied the notification permission which
          // means we failed to subscribe and the user will need
          // to manually change the notification permission to
          // subscribe to push messages
          status.textContent = 'Refus de permission pour les notifications';
          pushButton.disabled = true;
        } else {
          // A problem occurred with the subscription, this can
          // often be down to an issue or lack of the gcm_sender_id
           // and / or gcm_user_visible_only
          status.textContent = "Impossible de s’inscrire au service Push : " + e;
          pushButton.disabled = false;
          pushButton.textContent = 'Activer les notifications push';
        }
      });
  });
}

function sendSubscriptionToServer(subscription) {
    document.getElementById("debug").textContent = JSON.stringify(subscription);

/*    return fetch("/subscribe", {
        "method": "POST",
        "body": JSON.stringify(subscription)
    });*/
}
