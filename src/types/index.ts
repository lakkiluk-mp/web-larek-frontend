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
	price: string;
}

// отслеживание карточки 
export interface ILotOrder {
	oreder: boolean;
}

export type ILot = ILotItem & ILotOrder;

//вариант платежей

export type Payment = 'offline' | 'online';


export interface PaymentDeliveryForm {
	adress: string;
	payment: Payment;
}

export interface IEmailTelForm {
	email: string;
	tel: string;
}

export type IOrderForm = PaymentDeliveryForm & IEmailTelForm;

export interface IOrder extends IOrderForm {
	items: ILot[];
}

export type CatalogChangeEvent = {
	catalog: ILot[];
};


export interface IAppState {
	catalog: ILot[];
	basket: ILot[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}
