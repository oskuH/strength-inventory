// TODO: This model is still under construction.

import { type CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize';

import type { MembershipAvailability, MembershipTimeUnit } from '../utils/types/types.ts';

import { sequelize } from '../utils/db.js';

class Membership extends Model<InferAttributes<Membership>, InferCreationAttributes<Membership>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare price: number;
  declare priceCurrency: string;
  declare validity: number;
  declare validityUnit: MembershipTimeUnit;
  declare commitment: number | null | undefined;
  declare commitmentUnit: MembershipTimeUnit | null | undefined;
  declare availability: MembershipAvailability;
  declare notes: string | null | undefined;
}