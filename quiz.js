const RANDOM_IMG_ENDPOINT = "https://dog.ceo/api/breeds/image/random";

const BREEDS = ["affenpinscher", "african", "airedale", "akita", "appenzeller", "shepherd australian", "basenji", "beagle", "bluetick", "borzoi", "bouvier", "boxer", "brabancon", "briard", "norwegian buhund", "boston bulldog", "english bulldog", "french bulldog", "staffordshire bullterrier", "australian cattledog", "chihuahua", "chow", "clumber", "cockapoo", "border collie", "coonhound", "cardigan corgi", "cotondetulear", "dachshund", "dalmatian", "great dane", "scottish deerhound", "dhole", "dingo", "doberman", "norwegian elkhound", "entlebucher", "eskimo", "lapphund finnish", "bichon frise", "germanshepherd", "italian greyhound", "groenendael", "havanese", "afghan hound", "basset hound", "blood hound", "english hound", "ibizan hound", "plott hound", "walker hound", "husky", "keeshond", "kelpie", "komondor", "kuvasz", "labradoodle", "labrador", "leonberg", "lhasa", "malamute", "malinois", "maltese", "bull mastiff", "english mastiff", "tibetan mastiff", "mexicanhairless", "mix", "bernese mountain", "swiss mountain", "newfoundland", "otterhound", "caucasian ovcharka", "papillon", "pekinese", "pembroke", "miniature pinscher", "pitbull", "german pointer", "germanlonghair pointer", "pomeranian", "medium poodle", "miniature poodle", "standard poodle", "toy poodle", "pug", "puggle", "pyrenees", "redbone", "chesapeake retriever", "curly retriever", "flatcoated retriever", "golden retriever", "rhodesian ridgeback", "rottweiler", "saluki", "samoyed", "schipperke", "giant schnauzer", "miniature schnauzer", "english setter", "gordon setter", "irish setter", "sharpei", "english sheepdog", "shetland sheepdog", "shiba", "shihtzu", "blenheim spaniel", "brittany spaniel", "cocker spaniel", "irish spaniel", "japanese spaniel", "sussex spaniel", "welsh spaniel", "english springer", "stbernard", "american terrier", "australian terrier", "bedlington terrier", "border terrier", "cairn terrier", "dandie terrier", "fox terrier", "irish terrier", "kerryblue terrier", "lakeland terrier", "norfolk terrier", "norwich terrier", "patterdale terrier", "russell terrier", "scottish terrier", "sealyham terrier", "silky terrier", "tibetan terrier", "toy terrier", "welsh terrier", "westhighland terrier", "wheaten terrier", "yorkshire terrier", "tervuren", "vizsla", "spanish waterdog", "weimaraner", "whippet", "irish wolfhound"];

// Utility function to get a randomly selected item from an array
function getRandomElement(array) {
  const i = Math.floor(Math.random() * array.length);
  return array[i];
}

// Utility function to shuffle the order of items in an array in-place
function shuffleArray(array) {
  return array.sort((a, b) => Math.random() - 0.5);
}
const frame = document.getElementById("image-frame");
const options = document.getElementById("options"); // Container for the multiple-choice buttons
const nextQue = document.getElementById("next-option");
let n = 0;
const endNote = document.getElementById("end-note");
let correct = 0;


// return a list of that many choices, including the correct answer and others from the array
function getMultipleChoices(n, correctAnswer, allOptions) {
  const choices = [];
  choices.push(correctAnswer);
  while (choices.length < n) {
    let thisOption = getRandomElement(allOptions);
    if (!choices.includes(thisOption)) {
      choices.push(thisOption);
    }
  }
  return shuffleArray(choices);
}

// return the breed name string as formatted in the breed list, e.g. "standard poodle"
function getBreedFromURL(url) {
  let breedString;
  let breedInURL = url.split("/")[4];
  let actuallyUsefulBreed = breedInURL.split("-");
  if (actuallyUsefulBreed.length > 1) {
    breedString = actuallyUsefulBreed.reverse().join(" ");
  } else {
    breedString = breedInURL;
  }
  return breedString;
}

// Given a URL, fetch the resource at that URL,
// then parse the response as a JSON object,
// finally return the "message" property of its body
async function fetchMessage(url) {
  const response = await fetch(url);
  const body = await response.json();
  const { message } = body;
  return message;
}

async function goToNextQue() {
  n++;
  if(n===1){
    document.getElementById("correct").textContent = " ";
    document.getElementById("complete").textContent = " ";
  }
  endNote.classList.add("hidden");
  options.innerHTML = "";
  nextQue.classList.add("hidden");
  const [imgUrl, correctAnswer, choices] = await loadQuizData();
  renderQuiz(imgUrl, correctAnswer, choices);

}

// Function to add the multiple-choice buttons to the page
function renderButtons(choicesArray, correctAnswer) {
  // Event handler function to compare the clicked button's value to correctAnswer
  // added "correct"/"incorrect" classes to the buttons as appropriate

  function buttonHandler(e) {
    if (e.target.value === correctAnswer) {
      e.target.classList.add("correct");
      correct++;
    } else {
      e.target.classList.add("incorrect");
      document
        .querySelector(`button[value="${correctAnswer}"]`)
        .classList.add("correct");
    }

    for (let each of options.children) {
      each.setAttribute("disabled", "");
    }

    nextQue.classList.remove("hidden");

    document.getElementById("correct").textContent = correct;
    document.getElementById("complete").textContent = n;

    if(n===10) {
      endNote.classList.remove("hidden");
      nextQue.textContent = "Play Again!";
      n = 0;
      correct = 0;
     
    }

    else {
      nextQue.textContent = "Next";
    }

    nextQue.addEventListener("click", goToNextQue);

  }

  // For each of the choices in choicesArray,
  // Created a button element whose name, value, and textContent properties are the value of that choice,
  // attached a "click" event listener with the buttonHandler function,
  // and appended the button as a child of the options element
  for (let c of choicesArray) {
    const btn = document.createElement("button");
    btn.name = c;
    btn.value = c;
    btn.textContent = c;

    btn.addEventListener("click", buttonHandler);
    options.appendChild(btn);
  }
}

// Function to add the quiz content to the page
function renderQuiz(imgUrl, correctAnswer, choices) {
  const image = document.createElement("img");
  image.setAttribute("src", imgUrl);

  image.addEventListener("load", () => {
    // Waiting until the image has finished loading before trying to add elements to the page
    frame.replaceChildren(image);
    renderButtons(choices, correctAnswer);
  });
}

// Function to load the data needed to display the quiz
async function loadQuizData() {
  document.getElementById("image-frame").textContent =
    "Fetching doggo...";

  const doggoImgUrl = await fetchMessage(RANDOM_IMG_ENDPOINT);
  const correctBreed = getBreedFromURL(doggoImgUrl);
  const breedChoices = getMultipleChoices(3, correctBreed, BREEDS);

  return [doggoImgUrl, correctBreed, breedChoices];
}

// This starts the code!
await goToNextQue();