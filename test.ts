class Pickle {

  @Pickle.logger
  test() {
    console.log('hello');
  }

  static logger(target: Object, key: string, descriptor: PropertyDescriptor) {

    let originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.log('pickles');
      return originalMethod.apply(this, args);
    };

    return descriptor;

  }
}
