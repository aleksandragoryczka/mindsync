export default class QuizzesDisplayNumberGetter {
  static getQuizzesNumberToDisplay(quizzesNumber: number): number {
    switch (quizzesNumber) {
      case 1:
        return 1;
      case 2:
        return 1;
      case 3:
        return 2;
      case 4:
        return 3;
      default:
        return 4;
    }
  }
}
