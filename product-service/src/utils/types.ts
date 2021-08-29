export interface CardInterface {
    id: string,
    count: number,
    price: number,
    description: string,
    title: string,
    imageSrc: string,
}

export interface CardServiceInterface {
    getCardList: () => Promise<CardInterface[]>,
    getCardById: (id: string) => Promise<CardInterface>
}