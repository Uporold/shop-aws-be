import {getCardList} from "@functions/get-products-list/handler";
import {productList} from "../../utils/product-list";

describe("get cards test", () => {
    it('should get all cards', async () => {
        const result = await getCardList();
        expect(JSON.parse(result.body).cards).toEqual(productList);
        expect(result.statusCode).toBe(200);
    });
})