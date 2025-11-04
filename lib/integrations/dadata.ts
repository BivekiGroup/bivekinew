const DADATA_API_KEY = process.env.DADATA_API_KEY!;
const DADATA_API_URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs';

interface DaDataPartyResponse {
  suggestions: Array<{
    value: string;
    unrestricted_value: string;
    data: {
      inn: string;
      kpp?: string;
      ogrn?: string;
      name: {
        full_with_opf: string;
        short_with_opf: string;
      };
      address: {
        value: string;
        data: {
          source: string;
        };
      };
      management?: {
        name: string;
        post: string;
      };
      type: 'LEGAL' | 'INDIVIDUAL';
    };
  }>;
}

interface DaDataBankResponse {
  suggestions: Array<{
    value: string;
    data: {
      bic: string;
      swift?: string;
      inn?: string;
      kpp?: string;
      correspondent_account?: string;
      name: {
        payment: string;
        short: string;
      };
      address: {
        value: string;
      };
    };
  }>;
}

/**
 * Поиск организации или ИП по ИНН
 */
export async function findPartyByInn(inn: string): Promise<DaDataPartyResponse['suggestions'][0] | null> {
  try {
    const response = await fetch(`${DADATA_API_URL}/findById/party`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ${DADATA_API_KEY}`,
      },
      body: JSON.stringify({
        query: inn,
      }),
    });

    if (!response.ok) {
      console.error('DaData API error:', response.status, response.statusText);
      return null;
    }

    const data: DaDataPartyResponse = await response.json();

    if (!data.suggestions || data.suggestions.length === 0) {
      return null;
    }

    return data.suggestions[0];
  } catch (error) {
    console.error('Error fetching party from DaData:', error);
    return null;
  }
}

/**
 * Поиск банка по БИК
 */
export async function findBankByBik(bik: string): Promise<DaDataBankResponse['suggestions'][0] | null> {
  try {
    const response = await fetch(`${DADATA_API_URL}/findById/bank`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ${DADATA_API_KEY}`,
      },
      body: JSON.stringify({
        query: bik,
      }),
    });

    if (!response.ok) {
      console.error('DaData API error:', response.status, response.statusText);
      return null;
    }

    const data: DaDataBankResponse = await response.json();

    if (!data.suggestions || data.suggestions.length === 0) {
      return null;
    }

    return data.suggestions[0];
  } catch (error) {
    console.error('Error fetching bank from DaData:', error);
    return null;
  }
}

/**
 * Форматирование данных организации для сохранения
 */
export function formatPartyData(suggestion: DaDataPartyResponse['suggestions'][0]) {
  const { data } = suggestion;

  return {
    inn: data.inn,
    kpp: data.kpp || null,
    ogrn: data.ogrn || null,
    companyName: data.name.full_with_opf,
    legalAddress: data.address.data.source,
  };
}

/**
 * Форматирование данных банка для сохранения
 */
export function formatBankData(suggestion: DaDataBankResponse['suggestions'][0]) {
  const { data } = suggestion;

  return {
    bik: data.bic,
    bankName: data.name.payment || data.name.short,
    corrAccount: data.correspondent_account || null,
  };
}
