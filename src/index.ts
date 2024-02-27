import { AppState } from './components/AppData';
import { LarekAPI } from './components/LarekAPI';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import './scss/styles.scss';
import { CatalogChangeEvent } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Card, CatalogItem } from './components/Card'



const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// карточки 
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
// //заказ
// const successTemplate = ensureElement<HTMLTemplateElement>('#success'); 
// const orderTemplate = ensureElement<HTMLTemplateElement>('#order'); 
// const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
// //карзина
// const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
// const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

// Модель данных приложения
const appState = new AppState({}, events);

 // Глобальные контейнеры
 const page = new Page(document.body, events);
// const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
// const bascet = new Basket(cloneTemplate(bascetTemplate), events);
// const cardBasket = new Basket(cloneTemplate(cardBasketTemplate), {
//     onClick: (name) => {
//         if (name === 'closed') events.emit('basket:open');
//         else events.emit('bids:open');
//     }
// });
// const order = new Order(cloneTemplate(orderTemplate), events);

// запрос карточек 
api.getLotList()
    .then(appState.setCatalog)
    .catch(err => {
        console.error(err);
    });

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appState.catalog.map(item => {
        const card = new Card("card",cloneTemplate(cardCatalogTemplate), 
        {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            // description: item.about,
            price:item.price,
  
        });

    })
        // page.counter = appData.getClosedLots().length;
    });