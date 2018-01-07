//https://github.com/jaxgeller/tweezer.js/blob/master/src/tweezer.js

export function tween({ start, arr, tickFN, endFN, duration, first = true }) {

  let end = arr[0]

  var T = new Tweezer({
    start,
    end,
    duration
  })
    .on('tick', value => tickFN(value))
    .on('done', () => {
      if (arr.length == 1) {
        endFN()
      } else {
        tween({
          start: end,
          arr: arr.slice(1),
          tickFN,
          endFN,
          duration,
          first: false
        })
      }
    })
    .begin()

}

export class Tweezer {
  constructor(opts = {}) {
    this.duration = opts.duration || 1000
    this.ease = (t, b, c, d) => c * t / d + b
    this.start = opts.start
    this.end = opts.end

    this.frame = null
    this.next = null
    this.isRunning = false
    this.events = {}
    this.directionX = this.start.x < this.end.x ? "up" : "down"
    this.directionY = this.start.y < this.end.y ? "up" : "down"
  }

  begin() {
    if (!this.isRunning && this.next !== this.end) {
      this.frame = window.requestAnimationFrame(this._tick.bind(this))
    }
    return this
  }

  stop() {
    window.cancelAnimationFrame(this.frame)
    this.isRunning = false
    this.frame = null
    this.timeStart = null
    this.next = null
    return this
  }

  on(name, handler) {
    this.events[name] = this.events[name] || []
    this.events[name].push(handler)
    return this
  }

  emit(name, val) {
    let e = this.events[name]
    e && e.forEach(handler => handler.call(this, val))
  }

  _tick(currentTime) {
    this.isRunning = true

    let lastTick = this.next || this.start

    if (!this.timeStart) this.timeStart = currentTime
    this.timeElapsed = currentTime - this.timeStart
    this.next = {
      x: Math.round(this.ease(this.timeElapsed, this.start.x, this.end.x - this.start.x, this.duration)),
      y: Math.round(this.ease(this.timeElapsed, this.start.y, this.end.y - this.start.y, this.duration))
    }

    if (this._shouldTick(lastTick)) {
      this.emit('tick', this.next)
      this.frame = window.requestAnimationFrame(this._tick.bind(this))
    } else {
      this.emit('tick', this.end)
      this.emit('done', null)

    }
  }

  _shouldTick(lastTick) {
    return ({
      up: this.next.x < this.end.x && lastTick.x <= this.next.x,
      down: this.next.x > this.end.x && lastTick.x >= this.next.x
    }[this.directionX] ||

      {
        up: this.next.y < this.end.y && lastTick.y <= this.next.y,
        down: this.next.y > this.end.y && lastTick.y >= this.next.y
      }[this.directionY])
  }

}