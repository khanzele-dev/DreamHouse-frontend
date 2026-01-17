import { ICard, IDeveloperDetail } from "./models";

export interface IUser {
    id: number;
    name: string;
    phone_number: string;
    avatar?: string;
    profile_photo?: string;
}

export interface IAuthSliceState {
    isAuth: boolean;
    user: IUser | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;
}

export interface ICardsSliceState {
    cards: ICard[];
    currentCard: ICard | null;
    searchResults: ICard[];
    recentViews: ICard[];
    loading: boolean;
    searchLoading: boolean;
    recentViewsLoading: boolean;
    error: string | null;
    isFavoritesPage: boolean;
    hasMore: boolean;
    page: number;
    totalCount: number;
}

export interface IDevelopersSliceState {
    developers: IDeveloperDetail[];
    currentDeveloper: IDeveloperDetail | null;
    subscriptions: IDeveloperDetail[];
    loading: boolean;
    error: string | null;
}