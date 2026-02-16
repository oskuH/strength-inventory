import Express, { type Request, type Response } from 'express';

import { isAdmin, targetMembershipExtractor } from '../utils/middleware.ts';

import { Membership } from '../models/index.ts';

import type { Membership as FullMembership, MembershipPostAndPut } from '../utils/schemas.ts';

const membershipsRouter = Express.Router();

// GET all memberships
membershipsRouter.get('/', async (_req, res) => {
  const memberships = await Membership.findAll();
  return res.json(memberships);
});

// POST a new membership
membershipsRouter.post('/', async (req: Request<unknown, unknown, MembershipPostAndPut>, res: Response<FullMembership>) => {
  const { chain, name, price, priceCurrency, validity, validityUnit, commitment, commitmentUnit, availability, url, notes } = req.body;

  const membership = await Membership.create({ chain, name, price, priceCurrency, validity, validityUnit, commitment, commitmentUnit, availability, url, notes });

  return res.status(201).json(membership);
});

// PUT for admins to modify everything except id and timestamps
membershipsRouter.put(':id', ...isAdmin, targetMembershipExtractor, async (req: Request<{ id: string; }, unknown, MembershipPostAndPut>, res: Response<FullMembership>) => {
  if (!req.targetMembership) { throw new Error('Membership missing from request.'); }  // Should never trigger after middleware.

  const membership = req.targetMembership;
  const { chain, name, price, priceCurrency, validity, validityUnit, commitment, commitmentUnit, availability, url, notes } = req.body;

  await membership.update({
    chain: chain,
    name: name,
    price: price,
    priceCurrency: priceCurrency,
    validity: validity,
    validityUnit: validityUnit,
    commitment: commitment,
    commitmentUnit: commitmentUnit,
    availability: availability,
    url: url,
    notes: notes
  });
  await membership.save();

  return res.status(200).json(membership);
});

// TODO: add (chain) manager permissions
// DELETE for admins to delete a membership
membershipsRouter.delete('/:id', targetMembershipExtractor, ...isAdmin, async (req, res) => {
  if (!req.targetMembership) { throw new Error('Membership missing from request.'); }  // Should never trigger after middleware.

  const membership = req.targetMembership;
  await membership.destroy();

  return res.status(204).end();
});

export default membershipsRouter;
