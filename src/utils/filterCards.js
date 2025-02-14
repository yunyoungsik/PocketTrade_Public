export const isTradeable = (card) => {
  if (!card || !card.pack || !card.pack.trade) return false;

  const checkPack = ['A2']; // 거래 불가능한 pack 코드
  const checkTrade = ['impossible']; // 거래 불가능한 상태

  // 거래 불가능한 pack이거나 trade 상태가 impossible이면 false
  if (checkPack.includes(card.pack.codeName) || checkTrade.includes(card.pack.trade)) {
    return false;
  }

  return true; // 위 조건에 해당하지 않으면 거래 가능
};