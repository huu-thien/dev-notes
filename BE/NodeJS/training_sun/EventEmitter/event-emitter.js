
const EventEmitter = require('events')

class Timer extends EventEmitter {
  start() {
    console.log('Timer started')
    setTimeout(() => {
      this.emit('tick', '1 second passed')
    }, 1000)
    setTimeout(() => {
      this.emit('tick', '2 second passed')
    }, 2000)
    setTimeout(() => {
      this.emit('end', 'Timer end!')
    }, 3000)
  }
}

const timer = new Timer();

timer.on('tick', (message) => {
  console.log(`Tick: ${message}`);
})
timer.on('end', (message) => {
  console.log(message);
})

timer.start()
