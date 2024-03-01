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

	constructor(container: HTMLElement,  protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
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

	set total(price:number) {
        // const totalPrice = this.container.querySelectorAll('.card__price')
		this.setText(this._total, `${price} синапсов`);
	}
}

interface IBasketItem {
	title: string;
	id: number;
	price: string| number
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
    protected _prices: number[] = [];

	constructor(container: HTMLElement, actions?: IClick) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._id = ensureElement<HTMLElement>('.basket__item-index', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button.addEventListener('click', actions.onClick);
	}
	set title(value: string) {
		this.setText(this._title, value);
	}

	set id(value: number) {
		this.setText(this._id, value);
	}

	set price(value: string) {
		this.setText(this._price, `${value} синапсов`);
        this._prices.push(parseFloat(value));
	}

    // get totalPrice(): number {
    //     console.log(this._priceTotal)
    //     const total = this._prices.reduce((acc, curr) => acc + curr, 0);
    //     this.setText(this._priceTotal, total.toString());
    //     return total;
    //   }
    }

