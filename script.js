// ====================================================
// =============== Global variables ===================
// ====================================================

const minDivs = 1;
const maxDivs = 7;
const maxAnimationDuration = 800;
const stats = [
	"Weight",
	"Critical",
	"Swings to 0",
	"DPSb",
	"Range/Scaling",
	"STR Scaling",
	"DEX Scaling",
	"INT Scaling",
	"FTH Scaling",
	"ARC Scaling",
	"STR Req",
	"DEX Req",
	"INT Req",
	"FTH Req",
	"ARC Req",
	"Physical Negation",
	"Magic Negation",
	"Fire Negation",
	"Lightning Negation",
	"Holy Negation",
	"Guard",
	"Blood",
	"Buildup per Stamina Bar",
	"Rot",
	"Sleep",
	"Frost",
	"Poison",
	"Madness",
	"Buffable",
	"Additional",
];
const selectedStats = [
	"Weight",
	"AP @99",
	"Delta AP",
	"Critical",
	"Swings to 0",
	"DPSb",
	"Range/Scaling",
	"STR Scaling",
	"DEX Scaling",
	"INT Scaling",
	"FTH Scaling",
	"ARC Scaling",
	"STR Req",
	"DEX Req",
	"INT Req",
	"FTH Req",
	"ARC Req",
	"Physical Negation",
	"Magic Negation",
	"Fire Negation",
	"Lightning Negation",
	"Holy Negation",
	"Guard",
];
var divIdCounter = 0;
var weapons = [];

// ====================================================
// =============== Functions ==========================
// ====================================================

async function loadJson(file) {
	const response = await fetch(file);
	const data = await response.json();
	return data;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function arangeDivs(id = -Infinity) {
	let length = document.getElementsByClassName("weaponDiv").length;
	//calculate width of divs based on window size and amount of divs while making room for the button
	let width =
		document.body.offsetWidth * ((100 - 2 * length) / length / 100) -
		(document.getElementById("addButton").offsetWidth * 2) / length +
		"px";

	Array.from(document.getElementsByClassName("weaponDiv")).forEach(
		async function (item) {
			if (parseInt(item.id.substring(3)) > id) {
													  // ═╗
				item.style.float = "right"; 						  // ═╣
				document.getElementById("addButtonDiv").style.position = "relative";	  // ═╣
												}	  // ═╬─ animation fix
			item.style.width = width; 							  //  ║
			await sleep(maxAnimationDuration); 						  //  ║
			item.style.float = "left"; 							  //  ║
			document.getElementById("addButtonDiv").style.position = "absolute"; 		  // ═╝
		}
	);
}

function addRemoveButton(id) {
	var removeButton = document.createElement("button");
	removeButton.className = "removeButton";
	removeButton.textContent = "X";
	removeButton.id = id;

	document.getElementById("div" + removeButton.id).appendChild(removeButton);
	removeButton.addEventListener("click", async function () {
		if (
			Array.from(document.getElementsByClassName("removeButton"))
				.length == 1
		) {
			return;
		}

		document.getElementById("div" + removeButton.id).style.opacity = 0;
		await sleep(600);
		document.getElementById("div" + id).remove();
		arangeDivs(id);
	});
}

function addDropdown(id) {
	var selectElement = document.createElement("select");
	selectElement.className = "weaponDropdown";
	selectElement.id = "select" + id;

	weapons.forEach(function (item, index) {
		let option = document.createElement("option");
		option.value = index;
		option.textContent = item.name;
		selectElement.appendChild(option);
	});
	selectElement.addEventListener("change", changeAllStats);
	document.getElementById("div" + id).appendChild(selectElement);
}

function addStats(id) {
	stats.forEach(function (item) {
		let statDisplay = document.createElement("p");
		statDisplay.className = item + "Stat";
		statDisplay.id = item + id;

		if (!selectedStats.includes(item)) {
			statDisplay.setAttribute("hidden", "hidden");
		}
		statDisplay.textContent = `${item}: ${weapons[0][item]}`;
		document
			.getElementById("div" + id)
			.querySelector(".statDiv")
			.appendChild(statDisplay);
	});
}

function calculateLargestStat(stat) {
	let statList = Array.from(document.getElementsByClassName(stat + "Stat"));
	let max = "";
	for (let i = 0; i < statList.length; i++) {
		max = max < statList[i].textContent ? statList[i].textContent : max;
	}
	return max;
}

function changeStats(id) {
	stats.forEach(function (item) {
		let currentStats;
		let largestStat;
		let selectedIndex = document.getElementById("select" + id).value;
		document.getElementById(item + id).textContent = `${
			item.charAt(0).toUpperCase() + item.slice(1)
		}: ${weapons[selectedIndex][item]}`;

		largestStat = calculateLargestStat(item);
		currentStats = Array.from(
			document.getElementsByClassName(item + "Stat")
		);

		for (let i = 0; i < currentStats.length; i++) {
			if (currentStats[i].textContent == largestStat) {
				currentStats[i].style.textShadow = "0 0 15px rgb(212, 175, 55)";
				currentStats[i].style.color = "#f4e8c1";
			} else {
				currentStats[i].style.textShadow = "0 0 0px rgb(212, 175, 55)";
				currentStats[i].style.color = "white";
			}
		}
	});
}

function changeAllStats() {
	for (
		let i = 0;
		i < Array.from(document.getElementsByClassName("weaponDiv")).length;
		i++
	) {
		changeStats(i);
	}
}

function addDiv() {
	if (document.getElementsByClassName("weaponDiv") >= 7)
		document
			.getElementById("addButton")
			.setAttribute("disabled", "disabled"); //prevent spam
	var weaponDivElement = document.createElement("div");
	weaponDivElement.className = "weaponDiv";
	weaponDivElement.id = "div" + divIdCounter;

	var statsDivElement = document.createElement("div");
	statsDivElement.className = "statDiv";

	document.body.appendChild(weaponDivElement);
	addDropdown(divIdCounter);
	addRemoveButton(divIdCounter);
	arangeDivs(divIdCounter);
	weaponDivElement.appendChild(statsDivElement);
	addStats(divIdCounter);

	weaponDivElement.style.opacity = 1; //opacity was initially set to 0 causing a fade in animation

	document.getElementById("addButton").removeAttribute("disabled");
	divIdCounter++;
	changeAllStats();
}

// ====================================================
// =============== Main ===============================
// ====================================================

async function main() {
	weapons = await loadJson("weapons.json");
	addDiv();
	addDiv();

	document.getElementById("addButton").addEventListener("click", addDiv);
	window.addEventListener("resize", arangeDivs);
}

main();
