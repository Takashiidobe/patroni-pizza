import * as WebSocket from 'ws';
import setRandomInterval from 'set-random-interval';
import { Store, stores, makeStore, destroyStore } from './store';
import { writeOrder, redoStaleOrders, prisma } from './orders';
import { sleep, Pizza } from './utils';

const wss = new WebSocket.Server({ port: 3000 });

const meals: Pizza[] = [ 'Pepperoni', 'Ham', 'Pineapple', 'Cheese' ];

async function main() {
	wss.on('connection', async (ws: WebSocket) => {
		ws.send('Welcome to Pizza Bear.');
		if (stores.length == 0) {
			ws.send("Looks like there isn't a store open right now. Let's ask our associates to open one.");
			await sleep(2);
			stores.push(new Store(ws));
		}

		// random Events
		setRandomInterval(() => destroyStore(ws), 1000, 60000);
		setRandomInterval(() => makeStore(ws), 1000, 30000);
		setInterval(() => stores.forEach((store) => store.processOrder()), 0);

		// logging
		setInterval(() => {
			const storesLength = stores.length;
			if (storesLength == 1) ws.send('There is one store available.');
			else if (storesLength == 0) ws.send('There are no stores available.');
			else ws.send(`There are ${storesLength} stores available.`);
		}, 5000);
		setInterval(() => {
			const meal = meals[Math.floor(Math.random() * meals.length)];
			writeOrder(meal);
			ws.send(`A ${meal} pizza was ordered.`);
		}, 5000);
		setInterval(() => {
			redoStaleOrders();
			ws.send('Checking for stale orders!');
		}, 15000);
	});
}

main()
	.catch((e: Error) => {
		throw e;
	})
	.finally(async () => {
		await prisma.disconnect();
	});
