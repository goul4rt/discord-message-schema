import { z } from 'zod';

export const snowflakeSchema = z.string().regex(/^\d{17,20}$/, {
  message: 'Must be a Discord snowflake id',
});
