import { storage } from "firebase-admin";

export async function gansoCheck() {
  const newVacancies = await fetchVacancies();

  await updateData(newVacancies);

  return {
    newVacancies,
    time: new Date(),
  };
}

async function fetchVacancies(): Promise<Vacancy[]> {
  const response = await fetch("https://sec.489.jp/rg2/webapi/rooms/read", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shisetsuId: 2319,
      opId: 1,
      date: "2025-08-05",
      roomId: 1,
      mode: "",
      locale: "ja",
      adultCounts: 1,
    }),
  });

  const json = (await response.json()) as FetchResult;

  const vacancies = Object.values(json["data"]["calendarRooms"])
    .flatMap((t) => t["room"])
    .map((t) =>
      t["date"]
        ? {
            date: new Date(t["date"]),
            vacant: t["vacancyFlg"] > 0,
          }
        : undefined
    )
    .filter((t) => t)
    .map((t) => t!);

  return vacancies
    .filter((t) => t.date >= new Date("2025-08-04"))
    .filter((t) => t.date <= new Date("2025-08-10"));
}

interface FetchResult {
  data: {
    calendarRooms: {
      [key: string]: {
        room: {
          date: string | null;
          vacancyFlg: number;
        }[];
      };
    };
  };
}

interface Vacancy {
  date: Date;
  vacant: boolean;
}

const filePath = "watches/ganso.json";

async function updateData(newVacancies: Vacancy[]) {
  const bucket = storage().bucket();
  const file = bucket.file(filePath);

  const [buffer] = await file.download();
  const oldText = buffer.toString("utf-8");
  const oldData = JSON.parse(oldText) as SaveData;

  const newItems = newVacancies.map((newVacancy) => {
    const newDate = newVacancy.date.toLocaleDateString("en-CA");
    const oldItem = oldData?.items.find((item) => item.date === newDate);

    return {
      date: newDate,
      vacant: newVacancy.vacant,
      opened: oldItem?.opened ?? false,
    };
  });

  const newData: SaveData = {
    items: newItems,
    time: new Date().toISOString(),
  };
  await file.save(JSON.stringify(newData));
}

interface SaveData {
  items: SaveItem[];
  time: string;
}

interface SaveItem {
  date: string;
  vacant: boolean;
  opened: boolean;
}
