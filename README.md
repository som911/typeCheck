# typeCheck
Dynamic data validation in JS.

MODEL - is what you expect to receive.

For example, I expect the backend to send me the user's age, which will be an integer in the range from 18 to 60 years.

const ageModel = [Number, Int, InRange(18,60)];
const error = checkModel(ageModel, backResponse);
if(error) {
    console.log(error)
}



I expect to receive a user object with key 'name' and 'age'. 'name' must be string, 'age' must be number

const userModel = {
    name: [String],
    age: [Number], 
}
const error = checkModel(userModel, backResponse);
if(error) {
    console.log(error)
}

For mo exemples - watch test.js file.