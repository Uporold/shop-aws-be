import { getCardById } from '@functions/get-products-by-id/handler';
import { cardService } from '../../services/card-service';
import { CardEntity } from '../../entities/card.entity';

const mockResult = {
  count: 6,
  description: 'Short Product Description3',
  id: '1',
  price: 10,
  title: "Liliana, Death's Majesty",
  imageSrc:
    'https://c1.scryfall.com/file/scryfall-cards/large/front/4/0/40d8f490-f04d-4d59-9ab0-a977527fd529.jpg?1543675327',
};

const event = {
  pathParameters: {
    id: '1',
  },
};

describe('get card by id tests', () => {
  it('should get card by id', async () => {
    cardService.getCardById = jest.fn(async () => {
      return mockResult as CardEntity;
    });
    const result = await getCardById(event);
    expect(JSON.parse(result.body)).toEqual(mockResult);
    expect(result.statusCode).toBe(200);
  });

  it('should get an error with wrong card id', async () => {
    const event = {
      pathParameters: {
        id: 'over9000',
      },
    };
    cardService.getCardById = jest.fn(async () => {
      return undefined;
    });
    const result = await getCardById(event);
    expect(JSON.parse(result.body)).toEqual({ message: 'Card not found' });
    expect(result.statusCode).toBe(404);
  });

  it('should get 500 error if something wrong in BD service method', async () => {
    cardService.getCardById = jest.fn(() => {
      throw new Error();
    });
    const result = await getCardById(event);
    expect(result.statusCode).toBe(500);
  });
});
