"use strict";

var submitButton = document.getElementById("submitButton");
var selectedPillowFirmness;
var selectedSleepPosition;
var selectedBudget;
var validateResponses;
var wrapper = document.getElementById("wrapper");
var recommendationForm = document.getElementById("recommendationForm");
var introduction = document.getElementById("introduction");
var eligiblePillows;


/***********************
Main Function
***********************/

var findRecommendedPillows = function findRecommendedPillows() {
	validateResponses = validateResponse("firmness", "sleep_position", "budget");

	selectedPillowFirmness = getRadioValue("firmness");
	selectedSleepPosition = getRadioValue("sleep_position");
	selectedBudget = getRadioValue("budget");

	eligiblePillows = pillows.filter(eligiblePillowByFirmness).filter(eligiblePillowByBudget).filter(eligiblePillowBySleepPosition).sort(acendingOrder);

	eligiblePillows.length = 2; //there should only be up to 2 pillows displaying on the screen at a time

	renderPillows(eligiblePillows);
};

/***********************
Support Functions
***********************/

var validateResponse = function validateResponse(radioNameOne, radioNameTwo, radioNameThree) {
	if (document.querySelector("input[name=\"" + radioNameOne + "\"]:checked") === null) {
		alert("Please complete the form before continuing");
		return false;
	} else if (document.querySelector("input[name=\"" + radioNameTwo + "\"]:checked") === null) {
		alert("Please complete the form before continuing");
		return false;
	} else if (document.querySelector("input[name=\"" + radioNameThree + "\"]:checked") === null) alert("Please complete the form before continuing");
	return false;
};

var getRadioValue = function getRadioValue(radioName) {
	return document.querySelector("input[name=\"" + radioName + "\"]:checked").value;
};

var eligiblePillowByFirmness = function eligiblePillowByFirmness(pillow) {
	return firmnessCalculator(pillow) !== selectedPillowFirmness; //I use !== becuase I am making the assumption that people are not searching for a new pillow if they are satisfied with their current pillow.
};

var eligiblePillowByBudget = function eligiblePillowByBudget(pillow) {
	return pillow.priceStandard < selectedBudget;
};

var eligiblePillowBySleepPosition = function eligiblePillowBySleepPosition(pillow) {
	return pillow.sleepingStyle.indexOf(selectedSleepPosition) >= 0;
};

var firmnessCalculator = function firmnessCalculator(pillow) {
	console.log("calculating firmness");
	var firmnessRatio = pillow.weightOz / pillow.sizeSqIn;
	if (firmnessRatio < .03) {
		return "soft";
	} else if (firmnessRatio < .04) {
		return "medium";
	} else {
		return "firm";
	}
};

var acendingOrder = function acendingOrder(a, b) {
	return b.priceStandard - a.priceStandard;
};

var determinePillowImg = function determinePillowImg(pillow) {
	var firmness = firmnessCalculator(pillow);
	return "img/pillow_" + firmness + ".jpg";
};

var renderPillows = function renderPillows(eligiblePillows) {
	console.log("rendering pillows...");
	wrapper.removeChild(introduction);
	wrapper.removeChild(recommendationForm);
	var pillowHtml = eligiblePillows.map(function (pillow) {
		return renderPillow(pillow).innerHTML;
	}).join("");
	wrapper.innerHTML = pillowHtml;
	var secondRecommendationHeader = document.getElementsByClassName("recommendationHeader")[1];
	secondRecommendationHeader.innerText = "Another great option";
};

var renderPillow = function renderPillow(pillow) {
	var pillowHtml = document.createElement("section");
	var pillowFirmness = firmnessCalculator(pillow);
	var pillowImgUrl = determinePillowImg(pillow);
	pillowHtml.innerHTML = "\n\t<section>\n\t\t<label class=\"recommendationHeader\">The perfect pillow for you</label><br>\n\t\t<p class=\"pillowTitle\">" + pillow.featherType + ", " + pillow.fillPower + " Fill Power</p>\n\t\t<img src=\"" + pillowImgUrl + "\" class=\"pillowImg\"> \t\t\t\t\t\t\t\t\t\t\t\n\t\t<p class=\"field-label\">Pillow Name:<p>\n\t\t<p class=\"field-description\">" + pillow.name + "</p>\n\t\t<p class=\"field-label\">Firmness:<p>\n\t\t<p class=\"field-description\">" + pillowFirmness + "</p>\n\t\t<p class=\"field-label\">Description:<p>\n\t\t<p class=\"field-description\">" + pillow.description + "<p>\n\t\t<ul>\n\t\t\t<li class=\"size\">\n\t\t\t\t<a href=\"" + pillow.urlStandard + "\">\n\t\t\t\t\t<p>Standard:</p>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t\t<li class=\"size\">\n\t\t\t\t<a href=\"" + pillow.urlQueen + "\">\n\t\t\t\t\t<p>Queen:</p>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t\t<li class=\"size\">\n\t\t\t\t<a href=\"" + pillow.urlKing + "\">\n\t\t\t\t\t<p>King:</p>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t\t<li class=\"price\">\n\t\t\t\t<a href=\"" + pillow.urlStandard + "\">\n\t\t\t\t\t<p>$" + pillow.priceStandard + "</p>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t\t<li class=\"price\">\n\t\t\t\t<a href=\"" + pillow.urlQueen + "\">\n\t\t\t\t\t<p>$" + pillow.priceQueen + "</p>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t\t<li class=\"price\">\n\t\t\t\t<a href=\"" + pillow.urlKing + "\">\n\t\t\t\t\t<p>$" + pillow.priceKing + "</p>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t</ul>\n\t</section>\n\t";
	return pillowHtml;
};

/***********************
Wiring
***********************/

submitButton.addEventListener("click", findRecommendedPillows);
