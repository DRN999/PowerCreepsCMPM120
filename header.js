//init 

var canvas_width = 1280; 
var canvas_height = 720; 
var game;
var bmpText;

var escape = false; 
var chapter = 0; // chapter iterating
var endTile; // changes based on chapter
var score = 3; // survival choices affect this score, compromising choices decrease this score
// var tile_data;

var graphics;

var timeChoice = false; // default to day or night?

var menu = false;



var narrativeText = [
	"More than 50 years ago a war erupted in the Core. Political turmoil stirred in our homes,", 
	"and we were forced to pick up arms. Once the smoke subsided, we were left with broken ties",
	"and spilt blood. The Core was split in two warring factions: South Core and North Core.",
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
	"I overheard the barkeep's conversation with the captain of nightwatch.",
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

var bestEnding = [ // 3/3 survival points and escaped
	"Today Ren and I leave behind the Core. We free ourselves of its oppression, and pray",
	"that tomorrow will bring opportunity. Even if we are no longer subject to",
	"North Core's power, we still have family back there.",
	". . .",
	"It's not over. I must fight to earn what I can so that someday we can be",
	"together again. So that we can be free.",
	". . .",
	"It's strange. I know the road ahead is difficult, but . . .",
	". . .",
	"The sunrise never looked so bright . . .",
	". . .",
	"[Press ENTER to RESTART]",
];

var goodEnding = [ // 2/3 survival points and escaped
	"We left the Core behind, but it was more difficult than we ever anticipated. We bear",
	"scars - mental and physical - that will never heal. We've hurt others to get ",
	"to where we are, and put our bodies and minds through an unforgettable hell.",
	". . .",
	"These scars remind us that it will never be over. Though we escaped, our families",
	"remain in the Core. We must continue to fight, so that someday we can all be together",
	"again. Even so . . .",
	". . . ",
	"On that day, will we finally be free?",
	". . .",
	"We watched as the sun rose above the horizon, and,",
	"for a moment,",
	". . .",
	"I felt at ease.",
	". . .",
	"[Press ENTER to RESTART]",
];

var okayEnding = [ // 1/3 survival points and escaped
	"I could see the sunrise clearly over the horizon, and I felt my heart stop",
	"beating. We left the Core far behind us, but at a cost we may not ",
	"ever recover. I held my daughter's hand tightly, but could not",
	"feel her return my grip.",
	"I studied her face - weak and unresponsive to my tearful calls.",
	". . .",
	"She died soon after. I could do nothing but be a hand to hold. What was it that",
	"brought us to this point? Time? Hunger? Sickness?",
	". . .",
	"I don't know much time I spent by her side. When my eyes finally dried,",
	"I looked to the horizon.",
	". . .",
	"When did night fall?",
	". . .",
	"[Press ENTER to RESTART]",
];

var badEnding = [ // 0/3 survival points and escaped
	". . .",
	"We barely escaped from North Core.",
	". . .",
	"Is it night? Day? I . . .",
	"I could barely open my eyes. It was dark out. I can't see a thing.",
	". . .",
	"I felt a light touch brush against my hand. I struggled to squeeze out a single word",
	" - the name of my daughter.",
	"\"Ren?\"",
	". . .",
	"No response, but I felt the warmth of her hand in mine.",
	"I try to respond with a more firm grasp, but my fingers wouldn't respond.",
	". . .",
	"\"Ren?\", I repeated.",
	". . .",
	"Soon her warmth disappeared. Night, day, whatever time it was, it didn't matter.",
	"I couldn't see beyond the tears in my eyes.",
	"We made it this far, only to die? Here?",
	"It's not fair.",
	". . .",
	"\"I'm sorry . . .\"",
	"It didn't matter that we escaped. I just want another chance to be with my family.",
	". . .",
	". . .",
	"[Press ENTER to RESTART]",
];

var deathEnding = [ // did not escape
	"You died.",
	". . .",
	"[Press ENTER to RESTART]",
];


var ending = [];