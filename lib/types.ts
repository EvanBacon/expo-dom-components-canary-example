export interface Option {
  _id: string;
  name: string;
  price: number;
  multiple?: boolean;
  max?: number;
  days?: number[];
}

export interface Modifier {
  _id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  max?: number;
  options: Option[];
}

export interface Item {
  _id: string;
  name: string;
  price: number;
  description: string;
  modifiers: Modifier[];
}

export interface SelectedOption {
  _id: string;
  quantity: number;
}

export interface SelectedModifier {
  _id: string;
  options: SelectedOption[];
}

export interface OrderItem {
  _id: string;
  quantity: number;
  modifiers: SelectedModifier[];
}

export interface Order {
  items: OrderItem[];
}

export interface ItemOrder {
  quantity: number;
  modifiers: SelectedModifier[];
}
