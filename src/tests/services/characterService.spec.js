const CharacterService = require('../../services/characterService');
const Character = require('../../models/character');
const mockingoose = require('mockingoose');
const characterService = require('../../services/characterService');
const { ObjectId } = require('mongodb');

// removing logging from tests for better reading
beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
});
  
afterAll(() => {
    console.log.mockRestore();
    console.error.mockRestore();
    console.warn.mockRestore();
});

describe('characterService::createCharacter', ()=>{
    beforeEach(() => {
        mockingoose.resetAll();
    })

    it('should character if data is correct', async () => {
        let userId = "65d5a7f2e7b3a3c4f4b9d5e1";
        let charData = { name: "Bruenor" };
        let savedChar = { _id: "1", name: "Bruenor", user: "65d5a7f2e7b3a3c4f4b9d5e1", system: {} };

        mockingoose(Character).toReturn(savedChar, 'save');

        const char = await characterService.createCharacter(charData, userId);

        expect(char).toBeDefined();
        expect(char.user).toBeDefined();
        expect(char.user.toString()).toEqual(userId);
        expect(char.name).toEqual("Bruenor");
    })

    it('should raise error if error on save character', async() => {
        let userId = "65d5a7f2e7b3a3c4f4b9d5e1";
        let charData = { name: "Bruenor" };

        mockingoose(Character).toReturn(new Error(), 'save');
        
        await expect(characterService.createCharacter(charData, userId)).rejects.toThrow();
    })
})

describe('characterService::findCharacter', () => {
    beforeEach(() => {
        mockingoose.resetAll();
    })

    it('should find character if correct id and userId provided', async () => {
        let userId = "65d5a7f2e7b3a3c4f4b9d5e1";
        let charId = '65a1234567890abcde123456';
        let returnedChar = { _id: charId, user: userId, name: "Bruenor", type: "character", system: {}, items: [] };

        mockingoose(Character).toReturn(returnedChar, 'findOne');

        const char = await characterService.findCharacter(charId, userId);

        expect(char).toBeDefined();
        expect(char.user.toString()).toEqual(userId);
        expect(char._id.toString()).toEqual(charId)
        expect(char.name).toEqual("Bruenor");
    })

    it('should raise error if character not found', async () => {
        let userId = "65d5a7f2e7b3a3c4f4b9d5e1";
        let charId = '65a1234567890abcde123456';

        mockingoose(Character).toReturn(null, 'findOne');

        await expect(characterService.findCharacter(charId, userId)).rejects.toThrow('Personagem não encontrado');
    })
})

describe ("characterService.updateCharacter", ()=>{
    beforeEach(() => {
        mockingoose.resetAll();
    })

    it('should update character if data provided correctly', async ()=>{
        let userId = "65d5a7f2e7b3a3c4f4b9d5e1";
        let charId = '65a1234567890abcde123456';
        let returnedChar = { _id: charId, user: userId, name: "Bruenor", type: "character", system: {}, items: [] }
        let savedChar = { _id: charId, user: userId, name: "Drizzt", type: "character", system: { str: { value: 12, proficient: 1 } }, items: [] } 
        let charData = {
            name: "Drizzt",
            system: {
                str: {
                    value: 12,
                    proficient: 1
                }
            }
        }

        mockingoose(Character).toReturn(returnedChar, 'findOne');
        mockingoose(Character).toReturn(savedChar, 'save');

        const char = await characterService.updateCharacter(charId, userId, charData);

        expect(char).toBeDefined();
        expect(char.name).toEqual(charData.name);
        expect(char.system.str).toBeDefined();
        expect(char.system.str.value).toEqual(charData.system.str.value);
    })

    it('should throw error if character not found', async () => {
        let userId = "65d5a7f2e7b3a3c4f4b9d5e1";
        let charId = '65a1234567890abcde123456';
        let charData = {
            name: "Drizzt",
            system: {
                str: {
                    value: 12,
                    proficient: 1
                }
            }
        }

        mockingoose(Character).toReturn(null, 'findOne');

        await expect(characterService.updateCharacter(charId, userId, charData)).rejects.toThrow('Personagem não encontrado');
    })

    it ('should throw error if error during save', async() => {
        let userId = "65d5a7f2e7b3a3c4f4b9d5e1";
        let charId = '65a1234567890abcde123456';
        let returnedChar = { _id: charId, user: userId, name: "Bruenor", type: "character", system: {}, items: [] }
        let charData = {
            name: "Drizzt",
            system: {
                str: {
                    value: 12,
                    proficient: 1
                }
            }
        }

        mockingoose(Character).toReturn(returnedChar, 'findOne');
        mockingoose(Character).toReturn(new Error(), 'save');

        await expect(characterService.updateCharacter(charId, userId, charData)).rejects.toThrow();
    })
})

describe('characterService::deleteCharacter', () => {
    beforeEach(() => {
        mockingoose.resetAll();
    })

    it('should delete character if correct id and userId provided', async () => {
        let userId = "65d5a7f2e7b3a3c4f4b9d5e1"; 
        let charId = '65a1234567890abcde123456';
        let returnedChar = { _id: charId, user: userId, name: "Bruenor", type: "character", system: {}, items: [] };

        mockingoose(Character).toReturn(returnedChar, 'findOneAndDelete');

        const char = await characterService.deleteCharacter(charId, userId);

        expect(char).toBeDefined();
        expect(char.user.toString()).toEqual(userId);
        expect(char._id.toString()).toEqual(charId)
        expect(char.name).toEqual("Bruenor");
    })

    it('should raise error if character not found', async () => {
        let userId = "65d5a7f2e7b3a3c4f4b9d5e1";
        let charId = '65a1234567890abcde123456';

        mockingoose(Character).toReturn(null, 'findOneAndRemove');

        await expect(characterService.deleteCharacter(charId, userId)).rejects.toThrow('Personagem não encontrado');
    })
})