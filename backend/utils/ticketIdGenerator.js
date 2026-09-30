import Counter from '../models/Counter.js';

export const generateTicketId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'ticketId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return `TKT-${counter.seq}`;
};
