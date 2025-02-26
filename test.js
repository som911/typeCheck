const $tc = require('./index');

let error;

console.log('NUMBER')
//  Number
const model1 = [Number];
const response1 = '22'; 

error = $tc.checkModel(model1, response1, 'response1'); // response1 expect type number / get string
if(error) {
    console.error(error);
}
////////////////////////////
const model2 = [Number, $tc.Int];
const response2 = 22.2; 

error = $tc.checkModel(model2, response2, 'response2'); // response2 is not Int: 22.2
if(error) {
    console.error(error);
}
////////////////////////////
////////////////////////////
const model3 = [Number, $tc.Int, $tc.InRange(2,6) ];
const response3 = 7;

error = $tc.checkModel(model3, response3, 'response3'); // response3 value is out of range(2,6) - 7
if(error) {
    console.error(error);
}
////////////////////////////////
console.log('OBJECT')
// OBJECT
const model4 = {
    name: [String, $tc.InRangeChars(3,5)]
}
const response4 = {
    key1: 'Some Data'
}
error = $tc.checkModel(model4, response4, 'response4'); // response4 does not have key 'name'
if(error) {
    console.error(error);
}
/////////////////////////////////////////////

const model5 = {
    name: [String, $tc.InRangeChars(3,5)]
}
const response5 = {
    name: 'Some',
    age: 12
}
error = $tc.checkModel(model5, response5, 'response5'); // response5 has extra key 'age'
if(error) {
    console.error(error);
}
/////////////////////////////////////////////

const model6 = {
    name: [String, $tc.InRangeChars(3,5)]
}
const response6 = {
    key1: 'Some Data'
}
error = $tc.checkModel(model6, response6, 'response6'); // response4 does not have key 'name'
if(error) {
    console.error(error);
}
/////////////////////////////////////////////
const model7 = {
    name: [String, $tc.InRangeChars(3,5)],
    '?age': [Number] // can be without 'age' key, if have 'age' -  it must be number
}
const response7 = {
    name: 'Some',
    age: '22'
}
error = $tc.checkModel(model7, response7, 'response7'); 
if(error) {
    console.error(error);
}
//////////////////////////////////
console.log('ARRAY')
const model8 = [
    [Number],
    [String]
]
const response8 = ['22', 'Artur'];
error = $tc.checkModel(model8, response8, 'response8'); 
if(error) {
    console.error(error);
}
//////////////////////////////////
const model9 = $tc.FillArr({
    name: [
        [String],
        [Boolean]
    ],
    age: [
        [Number],
        [Boolean]
    ]
})
const response9 = [
    {
        name: ['Aret', true], 
        age: [22, true]
    },
    {
        name: ['Aret', true], 
        age: [22, true]
    },
    {
        name: ['Aret', true], 
        age: ['22', true] 
    },
];
error = $tc.checkModel(model9, response9, 'response9'); 
if(error) {
    console.error(error);
}
/////////////////////////////////////
const model10 = $tc.FillArr([
    [Number, $tc.Int, $tc.InRange(18,60)], // User Age
    [String, $tc.InRangeChars(4,10)] // User Name
])
const response10 = [
    [22, 'Artur'],
    [25, 'John'],
    [60, 'Carl'],
    [17, 'Tom'], // response10[3][0] value is out of range(18,60) - 17
    [22, 'Jerry'],
]
error = $tc.checkModel(model10, response10, 'response10'); 
if(error) {
    console.error(error);
}
//////////////////////////////////////
const model11 = $tc.OneOf(['btc','trx','usd']); // value must be primitive and included in array;
const response11 = 'eth';
error = $tc.checkModel(model11, response11, 'response11');  // response11 value is out of [btc,trx,usd] - eth
if(error) {
    console.error(error);
}