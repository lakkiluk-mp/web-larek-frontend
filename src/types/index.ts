export type LotCategory ='софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'


export interface ILotItem {
    title: string;
    id: string;
    description?: string;
    image: string;
    category:LotCategory
    price: string;
}


export interface ILotOrder{
    oreder:boolean  
}

export type ILot = ILotItem & ILotOrder;

//вариант платежей 

export type Payment =  "offline" | "online";

export interface PaymentDeliveryForm {
    adress: string;
    payment:Payment
}

export interface IEmailTelForm {
    email:string;
    tel:string
}


export type IOrderForm = PaymentDeliveryForm  & IEmailTelForm

interface IOrder extends IOrderForm{
    items:ILot[]
}


export type CatalogChangeEvent = {
    catalog: ILot[]
}


export type IBasketItem = Pick<ILot, 'id' | 'title' | 'price'>

export interface IAppState {
    catalog: ILot[];
    basket: IBasketItem[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}



export type FormErrors = Partial<Record<keyof IOrder, string>>;


export interface IOrderResult {
    id: string;
}