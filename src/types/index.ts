//категория карточек 
export type LotCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';


//лот
export interface ILotItem {
	title: string;
	id: string;
	description?: string;
	image: string;
	category: LotCategory;
	price: number | null;
}

// отслеживание карточки 
export interface ILotOrder {
	isOredered: boolean;
}

export type ILot = ILotItem & ILotOrder;

//вариант платежей
export type IPaymentType = 'offline' | 'online';


export interface IOrderDeliveryForm {
	adress: string;
	payment: IPaymentType;
}

export interface IOrderContactsForm {
	email: string;
	tel: string;
}

export type IOrderForm = IOrderDeliveryForm & IOrderContactsForm;

export interface IOrder extends IOrderForm {
	items: ILot[];
}

export interface IOrderAPI extends IOrderForm {
	items: string[]; 
	total: number; 
}

export type CatalogChangeEvent = {
	catalog: ILot[];
};


export type IFormErrors = Partial<Record<keyof IOrderForm, string>>;


export type IBasketItem = Pick<ILot, 'id' | 'title' | 'price'>;


export interface IAppState {
	catalog: ILot[];
	basket: ILot[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}
