import { SlideTypes } from '../models/enums/slideTypes.enum';
import { OptionModel } from '../models/option.model';
import { SlideModel } from '../models/slide.model';

export default class MultipleChoiceOptionsValidator {
  static isMultipleChoiceWithOptions(updatedSlide: SlideModel): boolean {
    if (
      updatedSlide.type === SlideTypes.MULTIPLE_CHOICE &&
      updatedSlide.options &&
      this.filterNonBlankOptions(updatedSlide.options)
    )
      return true;
    return false;
  }

  static isSlideNotChanged(
    updatedSlide: SlideModel,
    originalSlide: SlideModel
  ): boolean {
    let val =
      updatedSlide.title === originalSlide.title &&
      updatedSlide.displayTime === originalSlide.displayTime &&
      updatedSlide.headerColor === originalSlide.headerColor &&
      updatedSlide.titleColor === originalSlide.titleColor &&
      updatedSlide.type === originalSlide.type;
    if (updatedSlide.options && originalSlide.options)
      val =
        val && this.areArrayEquals(updatedSlide.options, originalSlide.options);
    return val;
  }

  private static areArrayEquals(
    updatedArray: OptionModel[],
    originalArray: OptionModel[]
  ): boolean {
    if (updatedArray.length < originalArray.length) return false;
    const nonEmptyUpdatedArray = updatedArray.filter(
      value => value.option !== ''
    );

    if (nonEmptyUpdatedArray.length !== originalArray.length) return false;

    return nonEmptyUpdatedArray.every(
      (value, index) => value === originalArray[index]
    );
  }

  private static filterNonBlankOptions(updatedArray: OptionModel[]) {
    const nonEmptyUpdatedArray = updatedArray.filter(
      value => value.option !== ''
    );
    if (nonEmptyUpdatedArray.length < 2) return true;
    return false;
  }
}
