var url = window.location.href;
var swLocation = '/generadoros/sw.js';


if( navigator.serviceWorker ){

    if( url.includes('localhost')){

        swLocation = '/sw.js';
    }
    navigator.serviceWorker.register( swLocation );
}

const optionsData = {
	"Insulation": ["Y","A","E","B","F","H","N","R","S"],
	"Leads": [3,6,9,12],
	"Plant": ["Azulejos","LUW","Macesa","Mosaicos","Pisos","Salamanca","Sta Catarina","Servicios"],
	"Mini": [
		["LUT","SUT","FF","PCyE","TRIM","WM"],
		["M1","M2","PE"],
		["Refractarios","Fritas"],
		["M1","M2","PE"],
		["M1","M2","M3","M4","M5","PC","PE"],
		["M1","M2","PC","PE"],
		["Boards"],
		["Azulejos","FMC","Fritas","Ingeniería","LUW","Mosaicos","Pisos","Refractarios","Salamanca","Servicios","Sta Catarina"]
	],
	"Process": ["Normal","Urgente","Garantía"]
}

let ControlActivo = "optVoltage";

function uploadData() {
	// Crea la lista de valores en los controles de selección desde el objeto "optionsData", al cargar la página
	let elem;
	let IDSelector; 
	let SelectControl;
	let counter = 0;
	Object.keys(optionsData).forEach(function(item) {
		if (counter != 3) { // objeto diferente de "Mini"
			elem = optionsData[item];
		} else {
			elem = optionsData[item][document.getElementById("optPlant").value]; // optionData[3][0], optionData[3][1], optionData[3][2]...
		}
		IDSelector = "opt" + item;  // Controles Option: optInsulation, optLeads, optPlant...
		SelectControl = document.getElementById(IDSelector);
		addOptionControls(elem, SelectControl);
		counter += 1;
	});
}

function updateTestControl(changedControl, updatingControl) {
	// Actualiza el control "updatingControl" (optMini) al cambiar valor del control "changedControl" (optPlant)
	const SelectControl = document.getElementById(updatingControl);
	let elem = optionsData.Mini[document.getElementById(changedControl).value];
	SelectControl.innerHTML = "";
	addOptionControls(elem, SelectControl);
}

function addOptionControls(elem, SelectControl) {
	// Actualiza lista de valores en control especificado (en tiempo de ejecución)
	let valueOption;
	let OptionControl;
	Object.keys(elem).forEach(function(index) {
		valueOption = elem[index];
			OptionControl = document.createElement("option");
			OptionControl.value = index; // 0,1,2, etc
			OptionControl.text = valueOption; 
		SelectControl.appendChild(OptionControl);
	});
}

window.onload = function(){	
	// Carga los datos desde el json a los controles de selección
	uploadData();
	
	// Evento change del control optPlant
	document.getElementById("optPlant").addEventListener("change", function() {updateTestControl(this.id, "optMini")});
	
	// Responsividad
	window.onresize = function() {
		if (document.documentElement.clientWidth < 330) {
			if (document.documentElement.clientWidth < 280) {
				if (document.documentElement.clientWidth < 240) {
					document.querySelector("section > ul:nth-child(1) > li > ul > li:nth-child(1) > a > div:nth-child(1)").innerHTML = "¿Placa?";
					document.querySelector("section > ul:nth-child(1) > li > ul > li:nth-child(9) > a > div:nth-child(1)").innerHTML = "¿Tipo?";
				} else {
					document.querySelector("section > ul:nth-child(1) > li > ul > li:nth-child(1) > a > div:nth-child(1)").innerHTML = "¿Placa datos?";
					document.querySelector("section > ul:nth-child(1) > li > ul > li:nth-child(9) > a > div:nth-child(1)").innerHTML = "¿Tipo?";
				}
			} else {
				document.querySelector("section > ul:nth-child(1) > li > ul > li:nth-child(1) > a > div:nth-child(1)").innerHTML = "¿Placa de datos?";
				document.querySelector("section > ul:nth-child(1) > li > ul > li:nth-child(14) > a > div:nth-child(1)").innerHTML = "¿Tipo Motor?";
			}
		} else {
			document.querySelector("section > ul:nth-child(1) > li > ul > li:nth-child(1) > a > div:nth-child(1)").innerHTML = "¿Tiene placa de datos?";
			document.querySelector("section > ul:nth-child(1) > li > ul > li:nth-child(14) > a > div:nth-child(1)").innerHTML = "¿Tipo de motor?";
		}
	}
	
	// Valor por defecto de controles
	/* Placa de datos */
	document.getElementById("optPunchY").addEventListener("click",() => {
		for (let elem of document.querySelectorAll("section > ul:nth-child(1) > li > ul > li:nth-child(n+2):nth-child(-n+13)")) {
			elem.style.display = "flex";
		}
		for (let elem of document.querySelectorAll("section > ul:nth-child(1) > li > ul > li:nth-child(n+14)")) {
			elem.style.display = "none";
		}
	});
	document.getElementById("optPunchN").addEventListener("click",() => {
		for (let elem of document.querySelectorAll("section > ul:nth-child(1) > li > ul > li:nth-child(n+2):nth-child(-n+13)")) {
			elem.style.display = "none";
		}
		for (let elem of document.querySelectorAll("section > ul:nth-child(1) > li > ul > li:nth-child(n+14)")) {
			elem.style.display = "flex";
		}
	});
	/* Tipo de motor */
	/*document.getElementById("optTypeN").addEventListener("click",() => {
		for (let elem of document.querySelectorAll("section > ul:nth-child(1) > li > ul > li:nth-child(n+14)")) {
			elem.style.display = "flex";
		}
	});
	document.getElementById("optTypeI").addEventListener("click",() => {
		for (let elem of document.querySelectorAll("section > ul:nth-child(1) > li > ul > li:nth-child(n+14)")) {
			elem.style.display = "none";
		}
	});*/
	
	// Asigna funciones a los elementos de la página
	document.getElementById("optVoltage").addEventListener("focus", function() {ControlActivo = "optVoltage"; this.select()});
	document.getElementById("optVoltage").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optCurrent").addEventListener("focus", function() {ControlActivo = "optCurrent"; this.select()});
	document.getElementById("optCurrent").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optPower").addEventListener("focus", function() {ControlActivo = "optPower"; this.select()}, false);
	document.getElementById("optPower").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optRPM").addEventListener("focus", function() {ControlActivo = "optRPM"; this.select()}, false);
	document.getElementById("optRPM").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optFrecuency").addEventListener("focus", function() {ControlActivo = "optFrecuency"; this.select()}, false);
	document.getElementById("optFrecuency").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optInsulation").addEventListener("focus", function() {ControlActivo = "optInsulation";}, false);
	document.getElementById("optInsulation").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optLeads").addEventListener("focus", function() {ControlActivo = "optLeads";}, false);
	document.getElementById("optLeads").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optFrame").addEventListener("focus", function() {ControlActivo = "optFrame"; this.select()}, false);
	document.getElementById("optFrame").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optKVA").addEventListener("focus", function() {ControlActivo = "optKVA"; this.select()}, false);
	document.getElementById("optKVA").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optBrand").addEventListener("focus", function() {ControlActivo = "optBrand"; this.select()}, false);
	document.getElementById("optBrand").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optModel").addEventListener("focus", function() {ControlActivo = "optModel"; this.select()}, false);
	document.getElementById("optModel").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optSN").addEventListener("focus", function() {ControlActivo = "optSN"; this.select()}, false);
	document.getElementById("optSN").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optTypeFB").addEventListener("focus", function() {ControlActivo = "optTypeFB"; this.select()}, false);
	document.getElementById("optTypeFB").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optTypeBP").addEventListener("focus", function() {ControlActivo = "optTypeBP"; this.select()}, false);
	document.getElementById("optTypeBP").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optTypeBPs").addEventListener("focus", function() {ControlActivo = "optTypeBPs"; this.select()}, false);
	document.getElementById("optTypeBPs").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optTypeDE").addEventListener("focus", function() {ControlActivo = "optTypeDE"; this.select()}, false);
	document.getElementById("optTypeDE").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("txtUser").addEventListener("focus", function() {ControlActivo = "txtUser"; this.select()}, false);
	document.getElementById("txtUser").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optPlant").addEventListener("focus", function() {ControlActivo = "optPlant";}, false);
	document.getElementById("optPlant").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optMini").addEventListener("focus", function() {ControlActivo = "optMini";}, false);
	document.getElementById("optMini").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("optProcess").addEventListener("focus", function() {ControlActivo = "optProcess";}, false);
	document.getElementById("optProcess").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("txtEquipment").addEventListener("focus", function() {ControlActivo = "txtEquipment"; this.select()}, false);
	document.getElementById("txtEquipment").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("txtTAG").addEventListener("focus", function() {ControlActivo = "txtTAG"; this.select()}, false);
	document.getElementById("txtTAG").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("txtBill").addEventListener("focus", function() {ControlActivo = "txtBill"; this.select()}, false);
	document.getElementById("txtBill").addEventListener("keyup", function(e) {tabular(e)});
	document.getElementById("txtApprover").addEventListener("focus", function() {ControlActivo = "txtApprover"; this.select()}, false);
	document.getElementById("txtApprover").addEventListener("keyup", function(e) {tabular(e)});
	
	// Da el foco al primer control
	document.getElementById("optVoltage").focus();
}

function tabular(e) {
	// Cambia el foco al control siguiente al presionar Enter
	const codeAscii = (e.keyCode ? e.keyCode : e.which);
	if(codeAscii == 13) {
		switch (ControlActivo) {
			case "optVoltage": document.getElementById("optCurrent").focus(); document.documentElement.scrollTop = document.getElementById("optCurrent").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optCurrent": document.getElementById("optPower").focus(); document.documentElement.scrollTop = document.getElementById("optPower").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optPower": document.getElementById("optRPM").focus(); document.documentElement.scrollTop = document.getElementById("optRPM").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optRPM": document.getElementById("optFrecuency").focus(); document.documentElement.scrollTop = document.getElementById("optFrecuency").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optFrecuency": document.getElementById("optInsulation").focus(); document.documentElement.scrollTop = document.getElementById("optInsulation").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optInsulation": document.getElementById("optLeads").focus(); document.documentElement.scrollTop = document.getElementById("optLeads").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optLeads": document.getElementById("optFrame").focus(); document.documentElement.scrollTop = document.getElementById("optFrame").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optFrame": document.getElementById("optKVA").focus(); document.documentElement.scrollTop = document.getElementById("optKVA").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optKVA": document.getElementById("optBrand").focus(); document.documentElement.scrollTop = document.getElementById("optBrand").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optBrand": document.getElementById("optModel").focus(); document.documentElement.scrollTop = document.getElementById("optModel").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optModel": document.getElementById("optSN").focus(); document.documentElement.scrollTop = document.getElementById("optSN").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optSN": document.getElementById("optTypeFB").focus(); document.documentElement.scrollTop = document.getElementById("optTypeFB").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optTypeFB": document.getElementById("optTypeBP").focus(); document.documentElement.scrollTop = document.getElementById("optTypeBP").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optTypeBP": document.getElementById("optTypeBPs").focus(); document.documentElement.scrollTop = document.getElementById("optTypeBPs").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optTypeBPs": document.getElementById("optTypeDE").focus(); document.documentElement.scrollTop = document.getElementById("optTypeDE").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optTypeDE": document.getElementById("txtUser").focus(); document.documentElement.scrollTop = document.getElementById("txtUser").offsetTop - 72; break; //document.body.scrollTop = 0
			case "txtUser": document.getElementById("optPlant").focus(); document.documentElement.scrollTop = document.getElementById("optPlant").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optPlant": document.getElementById("optMini").focus(); document.documentElement.scrollTop = document.getElementById("optMini").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optMini": document.getElementById("optProcess").focus(); document.documentElement.scrollTop = document.getElementById("optProcess").offsetTop - 72; break; //document.body.scrollTop = 0
			case "optProcess": document.getElementById("txtEquipment").focus(); document.documentElement.scrollTop = document.getElementById("txtEquipment").offsetTop - 72; break; //document.body.scrollTop = 0
			case "txtEquipment": document.getElementById("txtTAG").focus(); document.documentElement.scrollTop = document.getElementById("txtTAG").offsetTop - 72; break; //document.body.scrollTop = 0
			case "txtTAG": document.getElementById("txtBill").focus(); document.documentElement.scrollTop = document.getElementById("txtBill").offsetTop - 72; break; //document.body.scrollTop = 0
			case "txtBill": document.getElementById("txtApprover").focus(); document.documentElement.scrollTop = document.getElementById("txtApprover").offsetTop - 72; break; //document.body.scrollTop = 0
			case "txtApprover": document.getElementById("optVoltage").focus(); document.documentElement.scrollTop = document.getElementById("optVoltage").offsetTop - 72; break; //document.body.scrollTop = 0
		}
	}
}