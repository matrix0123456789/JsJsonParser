import {JsonParser} from "../src/JsonParser.js";
import {expect} from "chai";

describe('parser', () => {
    describe('correct', () => {
        it('null', () => {
            expect(JsonParser.parse('null')).to.deep.equal(null)
        });
        it('true', () => {
            expect(JsonParser.parse('true')).to.deep.equal(true)
        });
        it('false', () => {
            expect(JsonParser.parse('false')).to.deep.equal(false)
        });
        it('0', () => {
            expect(JsonParser.parse('0')).to.deep.equal(0)
        });
        it('1.234e1', () => {
            expect(JsonParser.parse('1.234e1')).to.deep.equal(12.34)
        });
        it('1e+3', () => {
            expect(JsonParser.parse('1e+3')).to.deep.equal(1000)
        });
        it('""', () => {
            expect(JsonParser.parse('""')).to.deep.equal("")
        });
        it('[]', () => {
            expect(JsonParser.parse('[]')).to.deep.equal([])
        });
        it('{}', () => {
            expect(JsonParser.parse('{}')).to.deep.equal({})
        });
        it('[1,2,3]', () => {
            expect(JsonParser.parse('[1,2,3]')).to.deep.equal([1, 2, 3])
        });
        it('"abcd"', () => {
            expect(JsonParser.parse('"abcd"')).to.deep.equal("abcd")
        });
        it('"a\\nb\\tc\\rd"', () => {
            expect(JsonParser.parse('"a\\nb\\tc\\rd"')).to.deep.equal("a\nb\tc\rd")
        });
        it('"\\u0041"', () => {
            expect(JsonParser.parse('"\\u0041"')).to.deep.equal("A")
        });
        it('excape codes"',()=>{
            expect(JsonParser.parse('"\\"\\\\\\/\\b\\f\\n\\r\\t\\u0000"')).to.deep.equal("\"\\/\b\f\n\r\t\u0000")
        });
        it('{"a":1}', () => {
            expect(JsonParser.parse('{"a":1}')).to.deep.equal({a: 1})
        });
        it('{"a":1,"b":"c","d":false}', () => {
            expect(JsonParser.parse('{"a":1,"b":"c","d":false}')).to.deep.equal({"a": 1, "b": "c", "d": false})
        });
        it('[{"one":[{"two":{"three":"four"}}]}]', () => {
            expect(JsonParser.parse('[{"one":[{"two":{"three":"four"}}]}]')).to.deep.equal([{"one": [{"two": {"three": "four"}}]}])
        });
        it(' [  {"one":   [{"two":{"three":    "four"}}  ]}]', ()=>{
            expect(JsonParser.parse(' [  {"one":   [{"two":{"three":    "four"}}  ]}]')).to.deep.equal([{"one": [{"two": {"three": "four"}}]}])

        })

    });
    describe('incorrect', () => {
        it('empty', () => {
            expect(() => JsonParser.parse('')).to.throw()
        });
        it('bad name', () => {
            expect(() => JsonParser.parse('nul')).to.throw()
        });
        it('bad number', () => {
            expect(() => JsonParser.parse('01')).to.throw()
        });
        it('bad string', () => {
            expect(() => JsonParser.parse('"abc')).to.throw()
        });
        it('bad array', () => {
            expect(() => JsonParser.parse('[')).to.throw()
        });
        it('bad object', () => {
            expect(() => JsonParser.parse('{')).to.throw()
        });
        it('bad object key', () => {
            expect(() => JsonParser.parse('{"a"}')).to.throw()
        });
        it('bad object value', () => {
            expect(() => JsonParser.parse('{"a":}')).to.throw()
        });
        it('somethink after end', () => {
            expect(() => JsonParser.parse('{}true')).to.throw()
        });

    });
});
