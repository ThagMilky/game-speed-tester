(() => {
  "use strict";
  const realmStarts = [1, 31, 81, 151, 231, 311, 401, 491, 581, 671, 761, 851, 941];
  const realmNames = ["Luyện Khí", "Trúc Cơ", "Kim Đan", "Nguyên Anh", "Hóa Thần", "Luyện Hư",
    "Hợp Thể", "Đại Thừa", "Chân Tiên", "Kim Tiên", "Thái Ất Ngọc Tiên", "Đại La Chân Tiên", "Đạo Tổ"];
  const realms = Object.freeze(realmNames.slice());
  const tierNumbers = Object.freeze(Array.from({ length: 10 }, (_, index) => index + 1));
  const tierCount = 10, maxLevel = 999;
  const nativeRadii = Object.freeze([8, 11, 15, 20]);
  const tiers = Object.freeze(realmStarts.flatMap((start, realmIndex) => {
    const end = realmStarts[realmIndex + 1] - 1 || maxLevel;
    const length = end - start + 1;
    return Array.from({ length: tierCount }, (_, index) => {
      const min = start + Math.ceil(index * length / tierCount);
      const max = start + Math.ceil((index + 1) * length / tierCount) - 1;
      return Object.freeze({ realm: realmNames[realmIndex], tier: index + 1, min, max,
        label: `${realmNames[realmIndex]} tầng ${index + 1}` });
    });
  }));
  const nativeRadius = (value) => nativeRadii.includes(value) ? value : null;
  function selection(kind, value) {
    const upper = kind === "max";
    const item = tiers.find((tier) => (upper ? tier.max : tier.min) === value);
    return item ? Object.freeze({ realm: item.realm, tier: item.tier, legacy: false })
      : Object.freeze({ realm: "legacy", tier: "", legacy: true });
  }
  function valueFor(realm, tier, kind) {
    const item = tiers.find((entry) => entry.realm === realm && entry.tier === Number(tier));
    return item ? (kind === "max" ? item.max : item.min) : null;
  }
  function options(kind, current) {
    const upper = kind === "max";
    const values = tiers.map((item) => upper ? item.max : item.min);
    const result = tiers.map((item) => ({ value: upper ? item.max : item.min, label: item.label }));
    if (Number.isSafeInteger(current) && current > 0 && !values.includes(current))
      result.push({ value: current, label: "Mức đã lưu (giữ nguyên)" });
    return result.sort((a, b) => a.value - b.value);
  }
  function describe(value, kind) {
    if (!Number.isSafeInteger(value) || value < 1) return "cảnh giới chưa rõ";
    const tier = tiers.find((item) => (kind === "max" ? item.max : item.min) === value);
    return tier ? tier.label : "Mức đã lưu (giữ nguyên)";
  }
  globalThis.GSTFarmCompatibility = Object.freeze({ nativeRadii, nativeRadius, realms, tierNumbers,
    tiers, selection, valueFor, options, describe });
})();
