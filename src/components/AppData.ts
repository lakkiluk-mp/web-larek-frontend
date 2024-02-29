 import _ from "lodash";
import {formatNumber} from "../utils/utils";

import {Model} from "./base/Model";
import {IFormErrors, IAppState,ILot, IOrder, IOrderForm, ILotOrder,} from "../types";
import { EventEmitter, IEvents } from "./base/events";

export type CatalogChangeEvent = {
    catalog: ILot[]
};

export class LotItem extends Model<ILot> {
    about: string;
    description: string;
    id: string;
    image: string;
    title: string;
    price: number;
    isOrdered:boolean; 
    status: ILotOrder;
    category:string;


    protected myLastBusket = 0;

    constructor(private data:Partial<ILot>, events: IEvents) {
        super(data,events)
     }

    clearBusket() {
        this.myLastBusket = 0;
    }

    placeBusket(price: number): void {
        this.price = price;

    }

 
}

export class AppState extends Model<IAppState> {
    basket: string[];
    catalog: ILot[];
    loading: boolean;
    order: IOrder; 
    preview: string | null;
    formErrors: IFormErrors = {};

    constructor(data:Partial<IAppState>,events: IEvents) {
        super(data, events);
        this.events = events;
    }

    setCatalog(items: ILot[]) {
        this.catalog = items.map(item => new LotItem(item, this.events));
        this.emitChanges('catalog:changed', { catalog: this.catalog });
    }

    setPreview(item: LotItem): void {
        this.preview = item.id;
        this.emitChanges('card:open', item);
    }
    
    addInBasket(item:LotItem):void{
        this.catalog.map(el=>{
            if(item.id===el.id){
                el.isOrdered=!el.isOrdered
            }
        })
        this.emitChanges('card:open', item);
    }


}

    // clearBasket() {
    //     this.order.items.forEach(id => {
    //         this.toggleOrderedLot(id, false);
    //         this.catalog.find(it => it.id === id).clearBasket();
    //     });
    // }

    // getTotal() {
    //     return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
    // }



    // setPreview(item: ILot[]) {
    //     this.preview = item.id;
    //     this.emitChanges('preview:changed', item);
    // }

    // getActiveLots(): ILot[] {
    //     return this.catalog
    //         .filter(item => item.status === 'active' && item.isParticipate);
    // }

    // getClosedLots(): ILot[] {
    //     return this.catalog
    //         .filter(item => item.status === 'closed' && item.isMyBid)
    // }

    // setOrderField(field: keyof IOrderForm, value: string) {
    //     this.order[field] = value;

    //     if (this.validateOrder()) {
    //         this.events.emit('order:ready', this.order);
    //     }
    // }

    // validateOrder() {
    //     const errors: typeof this.formErrors = {};
    //     if (!this.order.email) {
    //         errors.email = 'Необходимо указать email';
    //     }
    //     if (!this.order.phone) {
    //         errors.phone = 'Необходимо указать телефон';
    //     }
    //     this.formErrors = errors;
    //     this.events.emit('formErrors:change', this.formErrors);
    //     return Object.keys(errors).length === 0;
    // }
