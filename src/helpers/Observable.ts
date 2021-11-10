export default class ObservableHelper {
  
  public static on(eventName: string, cb: (payload?: any) => void) {
    this.registerTrigger(eventName, cb);
  }
  
  public static fire(eventName: string, payload?: any) {
    const triggers = this.getTriggers(eventName);
    triggers.forEach((cb: (payload: any) => void) => cb(payload));
  }

  private static triggers = {};

  private static getTriggers(eventName: string) {
    return this.triggers[eventName] || [];
  }

  private static registerTrigger(eventName: string, cb: (payload?: any) => void) {
    if (!this.triggers[eventName]) {
      this.triggers[eventName] = [];
    }

    this.triggers[eventName].push(cb);
  }
}