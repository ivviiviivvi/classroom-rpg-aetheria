import { describe, it, expect } from 'vitest';
import { ExportPackageSchema, RealmSchema, QuestSchema } from './schemas';

describe('Schemas', () => {
  it('should validate a correct ExportPackage', () => {
    const validPackage = {
      version: '1.0',
      exportedAt: Date.now(),
      realms: [
        {
          id: 'realm1',
          name: 'Realm 1',
          description: 'A test realm',
          color: '#ffffff',
          createdAt: Date.now(),
        },
      ],
      quests: [
        {
          id: 'quest1',
          realmId: 'realm1',
          name: 'Quest 1',
          description: 'A test quest',
          type: 'standard',
          xpValue: 100,
          status: 'available',
          createdAt: Date.now(),
        },
      ],
      theme: 'fantasy',
    };

    const result = ExportPackageSchema.safeParse(validPackage);
    expect(result.success).toBe(true);
  });

  it('should fail on invalid ExportPackage', () => {
    const invalidPackage = {
      version: '1.0',
      exportedAt: Date.now(),
      realms: [], // Empty is valid, but let's break something else
      quests: [
        {
          id: 'quest1',
          // Missing realmId
          name: 'Quest 1',
          description: 'A test quest',
          type: 'standard',
          xpValue: 100,
          status: 'available',
          createdAt: Date.now(),
        },
      ],
      theme: 'fantasy',
    };

    const result = ExportPackageSchema.safeParse(invalidPackage);
    expect(result.success).toBe(false);
  });

  it('should validate a correct Realm', () => {
    const validRealm = {
      id: 'realm1',
      name: 'Realm 1',
      description: 'A test realm',
      color: '#ffffff',
      createdAt: Date.now(),
    };
    const result = RealmSchema.safeParse(validRealm);
    expect(result.success).toBe(true);
  });

  it('should fail on invalid Realm', () => {
    const invalidRealm = {
      id: 'realm1',
      name: 'Realm 1',
      // Missing description
      color: '#ffffff',
      createdAt: Date.now(),
    };
    const result = RealmSchema.safeParse(invalidRealm);
    expect(result.success).toBe(false);
  });

  it('should validate a correct Quest', () => {
    const validQuest = {
      id: 'quest1',
      realmId: 'realm1',
      name: 'Quest 1',
      description: 'A test quest',
      type: 'boss',
      xpValue: 500,
      status: 'locked',
      createdAt: Date.now(),
    };
    const result = QuestSchema.safeParse(validQuest);
    expect(result.success).toBe(true);
  });

  it('should fail on invalid Quest enum', () => {
    const invalidQuest = {
      id: 'quest1',
      realmId: 'realm1',
      name: 'Quest 1',
      description: 'A test quest',
      type: 'invalid_type', // Invalid
      xpValue: 500,
      status: 'locked',
      createdAt: Date.now(),
    };
    const result = QuestSchema.safeParse(invalidQuest);
    expect(result.success).toBe(false);
  });
});
