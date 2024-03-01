import { AppState, LotItem } from './components/AppData';
import { LarekAPI } from './components/LarekAPI';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Basket, BasketItem } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import './scss/styles.scss';
import { CatalogChangeEvent, ILot } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate, createElement } from './utils/utils';
import { AuctionItem, Card } from './components/Card';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// карточки
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
// //заказ
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
//карзина
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

// Модель данных приложения
const appState = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
// const cardBasket = new Basket(cloneTemplate(cardBasketTemplate,events));
// const order = new Order(cloneTemplate(orderTemplate), events);

// запрос карточек
api
	.getLotList()
	.then(appState.setCatalog.bind(appState))
	.catch((err) => {
		console.error(err);
	});

// отрисовка карточек
events.on<CatalogChangeEvent>('catalog:changed', () => {
	page.catalog = appState.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			// description: item.about,
			price: item.price,
			category: item.category,
		});
	});
	// page.counter = appData.getClosedLots().length;
});

// открытие модалки карточки событие
events.on('card:select', (item: LotItem) => {
	appState.setPreview(item);
});

events.on('card:basket', (item: LotItem) => {
	appState.handleBasket(item);
});

// Отрисовка модалки карточки
events.on('card:open', (item: LotItem) => {
	const card = new AuctionItem(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:basket', item);
		},
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			button: item.isOrdered,
		}),
	});
});

// открытие и отрисовка корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});


events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('lot:changed', () => {
	page.counter = appState.getBasketLots()?.length;
	basket.items = appState.getBasketLots().map((item, id) => {
		const CardItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
                console.log('ss')
				events.emit('basket:delItem', () => {
                    console.log('ss')
				});
			},
		});
		console.log('sd');
		return CardItem.render({
			title: item.title,
			price: item.price,
			id: id + 1,
		});
	});
	console.log(basket, basket.items);
	basket.total = appState.getTotal();
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});
