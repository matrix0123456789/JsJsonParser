import {JsonParser} from "./src/JsonParser.js";

const exampleJson = '\n' +
    '{\n' +
    '    "glossary": {\n' +
    '        "title": "example glossary",\n' +
    '\t\t"GlossDiv": {\n' +
    '            "title": "S",\n' +
    '\t\t\t"GlossList": {\n' +
    '                "GlossEntry": {\n' +
    '                    "ID": "SGML",\n' +
    '\t\t\t\t\t"SortAs": "SGML",\n' +
    '\t\t\t\t\t"GlossTerm": "Standard Generalized Markup Language",\n' +
    '\t\t\t\t\t"Acronym": "SGML",\n' +
    '\t\t\t\t\t"Abbrev": "ISO 8879:1986",\n' +
    '\t\t\t\t\t"GlossDef": {\n' +
    '                        "para": "A meta-markup language, used to create markup languages such as DocBook.",\n' +
    '\t\t\t\t\t\t"GlossSeeAlso": ["GML", "XML"]\n' +
    '                    },\n' +
    '\t\t\t\t\t"GlossSee": "markup"\n' +
    '                }\n' +
    '            }\n' +
    '        }\n' +
    '    }\n' +
    '}'


const start1 = new Date();
for (let i = 0; i < 1000000; i++) {
    JsonParser.parse(exampleJson)
}
const time1 = new Date() - start1;

const start2 = new Date();
for (let i = 0; i < 1000000; i++) {
    JSON.parse(exampleJson)
}
const time2 = new Date() - start2;

console.log('my parser', time1)
console.log('built in parser', time2)
console.log('ratin', time1 / time2)
