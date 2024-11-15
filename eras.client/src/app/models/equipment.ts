import { User } from '../models/user';
import { Area } from '../models/area';
import { EquipmentModel } from './equipment-model';
export interface Equipment {
  id: number,
  name?: string,
  alias?: string,
  hostName?: string,
  ipAddress?: string,
  vncUserName?: string,
  vncPassword?: string,
  equipmentModelId?: number,
  areaId?: number,
  enabled?: boolean,
  isDeleted?: boolean,
  image?: Uint8Array,
  urlToken?: string,
  equipmentModel?: EquipmentModel,
  area?: Area,
  dateCreated?: Date,
  dateModified?: Date,
  userCreatedId?: number,
  userModifiedId?: number,
  userCreated?: User;
  userModified?: User;
}
