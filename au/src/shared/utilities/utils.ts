

export class Utils {


  static findIndex(objs: any[], comparator: (o: any) => boolean) {

    for (let i = 0; i < objs.length; i++) {
      if (comparator(objs[i])) {
        return i;
      }
    }
    return -1;
  }


}