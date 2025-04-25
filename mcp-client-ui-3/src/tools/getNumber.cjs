
const { generateText, tool } = require('ai')
const { z } = require('zod')

const getNumber = tool({
  description: "入力された面数のサイコロを振ります。",
  parameters: z.object({
    dice: z.number().min(1).describe("サイコロの面数").optional().default(6),
  }),
  execute: async ({ dice }) => {
    return Math.floor(Math.random() * dice) + 1;
  },
});

module.exports = { getNumber };

