//init 

var canvas_width = 1280; 
var canvas_height = 720; 
var game;
var bmpText;

var escape = false;
var chapter = 0; // chapter iterating
var score = 3; // survival choices affect this score, compromising choices decrease this score

var graphics;

var timeChoice = false; // default to day or night?

var menu = false;



var narrativeText = [
	"More than 50 years ago a war erupted in the Core. Political turmoil stirred in our homes,", 
	"and we were forced to pick up arms. Once the smoke subsided, we were left with broken ties",
	" and spilt blood. The Core was split in two warring factions: South Core and North Core.",
	". . .",
	"Fast forward to present day in North Core, where my family suffers under the grip of oppression.",
	"We remain outsiders to the rest of the world - taught to believe that we are superior, but",
	"painfully aware of our reality. What glorious state such as ours would keep its own citizens on",
	"the constant brink of famine and punish us for original thought? I can't believe that a government",
	"such as ours shines as the pinnacle of society.",
	". . .",
	"I have resolved to escape. A way to leave the Core will come soon. My family can only afford to",
	"send me and my daughter, Ren, provided I can reach the border in time. Ahead lies a trial more",
	"difficult than I can imagine. I pray that I overcome it safely.",
	". . .",
];


var line = [];
var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 75;
var lineDelay = 300;


var chapter1Text = [
	"I overheard the barkeep's conversation with the captain of nightwatch. ",
	"He said something along the lines of . . .",
	". . .",
    "Barkeep: \"It's going to be a big night, ain't it?\"",
    "Captain: \"I sure hope so - 20 years and this is the thanks I get.\"",
	". . .",
    "It sounds like the guards will be throwing the chief a party. That probably means less guards on duty tonight.",
    "It's short notice, but I might be able to save supplies by moving forward now rather than wait for daybreak.",
    "Visibility might be low though . . .",
    "Should I try to make my way through during the day or at night?",
    ". . .",
];

var chapter2Text = [
	". . .",
	"Making it this far has been no easy task. We arrived just as the sun began to rise.",
	"Perhaps we should rest for the day, and continue onward at night. It may cost",
	"some time and valuable supplies, but . . .",
	"Ren's breath has been shallow for a while. Her forehead was a little warm . . .",
	"The rest might do us some good.",

	". . .",
	"On the other hand . . .",
	"If we push forward now, we can save our supplies and precious time",
	"for when it really counts . . .",
	"Should I keep going, or rest until night?",
	". . .",
];

var chapter3Text = [
	". . .",
	"It's been rough, but we are almost there. Through some impossible stroke of luck,",
	"I was able to locate where most of the local guard eat their dinner - a local kitchen",
	"open to Core employees . . .",
	"I found some medicine in their kitchen. If I pour it into their food,",
	"it will keep them too occupied during the night to keep an actual watch",
	". . .",
	"On the other hand, I can save time and supplies by going now. Some of the guards will",
	"be busy ordering their dinner, but there will still be a full duty roster. It's ",
	"a risk . . . but it might be one worth taking.",
	". . .",
	"Should I wait for night and poison the guards' food, or simply move on?",
	". . .",
];

var chapterText;



