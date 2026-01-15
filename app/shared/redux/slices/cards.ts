import axiosInstance from "@/app/shared/config/axios";
import { API_BASE_URL } from "@/app/shared/config/axios";
import { ICardsSliceState } from "@/app/types/redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICard } from "@/app/types/models";
import { ICardFilters } from "@/app/types";

interface FetchCardsResponse {
  results?: ICard[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export const fetchCards = createAsyncThunk<
  FetchCardsResponse & { append?: boolean },
  ICardFilters & { page?: number; append?: boolean; q?: string }
>("cards/fetchCards", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    const { page = 1, append, q, ...restFilters } = filters || {};

    params.append("page", String(page));
    params.append("limit", "8");
    
    if (q && q.trim().length > 0) {
      params.append("q", q.trim());
    }

    if (restFilters) {
      Object.entries(restFilters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
        ) {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/cards/${queryString ? `?${queryString}` : ""}`;
    const { data } = await axiosInstance.get<FetchCardsResponse | ICard[]>(url);
    if (Array.isArray(data)) {
      return {
        results: data,
        count: data.length,
        next: null,
        previous: null,
        append: append || false,
      };
    }

    return { ...data, append: append || false };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: unknown };
      message?: string;
    };
    return rejectWithValue(
      axiosError.message || "Не удалось загрузить карточки"
    );
  }
});

export const fetchCardById = createAsyncThunk<ICard, number>(
  "cards/fetchCardById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<ICard>(
        `${API_BASE_URL}/cards/${id}/`
      );
      if (!data || typeof data !== 'object') {
        return rejectWithValue("Получены некорректные данные карточки");
      }
      return data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: unknown };
        message?: string;
      };
      if (axiosError.message?.includes('JSON')) {
        return rejectWithValue("Ошибка обработки данных с сервера");
      }
      return rejectWithValue(
        axiosError.message || "Не удалось загрузить карточку"
      );
    }
  }
);

export const searchCards = createAsyncThunk<
  ICard[],
  string | { query: string; filters?: ICardFilters }
>("cards/searchCards", async (arg, { rejectWithValue }) => {
  try {
    const query = typeof arg === "string" ? arg : arg.query;
    const filters = typeof arg === "object" ? arg.filters : undefined;
    
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    const params = new URLSearchParams();
    params.append("q", query.trim());
    
    // Добавляем фильтры если они есть
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
        ) {
          params.append(key, String(value));
        }
      });
    }
    
    const { data } = await axiosInstance.get<FetchCardsResponse | ICard[]>(
      `${API_BASE_URL}/cards/search/?${params.toString()}`
    );
    
    // Обрабатываем ответ с пагинацией или массивом
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data && typeof data === 'object' && 'results' in data) {
      return Array.isArray(data.results) ? data.results : [];
    }
    
    return [];
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: unknown };
      message?: string;
    };
    return rejectWithValue(axiosError.message || "Ошибка поиска");
  }
});

export const fetchFavoriteCards = createAsyncThunk<ICard[]>(
  "cards/fetchFavoriteCards",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        return rejectWithValue("Необходима авторизация");
      }
      const { data } = await axiosInstance.get<
        Array<{ id: number; card: ICard }>
      >(`${API_BASE_URL}/cards/favorites/me/`);
      return data.map((item) => item.card);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: unknown };
        message?: string;
      };
      return rejectWithValue(
        axiosError.message || "Не удалось загрузить избранные карточки"
      );
    }
  }
);

export const toggleFavorite = createAsyncThunk<
  { id: number; is_favorite: boolean },
  { id: number; is_favorite: boolean }
>("cards/toggleFavorite", async ({ id, is_favorite }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return rejectWithValue("Необходима авторизация");
    }

    if (is_favorite) {
      await axiosInstance.delete(`${API_BASE_URL}/cards/${id}/favorite/`);
      return { id, is_favorite: false };
    } else {
      await axiosInstance.post(`${API_BASE_URL}/cards/${id}/favorite/`, {});
      return { id, is_favorite: true };
    }
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: unknown };
      message?: string;
    };
    return rejectWithValue(axiosError.message || "Ошибка изменения избранного");
  }
});

const initialState: ICardsSliceState = {
  cards: [],
  currentCard: null,
  searchResults: [],
  loading: true,
  searchLoading: true,
  error: null,
  isFavoritesPage: false,
  hasMore: true,
  page: 1,
  totalCount: 0,
};

const cards = createSlice({
  name: "cards",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSearchResults(state) {
      state.searchResults = [];
    },
    resetPagination(state) {
      state.cards = [];
      state.page = 1;
      state.hasMore = true;
      state.totalCount = 0;
    },
    updateCardFavorite(
      state,
      action: { payload: { id: number; is_favorite: boolean } }
    ) {
      const cardInList = state.cards.find(
        (card) => card.id === action.payload.id
      );
      if (cardInList) {
        cardInList.is_favorite = action.payload.is_favorite;
      }
      if (state.currentCard && state.currentCard.id === action.payload.id) {
        state.currentCard.is_favorite = action.payload.is_favorite;
      }
      const cardInSearch = state.searchResults.find(
        (card) => card.id === action.payload.id
      );
      if (cardInSearch) {
        cardInSearch.is_favorite = action.payload.is_favorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.loading = false;
        const {
          results = [],
          count = 0,
          next = null,
          append = false,
        } = action.payload;

        if (append) {
          state.cards = [...state.cards, ...results];
        } else {
          state.cards = results;
        }

        state.totalCount = count;
        state.hasMore = next !== null;
        state.page = append ? state.page + 1 : 1;
        state.error = null;
        state.isFavoritesPage = false;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Ошибка загрузки карточек";
      })
      .addCase(fetchCardById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCardById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCard = action.payload;
        state.error = null;
      })
      .addCase(fetchCardById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Ошибка загрузки карточки";
      })
      .addCase(searchCards.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchCards.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(searchCards.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchResults = [];
        state.error = (action.payload as string) || "Ошибка поиска";
      })
      .addCase(fetchFavoriteCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
        state.error = null;
        state.isFavoritesPage = true;
      })
      .addCase(fetchFavoriteCards.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Не удалось загрузить избранные карточки";
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { id, is_favorite } = action.payload;

        if (!is_favorite && state.isFavoritesPage) {
          state.cards = state.cards.filter((card) => card.id !== id);
        } else {
          const cardInList = state.cards.find((card) => card.id === id);
          if (cardInList) {
            cardInList.is_favorite = is_favorite;
          }
        }

        if (state.currentCard && state.currentCard.id === id) {
          state.currentCard.is_favorite = is_favorite;
        }

        const cardInSearch = state.searchResults.find((card) => card.id === id);
        if (cardInSearch) {
          cardInSearch.is_favorite = is_favorite;
        }
      });
  },
});

export const {
  clearError,
  clearSearchResults,
  resetPagination,
  updateCardFavorite,
} = cards.actions;
export default cards.reducer;
