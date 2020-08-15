import * as WebSocket from 'ws';
import { Order } from '@prisma/client';
import { finishOrder } from '../orders/index';

class Store {
	public _orders: Order[];
	private _chefs: number;
	public _location: number;
	private _ws: WebSocket;

	public constructor(ws, orders = [], chefs = 1) {
		this._orders = orders;
		this._chefs = chefs;
		this._location = Math.floor(Math.random() * 8);
		this._ws = ws;
	}

	addChef() {
		this._chefs++;
		this._ws.send(`Hiring another chef! ${this._chefs} chefs are available.`);
	}

	addOrder(order: Order) {
		this._orders.push(order);

		if (this._orders.length / 2 > this._chefs) this.addChef();
	}

	async processOrder() {
		if (this._orders.length == 0) return;
		const order = this._orders.pop();
		const result = finishOrder(order.id);
		if (result) this._ws.send(`Finished order with: ${order.item} Pizza`);
	}
}

const events = [ 'a tornado', 'lightning', 'a flood', 'a hailstorm', 'a snowstorm' ];

const stores: Store[] = [];

function makeStore(ws: WebSocket) {
	stores.push(new Store(ws));
	ws.send("We've made a new store.");
}

function destroyStore(ws: WebSocket) {
	if (stores.length == 0) return;
	const index = Math.floor(Math.random() * stores.length);
	stores.splice(index, 1);
	const randomEvent = events[Math.floor(Math.random() * events.length)];
	ws.send(`Oh no, Store ${index + 1} was struck by ${randomEvent} and had to close down.`);
}

export { Store, stores, makeStore, destroyStore };
