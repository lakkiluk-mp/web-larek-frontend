
//Карточка 
export interface ILotItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

//Отслеживание карточки
export interface ILotOrder {
	isOredered: boolean;
}

export type LotStatus = 'купить' | 'в корзину';
//Общий тип лота 
export type ILot = ILotItem & ILotOrder;

//Выбор оплаты 
export type IPaymentType = 'Онлайн' | 'При получении';

//Интерфейс формы введения адреса и способа оплаты 
export interface IOrderDeliveryForm {
	address: string;
	payment: IPaymentType;
}
//Интефрейс формы введения контактных данных 
export interface IOrderContactsForm {
	email: string;
	tel: string;
}

//Общий тип формы заказа 
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
