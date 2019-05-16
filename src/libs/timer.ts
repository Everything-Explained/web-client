


// TODO: Create extended interface for _count & _queued
export interface ITimerExec {
  name: string;

  /** Set by 5 second increments: 12 would be 60 seconds. */
  time: number;

  /** Set false for timeout */
  interval: boolean;

  /** Interations through the interval execution */
  _count?: number;

  /** Wait until beginning of next interval iteration */
  _queued?: boolean;

  exec: (...args: any[]) => void;
}



/**
 * Creates one timeout to manage all timers.
 */
export class Timer {


  private pollTimeout = 0;
  private pollTime    = 5e3;    // 5 seconds minimum
  private pollRunning = false;

  private timers: ITimerExec[] = [];




  constructor() {}




  public add(timer: ITimerExec) {
    if (this.getTimer(timer.name))
      throw new Error(`A Time named "${timer.name}" already exists`)
    ;

    timer = Object.assign(timer, {
      _queued: this.pollRunning,
      _count: (timer.interval) ? 0 : timer.time
    });

    this.timers.push(timer);
    console.debug('ADDTIMER', this.timers);
    return this;
  }


  public delete(name: string) {
    if (!name) return this;

    const timer = this.getTimer(name)
    const index = this.timers.indexOf(timer);

    this.timers.splice(index, 1);

    console.debug(`DELTIMER::${name}`, timer);

    // Stop interval on 0 timers
    if (!this.timers.length) this.stop();

    return this;
  }


  public start(name?: string) {
    if (name) return this._initTimeout(name);

    if (this.pollRunning) {
      console.warn('Timer Poll Already Running');
    } else {
      this.pollTimeout =
        setInterval(() => this.execInterval(), this.pollTime)
      ;

      this.pollRunning = true;
    }

    return this;
  }


  private _initTimeout(name: string) {
    let timer = this.getTimer(name);

    if (timer.interval)
      throw new Error('You can ONLY start individual Timeouts, not Intervals')
    ;

    timer._queued = this.pollRunning;
    timer._count = 0;

    return this;
  }


  public restart(name: string) {
    let timer = this.getTimer(name);

    if (timer.interval) {
      console.warn('Intervals Cannot be Restared as they are Recurring.');
      return;
    }

    timer._count = 0;

  }


  public stop(name?: string) {
    if (name) {
      let timer = this.getTimer(name);
      if (!timer.interval)
        timer._count = timer.time
      ;
      return;
    }

    if (this.pollRunning) {
      clearInterval(this.pollTimeout);
      this.timers.forEach(t => {
        t._count = 0;
        t._queued = false;
      });
      this.pollRunning = false;
      console.debug('TIMER::', 'Main Interval Stopped');
    }
  }


  private execInterval() {
    if (!this.timers.length) {
      return this.stop();
    }

    this.timers.forEach(t => this.checkTimer(t));
  }


  private checkTimer(t: ITimerExec) {
    if (t._queued) {
      t._queued = false;
      return;
    }

    // Check when a timeout is finished executing
    if (!t.interval && t._count == t.time) return;

    if (++t._count! % t.time == 0) {
      t.exec();
    }
  }


  private getTimer(name: string) {
    const timer = this.timers.find(t => t.name == name);
    if (timer) return timer;
    throw new Error(`Timer::invalid timer name "${name}"`);
  }





}