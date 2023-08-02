export interface InputPopupModel {
  type: string;
  placeholder?: string;
  selectOptions?: SelectOptionPopupModel[];
  value?: number | string;
}

export interface SelectOptionPopupModel {
  value: number | string;
  displayValue: string;
}

export enum ButtonTypes {
  PRIMARY,
  SECONDARY,
}

export interface ButtonPopupModel {
  type: ButtonTypes;
  text: string;
  onClick?: CallableFunction;
}

export interface InputPopupFullDataModel {
  title: string;
  description?: string;
  buttons: ButtonPopupModel[];
  inputs: Record<string, InputPopupModel>;
}
