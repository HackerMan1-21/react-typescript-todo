import { Item } from '../types/item';

const BASE = '/api';

async function safeFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
	const res = await fetch(input, init);
	if (!res.ok) throw new Error(await res.text());
	// Some endpoints (DELETE) may return 204 No Content — handle that gracefully
	if (res.status === 204) return undefined as unknown as T;
	return (await res.json()) as T;
}

export async function getItems(): Promise<Item[]> {
	try {
		return await safeFetch<Item[]>(`${BASE}/items`);
	} catch (e) {
		// rethrow to let caller fallback
		throw e;
	}
}

export async function getItem(id: string): Promise<Item> {
	return safeFetch<Item>(`${BASE}/items/${encodeURIComponent(id)}`);
}

export async function createItem(item: Item): Promise<Item> {
	return safeFetch<Item>(`${BASE}/items`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(item),
	});
}

export async function updateItem(item: Item): Promise<Item> {
	return safeFetch<Item>(`${BASE}/items/${encodeURIComponent(item.id)}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(item),
	});
}

export async function deleteItem(id: string): Promise<void> {
	await safeFetch<void>(`${BASE}/items/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function uploadImage(file: File): Promise<{ url: string }> {
	const form = new FormData();
	form.append('file', file);
	const res = await fetch(`${BASE}/upload`, {
		method: 'POST',
		body: form,
	});
	if (!res.ok) throw new Error(await res.text());
	return (await res.json()) as { url: string };
}
