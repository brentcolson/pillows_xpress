var submitButton = document.getElementById("submitButton");
var selectedPillowFirmness;
var selectedSleepPosition;
var selectedBudget;
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

	eligiblePillows = pillows.
		filter(eligiblePillowByFirmness).
		filter(eligiblePillowByBudget).
		filter(eligiblePillowBySleepPosition).
		sort(acendingOrder);

	renderPillows(eligiblePillows);

};



/***********************
Support Functions
***********************/

var validateResponse = function(radioNameOne, radioNameTwo, radioNameThree){
	if(document.querySelector(`input[name="${radioNameOne}"]:checked`) === null){
		alert("Please complete the form before continuing");
		return false;
	} else if (document.querySelector(`input[name="${radioNameTwo}"]:checked`) === null){
		alert("Please complete the form before continuing");
		return false;
	} else if (document.querySelector(`input[name="${radioNameThree}"]:checked`) === null)
		alert("Please complete the form before continuing");
		return false;
};


var getRadioValue = function(radioName) {
	return document.querySelector(`input[name="${radioName}"]:checked`).value;
}	


var eligiblePillowByFirmness = function(pillow){
	return firmnessCalculator(pillow) !== selectedPillowFirmness; //I use !== becuase I am making the assumption that people are not searching for a new pillow if they are satisfied with their current pillow.
}

var eligiblePillowByBudget = function(pillow){
	return pillow.priceStandard < selectedBudget;
}

var eligiblePillowBySleepPosition = function(pillow){
	return pillow.sleepingStyle.indexOf(selectedSleepPosition) >= 0;
}

var firmnessCalculator = function(pillow){
	console.log("calculating firmness");
	var firmnessRatio = pillow.weightOz / pillow.sizeSqIn;
	if(firmnessRatio < .03) {
		return "soft";
	} else if(firmnessRatio < .04) {
		return "medium";
	} else {
		return "firm";
	}
}		

var acendingOrder = function (a, b) { 
  return b.priceStandard - a.priceStandard;
}

var determinePillowImg = function(pillow){
	var firmness = firmnessCalculator(pillow)
	return `img/pillow_${firmness}.jpg`
}

var renderPillows = function renderPillows(eligiblePillows) {
	wrapper.removeChild(introduction);
	wrapper.removeChild(recommendationForm);
	addPillowIfNoEligiblePillows(eligiblePillows);
	var pillowHtml = eligiblePillows.map(function (pillow) {
		return renderPillow(pillow).innerHTML;
	}).join("");
	wrapper.innerHTML = pillowHtml;
	var secondRecommendationHeader = document.getElementsByClassName("recommendationHeader")[1];
	secondRecommendationHeader.innerText = "Another great option";
	document.body.scrollTop = document.documentElement.scrollTop = 0;
};

var renderPillow = function(pillow){
	var pillowHtml = document.createElement("section");
	var pillowFirmness = firmnessCalculator(pillow);
	var pillowImgUrl = determinePillowImg(pillow);
	pillowHtml.innerHTML = 										
	`
	<section>
		<label class="recommendationHeader">The perfect pillow for you</label><br>
		<p class="pillowTitle">${pillow.featherType}, ${pillow.fillPower} Fill Power</p>
		<img src="${pillowImgUrl}" class="pillowImg"> 											
		<p class="field-label">Pillow Name:<p>
		<p class="field-description">${pillow.name}</p>
		<p class="field-label">Firmness:<p>
		<p class="field-description">${pillowFirmness}</p>
		<p class="field-label">Description:<p>
		<p class="field-description">${pillow.description}<p>
		<ul>
			<li class="size">
				<a href="${pillow.urlStandard}">
					<p>Standard:</p>
				</a>
			</li>
			<li class="size">
				<a href="${pillow.urlQueen}">
					<p>Queen:</p>
				</a>
			</li>
			<li class="size">
				<a href="${pillow.urlKing}">
					<p>King:</p>
				</a>
			</li>
			<li class="price">
				<a href="${pillow.urlStandard}">
					<p>$${pillow.priceStandard}</p>
				</a>
			</li>
			<li class="price">
				<a href="${pillow.urlQueen}">
					<p>$${pillow.priceQueen}</p>
				</a>
			</li>
			<li class="price">
				<a href="${pillow.urlKing}">
					<p>$${pillow.priceKing}</p>
				</a>
			</li>
		</ul>
	</section>
	`
	return pillowHtml;
}



/***********************
Wiring
***********************/

submitButton.addEventListener("click", findRecommendedPillows);


