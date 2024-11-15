import { User } from '../models/user';
export interface EquipmentModel {
  id: number,
  name?: string,
  alias?: string,
  isDeleted?: boolean,
  dateCreated?: Date,
  dateModified?: Date,
  userCreatedId?: number,
  userModifiedId?: number,
  userCreated?: User;
  userModified?: User;
}
