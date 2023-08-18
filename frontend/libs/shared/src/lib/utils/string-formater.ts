export default class StringFormater {
  static getDateFromISOString(isoString: string): string {
    if (isoString.length > 0) return new Date(isoString).toLocaleDateString();
    return '';
  }

  static reduceString(str: string): string {
    if (str.length > 26) return str.substring(0, 25) + '...';
    return str;
  }
}
