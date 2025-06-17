const FishRarity = {
    Common: 0.477125,
    Uncommon: 0.34,
    Rare: 0.12,
    Epic: 0.05,
    Legendary: 0.01,
    Mythic: 0.002,
    Unreal: 0.0005,
    Transcendent: 0.00025,
    Celestial: 0.000125
};

const subFishRarity = {
    None: 0.9995,
    Shiny: 0.00025,
    Shadow: 0.00015,
    Obfuscated: 0.0001
};

const FishType = {
    "Raw Cod": 0.6,
    "Raw Salmon": 0.25,
    "Tropical Fish": 0.02,
    "Pufferfish": 0.13,
    "Undefined": 1.0
};

function calculateFish() {
    const type = document.getElementById("fishType").value;
    const rarity = document.getElementById("rarity").value;
    const subrarity = document.getElementById("subrarity").value;
    const combinedProbability = FishType[type] * FishRarity[rarity] * subFishRarity[subrarity];

    const oneInX = combinedProbability > 0 ? Math.round(1 / combinedProbability).toLocaleString() : "Impossible";
    document.getElementById("chanceDisplay").textContent = oneInX;
    document.getElementById("chancePercent").textContent = (combinedProbability * 100).toFixed(10);
}

// Attach event listeners to update the result when inputs change
window.addEventListener("DOMContentLoaded", () => {
    ["fishType", "rarity", "subrarity"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("change", calculateFish);
        }
    });
    calculateFish(); // Initial calculation
});