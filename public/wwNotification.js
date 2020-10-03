onmessage = function (event) {
  let data = event.data;

  let notification = new Notification(data.title, {
    icon: "./process.ico",
    body: data.body,
    silent: data.silent,
    image: data.url,
  });

  notification.onclick = (event) => {
    event.preventDefault();
    postMessage(true);
  };
};
