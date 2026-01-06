// config/credit-packs.ts

export type CreditPack = {
    id: string;
    name: string;
    nameZh: string;
    price: number;       // 美元价格
    credits: number;     // 获得的积分
    generations: number; // 约等于多少次生成 (用于展示)
    label?: string;      // 营销标签
    labelZh?: string;
    priceId: string;     // Creem 的 Price ID (需要替换)
};

// 10 积分 = 1 次生成
export const CREDITS_PER_GENERATION = 10;

export const CREDIT_PACKS: CreditPack[] = [
    {
        id: "starter",
        name: "Starter Pack",
        nameZh: "入门体验包",
        price: 4.90,
        credits: 500,
        generations: 50,
        priceId: "price_starter_TODO", // TODO: 替换为真实 Creem Price ID
        label: "Great for trying",
        labelZh: "适合尝鲜"
    },
    {
        id: "creator",
        name: "Creator Pack",
        nameZh: "超值创作包",
        price: 9.90,
        credits: 1200,
        generations: 120,
        priceId: "price_creator_TODO", // TODO: 替换为真实 Creem Price ID
        label: "🔥 Most Popular (Save 20%)",
        labelZh: "🔥 最受欢迎 (省20%)"
    },
    {
        id: "pro",
        name: "Pro Pack",
        nameZh: "专业生产力",
        price: 19.90,
        credits: 3000,
        generations: 300,
        priceId: "price_pro_TODO", // TODO: 替换为真实 Creem Price ID
        label: "Best Value",
        labelZh: "单价最低"
    }
];

// 获取本地化的包信息
export function getLocalizedPack(pack: CreditPack, locale: string) {
    return {
        ...pack,
        displayName: locale === 'zh' ? pack.nameZh : pack.name,
        displayLabel: locale === 'zh' ? pack.labelZh : pack.label,
    };
}
