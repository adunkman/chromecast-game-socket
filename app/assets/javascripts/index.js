const ReceiverRouter = require("./routers/receiver")
const SenderRouter = require("./routers/sender")

const isChromecastDevice = document.querySelector("[data-chromecast='receiver']")

if (isChromecastDevice) {
  new ReceiverRouter()
}
else {
  new SenderRouter()
}
