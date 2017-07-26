module.exports = (server) => {
  server.subscription("/rooms/{room_name}")

  server.route({
    method: "POST",
    path: "/rooms/{room_name}",
    config: {
      payload: {
        output: "data",
        parse: true
      }
    },
    handler: (request, reply) => {
      server.publish(`/rooms/${request.params.room_name}`, request.payload)
      reply()
    }
  })
}
