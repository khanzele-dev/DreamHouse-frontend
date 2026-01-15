export const translateHouseType = (type: string): string => {
  const translations: Record<string, string> = {
    'private': 'Частный дом',
    'apartment': 'Квартира',
  };
  return translations[type] || type;
};

export const translateBuildingMaterial = (material: string): string => {
  const translations: Record<string, string> = {
    'brick': 'Кирпичный',
    'panel': 'Панельный',
    'monolith': 'Монолитный',
  };
  return translations[material] || material;
};

export const translateCategory = (category: string): string => {
  const translations: Record<string, string> = {
    'flat': 'Квартира',
    'new_building': 'Новостройка',
  };
  return translations[category] || category;
};

export const translateCity = (cityId: number): string => {
  const translations: Record<number, string> = {
    1: 'Махачкала',
    2: 'Каспийск',
    3: 'Дербент',
  };
  return translations[cityId] || 'Махачкала';
};

export const translateElevator = (elevator: string): string => {
  const translations: Record<string, string> = {
    'none': 'Нет',
    'passenger': 'Пассажирский',
    'cargo': 'Грузовой',
  };
  return translations[elevator] || elevator;
};

export const translateParking = (parking: string): string => {
  const translations: Record<string, string> = {
    'none': 'Нет',
    'underground': 'Подземная',
  };
  return translations[parking] || parking;
};

export const formatPrice = (price: string | number): string => {
  return new Intl.NumberFormat("ru-RU").format(parseFloat(String(price)));
};