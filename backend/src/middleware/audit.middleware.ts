import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../services/storage';

export const logAudit = (
  actorId: string,
  actorName: string,
  actorRole: string,
  action: string,
  entityType: string,
  entityId: string,
  details: string,
  ipAddress?: string
) => {
  const log = {
    _id: uuidv4(),
    actorId,
    actorName,
    actorRole,
    action,
    entityType,
    entityId,
    details,
    ipAddress: ipAddress || '127.0.0.1',
    createdAt: new Date().toISOString(),
  };

  dbStore.collection.auditLogs.unshift(log);
  // Keep latest 1000 logs
  if (dbStore.collection.auditLogs.length > 1000) {
    dbStore.collection.auditLogs = dbStore.collection.auditLogs.slice(0, 1000);
  }
  dbStore.save();
};
