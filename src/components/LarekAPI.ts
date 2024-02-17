import { Api, ApiListResponse } from './base/api';
import {IOrder, IOrderResult, ILot,} from "../types";

export interface IAuctionAPI {
    getLotList: () => Promise<ILot[]>;
    getLotItem: (id: string) => Promise<ILot>;
    orderLots: (order: IOrder) => Promise<IOrderResult>;
}

export class AuctionAPI extends Api implements IAuctionAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getLotItem(id: string): Promise<ILot> {
        return this.get(`/lot/${id}`).then(
            (item: ILot) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getLotList(): Promise<ILot[]> {
        return this.get('/lot').then((data: ApiListResponse<ILot>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderLots(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}