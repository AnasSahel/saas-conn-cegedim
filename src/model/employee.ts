import { z } from 'zod';
import { EmployeeSchema as PopuItem } from '../sdk/model';

export const EmployeeSchema = PopuItem.extend({});
export type EmployeeType = z.infer<typeof EmployeeSchema>;
export type EmployeeListType = EmployeeType[];
