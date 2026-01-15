import { FieldChips } from "@/app/components/Filter/ui/FieldChips";
import { FieldSelect } from "@/app/components/Filter/ui/FieldSelect";
import { RangeSlider } from "@/app/components/Filter/ui/RangeSlider";
import { ICardFilters } from "@/app/types";
import { useEffect, useState, useCallback, memo } from "react";

interface FiltersModalProps {
  initial: ICardFilters;
  onClose: () => void;
  onApply: (filters: ICardFilters) => void;
}

export const FiltersModal = memo(function FiltersModal({ initial, onClose, onApply }: FiltersModalProps) {
  const [localFilters, setLocalFilters] = useState<ICardFilters>(() => ({
    ...initial,
  }));

  useEffect(() => {
    setLocalFilters({ ...initial });
  }, [initial]);

  const updateField = useCallback(
    (key: keyof ICardFilters, value: string | number | boolean | undefined) => {
      setLocalFilters((prev) => {
        const newValue = value === "" ? undefined : value;
        if (prev[key] === newValue) return prev;
        return {
          ...prev,
          [key]: newValue,
        };
      });
    },
    []
  );

  const toggleSingleChip = useCallback(
    (key: keyof ICardFilters, value: string) => {
      setLocalFilters((prev) => {
        const current = prev[key];
        // If the stored value is boolean, convert incoming string to boolean and toggle
        if (typeof current === "boolean") {
          const incoming = value === "true";
          const newValue = current === incoming ? undefined : incoming;
          if (prev[key] === newValue) return prev;
          return {
            ...prev,
            [key]: newValue,
          };
        }

        const currentValue = prev[key] as string | undefined;
        const newValue = currentValue === value ? undefined : value;
        if (prev[key] === newValue) return prev;
        return {
          ...prev,
          [key]: newValue,
        };
      });
    },
    []
  );

  const formatPrice = useCallback(
    (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`,
    []
  );

  const formatArea = useCallback((value: number) => `${value} м²`, []);

  const handleApply = useCallback(() => {
    const cleanFilters = Object.entries(localFilters).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== "") {
          acc[key as keyof ICardFilters] = value;
        }
        return acc;
      },
      {} as ICardFilters
    );

    onApply(cleanFilters);
  }, [localFilters, onApply]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-[family-name:var(--font-stetica-bold)]">
          Все фильтры
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-3xl leading-none hover:opacity-70 transition-opacity w-8 h-8 flex items-center justify-center"
          aria-label="Закрыть фильтры"
        >
          ×
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <FieldSelect
          label="Где искать"
          value={localFilters.city?.toString()}
          onChange={(v) => updateField("city", v ? (Number(v) as 1 | 2 | 3) : undefined)}
          placeholder="Все города"
          options={[
            { value: "1", label: "Махачкала" },
            { value: "2", label: "Каспийск" },
            { value: "3", label: "Дербент" },
          ]}
        />
        <div
          className="h-px"
          style={{ backgroundColor: "var(--border-color)" }}
        />
        <FieldChips
          label="Категория"
          options={[
            { value: "flat", label: "Квартира" },
            { value: "new_building", label: "Новостройка" },
            { value: "secondary", label: "Вторичка", disabled: true },
            { value: "land", label: "Земельный участок", disabled: true },
            { value: "commercial", label: "Коммерческая недвижимость", disabled: true },
          ]}
          value={localFilters.category ? [localFilters.category] : []}
          onToggle={(val) => toggleSingleChip("category", val)}
          multiSelect={false}
        />
        <div
          className="h-px"
          style={{ backgroundColor: "var(--border-color)" }}
        />
        <FieldChips
          label="Тип жилья"
          options={[
            { value: "apartment", label: "Квартира" },
            { value: "private", label: "Частный дом" },
          ]}
          value={localFilters.house_type ? [localFilters.house_type] : []}
          onToggle={(val) => toggleSingleChip("house_type", val)}
          multiSelect={false}
        />
        <div
          className="h-px"
          style={{ backgroundColor: "var(--border-color)" }}
        />
        <RangeSlider
          label="Стоимость"
          min={0}
          max={100000000}
          step={100000}
          valueMin={localFilters.price_min}
          valueMax={localFilters.price_max}
          onChangeMin={(v) => updateField("price_min", v)}
          onChangeMax={(v) => updateField("price_max", v)}
          formatValue={formatPrice}
        />
        <div
          className="h-px"
          style={{ backgroundColor: "var(--border-color)" }}
        />
        <RangeSlider
          label="Площадь"
          min={0}
          max={500}
          step={5}
          valueMin={localFilters.area_min}
          valueMax={localFilters.area_max}
          onChangeMin={(v) => updateField("area_min", v)}
          onChangeMax={(v) => updateField("area_max", v)}
          formatValue={formatArea}
        />
        <div
          className="h-px"
          style={{ backgroundColor: "var(--border-color)" }}
        />
        <RangeSlider
          label="Количество комнат"
          min={1}
          max={10}
          step={1}
          valueMin={localFilters.rooms_min}
          valueMax={localFilters.rooms_max}
          onChangeMin={(v) => updateField("rooms_min", v)}
          onChangeMax={(v) => updateField("rooms_max", v)}
        />
        <div
          className="h-px"
          style={{ backgroundColor: "var(--border-color)" }}
        />
        <RangeSlider
          label="Этаж"
          min={1}
          max={50}
          step={1}
          valueMin={localFilters.floors_min}
          valueMax={localFilters.floors_max}
          onChangeMin={(v) => updateField("floors_min", v)}
          onChangeMax={(v) => updateField("floors_max", v)}
        />
        <div
          className="h-px"
          style={{ backgroundColor: "var(--border-color)" }}
        />
        <FieldChips
          label="Материал здания"
          options={[
            { value: "brick", label: "Кирпичный" },
            { value: "panel", label: "Панельный" },
            { value: "monolith", label: "Монолитный" },
          ]}
          value={localFilters.building_material ? [localFilters.building_material] : []}
          onToggle={(val) => toggleSingleChip("building_material", val)}
          multiSelect={false}
        />
        <div
          className="h-px"
          style={{ backgroundColor: "var(--border-color)" }}
        />
        <FieldChips
          label="Лифт"
          options={[
            { value: "passenger", label: "Пассажирский" },
            { value: "cargo", label: "Грузовой" },
            { value: "none", label: "Нет" },
          ]}
          value={localFilters.elevator ? [localFilters.elevator] : []}
          onToggle={(val) => toggleSingleChip("elevator", val)}
          multiSelect={false}
        />
        <div
          className="h-px"
          style={{ backgroundColor: "var(--border-color)" }}
        />
        <FieldChips
          label="Парковка"
          options={[
            { value: "underground", label: "Подземная" },
            { value: "none", label: "Нет" },
          ]}
          value={localFilters.parking ? [localFilters.parking] : []}
          onToggle={(val) => toggleSingleChip("parking", val)}
          multiSelect={false}
        />
        <div
          className="h-px"
          style={{ backgroundColor: "var(--border-color)" }}
        />
        <FieldChips
          label="Балкон"
          options={[
            { value: "true", label: "Есть" },
            { value: "false", label: "Нет" },
          ]}
          value={localFilters.balcony !== undefined ? [localFilters.balcony.toString()] : []}
          onToggle={(val) => toggleSingleChip("balcony", val)}
          multiSelect={false}
        />
      </div>
      <div className="mt-8">
        <button
          type="button"
          onClick={handleApply}
          className="w-full py-3 cursor-pointer rounded-full font-[family-name:var(--font-stetica-bold)] text-base transition-all hover:opacity-90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          Показать
        </button>
      </div>
    </>
  );
});
