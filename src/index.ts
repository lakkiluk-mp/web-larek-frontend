import { AppState, LotItem } from './components/AppData';
import { LarekAPI } from './components/LarekAPI';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import './scss/styles.scss';
import { CatalogChangeEvent, ILot } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { AuctionItem, Card } from './components/Card'



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
    .then(appState.setCatalog.bind(appState))
    .catch(err => {
        console.error(err);
    });

// отрисовка карточек 
events.on<CatalogChangeEvent>('catalog:changed', () => {
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
            category:item.category
  
        });

    })
        // page.counter = appData.getClosedLots().length;
    });

// открытие модалки карточки событие
    events.on('card:select', (item: LotItem) => {
        appState.setPreview(item);
        // console.log('sdsdsdsds')
    });


// Изменен открытый выбранный лот
    events.on('card:open', (item: LotItem) => {
    console.log('sdsdsd')

    const showItem = (item: LotItem) => {
        const card = new AuctionItem(cloneTemplate(cardPreviewTemplate));
        modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                description: item.description.split("\n"),
                // status: auction.render({
                //     status: item.status,
                //     time: item.timeStatus,
                //     label: item.auctionStatus,
                //     nextBid: item.nextBid,
                //     history: item.history
                // })
            })
        });

        // if (item.status === 'купить') {
        //     auction.focus();
        // }
    };
    showItem(item);

    // if (item) {
        // api.getLotItem(item.id)
        //     .then((result) => {
        //         item.description = result.description;
        //         showItem(item);
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //         })
    // } else {
    //     modal.close();
    // }
});