module.exports = class Sockets {
  constructor() {
    this.sockets = []
  }

  add(socket) {
    this.sockets.push({
      socket: socket,
      room: null
    })
  }

  join(socket, room) {
    this.sockets.find((s) => s.socket === socket).room = room
  }

  in(room) {
    return this.sockets.filter((s) => s.room === room)
  }

  all() {
    return this.sockets
  }

  broadcast(sockets, message) {
    sockets.forEach((s) => {
      s.socket.send(message)
    })
  }

  remove(socket) {
    const item = this.sockets.find((s) => s.socket === socket)
    this.sockets.splice(this.sockets.indexOf(item), 1)
  }
}
