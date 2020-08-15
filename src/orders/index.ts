import { PrismaClient, Order } from '@prisma/client';
import { Pizza } from '../utils';
import { stores } from '../store';

const prisma = new PrismaClient({
	datasources: {
		db: 'postgresql://postgres:zalando@127.0.0.1:5000/postgres'
	}
});

async function writeOrder(msg: Pizza): Promise<Order> {
	const order = await prisma.order.create({
		data: {
			item: msg
		}
	});
	return order;
}

async function finishOrder(id: number): Promise<boolean> {
	const orderToComplete = await prisma.order.update({
		where: {
			id: id
		},
		data: {
			fulfilledAt: new Date()
		}
	});

	return !!orderToComplete.fulfilledAt;
}

async function redoStaleOrders() {
	const staleOrders = await prisma.order.findMany({
		where: {
			fulfilledAt: null
		},
		orderBy: {
			createdAt: 'asc'
		},
		first: 10
	});

	function getRandomStoreIndex() {
		return Math.floor(Math.random() * stores.length);
	}

	// randomly assign a store an order
	if (stores.length > 0) {
		staleOrders.forEach((order) => {
			stores[getRandomStoreIndex()].addOrder(order);
		});
	}
}

export { writeOrder, finishOrder, redoStaleOrders, prisma };
