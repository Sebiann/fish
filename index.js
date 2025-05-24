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

function binomialProbability(n, k, p) {
    function logFactorial(x) {
        let result = 0;
        for (let i = 2; i <= x; i++) result += Math.log(i);
        return result;
    }
    function logCombination(n, k) {
        return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
    }
    let prob = 0;
        for (let i = 0; i < k; i++) {
        const logTerm = logCombination(n, i) + i * Math.log(p) + (n - i) * Math.log(1 - p);
        prob += Math.exp(logTerm);
    }
    return 1 - prob;
}

let fishList = [];

function saveData() {
    const totalCaught = parseInt(document.getElementById("totalCaught").value);
    localStorage.setItem("fishList", JSON.stringify(fishList));
    localStorage.setItem("totalCaught", totalCaught);
}

function loadData() {
    const savedList = localStorage.getItem("fishList");
    const savedCaught = localStorage.getItem("totalCaught");
    if (savedList) fishList = JSON.parse(savedList);
    if (savedCaught !== null) document.getElementById("totalCaught").value = savedCaught;
    updateStats();
}

function addFish() {
    const type = document.getElementById("fishType").value;
    const rarity = document.getElementById("rarity").value;
    const subrarity = document.getElementById("subrarity").value;
    const amount = parseInt(document.getElementById("amount").value);

    if (amount < 1) return;

    const existing = fishList.find(fish => fish.type === type && fish.rarity === rarity && fish.subrarity === subrarity);
    if (existing) {
    existing.amount += amount;
    } else {
    fishList.push({ type, rarity, subrarity, amount });
    }
    updateStats();
}

function updateStats() {
    const table = document.getElementById("fishTable");
    const totalCaught = parseInt(document.getElementById("totalCaught").value);
    table.innerHTML = "";
    let totalLogged = 0;
    let combinedProbability = 1;
    const typeChances = {
    "Raw Cod": 0.6,
    "Raw Salmon": 0.25,
    "Tropical Fish": 0.02,
    "Pufferfish": 0.13,
    "Undefined": 1.0
    };

    fishList.forEach(fish => {
    const row = `<tr><td>${fish.type}</td><td>${fish.rarity}</td><td>${fish.subrarity}</td><td>${fish.amount}</td></tr>`;
    table.innerHTML += row;
    totalLogged += fish.amount;
    const baseChance = FishRarity[fish.rarity] * subFishRarity[fish.subrarity];
    const typeChance = typeChances[fish.type] || 1;
    const p = baseChance * typeChance;
    const binom = binomialProbability(totalCaught, fish.amount, p);
    combinedProbability *= binom;
    });

    const oneInX = combinedProbability > 0 ? Math.round(1 / combinedProbability).toLocaleString() : "Impossible";
    document.getElementById("chanceDisplay").textContent = oneInX;
    document.getElementById("chancePercent").textContent = (combinedProbability * 100).toFixed(10);
    document.getElementById("uncounted").textContent = Math.max(0, totalCaught - totalLogged);
    saveData();
}

function resetData() {
    if (confirm("Are you sure you want to reset all data?")) {
    fishList = [];
    document.getElementById("totalCaught").value = 1;
    localStorage.removeItem("fishList");
    localStorage.removeItem("totalCaught");
    updateStats();
    }
}

window.onload = loadData;
