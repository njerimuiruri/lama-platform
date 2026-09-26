// Formats an amount given in US$ millions: 13 → "$13.0M", 70289.2 → "$70.3B"
export function formatMoney(millions) {
    const value = Number(millions) || 0;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}B`;
    return `$${value.toFixed(1)}M`;
}
