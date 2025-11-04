import { findPartyByInn, findBankByBik, formatPartyData, formatBankData } from '@/lib/integrations/dadata';

export const dadataResolvers = {
  Query: {
    findPartyByInn: async (_: any, { inn }: { inn: string }) => {
      const result = await findPartyByInn(inn);

      if (!result) {
        return null;
      }

      return formatPartyData(result);
    },

    findBankByBik: async (_: any, { bik }: { bik: string }) => {
      const result = await findBankByBik(bik);

      if (!result) {
        return null;
      }

      return formatBankData(result);
    },
  },
};
