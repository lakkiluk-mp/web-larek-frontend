import _ from 'lodash';
import { formatNumber } from '../utils/utils';

import { Model } from './base/Model';
import {
	IFormErrors,
	IAppState,
	ILot,
	IOrder,
	IOrderForm,
	ILotOrder,
} from '../types';
import { EventEmitter, IEvents } from './base/events';

export type CatalogChangeEvent = {
	catalog: ILot[];
};

export class LotItem extends Model<ILot> {
	about: string;
	description: string;
	id: string;
	image: string;
	title: string;
	price: number;
	isOrdered: boolean;
	status: ILotOrder;
	category: string;

	protected myLastBusket = 0;

	constructor(private data: Partial<ILot>, events: IEvents) {
		super(data, events);
	}

	clearBusket() {
		this.myLastBusket = 0;
	}

	placeBusket(price: number): void {
		this.price = price;
	}
}

export class AppState extends Model<IAppState> {
	basket: ILot[];
	catalog: ILot[];
	loading: boolean;
	order: IOrder = {
		email: '',
		phone: '',
		items: [],
		address: '',
		payment: '',
	};
	preview: string | null;
	formErrors: IFormErrors = {};

	constructor(data: Partial<IAppState>, events: IEvents) {
		super(data, events);
		this.events = events;
	}

	setCatalog(items: ILot[]) {
		this.catalog = items.map((item) => new LotItem(item, this.events));
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}

	// getTotal() {
	//     return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
	// }

	setPreview(item: LotItem): void {
		this.preview = item.id;
		this.emitChanges('card:open', item);
	}

	addInBasket(item: LotItem): void {
		this.catalog.map((el) => {
			if (item.id === el.id) {
				el.isOrdered = true;
			}
		});

		this.emitChanges('card:open',item);
		this.emitChanges('lot:changed',item);
	}

	delFromBasket(item: LotItem): void {
		this.catalog.map((el) => {
			if (item.id === el.id) {
				el.isOrdered = false;
			}
		});

		this.emitChanges('card:open',item);
		this.emitChanges('lot:changed',item);
		// this.emitChanges('basket:delItem', item);
	}
	clearBasket(): void {
		this.catalog.forEach((el) => {
			el.isOrdered = false;
		});
		this.emitChanges('lot:changed');
	}

	delFromBasketButton(item: LotItem): void {
		this.catalog.map((el) => {
			if (item.id === el.id) {
				el.isOrdered = false;
			}
		});
		// this.emitChanges('card:open', item);
		this.emitChanges('lot:changed', item);
		// this.emitChanges('basket:delItem', item);
	}

	handleBasket(item: LotItem): void {
		// console.log(item)
		if (item.isOrdered) {
			this.delFromBasket(item);
		} else {
			this.addInBasket(item);
		}
	}

	getBasketLots = (): ILot[] => this.catalog.filter((item) => item.isOrdered);

	getTotal() {
		return this.catalog
			.filter((item) => item.isOrdered)
			.reduce((acc, el) => acc + el.price, 0);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		// console.log(this.order);
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}
	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		// console.log(this.order.email);
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}

// clearBasket() {
//     this.order.items.forEach(id => {
//         this.toggleOrderedLot(id, false);
//         this.catalog.find(it => it.id === id).clearBasket();
//     });
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
