//GitHub API Library
const { Octokit } = require("@octokit/rest");

//Insert your GitHub tokens here in next format ['token1', 'token2', 'token'] 
const gitTokens = ['token']

//Insert your GitHub names here in next format ['namel', 'name2', 'name'] 
const gitNames = ['name']

function generateUniqueName () {
return `fact_${Math.floor(Math.random() * 150000000)}.txt`;
}

async function pushRandomDogName (repoOwner, token) {
const octokit = new Octokit ({auth: token});

try {


const branchFilesData = await octokit.rest.repos.getContent({ 
owner: repoOwner,
repo: 'RandomDogFacts',
branch: 'main',
});

console.log(branchFilesData, 'branchFilesData')

//Get random cat fact
const catsResponse = await fetch("https://dogfact.ninja/fact"); 
const { fact } = await catsResponse.json();

//Generate unique name for the file
let randomName = generateUniqueName();

//Check if file name is unique in the repo
const isAlreadyFileNameExist = !! branchFilesData.data.find((user) => { 
return user.path === randomName;
});

//If file name is not unique, generate new name
if (isAlreadyFileNameExist) {
pushRandomDogName (repoOwner, token);
}

// Push file to the repo
await octokit.rest.repos.createOrUpdateFileContents({
owner: repoOwner,
repo: 'RandomDogFacts',
path: randomName,
message: 'Another day with great dog fact',
content: Buffer.from(fact).toString('base64'), 
branch: 'main',
});
console.log('Pushed fact to RandomDogFacts');
} catch (error) {
console.error('Error pushing fact to RandomDogFacts', error);
}
}

//Function to start execution 
function startExecution() {
gitTokens.forEach((token, index) => {
pushRandomDogName (gitNames[index], token);
})
}

//Start execution
startExecution();
