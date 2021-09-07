import {getCardList} from "@functions/get-products-list/handler";
import {productList} from "../../utils/product-list";
import {cardService} from "../../card-service";

describe("get cards test", () => {
    it('should get all cards', async () => {
        const result = await getCardList();
        expect(JSON.parse(result.body).cards).toEqual(productList);
        expect(result.statusCode).toBe(200);
    });

    it('should get 500 error if something wrong in BD service method', async () => {
        cardService.getCardList = jest.fn(() => {
            throw new Error()
        });
        const result = await getCardList();
        expect(result.statusCode).toBe(500);
    });
})