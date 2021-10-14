var attributes  =  "<name>;<age>;<major>";

var pieces = attributes.split(";");

for (i=0; i<pieces.length;i++) {
console.log(pieces[i]+typeof(pieces[i]));
}