export type ItemImage = {
	url: string;
	comment?: string;
};

export type WildRare = {
	id: string;
	note?: string;
	location?: string;
	date?: string;
	images?: ItemImage[];
};
export type VehicleData = {
	internalModelName?: string;
	internalId?: string;
	vehicleType?: string;
	dlc?: string;
	saleStatus?: string;
	spawnType?: string;
	customDiff?: string;
	specialVersion?: string;
	colorInfo?: string;
};

export type AcquisitionData = {
	method?: string;
	storable?: string;
	stealMethod?: string;
	spawnLocation?: string;
	spawnTime?: string;
};

export type RareData = {
	rareColor?: string;
	wornColor?: string;
	npcOnlyColor?: string;
	specialPearl?: string;
	wheelColor?: string;
};

export type SpawnConditionData = {
	region?: string;
	time?: string;
	weather?: string;
	trafficDensity?: string;
	seedVehicle?: string;
};

export type Item = {
	id: string;
	name: string;
	nameJP: string;
	category: string;
	image: string;
	description: string;
	images?: ItemImage[];
	vehicleData?: VehicleData;
	acquisition?: AcquisitionData;
	rare?: RareData;
	spawnConditions?: SpawnConditionData;
	// 野良レア車両として複数登録できるデータ
	wildRares?: WildRare[];
};
