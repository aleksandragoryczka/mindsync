import { SlideTypes } from '../models/enums/slideTypes.enum';
import { SelectOptionPopupModel } from '../models/input-popup-data.model';

export default class StringFormatter {
  static getDateFromISOString(isoString: string): string {
    if (isoString.length > 0) return new Date(isoString).toLocaleDateString();
    return '';
  }

  static reduceString(str: string): string {
    if (str.length > 26) return str.substring(0, 25) + '...';
    return str;
  }

  static generateListOfSelectedOptions(): SelectOptionPopupModel[] {
    const options: SelectOptionPopupModel[] = [];
    for (let i = 5; i <= 120; i = i + 5) {
      options.push({ value: `${i}`, displayValue: `${i}s` });
    }
    return options;
  }

  static getTypesOfSlides(): SelectOptionPopupModel[] {
    const types: SelectOptionPopupModel[] = [];
    for (let i = 0; i < Object.keys(SlideTypes).length; i = i + 1) {
      const strValue = Object.values(SlideTypes)[i];
      types.push({
        value: strValue,
        displayValue: strValue,
      });
    }
    return types;
  }
}
