export class IdleScheduler {
  callback: () => void;
  timeout: number;
  intervalHandle?: number;

  constructor(callback: () => void, timeout: number) {
    this.callback = callback;
    this.timeout = timeout;
  }

  start(): IdleScheduler {
    let isJobAlreadyScheduled = false;

    this.intervalHandle = setInterval(() => {
      if (isJobAlreadyScheduled) {
        return;
      }

      isJobAlreadyScheduled = true;

      // @ts-ignore
      window.requestIdleCallback(() => {
        this.callback();
        isJobAlreadyScheduled = false;
      });
    }, this.timeout);
    return this;
  }

  stop(): IdleScheduler {
    clearInterval(this.intervalHandle);
    return this;
  }
}
