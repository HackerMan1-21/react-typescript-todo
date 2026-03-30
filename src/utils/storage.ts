export const createItemId = () => {
	if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) {
		return (crypto as any).randomUUID();
	}
	return `item-${Date.now()}`;
};
