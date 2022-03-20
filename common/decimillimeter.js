/** common module for deci-milli-meter (dmm) 10^-4
 * includes various helper methods to convert to and from decimillimeters relevant to the project
 */

function toCentimeters(p_input){
    return p_input / 100;
}

function toFeet(p_input){
    return p_input / 3048;
}

function fromCentimeters(p_input){
    return p_input * 100;
}

function fromFeet(p_input){
    return p_input * 3048;
}

function varianceToCentimeters(){
    return p_input / 10000;
}

function varianceToFeet(){
    return p_input / (3048 * 3048);
}

module.exports = {varianceToFeet, varianceToCentimeters, toCentimeters, toFeet, fromCentimeters, fromFeet};