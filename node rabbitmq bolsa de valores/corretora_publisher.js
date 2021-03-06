#!/usr/bin/env node

require('dotenv').config();
// RabbitMQ connection string
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

// AMQP
var amqp = require('amqplib/callback_api');

// Abrir conexão AMQP
amqp.connect(messageQueueConnectionString, function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'BOLSADEVALORES';
    var args = process.argv.slice(2);
    var key = args[0];
    var msg = args.slice(1).join(' ');

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });
    channel.publish(exchange, key, Buffer.from(msg));
    console.log(" [x] Sent %s:'%s'", key, msg);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});
