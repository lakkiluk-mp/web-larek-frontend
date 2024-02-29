import { Component } from '../base/Component';
import {
	cloneTemplate,
	createElement,
	ensureAllElements,
	ensureElement,
	formatNumber,
} from '../../utils/utils';
import { EventEmitter, IEvents } from '../base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		//  this._button = this.container.querySelector('.basket__action');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set total(total: number) {
		this.setText(this._total, formatNumber(total));
	}
}

interface IBasketItem {
	title: string;
	id: number;
	price: string;
}
interface IClick {
	onClick: (event: MouseEvent) => void;
}
export class BasketItem extends Component<IBasketItem> {
	protected _title: HTMLElement;
	protected _id: HTMLElement;
	protected _price: HTMLElement;
	protected _priceTotal: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IClick) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._id = ensureElement<HTMLElement>('.basket__item-index', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._priceTotal = ensureElement<HTMLElement>('basket__price', container);

		this._button.addEventListener('click', actions.onClick);
	}
	set title(value: string) {
		this.setText(this._title, value);
	}

	set id(value: number) {
		this.setText(this._id, value);
	}

	set price(value: string) {
		this.setText(this._price, value);
	}

	// set priceTotal(value: string) {
	// 	this.setText(this._price, value);
	// }
}
